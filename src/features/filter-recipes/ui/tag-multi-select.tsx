"use client";

import { useState } from "react";
import { inputClass } from "@/shared/ui";

export function TagMultiSelect({
  all,
  selected,
  onChange,
}: {
  all: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const q = query.toLowerCase().trim();
  const suggestions = all.filter((t) => !selected.includes(t) && t.toLowerCase().includes(q));

  function add(tag: string) {
    onChange([...selected, tag]);
    setQuery("");
  }

  return (
    <div className="flex flex-col gap-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange(selected.filter((x) => x !== t))}
              className="inline-flex items-center gap-1 rounded-full bg-terracotta px-2.5 py-1 text-xs font-medium text-cream"
            >
              #{t}
              <span className="text-cream/80">×</span>
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Теги: начните вводить…"
          className={inputClass}
        />
        {open && suggestions.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-ink/15 bg-cream py-1 shadow-md">
            {suggestions.slice(0, 10).map((t) => (
              <li key={t}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    add(t);
                  }}
                  className="block w-full px-3.5 py-2 text-left text-sm hover:bg-gold/15"
                >
                  #{t}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
