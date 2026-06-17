import "server-only";
import { getSupabaseAdmin, RECIPE_PHOTOS_BUCKET } from "@/shared/lib/supabase/server";
import type { MealType, Recipe } from "../model/types";

const SIGNED_TTL = 60 * 60; // 1 час

/** Список рецептов семьи (для главной). Без продуктов; с подписанными URL фото. */
export async function getFamilyRecipes(familyId: string): Promise<Recipe[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("recipes")
    .select("id, name, photo_path, cook_time_minutes, meal_types, tags")
    .eq("family_id", familyId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const paths = data.map((r) => r.photo_path).filter(Boolean) as string[];
  const signed = await signedUrlMap(paths);

  return data.map((r) => ({
    id: r.id,
    name: r.name,
    photoUrl: r.photo_path ? signed[r.photo_path] : undefined,
    cookTimeMinutes: r.cook_time_minutes ?? undefined,
    mealTypes: (r.meal_types ?? []) as MealType[],
    tags: r.tags ?? [],
    ingredients: [],
  }));
}

/** Один рецепт семьи с продуктами и подписанным URL фото. null — если не найден. */
export async function getFamilyRecipe(familyId: string, id: string): Promise<Recipe | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("recipes")
    .select(
      "id, name, description, photo_path, cook_time_minutes, meal_types, tags, ingredients(name, amount, sort_order)",
    )
    .eq("family_id", familyId)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  let photoUrl: string | undefined;
  if (data.photo_path) {
    const { data: signed } = await supabase.storage
      .from(RECIPE_PHOTOS_BUCKET)
      .createSignedUrl(data.photo_path, SIGNED_TTL);
    photoUrl = signed?.signedUrl;
  }

  const ingredients = (data.ingredients ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((i) => ({ name: i.name as string, amount: (i.amount as string | null) ?? "" }));

  return {
    id: data.id,
    name: data.name,
    description: data.description ?? undefined,
    photoUrl,
    cookTimeMinutes: data.cook_time_minutes ?? undefined,
    mealTypes: (data.meal_types ?? []) as MealType[],
    tags: data.tags ?? [],
    ingredients,
  };
}

/** Лёгкий список рецептов семьи (id + name) — для выбора, без фото/подписанных URL. */
export async function getFamilyRecipeOptions(
  familyId: string,
): Promise<{ id: string; name: string }[]> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("recipes")
    .select("id, name")
    .eq("family_id", familyId)
    .order("name", { ascending: true });
  return data?.map((r) => ({ id: r.id as string, name: r.name as string })) ?? [];
}

async function signedUrlMap(paths: string[]): Promise<Record<string, string>> {
  if (paths.length === 0) return {};
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.storage
    .from(RECIPE_PHOTOS_BUCKET)
    .createSignedUrls(paths, SIGNED_TTL);

  const map: Record<string, string> = {};
  for (const item of data ?? []) {
    if (item.path && item.signedUrl) map[item.path] = item.signedUrl;
  }
  return map;
}
