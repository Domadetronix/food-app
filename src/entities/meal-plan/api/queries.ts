import "server-only";
import { getSupabaseAdmin } from "@/shared/lib/supabase/server";
import type { PlanEntry } from "../model/types";

/** Записи плана семьи за период [startDate; endDate] (включительно), с названием блюда. */
export async function getMonthPlan(
  familyId: string,
  startDate: string,
  endDate: string,
): Promise<PlanEntry[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("meal_plan")
    .select("id, date, recipe_id, recipes(name)")
    .eq("family_id", familyId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as string,
    date: row.date as string,
    recipeId: row.recipe_id as string,
    recipeName: (row.recipes as { name?: string } | null)?.name ?? "Блюдо",
  }));
}
