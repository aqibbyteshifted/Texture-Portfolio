import { cn } from "@/lib/cn";

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
  action?: React.ReactNode;
}

export function SectionHeading({ eyebrow, title, description, align = "left", className, as: Tag = "h2", action }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center sm:justify-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-clay-500 uppercase">{eyebrow}</p>
        )}
        <Tag className="text-[1.75rem] leading-[1.1] font-bold text-ink sm:text-4xl">{title}</Tag>
        {description && <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}
