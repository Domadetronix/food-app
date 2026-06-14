"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/shared/lib/auth/session";
import { getSupabaseAdmin, RECIPE_PHOTOS_BUCKET } from "@/shared/lib/supabase/server";

export type RecipeFormState = { error?: string };

function toNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

/** Создание (нет id) или редактирование (есть id) рецепта. */
export async function saveRecipeAction(
  _prev: RecipeFormState,
  formData: FormData,
): Promise<RecipeFormState> {
  const session = await getSession();
  if (!session) redirect("/login");
  const familyId = session.familyId;
  const supabase = getSupabaseAdmin();

  const id = toNull(String(formData.get("id") ?? ""));
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 1) return { error: "Введите название блюда" };

  const description = toNull(String(formData.get("description") ?? ""));
  const cookRaw = String(formData.get("cookTime") ?? "").trim();
  const cookTimeMinutes = cookRaw ? Math.max(0, Math.trunc(Number(cookRaw))) || null : null;
  const mealTypes = formData.getAll("mealTypes").map(String);
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const ingNames = formData.getAll("ingName").map(String);
  const ingAmounts = formData.getAll("ingAmount").map(String);
  const ingredients = ingNames
    .map((n, i) => ({ name: n.trim(), amount: toNull(ingAmounts[i] ?? "") }))
    .filter((ing) => ing.name.length > 0);

  // Проверяем принадлежность семье при редактировании.
  let oldPhotoPath: string | null = null;
  if (id) {
    const { data: existing } = await supabase
      .from("recipes")
      .select("photo_path")
      .eq("id", id)
      .eq("family_id", familyId)
      .maybeSingle();
    if (!existing) return { error: "Блюдо не найдено" };
    oldPhotoPath = existing.photo_path ?? null;
  }

  // Загрузка фото (если прислано).
  let newPhotoPath: string | undefined;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const path = `${familyId}/${randomUUID()}.jpg`;
    const buffer = Buffer.from(await photo.arrayBuffer());
    const { error: upErr } = await supabase.storage
      .from(RECIPE_PHOTOS_BUCKET)
      .upload(path, buffer, { contentType: photo.type || "image/jpeg", upsert: false });
    if (upErr) return { error: "Не удалось загрузить фото. Попробуйте ещё раз." };
    newPhotoPath = path;
  }

  // Запись рецепта.
  let recipeId: string;
  if (id) {
    const update: Record<string, unknown> = {
      name,
      description,
      cook_time_minutes: cookTimeMinutes,
      meal_types: mealTypes,
      tags,
    };
    if (newPhotoPath) update.photo_path = newPhotoPath;
    const { error } = await supabase
      .from("recipes")
      .update(update)
      .eq("id", id)
      .eq("family_id", familyId);
    if (error) return { error: "Не удалось сохранить изменения." };
    recipeId = id;
  } else {
    const { data, error } = await supabase
      .from("recipes")
      .insert({
        family_id: familyId,
        name,
        description,
        cook_time_minutes: cookTimeMinutes,
        meal_types: mealTypes,
        tags,
        photo_path: newPhotoPath ?? null,
      })
      .select("id")
      .single();
    if (error || !data) return { error: "Не удалось создать блюдо." };
    recipeId = data.id;
  }

  // Продукты: перезаписываем целиком.
  await supabase.from("ingredients").delete().eq("recipe_id", recipeId);
  if (ingredients.length) {
    await supabase.from("ingredients").insert(
      ingredients.map((ing, i) => ({
        recipe_id: recipeId,
        name: ing.name,
        amount: ing.amount,
        sort_order: i,
      })),
    );
  }

  // Старое фото удаляем после успешной замены (best-effort).
  if (newPhotoPath && oldPhotoPath) {
    await supabase.storage.from(RECIPE_PHOTOS_BUCKET).remove([oldPhotoPath]);
  }

  revalidatePath("/");
  revalidatePath(`/recipes/${recipeId}`);
  // После создания — на главную; после редактирования — обратно в карточку.
  redirect(id ? `/recipes/${recipeId}` : "/");
}

/** Удаление рецепта (вместе с фото; продукты удаляются каскадом). */
export async function deleteRecipeAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");
  const id = String(formData.get("id") ?? "");
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("recipes")
    .select("photo_path")
    .eq("id", id)
    .eq("family_id", session.familyId)
    .maybeSingle();

  await supabase.from("recipes").delete().eq("id", id).eq("family_id", session.familyId);
  if (data?.photo_path) {
    await supabase.storage.from(RECIPE_PHOTOS_BUCKET).remove([data.photo_path]);
  }

  revalidatePath("/");
  redirect("/");
}
