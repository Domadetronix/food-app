import { SignJWT, jwtVerify } from "jose";

// Без "server-only" и без next/headers — модуль используется и в middleware (edge).

export const SESSION_COOKIE = "family_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 дней

function secret(): Uint8Array {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("Не задан SESSION_SECRET");
  return new TextEncoder().encode(value);
}

export type SessionPayload = { familyId: string };

export async function signSession(familyId: string): Promise<string> {
  return new SignJWT({ familyId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    const familyId = payload.familyId;
    return typeof familyId === "string" ? { familyId } : null;
  } catch {
    return null;
  }
}
