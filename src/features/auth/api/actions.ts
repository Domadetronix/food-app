"use server";

import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/shared/lib/supabase/server";
import { generateCode, hashCode } from "@/shared/lib/auth/code";
import { createSession, clearSession } from "@/shared/lib/auth/session";

export type AuthState = { error?: string; createdCode?: string };

const PG_UNIQUE_VIOLATION = "23505";

/** Создание новой семьи (название) или вход в существующую (код). */
export async function authAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const mode = String(formData.get("mode") ?? "");

  if (mode === "create") {
    return createFamily(String(formData.get("name") ?? "").trim());
  }
  return joinFamily(String(formData.get("code") ?? ""));
}

async function createFamily(name: string): Promise<AuthState> {
  if (name.length < 2) return { error: "Введите название семьи" };

  const supabase = getSupabaseAdmin();

  // Генерируем код; на маловероятной коллизии UNIQUE — пробуем заново.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    const { data, error } = await supabase
      .from("families")
      .insert({ name, code_hash: hashCode(code) })
      .select("id")
      .single();

    if (!error && data) {
      await createSession(data.id);
      return { createdCode: code };
    }
    if (error && error.code !== PG_UNIQUE_VIOLATION) {
      return { error: "Не удалось создать семью. Попробуйте ещё раз." };
    }
    // иначе — коллизия кода, генерируем новый
  }
  return { error: "Не удалось сгенерировать уникальный код. Попробуйте ещё раз." };
}

async function joinFamily(code: string): Promise<AuthState> {
  if (code.trim().length < 4) return { error: "Введите код доступа" };

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("families")
    .select("id")
    .eq("code_hash", hashCode(code))
    .maybeSingle();

  if (error) return { error: "Ошибка сервера. Попробуйте позже." };
  if (!data) return { error: "Семья с таким кодом не найдена" };

  await createSession(data.id);
  redirect("/");
}

/** Выход из семьи. */
export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}
