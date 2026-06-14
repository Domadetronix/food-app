"use client";

import { useState } from "react";

export function TagMultiSelect({
  all,
  selected,
  onChange,
  className,
}: {
  all: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const q = query.toLowerCase().trim();
  const visible = all.filter((t) => t.toLowerCase().includes(q));

  function toggle(tag: string) {
    onChange(selected.includes(tag) ? selected.filter((x) => x !== tag) : [...selected, tag]);
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-full items-center gap-2 rounded-xl border border-ink/15 bg-cream px-3 text-base outline-none focus:border-terracotta"
      >
        <span className={selected.length ? "text-ink" : "text-ink/55"}>Теги</span>
        {selected.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-xs font-medium text-cream">
            {selected.length}
          </span>
        )}
        <span className="ml-auto text-ink/40">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 w-full rounded-xl border border-ink/15 bg-cream p-2 shadow-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск тега…"
              className="mb-2 h-10 w-full rounded-lg border border-ink/15 bg-cream px-3 text-base outline-none placeholder:text-ink/40 focus:border-terracotta"
            />
            <div className="flex max-h-56 flex-wrap gap-1.5 overflow-auto">
              {visible.length === 0 ? (
                <span className="px-1 py-1 text-sm text-ink/50">Тегов не найдено</span>
              ) : (
                visible.map((t) => {
                  const on = selected.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggle(t)}
                      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                        on
                          ? "border-transparent bg-terracotta text-cream"
                          : "border-gold/60 text-ink hover:border-gold"
                      }`}
                    >
                      #{t}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
