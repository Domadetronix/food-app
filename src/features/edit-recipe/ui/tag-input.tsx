"use client";

import { useState } from "react";
import { inputBase } from "@/shared/ui";

// Ввод тегов по одному: Enter/запятая добавляют тег, Backspace на пустом — удаляет последний.
// Теги приводятся к нижнему регистру (регистр неважен). Сабмит — через скрытые input name="tag".
export function TagInput({ initial = [], name = "tag" }: { initial?: string[]; name?: string }) {
  const [tags, setTags] = useState<string[]>(initial);
  const [text, setText] = useState("");

  function add() {
    const t = text.trim().toLowerCase();
    setText("");
    if (t && !tags.includes(t)) setTags([...tags, t]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !text && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {tags.map((t) => (
        <input key={t} type="hidden" name={name} value={t} />
      ))}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTags(tags.filter((x) => x !== t))}
              className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2.5 py-1 text-xs text-ink/80"
            >
              #{t}
              <span className="text-ink/50">×</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Например, мясное — и нажмите Enter"
          className={`${inputBase} min-w-0 flex-1`}
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-gold px-4 text-sm font-medium text-ink transition-colors hover:bg-gold/15"
        >
          Добавить
        </button>
      </div>
    </div>
  );
}
