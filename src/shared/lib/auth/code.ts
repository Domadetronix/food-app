import "server-only";
import { createHmac, randomBytes } from "node:crypto";

// Алфавит без похожих символов (нет 0/O, 1/I, и т.п.). Длина 32 → нет modulo-bias от байта.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 10;

/** Случайный код доступа, формат XXXXX-XXXXX (для читаемости). */
export function generateCode(): string {
  const bytes = randomBytes(CODE_LENGTH);
  let raw = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    raw += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `${raw.slice(0, 5)}-${raw.slice(5)}`;
}

/** Нормализация ввода: верхний регистр, только буквы/цифры (дефисы и пробелы убираем). */
export function normalizeCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/**
 * Детерминированный хеш кода (HMAC-SHA256 c серверным пеппером).
 * Детерминированность нужна, чтобы искать семью по коду и держать UNIQUE-индекс.
 */
export function hashCode(code: string): string {
  const pepper = process.env.CODE_PEPPER;
  if (!pepper) throw new Error("Не задан CODE_PEPPER");
  return createHmac("sha256", pepper).update(normalizeCode(code)).digest("hex");
}
