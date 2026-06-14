"use client";

import { useMemo, useState } from "react";
import { RecipeCard } from "@/entities/recipe";
import type { MealType, Recipe } from "@/entities/recipe";
import { TagMultiSelect } from "./tag-multi-select";

const mealOptions: { value: "" | MealType; label: string }[] = [
  { value: "", label: "Любой приём пищи" },
  { value: "breakfast", label: "Завтрак" },
  { value: "lunch", label: "Обед" },
  { value: "dinner", label: "Ужин" },
];

const timeOptions: { value: string; label: string }[] = [
  { value: "any", label: "Любое время" },
  { value: "15", label: "до 15 мин" },
  { value: "30", label: "до 30 мин" },
  { value: "60", label: "до 60 мин" },
  { value: "60+", label: "больше 60 мин" },
];

const selectClass =
  "h-11 flex-1 rounded-xl border border-ink/15 bg-cream px-3 text-sm outline-none focus:border-terracotta";

function matchesTime(value: string, minutes?: number): boolean {
  if (value === "any") return true;
  if (minutes == null) return false; // фильтр по времени активен → блюда без времени скрываем
  if (value === "60+") return minutes > 60;
  return minutes <= Number(value);
}

export function RecipeBrowser({ recipes }: { recipes: Recipe[] }) {
  const [search, setSearch] = useState("");
  const [meal, setMeal] = useState<"" | MealType>("");
  const [time, setTime] = useState("any");
  const [tags, setTags] = useState<string[]>([]);

  const allTags = useMemo(
    () =>
      Array.from(new Set(recipes.flatMap((r) => r.tags))).sort((a, b) =>
        a.localeCompare(b, "ru"),
      ),
    [recipes],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return recipes.filter((r) => {
      if (q && !r.name.toLowerCase().includes(q)) return false;
      if (meal && !r.mealTypes.includes(meal)) return false;
      if (!matchesTime(time, r.cookTimeMinutes)) return false;
      if (tags.length && !tags.every((t) => r.tags.includes(t))) return false;
      return true;
    });
  }, [recipes, search, meal, time, tags]);

  const hasActiveFilters = Boolean(search || meal || time !== "any" || tags.length);

  function reset() {
    setSearch("");
    setMeal("");
    setTime("any");
    setTags([]);
  }

  return (
    <div className="flex flex-col gap-5">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск по названию…"
        className="h-11 w-full rounded-full border border-ink/15 bg-cream px-4 text-sm outline-none placeholder:text-ink/40 focus:border-terracotta"
      />

      <div className="flex flex-col gap-2.5">
        <div className="flex gap-2">
          <select
            value={meal}
            onChange={(e) => setMeal(e.target.value as "" | MealType)}
            className={selectClass}
            aria-label="Приём пищи"
          >
            {mealOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={selectClass}
            aria-label="Время готовки"
          >
            {timeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {allTags.length > 0 && <TagMultiSelect all={allTags} selected={tags} onChange={setTags} />}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 px-6 py-12 text-center">
          <p className="text-ink/60">Ничего не найдено по выбранным фильтрам.</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={reset}
              className="text-sm font-medium text-terracotta hover:underline"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
