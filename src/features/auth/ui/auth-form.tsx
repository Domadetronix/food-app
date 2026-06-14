"use client";

import { useActionState, useState } from "react";
import { Button, TextField } from "@/shared/ui";
import { authAction, type AuthState } from "../api/actions";

type Mode = "create" | "join";

// Понятный код без похожих символов (0/O, 1/I и т.п.)
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("create");
  const [code, setCode] = useState("");
  const [state, formAction, pending] = useActionState<AuthState, FormData>(authAction, {});

  return (
    <div className="flex flex-col gap-6">
      {/* Выбор: создать или присоединиться */}
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

        <TextField label="Название семьи" name="name" placeholder="Наша семья" required />

        <div className="flex flex-col gap-1.5">
          <TextField
            label="Код доступа"
            name="code"
            placeholder="••••••••"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete={mode === "create" ? "new-password" : "current-password"}
            required
          />
          {mode === "create" && (
            <button
              type="button"
              onClick={() => setCode(generateCode())}
              className="self-start text-sm font-medium text-terracotta hover:underline"
            >
              Сгенерировать надёжный код
            </button>
          )}
        </div>

        {state?.error && <p className="text-sm text-terracotta">{state.error}</p>}

        {mode === "create" && (
          <p className="text-xs text-ink/50">
            Сохраните код — посмотреть его позже нельзя (хранится в виде хеша), только сбросить.
            Поделитесь названием и кодом с близкими, чтобы они вошли в семью.
          </p>
        )}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Подождите…" : mode === "create" ? "Создать семью" : "Войти"}
        </Button>
      </form>
    </div>
  );
}
