"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/shared/lib/auth/session";
import { getSupabaseAdmin } from "@/shared/lib/supabase/server";

/** Прикрепить блюдо семьи к дате (YYYY-MM-DD). */
export async function addMealToPlan(date: string, recipeId: string): Promise<void> {
  const session = await getSession();
  if (!session) return;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;

  const supabase = getSupabaseAdmin();

  // Блюдо должно принадлежать этой семье.
  const { data: recipe } = await supabase
    .from("recipes")
    .select("id")
    .eq("id", recipeId)
    .eq("family_id", session.familyId)
    .maybeSingle();
  if (!recipe) return;

  await supabase
    .from("meal_plan")
    .insert({ family_id: session.familyId, date, recipe_id: recipeId });

  revalidatePath("/calendar");
}

/** Убрать запись плана. */
export async function removeMealFromPlan(entryId: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  const supabase = getSupabaseAdmin();
  await supabase
    .from("meal_plan")
    .delete()
    .eq("id", entryId)
    .eq("family_id", session.familyId);

  revalidatePath("/calendar");
}
