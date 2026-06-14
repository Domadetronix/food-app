import type { ButtonHTMLAttributes } from "react";

export function Chip({
  active = false,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-transparent bg-terracotta text-cream"
          : "border-gold/60 text-ink hover:border-gold"
      } ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
