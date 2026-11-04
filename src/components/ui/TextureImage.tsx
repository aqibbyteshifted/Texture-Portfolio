import Image from "next/image";
import { cn } from "@/lib/cn";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface Props {
  src?: string;
  alt: string;
  /** Fallback colour used for the generated placeholder when `src` is missing. */
  swatch: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Fills its (relatively positioned) parent. Renders the photo when one exists, otherwise a
 * tinted, grain-textured placeholder so pages stay presentable until real photos are added.
 */
export function TextureImage({ src, alt, swatch, sizes, priority, className }: Props) {
  if (src) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", className)} />;
  }
  return (
    <div
      role="img"
      aria-label={`${alt} (photo coming soon)`}
      className={cn("absolute inset-0", className)}
      style={{
        backgroundColor: swatch,
        backgroundImage: `${NOISE}, linear-gradient(135deg, rgba(255,255,255,.28), rgba(0,0,0,.18))`,
        backgroundBlendMode: "overlay, normal",
      }}
    />
  );
}
