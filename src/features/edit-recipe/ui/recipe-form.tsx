"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import {
  Button,
  TextArea,
  TextField,
  fieldLabelClass,
  inputClass,
} from "@/shared/ui";
import { resizeImage } from "@/shared/lib/image/resize";
import type { Recipe, MealType } from "@/entities/recipe";
import { saveRecipeAction, type RecipeFormState } from "../api/actions";

const mealOptions: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Завтрак" },
  { value: "lunch", label: "Обед" },
  { value: "dinner", label: "Ужин" },
];

type Row = { name: string; amount: string };

export function RecipeForm({ mode, initial }: { mode: "new" | "edit"; initial?: Recipe }) {
  const [state, formAction, pending] = useActionState<RecipeFormState, FormData>(
    saveRecipeAction,
    {},
  );

  const [rows, setRows] = useState<Row[]>(
    initial?.ingredients.length
      ? initial.ingredients.map((i) => ({ name: i.name, amount: i.amount }))
      : [{ name: "", amount: "" }],
  );
  const [photoPreview, setPhotoPreview] = useState<string | null>(initial?.photoUrl ?? null);
  const photoBlobRef = useRef<Blob | null>(null);

  function setRow(i: number, key: keyof Row, value: string) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  }

  async function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const blob = await resizeImage(file);
      photoBlobRef.current = blob;
      setPhotoPreview(URL.createObjectURL(blob));
    } catch {
      photoBlobRef.current = file;
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.delete("photo"); // убираем «сырое» значение файлового инпута
    if (photoBlobRef.current) fd.set("photo", photoBlobRef.current, "photo.jpg");
    formAction(fd);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {mode === "edit" && initial && <input type="hidden" name="id" value={initial.id} />}

      <TextField
        label="Название"
        required
        name="name"
        defaultValue={initial?.name ?? ""}
        placeholder="Например, Паста карбонара"
      />

      {/* Фото */}
      <div className="flex flex-col gap-1.5">
        <span className={fieldLabelClass}>Фото</span>
        <label className="relative flex aspect-[16/10] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-ink/25 bg-ink/[0.03] text-sm text-ink/55 transition-colors hover:border-terracotta hover:text-terracotta">
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoPreview} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-2">
              <span className="text-2xl leading-none">＋</span>
              Добавить фото
            </span>
          )}
          <input type="file" name="photo" accept="image/*" onChange={onPhotoChange} className="sr-only" />
        </label>
      </div>

      <TextArea
        label="Рецепт и заметки"
        name="description"
        rows={5}
        defaultValue={initial?.description ?? ""}
        placeholder="Шаги приготовления, заметки…"
      />

      {/* Продукты */}
      <div className="flex flex-col gap-1.5">
        <span className={fieldLabelClass}>Продукты</span>
        <div className="flex flex-col gap-2">
          {rows.map((row, i) => (
            <div key={i} className="flex gap-2">
              <input
                name="ingName"
                value={row.name}
                onChange={(e) => setRow(i, "name", e.target.value)}
                className={`${inputClass} flex-1`}
                placeholder="Продукт"
              />
              <input
                name="ingAmount"
                value={row.amount}
                onChange={(e) => setRow(i, "amount", e.target.value)}
                className={`${inputClass} w-28`}
                placeholder="200 гр"
              />
              <button
                type="button"
                onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}
                className="px-2 text-lg text-ink/40 hover:text-terracotta"
                aria-label="Удалить продукт"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setRows((prev) => [...prev, { name: "", amount: "" }])}
          className="mt-1 self-start text-sm font-medium text-terracotta hover:underline"
        >
          ＋ Добавить продукт
        </button>
      </div>

      {/* Приём пищи */}
      <div className="flex flex-col gap-2">
        <span className={fieldLabelClass}>Приём пищи</span>
        <div className="flex flex-wrap gap-2">
          {mealOptions.map((m) => (
            <label
              key={m.value}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-gold/60 px-3.5 py-1.5 text-sm has-[:checked]:border-transparent has-[:checked]:bg-terracotta has-[:checked]:text-cream"
            >
              <input
                type="checkbox"
                name="mealTypes"
                value={m.value}
                defaultChecked={initial?.mealTypes.includes(m.value)}
                className="sr-only"
              />
              {m.label}
            </label>
          ))}
        </div>
      </div>

      {/* Время */}
      <div className="flex flex-col gap-1.5">
        <span className={fieldLabelClass}>Время, мин</span>
        <input
          type="number"
          min={0}
          name="cookTime"
          defaultValue={initial?.cookTimeMinutes ?? ""}
          className={`${inputClass} w-28`}
          placeholder="25"
        />
      </div>

      {/* Теги */}
      <TextField
        label="Теги"
        name="tags"
        defaultValue={initial?.tags.join(", ") ?? ""}
        placeholder="мясное, острое (через запятую)"
      />

      {state?.error && <p className="text-sm text-terracotta">{state.error}</p>}

      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? "Сохранение…" : mode === "new" ? "Сохранить блюдо" : "Сохранить изменения"}
        </Button>
        <Link
          href={mode === "edit" && initial ? `/recipes/${initial.id}` : "/"}
          className="inline-flex h-11 items-center justify-center rounded-full border border-ink/20 px-5 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}
