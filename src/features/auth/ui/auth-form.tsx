"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button, TextField, buttonStyles } from "@/shared/ui";
import { authAction, type AuthState } from "../api/actions";

type Mode = "create" | "join";

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("create");
  const [state, formAction, pending] = useActionState<AuthState, FormData>(authAction, {});

  // После создания семьи показываем код — его нельзя будет посмотреть позже.
  if (state?.createdCode) {
    return <CreatedPanel code={state.createdCode} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-1 rounded-full border border-ink/15 p-1">
        {(["create", "join"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`h-9 rounded-full text-sm font-medium transition-colors ${
              mode === m ? "bg-terracotta text-cream" : "text-ink/60 hover:text-ink"
            }`}
          >
            {m === "create" ? "Создать семью" : "Присоединиться"}
          </button>
        ))}
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="mode" value={mode} />

        {mode === "create" ? (
          <>
            <TextField label="Название семьи" name="name" placeholder="Наша семья" required />
            <p className="text-xs text-ink/50">
              Код доступа сгенерируется автоматически и покажется после создания — сохраните
              его и поделитесь с близкими.
            </p>
          </>
        ) : (
          <>
            <TextField
              label="Код доступа"
              name="code"
              placeholder="XXXXX-XXXXX"
              autoComplete="off"
              autoCapitalize="characters"
              required
            />
            <p className="text-xs text-ink/50">Введите код семьи (регистр и дефис не важны).</p>
          </>
        )}

        {state?.error && <p className="text-sm text-terracotta">{state.error}</p>}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Подождите…" : mode === "create" ? "Создать семью" : "Войти"}
        </Button>
      </form>
    </div>
  );
}

function CreatedPanel({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Семья создана!</h2>
        <p className="mt-1 text-sm text-ink/55">Это код доступа вашей семьи</p>
      </div>

      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(code);
          setCopied(true);
        }}
        className="w-full rounded-2xl border border-gold bg-gold/10 px-4 py-4 font-mono text-2xl font-semibold tracking-widest transition-colors hover:bg-gold/20"
        title="Нажмите, чтобы скопировать"
      >
        {code}
      </button>
      <span className="text-xs text-ink/55">{copied ? "Скопировано ✓" : "Нажмите на код, чтобы скопировать"}</span>

      <p className="text-xs text-ink/50">
        Поделитесь кодом с близкими — по нему они войдут в семью. Код всегда можно
        посмотреть позже в настройках.
      </p>

      <Link href="/" className={buttonStyles("primary", "w-full")}>
        Перейти в приложение
      </Link>
    </div>
  );
}
