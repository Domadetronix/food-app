import Link from "next/link";
import {
  Button,
  TextArea,
  TextField,
  fieldLabelClass,
  inputClass,
} from "@/shared/ui";

const mealOptions = ["Завтрак", "Обед", "Ужин"];

// Заготовка формы. Логика сохранения появится на этапе 1.
export function RecipeForm({ mode }: { mode: "new" | "edit" }) {
  return (
    <form className="flex flex-col gap-5">
      {/* Название — единственное обязательное поле */}
      <TextField label="Название" required placeholder="Например, Паста карбонара" />

      {/* Фото */}
      <div className="flex flex-col gap-1.5">
        <span className={fieldLabelClass}>Фото</span>
        <button
          type="button"
          className="flex aspect-[16/10] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/25 bg-ink/[0.03] text-sm text-ink/55 transition-colors hover:border-terracotta hover:text-terracotta"
        >
          <span className="text-2xl leading-none">＋</span>
          Добавить фото
        </button>
      </div>

      {/* Описание */}
      <TextArea label="Рецепт и заметки" rows={5} placeholder="Шаги приготовления, заметки…" />

      {/* Продукты */}
      <div className="flex flex-col gap-1.5">
        <span className={fieldLabelClass}>Продукты</span>
        <div className="flex flex-col gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-2">
              <input className={`${inputClass} flex-1`} placeholder="Продукт" />
              <input className={`${inputClass} w-28`} placeholder="200 гр" />
            </div>
          ))}
        </div>
        <button type="button" className="mt-1 self-start text-sm font-medium text-terracotta hover:underline">
          ＋ Добавить продукт
        </button>
      </div>

      {/* Приём пищи */}
      <div className="flex flex-col gap-2">
        <span className={fieldLabelClass}>Приём пищи</span>
        <div className="flex flex-wrap gap-2">
          {mealOptions.map((m) => (
            <label
              key={m}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-gold/60 px-3.5 py-1.5 text-sm has-[:checked]:border-transparent has-[:checked]:bg-terracotta has-[:checked]:text-cream"
            >
              <input type="checkbox" className="sr-only" />
              {m}
            </label>
          ))}
        </div>
      </div>

      {/* Время */}
      <div className="flex flex-col gap-1.5">
        <span className={fieldLabelClass}>Время, мин</span>
        <input type="number" min={0} className={`${inputClass} w-28`} placeholder="25" />
      </div>

      {/* Теги (включая «мясное») */}
      <TextField label="Теги" placeholder="мясное, острое, праздничное (через запятую)" />

      {/* Действия */}
      <div className="flex gap-3 pt-1">
        <Button type="button" className="flex-1">
          {mode === "new" ? "Сохранить блюдо" : "Сохранить изменения"}
        </Button>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full border border-ink/20 px-5 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}
