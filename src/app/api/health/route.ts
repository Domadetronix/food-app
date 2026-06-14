import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/shared/lib/supabase/server";

// Keep-alive: лёгкий запрос к БД, чтобы Supabase (free) не уходил в паузу после
// 7 дней простоя. Дёргается Vercel Cron (см. vercel.json) раз в сутки.
// Защищён CRON_SECRET: Vercel автоматически шлёт его в заголовке Authorization.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("families").select("id", { head: true, count: "exact" });
    if (error) {
      return NextResponse.json({ ok: false, db: false }, { status: 500 });
    }
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
