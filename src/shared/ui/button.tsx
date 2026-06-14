import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "outline" | "ghost";

const base =
  "inline-flex h-11 items-center justify-center gap-1.5 rounded-full px-5 text-sm font-medium transition-colors";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-terracotta text-cream hover:bg-terracotta/90",
  outline: "border border-gold text-ink hover:bg-gold/15",
  ghost: "border border-ink/20 text-ink/70 hover:bg-ink/5",
};

/** Классы кнопки — для использования на <Link> и других элементах. */
export function buttonStyles(variant: ButtonVariant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`.trim();
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button className={buttonStyles(variant, className)} {...props}>
      {children}
    </button>
  );
}
