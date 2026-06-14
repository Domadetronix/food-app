import { notFound } from "next/navigation";
import { getSession } from "@/shared/lib/auth/session";
import { getFamilyRecipe } from "@/entities/recipe/api/queries";
import { RecipeForm } from "@/features/edit-recipe";
import type { Recipe } from "@/entities/recipe";

export async function RecipeFormPage({
  mode,
  recipeId,
}: {
  mode: "new" | "edit";
  recipeId?: string;
}) {
  let initial: Recipe | undefined;

  if (mode === "edit" && recipeId) {
    const session = await getSession();
    const recipe = session ? await getFamilyRecipe(session.familyId, recipeId) : null;
    if (!recipe) notFound();
    initial = recipe;
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold tracking-tight">
        {mode === "new" ? "Новое блюдо" : "Редактировать блюдо"}
      </h1>
      <RecipeForm mode={mode} initial={initial} />
    </div>
  );
}
