import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Админ-клиент Supabase с service-ключом. Обходит RLS — использовать ТОЛЬКО на сервере.
 * Создаётся лениво, чтобы отсутствие env не ломало сборку.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Не заданы SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  }

  client = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return client;
}

export const RECIPE_PHOTOS_BUCKET = "recipe-photos";
