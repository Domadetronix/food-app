// Заготовка календаря: статичный июнь 2026.
// На этапе 2 — интерактив с прикреплением блюд из базы.

const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const today = 14;

// Июнь 2026: 1-е число — понедельник (смещение 0), 30 дней.
const daysInMonth = 30;
const startOffset = 0;

const planned: Record<number, string[]> = {
  11: ["Паста"],
  14: ["Плов", "Сырники"],
  23: ["Куриный суп"],
};

export function CalendarPage() {
  const cells: (number | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <button type="button" className="h-9 w-9 rounded-full text-lg text-ink/60 hover:bg-ink/5">
          ‹
        </button>
        <h1 className="text-lg font-semibold tracking-tight">Июнь 2026</h1>
        <button type="button" className="h-9 w-9 rounded-full text-lg text-ink/60 hover:bg-ink/5">
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-ink/50">
        {weekdays.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`e-${idx}`} />;
          const dishes = planned[day] ?? [];
          const isToday = day === today;
          return (
            <div
              key={day}
              className={`flex min-h-[68px] flex-col gap-1 rounded-lg border p-1.5 text-left ${
                isToday ? "border-terracotta" : "border-ink/10"
              }`}
            >
              <span className={`text-xs ${isToday ? "font-semibold text-terracotta" : "text-ink/55"}`}>
                {day}
              </span>
              <div className="flex flex-col gap-0.5">
                {dishes.slice(0, 2).map((name) => (
                  <span
                    key={name}
                    className="truncate rounded bg-terracotta/15 px-1 py-0.5 text-[10px] leading-tight text-ink/80"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-ink/45">Демо. На этапе 2 — добавление блюд по тапу на день.</p>
    </div>
  );
}
