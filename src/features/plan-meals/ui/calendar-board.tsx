"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import type { PlanEntry } from "@/entities/meal-plan";
import { addMealToPlan, removeMealFromPlan } from "../api/actions";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS_NOM = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const MONTHS_GEN = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (y: number, m0: number, d: number) => `${y}-${pad(m0 + 1)}-${pad(d)}`;

type RecipeOption = { id: string; name: string };

export function CalendarBoard({
  month,
  entries,
  recipes,
}: {
  month: string;
  entries: PlanEntry[];
  recipes: RecipeOption[];
}) {
  const year = Number(month.split("-")[0]);
  const m0 = Number(month.split("-")[1]) - 1;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const prevDate = new Date(year, m0 - 1, 1);
  const nextDate = new Date(year, m0 + 1, 1);
  const prevMonth = `${prevDate.getFullYear()}-${pad(prevDate.getMonth() + 1)}`;
  const nextMonth = `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}`;

  const firstWeekday = (new Date(year, m0, 1).getDay() + 6) % 7; // Пн = 0
  const daysInMonth = new Date(year, m0 + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const byDate = useMemo(() => {
    const map: Record<string, PlanEntry[]> = {};
    for (const e of entries) (map[e.date] ??= []).push(e);
    return map;
  }, [entries]);

  const today = new Date();
  const todayStr = ymd(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Link
          href={`/calendar?month=${prevMonth}`}
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-ink/60 hover:bg-ink/5"
          aria-label="Предыдущий месяц"
        >
          ‹
        </Link>
        <h1 className="text-lg font-semibold tracking-tight">
          {MONTHS_NOM[m0]} {year}
        </h1>
        <Link
          href={`/calendar?month=${nextMonth}`}
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-ink/60 hover:bg-ink/5"
          aria-label="Следующий месяц"
        >
          ›
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-ink/50">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`e-${idx}`} />;
          const dateStr = ymd(year, m0, day);
          const dishes = byDate[dateStr] ?? [];
          const isToday = dateStr === todayStr;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDate(dateStr)}
              className={`flex min-h-[68px] flex-col gap-1 rounded-lg border p-1.5 text-left transition-colors hover:border-terracotta ${
                isToday ? "border-terracotta" : "border-ink/10"
              }`}
            >
              <span className={`text-xs ${isToday ? "font-semibold text-terracotta" : "text-ink/55"}`}>
                {day}
              </span>
              <span className="flex flex-col gap-0.5">
                {dishes.slice(0, 2).map((e) => (
                  <span
                    key={e.id}
                    className="truncate rounded bg-terracotta/15 px-1 py-0.5 text-[10px] leading-tight text-ink/80"
                  >
                    {e.recipeName}
                  </span>
                ))}
                {dishes.length > 2 && (
                  <span className="px-1 text-[10px] text-ink/50">+{dishes.length - 2}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-ink/45">Нажмите на день, чтобы запланировать блюда.</p>

      {selectedDate && (
        <DayPicker
          date={selectedDate}
          entries={byDate[selectedDate] ?? []}
          recipes={recipes}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}

function DayPicker({
  date,
  entries,
  recipes,
  onClose,
}: {
  date: string;
  entries: PlanEntry[];
  recipes: RecipeOption[];
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const [, m, d] = date.split("-").map(Number);
  const heading = `${d} ${MONTHS_GEN[m - 1]}`;

  const q = query.toLowerCase().trim();
  const matches = recipes.filter((r) => r.name.toLowerCase().includes(q));

  function add(recipeId: string) {
    startTransition(async () => {
      await addMealToPlan(date, recipeId);
    });
  }
  function remove(entryId: string) {
    startTransition(async () => {
      await removeMealFromPlan(entryId);
    });
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col justify-end" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Закрыть" onClick={onClose} />
      <div className="relative flex max-h-[80vh] flex-col gap-4 rounded-t-2xl bg-cream p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">{heading}</h2>
          <button type="button" onClick={onClose} className="h-8 w-8 rounded-full text-ink/50 hover:bg-ink/5" aria-label="Закрыть">
            ✕
          </button>
        </div>

        {entries.length > 0 ? (
          <div className="flex flex-col gap-2">
            {entries.map((e) => (
              <div key={e.id} className="flex items-center gap-1 rounded-xl border border-ink/10 pl-3">
                <Link
                  href={`/recipes/${e.recipeId}`}
                  className="flex-1 truncate py-2.5 text-sm font-medium hover:text-terracotta"
                >
                  {e.recipeName}
                </Link>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => remove(e.id)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg text-ink/40 hover:bg-ink/5 hover:text-terracotta disabled:opacity-60"
                  aria-label="Убрать из плана"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/55">На этот день блюд пока нет.</p>
        )}

        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-wide text-ink/50">Добавить блюдо</span>
          {recipes.length === 0 ? (
            <p className="text-sm text-ink/55">Сначала добавьте рецепты на главной.</p>
          ) : (
            <>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск блюда…"
                className="h-11 w-full rounded-xl border border-ink/15 bg-cream px-3.5 text-base outline-none placeholder:text-ink/40 focus:border-terracotta"
              />
              <div className="flex min-h-0 flex-1 flex-col overflow-auto rounded-xl border border-ink/10">
                {matches.length === 0 ? (
                  <span className="px-3.5 py-3 text-sm text-ink/50">Ничего не найдено</span>
                ) : (
                  matches.map((r, i) => (
                    <button
                      key={r.id}
                      type="button"
                      disabled={pending}
                      onClick={() => add(r.id)}
                      className={`flex items-center justify-between px-3.5 py-2.5 text-left text-sm hover:bg-gold/15 disabled:opacity-60 ${
                        i !== 0 ? "border-t border-ink/10" : ""
                      }`}
                    >
                      {r.name}
                      <span className="text-terracotta">＋</span>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
