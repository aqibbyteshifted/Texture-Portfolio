import {
  Award,
  BadgeCheck,
  Clock,
  ClipboardCheck,
  Droplets,
  FileSignature,
  Hammer,
  MapPinned,
  Receipt,
  Ruler,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react";

export function WhatsAppIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.84 9.84 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.22 8.24c0 4.54-3.7 8.23-8.22 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.88 2.4 1 2.56c.12.17 1.73 2.64 4.19 3.7.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

export const iconMap = {
  badge: BadgeCheck,
  award: Award,
  pin: MapPinned,
  shield: ShieldCheck,
  send: Send,
  clipboard: ClipboardCheck,
  file: FileSignature,
  hammer: Hammer,
  ruler: Ruler,
  droplets: Droplets,
  clock: Clock,
  receipt: Receipt,
  sun: Sun,
  sliders: SlidersHorizontal,
  sparkles: Sparkles,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Component = iconMap[name];
  return <Component aria-hidden="true" className={className} />;
}
