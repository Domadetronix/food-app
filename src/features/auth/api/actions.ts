"use server";

import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/shared/lib/supabase/server";
import { hashCode, verifyCode } from "@/shared/lib/auth/password";
import { createSession, clearSession } from "@/shared/lib/auth/session";

export type AuthState = { error?: string };

/** Создание новой семьи или вход в существующую (mode из формы). */
export async function authAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const mode = String(formData.get("mode") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "");

  if (name.length < 2) return { error: "Введите название семьи" };
  if (code.length < 6) return { error: "Код должен быть не короче 6 символов" };

  const supabase = getSupabaseAdmin();
  let familyId: string;

  if (mode === "create") {
    const codeHash = await hashCode(code);
    const { data, error } = await supabase
      .from("families")
      .insert({ name, code_hash: codeHash })
      .select("id")
      .single();
    if (error || !data) return { error: "Не удалось создать семью. Попробуйте ещё раз." };
    familyId = data.id;
  } else {
    const { data: families, error } = await supabase
      .from("families")
      .select("id, code_hash")
      .eq("name", name);
    if (error) return { error: "Ошибка сервера. Попробуйте позже." };
    const matched = await findMatchingFamily(families ?? [], code);
    if (!matched) return { error: "Неверное название или код" };
    familyId = matched;
  }

  await createSession(familyId);
  redirect("/");
}

async function findMatchingFamily(
  families: { id: string; code_hash: string }[],
  code: string,
): Promise<string | null> {
  for (const fam of families) {
    if (await verifyCode(code, fam.code_hash)) return fam.id;
  }
  return null;
}

/** Выход из семьи. */
export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}
