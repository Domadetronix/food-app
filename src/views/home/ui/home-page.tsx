import { RecipeFilters } from "@/features/filter-recipes";
import { RecipeCard, demoRecipes } from "@/entities/recipe";

export function HomePage() {
  return (
    <div className="flex flex-col gap-5">
      <input
        type="search"
        placeholder="Поиск по названию…"
        className="h-11 w-full rounded-full border border-ink/15 bg-cream px-4 text-sm outline-none placeholder:text-ink/40 focus:border-terracotta"
      />

      <RecipeFilters />

      <div className="grid grid-cols-2 gap-3">
        {demoRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      <p className="pt-1 text-center text-xs text-ink/45">
        Демо-данные. На этапе 1 подключим базу и реальные рецепты.
      </p>
    </div>
  );
}
