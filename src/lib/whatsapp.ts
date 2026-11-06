import { site } from "@/data/site";

export function whatsappLink(message: string) {
  return `https://wa.me/${site.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export const waMessages = {
  start: "Salam Zain & Co, I am ready to start my wall texture project.",
  visit: "Salam Zain & Co, I would like to book a site visit in Lahore.",
  consult: "Salam Zain & Co, I would like to consult on wall textures.",
  engineer: "Salam Zain & Co, I would like to chat with a site engineer.",
  sample: (texture: string) =>
    `Salam Zain & Co, I would like to request a physical 1x1 ft ${texture} sample board.`,
  interest: (texture: string) =>
    `Salam Zain & Co, I am interested in ${texture} for my project. Please share details.`,
  estimate: (texture: string, sqft: number, total: string) =>
    `Salam Zain & Co, I calculated an estimate for ${sqft.toLocaleString("en-PK")} sq ft of ${texture} (${total}). Please schedule a site visit and sample review.`,
  shade: (texture: string, shade: string, code: string) =>
    `Salam Zain & Co, I like ${texture} in shade ${shade} (${code}). Please share a quote and a sample board.`,
  compare: (names: string[]) =>
    `Salam Zain & Co, I am comparing ${names.join(", ")}. Please help me choose the right finish.`,
  followUp: (ref: string) => `Salam, following up on my recent quote request #${ref}.`,
  quoteRef: (ref: string, name: string, area: string) =>
    `Salam Zain & Co, I just submitted Quote Ref #${ref}${name ? ` (${name})` : ""}${area ? ` for ${area}` : ""}. Sharing my site photos/layout here.`,
};
