import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export const fieldLabelClass =
  "text-sm font-semibold uppercase tracking-wide text-ink/50";

export const inputClass =
  "h-11 w-full rounded-xl border border-ink/15 bg-cream px-3.5 text-sm outline-none placeholder:text-ink/40 focus:border-terracotta";

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className={fieldLabelClass}>
      {label}
      {required && <span className="text-terracotta"> *</span>}
    </label>
  );
}

export function TextField({
  label,
  required,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <FieldLabel label={label} required={required} />}
      <input className={`${inputClass} ${className ?? ""}`} required={required} {...props} />
    </div>
  );
}

export function TextArea({
  label,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <FieldLabel label={label} />}
      <textarea
        className={`w-full resize-y rounded-xl border border-ink/15 bg-cream p-3.5 text-sm outline-none placeholder:text-ink/40 focus:border-terracotta ${className ?? ""}`}
        {...props}
      />
    </div>
  );
}
