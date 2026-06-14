"use client";

import { useState } from "react";
import { regenerateFamilyCodeAction } from "../api/actions";

export function FamilyCodeCard({ code }: { code: string | null }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-ink/10 p-4">
      <span className="text-sm font-semibold uppercase tracking-wide text-ink/50">Код доступа</span>

      {code ? (
        <>
          <div className="flex items-center gap-3">
            <code className="rounded-lg bg-ink/5 px-3 py-1.5 font-mono text-lg tracking-widest">
              {revealed ? code : "•••••-•••••"}
            </code>
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              className="text-sm font-medium text-terracotta hover:underline"
            >
              {revealed ? "Скрыть" : "Показать"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(code);
                setCopied(true);
              }}
              className="text-sm font-medium text-terracotta hover:underline"
            >
              Скопировать
            </button>
            {copied && <span className="text-xs text-ink/55">Скопировано ✓</span>}
          </div>
          <p className="text-xs text-ink/50">
            Поделитесь кодом с близкими, чтобы они вошли в семью.
          </p>
        </>
      ) : (
        <p className="text-sm text-ink/70">
          Код этой семьи создан до обновления и недоступен для показа. Сгенерируйте новый,
          чтобы видеть его здесь и делиться. Старый код при этом перестанет работать.
        </p>
      )}

      <form
        action={regenerateFamilyCodeAction}
        onSubmit={(e) => {
          if (
            !window.confirm(
              "Старый код перестанет работать (уже вошедшие участники доступ не потеряют). Сгенерировать новый код?",
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-full border border-gold px-4 text-sm font-medium text-ink transition-colors hover:bg-gold/15"
        >
          Сгенерировать новый код
        </button>
      </form>
    </section>
  );
}
