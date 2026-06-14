import Link from "next/link";
import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-ink/10 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-2xl items-center px-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Семейные&nbsp;рецепты
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 pt-5">{children}</main>

      <BottomNav />
    </div>
  );
}
