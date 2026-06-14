import "server-only";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
} from "node:crypto";

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

function pepper(): string {
  const value = process.env.CODE_PEPPER;
  if (!value) throw new Error("Не задан CODE_PEPPER");
  return value;
}

/**
 * Детерминированный хеш кода (HMAC-SHA256 c серверным пеппером).
 * Нужен, чтобы искать семью по коду и держать UNIQUE-индекс.
 */
export function hashCode(code: string): string {
  return createHmac("sha256", pepper()).update(normalizeCode(code)).digest("hex");
}

// Ключ AES выводится из CODE_PEPPER (32 байта). В БД хранится только шифртекст —
// без серверного пеппера прочитать код нельзя.
function encKey(): Buffer {
  return createHash("sha256").update(pepper()).digest();
}

/** Обратимое шифрование кода для показа в настройках. Формат: iv:tag:ciphertext (hex). */
export function encryptCode(code: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encKey(), iv);
  const enc = Buffer.concat([cipher.update(code, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("hex"), tag.toString("hex"), enc.toString("hex")].join(":");
}

/** Расшифровка кода. Возвращает null, если данные повреждены/несовместимы. */
export function decryptCode(stored: string): string | null {
  try {
    const [ivHex, tagHex, dataHex] = stored.split(":");
    if (!ivHex || !tagHex || !dataHex) return null;
    const decipher = createDecipheriv("aes-256-gcm", encKey(), Buffer.from(ivHex, "hex"));
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    const dec = Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]);
    return dec.toString("utf8");
  } catch {
    return null;
  }
}
