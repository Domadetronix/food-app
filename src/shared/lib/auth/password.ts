import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEYLEN = 64;

/** Хеширует код доступа (scrypt + соль). Формат хранения: "<salt_hex>:<hash_hex>". */
export async function hashCode(code: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(code, salt, KEYLEN)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

/** Проверяет код против сохранённого хеша (constant-time сравнение). */
export async function verifyCode(code: string, stored: string): Promise<boolean> {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const keyBuf = Buffer.from(key, "hex");
  const derived = (await scryptAsync(code, salt, KEYLEN)) as Buffer;
  return keyBuf.length === derived.length && timingSafeEqual(keyBuf, derived);
}
