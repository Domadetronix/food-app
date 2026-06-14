import { Chip } from "@/shared/ui";

// Фильтры: приём пищи и время. «Мясное» — это тег, фильтр по тегам добавим позже.
const mealFilters = ["Завтрак", "Обед", "Ужин"];
const timeFilters = ["≤ 15 мин", "≤ 30 мин", "≤ 60 мин"];

export function RecipeFilters() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap gap-2">
        {mealFilters.map((f, i) => (
          <Chip key={f} active={i === 1}>
            {f}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {timeFilters.map((f) => (
          <Chip key={f}>{f}</Chip>
        ))}
      </div>
    </div>
  );
}
