import Link from "next/link";
import { PlateIcon, Tag } from "@/shared/ui";
import type { Recipe } from "../model/types";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-sm transition-shadow hover:shadow-md"
    >
      {recipe.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={recipe.photoUrl}
          alt={recipe.name}
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-ink/5">
          <PlateIcon className="h-10 w-10 text-gold" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="font-medium leading-tight">{recipe.name}</h3>
        {recipe.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1">
            {recipe.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
        {recipe.cookTimeMinutes != null && (
          <span className="text-xs text-ink/55">~ {recipe.cookTimeMinutes} мин</span>
        )}
      </div>
    </Link>
  );
}
