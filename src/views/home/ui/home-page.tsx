import Link from "next/link";
import { getSession } from "@/shared/lib/auth/session";
import { getFamilyRecipes } from "@/entities/recipe/api/queries";
import { RecipeCard } from "@/entities/recipe";
import { RecipeFilters } from "@/features/filter-recipes";
import { buttonStyles } from "@/shared/ui";

export async function HomePage() {
  const session = await getSession();
  const recipes = session ? await getFamilyRecipes(session.familyId) : [];

  return (
    <div className="flex flex-col gap-5">
      <input
        type="search"
        placeholder="Поиск по названию…"
        className="h-11 w-full rounded-full border border-ink/15 bg-cream px-4 text-sm outline-none placeholder:text-ink/40 focus:border-terracotta"
      />

      <RecipeFilters />

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-ink/15 px-6 py-12 text-center">
          <p className="text-ink/60">Пока нет рецептов. Добавьте первое блюдо.</p>
          <Link href="/recipes/new" className={buttonStyles("primary")}>
            ＋ Новое блюдо
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
