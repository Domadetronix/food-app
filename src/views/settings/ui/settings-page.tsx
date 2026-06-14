import Link from "next/link";
import { buttonStyles } from "@/shared/ui";

export function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Настройки</h1>

      <section className="flex flex-col gap-3 rounded-2xl border border-ink/10 p-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold uppercase tracking-wide text-ink/50">Семья</span>
          <span className="text-lg">Наша семья</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold uppercase tracking-wide text-ink/50">Код доступа</span>
          <div className="flex items-center gap-3">
            <code className="rounded-lg bg-ink/5 px-3 py-1.5 font-mono tracking-widest">••••••••</code>
            <button type="button" className="text-sm font-medium text-terracotta hover:underline">
              Показать
            </button>
          </div>
          <p className="text-xs text-ink/50">Поделись названием и кодом с близкими, чтобы они вошли в эту семью.</p>
        </div>
      </section>

      <div className="flex flex-col gap-2">
        <button type="button" className={buttonStyles("outline")}>
          Сменить код доступа
        </button>
        <Link href="/login" className={buttonStyles("ghost")}>
          Выйти
        </Link>
      </div>

      <p className="text-center text-xs text-ink/45">Демо. На этапе 1 — реальная семья и код.</p>
    </div>
  );
}
