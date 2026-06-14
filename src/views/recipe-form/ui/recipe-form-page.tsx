import { RecipeForm } from "@/features/edit-recipe";

export function RecipeFormPage({ mode }: { mode: "new" | "edit" }) {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold tracking-tight">
        {mode === "new" ? "Новое блюдо" : "Редактировать блюдо"}
      </h1>
      <RecipeForm mode={mode} />
    </div>
  );
}
