import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "whatsapp" | "dark" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-clay-500 text-white hover:bg-clay-600 active:bg-clay-700 shadow-sm",
  secondary: "bg-surface text-ink border border-line-strong hover:bg-sunken",
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-dark shadow-sm",
  dark: "bg-ink text-white hover:bg-black",
  ghost: "text-clay-600 hover:bg-clay-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-6 text-[15px] gap-2.5",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-control font-semibold whitespace-nowrap",
    "transition-[background,transform,box-shadow] duration-200 active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = CommonProps &
  (
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">)
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
  );

export function Button({ variant, size, className, children, ...rest }: ButtonProps) {
  const classes = buttonClass(variant, size, className);

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchor } = rest;
    const external = /^(https?:|tel:|mailto:)/.test(href);
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...anchor}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchor}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...button } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={classes} {...button}>
      {children}
    </button>
  );
}
