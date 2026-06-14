import { getSession } from "@/shared/lib/auth/session";
import { getSupabaseAdmin } from "@/shared/lib/supabase/server";
import { logoutAction } from "@/features/auth";

export async function SettingsPage() {
  const session = await getSession();
  let familyName = "—";
  if (session) {
    const { data } = await getSupabaseAdmin()
      .from("families")
      .select("name")
      .eq("id", session.familyId)
      .single();
    familyName = data?.name ?? "—";
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Настройки</h1>

      <section className="flex flex-col gap-3 rounded-2xl border border-ink/10 p-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold uppercase tracking-wide text-ink/50">Семья</span>
          <span className="text-lg">{familyName}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold uppercase tracking-wide text-ink/50">Код доступа</span>
          <p className="text-sm text-ink/70">
            Код хранится в зашифрованном виде, посмотреть его нельзя. Поделитесь названием
            семьи и кодом с близкими, чтобы они вошли. Если код утерян — сменить его можно
            будет позже (добавим в следующих шагах).
          </p>
        </div>
      </section>

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
