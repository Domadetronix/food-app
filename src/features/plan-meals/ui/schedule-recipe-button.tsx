"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { buttonStyles } from "@/shared/ui";
import { addMealToPlan } from "../api/actions";

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ScheduleRecipeButton({ recipeId }: { recipeId: string }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<string>(today);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function schedule() {
    if (!date) return;
    startTransition(async () => {
      await addMealToPlan(date, recipeId);
      setDone(true);
    });
  }

  function close() {
    setOpen(false);
    setDone(false);
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonStyles("primary", "w-full")}>
        Добавить в календарь
      </button>

      {open && (
        <div className="fixed inset-0 z-30 flex items-end justify-center" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Закрыть" onClick={close} />
          <div className="relative flex w-full max-w-md flex-col gap-4 rounded-t-2xl bg-cream p-5 shadow-xl">
            {done ? (
              <>
                <h2 className="text-lg font-semibold tracking-tight">Запланировано ✓</h2>
                <p className="text-sm text-ink/70">Блюдо добавлено в календарь.</p>
                <div className="flex gap-3">
                  <Link href={`/calendar?month=${date.slice(0, 7)}`} className={buttonStyles("primary", "flex-1")}>
                    Открыть календарь
                  </Link>
                  <button type="button" onClick={close} className={buttonStyles("ghost")}>
                    Готово
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold tracking-tight">В какой день?</h2>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-11 w-full rounded-xl border border-ink/15 bg-cream px-3.5 text-base outline-none focus:border-terracotta"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={pending || !date}
                    onClick={schedule}
                    className={buttonStyles("primary", "flex-1")}
                  >
                    {pending ? "Добавляю…" : "Запланировать"}
                  </button>
                  <button type="button" onClick={close} className={buttonStyles("ghost")}>
                    Отмена
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
