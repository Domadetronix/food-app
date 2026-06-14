"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/shared/lib/auth/session";
import { getSupabaseAdmin } from "@/shared/lib/supabase/server";
import { encryptCode, generateCode, hashCode } from "@/shared/lib/auth/code";

const PG_UNIQUE_VIOLATION = "23505";

/**
 * Генерирует новый код доступа для текущей семьи.
 * Уже вошедшие участники доступ не теряют (сессия привязана к family_id, не к коду).
 * Старый код перестаёт работать для новых входов.
 */
export async function regenerateFamilyCodeAction(): Promise<void> {
  const session = await getSession();
  if (!session) return;

  const supabase = getSupabaseAdmin();
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    const { error } = await supabase
      .from("families")
      .update({ code_hash: hashCode(code), code_encrypted: encryptCode(code) })
      .eq("id", session.familyId);

    if (!error) break;
    if (error.code !== PG_UNIQUE_VIOLATION) break;
    // иначе — коллизия кода, пробуем заново
  }

  revalidatePath("/settings");
}
