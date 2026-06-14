import Link from "next/link";
import { getSession } from "@/shared/lib/auth/session";
import { getFamilyRecipes } from "@/entities/recipe/api/queries";
import { RecipeBrowser } from "@/features/filter-recipes";
import { buttonStyles } from "@/shared/ui";

export async function HomePage() {
  const session = await getSession();
  const recipes = session ? await getFamilyRecipes(session.familyId) : [];

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-ink/15 px-6 py-12 text-center">
        <p className="text-ink/60">Пока нет рецептов. Добавьте первое блюдо.</p>
        <Link href="/recipes/new" className={buttonStyles("primary")}>
          ＋ Новое блюдо
        </Link>
      </div>
    );
  }

  return <RecipeBrowser recipes={recipes} />;
}
