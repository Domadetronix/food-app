export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[11px] text-ink/70">
      #{children}
    </span>
  );
}
