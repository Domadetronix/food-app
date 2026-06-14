import { getSession } from "@/shared/lib/auth/session";
import { getSupabaseAdmin } from "@/shared/lib/supabase/server";
import { decryptCode } from "@/shared/lib/auth/code";
import { logoutAction } from "@/features/auth";
import { FamilyCodeCard } from "@/features/manage-family-code";

export async function SettingsPage() {
  const session = await getSession();
  let familyName = "—";
  let code: string | null = null;

  if (session) {
    const { data } = await getSupabaseAdmin()
      .from("families")
      .select("name, code_encrypted")
      .eq("id", session.familyId)
      .single();
    familyName = data?.name ?? "—";
    code = data?.code_encrypted ? decryptCode(data.code_encrypted) : null;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Настройки</h1>

      <section className="flex flex-col gap-1 rounded-2xl border border-ink/10 p-4">
        <span className="text-sm font-semibold uppercase tracking-wide text-ink/50">Семья</span>
        <span className="text-lg">{familyName}</span>
      </section>

      <FamilyCodeCard code={code} />

      <form action={logoutAction}>
        <button
          type="submit"
          className="inline-flex h-11 w-full items-center justify-center rounded-full border border-ink/20 px-5 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5"
        >
          Выйти
        </button>
      </form>
    </div>
  );
}
