import { useId } from "react";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-control border border-line-strong bg-surface px-3 text-sm text-ink placeholder:text-ink-muted/70 " +
  "transition-shadow focus:border-clay-500 focus:shadow-[0_0_0_3px_rgba(181,101,29,0.15)] focus:outline-none " +
  "aria-[invalid=true]:border-red-500 aria-[invalid=true]:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]";

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
}

export function Field({
  label,
  error,
  hint,
  className,
  as = "input",
  options,
  ...props
}: BaseProps & {
  as?: "input" | "textarea" | "select";
  options?: { value: string; label: string }[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
} & Omit<
    React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement> & React.SelectHTMLAttributes<HTMLSelectElement>,
    "className" | "onChange"
  >) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  const shared = { id, "aria-invalid": !!error, "aria-describedby": describedBy };

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-soft uppercase">
        {label}
        {props.required && <span className="text-clay-500"> *</span>}
      </label>
      {as === "textarea" ? (
        <textarea {...shared} rows={4} className={cn(control, "min-h-24 resize-y py-2.5")} {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : as === "select" ? (
        <select {...shared} className={cn(control, "h-11")} {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...shared} className={cn(control, "h-11")} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {error ? (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
