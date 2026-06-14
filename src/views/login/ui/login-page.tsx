import Link from "next/link";
import { TextField, buttonStyles } from "@/shared/ui";

// Заготовка входа. Логика авторизации семьи — на этапе 1.
export function LoginPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-5 py-12">
      <div className="flex w-full max-w-sm flex-col gap-7">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta text-cream">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="8.5" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Семейные рецепты</h1>
          <p className="text-sm text-ink/55">Войди в свою семью по названию и коду</p>
        </div>

        <form className="flex flex-col gap-4">
          <TextField label="Название семьи" placeholder="Наша семья" />
          <TextField label="Код доступа" placeholder="••••••••" />
          <Link href="/" className={buttonStyles("primary")}>
            Войти
          </Link>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-sm">
          <span className="text-ink/55">Ещё нет семьи?</span>
          <button type="button" className="font-medium text-terracotta hover:underline">
            Создать новую
          </button>
        </div>
      </div>
    </main>
  );
}
