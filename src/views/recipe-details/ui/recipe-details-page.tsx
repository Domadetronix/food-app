import Link from "next/link";
import { notFound } from "next/navigation";
import { PlateIcon, Tag, buttonStyles } from "@/shared/ui";
import { getSession } from "@/shared/lib/auth/session";
import { getFamilyRecipe } from "@/entities/recipe/api/queries";
import { DeleteRecipeButton } from "@/features/edit-recipe";

const mealLabels: Record<string, string> = {
  breakfast: "Завтрак",
  lunch: "Обед",
  dinner: "Ужин",
};

export async function RecipeDetailsPage({ id }: { id: string }) {
  const session = await getSession();
  const recipe = session ? await getFamilyRecipe(session.familyId, id) : null;
  if (!recipe) notFound();

  return (
    <div className="flex flex-col gap-5">
      <Link href="/" className="text-sm text-ink/60 hover:text-ink">
        ← К рецептам
      </Link>

      {recipe.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={recipe.photoUrl}
          alt={recipe.name}
          className="aspect-[16/10] w-full rounded-2xl border border-ink/10 object-cover"
        />
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center rounded-2xl border border-ink/10 bg-ink/5">
          <PlateIcon className="h-14 w-14 text-gold" />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{recipe.name}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink/60">
          {recipe.cookTimeMinutes != null && <span>~ {recipe.cookTimeMinutes} мин</span>}
          {recipe.mealTypes.length > 0 && (
            <>
              {recipe.cookTimeMinutes != null && <span>•</span>}
              <span>{recipe.mealTypes.map((m) => mealLabels[m] ?? m).join(", ")}</span>
            </>
          )}
        </div>
        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
      </div>

      {recipe.description && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Рецепт и заметки</h2>
          <p className="whitespace-pre-wrap leading-relaxed text-ink/90">{recipe.description}</p>
        </section>
      )}

      {recipe.ingredients.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Продукты</h2>
          <ul className="overflow-hidden rounded-2xl border border-ink/10">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={`${ing.name}-${i}`}
                className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                  i !== 0 ? "border-t border-ink/10" : ""
                }`}
              >
                <span>{ing.name}</span>
                {ing.amount && <span className="text-ink/60">{ing.amount}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-col gap-2 pt-1">
        <Link href={`/recipes/${recipe.id}/edit`} className={buttonStyles("outline", "w-full")}>
          Редактировать
        </Link>
        <DeleteRecipeButton id={recipe.id} />
      </div>
    </div>
  );
}
