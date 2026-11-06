import { msg } from "@/i18n/config";

/**
 * Payment rule shown on the process section, quote confirmation, warranty page, FAQ and the PDF estimate.
 * Edit the wording here and it updates everywhere. Confirm every clause matches Zain & Co's real policy before publishing.
 */
export const paymentRule = {
  title: msg("Pay only the company. Never the workers."),
  summary: msg(
    "Our karigars, helpers and site staff are not allowed to ask for, accept or give any money on site. Every payment and every agreement goes through the Zain & Co office.",
  ),
  points: [
    msg("Do not give advances, tips, 'extra work' charges or material money to workers or supervisors."),
    msg("Pay only Zain & Co, on the agreed milestones (50% to mobilise, 30% mid-project, 20% on satisfied handover), and ask for an official company receipt."),
    msg("Any extra work, change of scope or change of price must be agreed with the company office in writing. Workers cannot approve or quote it."),
    msg("Workers cannot promise discounts, warranty terms or schedule changes."),
    msg("Please do not hire or pay our karigars for private jobs on the side. Contact the company for any additional work."),
  ],
  report: msg("If anyone on site asks you for money, tell us right away."),
  whatsappMessage: "Salam Zain & Co, I want to report that someone working on my site asked me for money. Please contact me.",
  /** One-line version used in the PDF estimate */
  pdfNote:
    "Pay only Zain & Co on the agreed milestones and ask for an official receipt. Never pay workers or supervisors directly; they cannot accept money or approve extra work.",
};

export const paymentFaq = {
  id: "f7",
  question: "Can I pay the karigars or supervisors directly?",
  answer:
    "No. Our workers and supervisors are not allowed to take or give any money on site, including advances, tips, material money or payment for extra work. All payments are made only to Zain & Co on the agreed milestones against an official receipt, and any extra work is agreed with the company office in writing. If anyone asks you for money, contact the company directly and we will deal with it.",
};
