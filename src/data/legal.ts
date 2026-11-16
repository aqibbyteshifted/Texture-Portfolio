import { paymentRule } from "@/data/policy";
import { site } from "@/data/site";

/**
 * Original wording for the Terms & Conditions and Privacy Policy pages (English only).
 * Written for Zain & Co from scratch, not copied from any template or competitor.
 * It is a plain-language draft: have a Pakistani lawyer review it before relying on it, and make sure every
 * clause (milestones, warranty scope, validity period, retention period) matches how the company really works.
 */
export interface LegalSection {
  id: string;
  title: string;
  /** Paragraphs */
  body?: string[];
  /** Bullet points */
  list?: string[];
}

export const LEGAL_UPDATED = "16 November 2026";

export const termsSections: LegalSection[] = [
  {
    id: "about",
    title: "1. About these terms",
    body: [
      `These terms explain how ${site.name} ("we", "us") works with clients in Lahore and the rest of Punjab on wall-texture, facade-finish and flooring projects, and how you may use this website. By asking for a quotation, booking a site visit or signing a work order you agree to them. If a signed contract or work order says something different, the signed document comes first.`,
    ],
  },
  {
    id: "estimates",
    title: "2. Estimates and quotations",
    body: [
      "Prices shown on this website, in the calculators and in the PDF estimate are indicative. They help you plan a budget; they are not a binding offer.",
    ],
    list: [
      "A firm quotation is issued only after a site survey in which we measure the surfaces and check the condition of the plaster or substrate.",
      "Rates are in Pakistani rupees per square foot unless stated. Offer prices apply for the period or conditions stated with the offer and may be withdrawn afterwards.",
      "Finishes sold as a range (for example epoxy flooring) are priced from the system you select at survey.",
      "Quotations normally stay valid for 15 days. Material prices can move, so a later start may need a revised figure.",
      "Outstation projects may carry a logistics charge, shown before you confirm.",
    ],
  },
  {
    id: "scope",
    title: "3. Scope of work",
    body: [
      "The quotation lists the surfaces, the finish, the preparation steps and the number of coats. Anything outside that list is extra work. Typical items not included unless written down: structural repair, re-plastering of badly damaged walls, removing and refitting fixtures, scaffolding beyond normal reach, and electrical or plumbing changes.",
      "Textures are applied by hand. Small variations in pattern and tone between areas, and between a sample board and a full wall, are part of the character of the finish and are not defects.",
    ],
  },
  {
    id: "payments",
    title: "4. Payments",
    body: [paymentRule.summary, "The notice below sets out the rule in full."],
    list: [
      "Official receipts carry the company name and project reference. If you do not receive one, contact the office.",
    ],
  },
  {
    id: "client",
    title: "5. What we need from you",
    list: [
      "Clear access to the site on agreed working days, with water and electricity available.",
      "Surfaces that are structurally sound. Active seepage, leaking pipes or rising damp should be repaired first or disclosed at survey.",
      "A named person who can approve colours, samples and any change of scope.",
      "Delays caused by access, weather or late decisions can move the schedule; we will tell you promptly.",
    ],
  },
  {
    id: "schedule",
    title: "6. Schedule and weather",
    body: [
      "Timelines given in estimates are working-day approximations. Curing time between coats is part of the process and cannot be shortened safely. Heavy rain, extreme heat or dust storms can pause exterior work, in which case the programme is extended by the days lost.",
    ],
  },
  {
    id: "warranty",
    title: "7. Warranty",
    body: [
      "Completed projects receive a written warranty card stating the finish, the area and the cover period. The period depends on the finish and is printed on your card.",
    ],
    list: [
      "Covered: delamination, flaking, hollow spots and UV colour fading caused by workmanship or material fault.",
      "Not covered: damage from structural movement, leaks or seepage from outside the finished layer, impact or vandalism, harsh chemicals or pressure washing, repainting or alterations by others, and normal weathering of natural-look finishes.",
      "To claim, use the form on the Warranty page or contact the office with photos. We aim to inspect within 48 hours in Lahore.",
      "The warranty applies only to projects paid in full.",
    ],
  },
  {
    id: "changes",
    title: "8. Changes and cancellation",
    body: [
      "You may change the scope before work starts; the price is then revised in writing. Once materials have been ordered or mixed to your colour, or work has begun, the cost of those materials and of the work already done is payable. Cancelling after mobilisation does not return the first milestone payment for work and materials already committed.",
    ],
  },
  {
    id: "site",
    title: "9. Conduct on site",
    body: [
      "Our crews work under company supervision and must behave professionally. They may not ask for, receive or hand over money, and may not approve or price extra work. Please report any breach straight away using the contact details at the end of this page.",
    ],
  },
  {
    id: "website",
    title: "10. Using this website",
    list: [
      "Calculators, the colour visualizer and shade previews are visual aids. Screens differ, so colours and textures will not match the finished wall exactly; always confirm against a physical sample board.",
      "Photos you load into the visualizer are processed inside your browser and are not uploaded to our servers.",
      "Please do not misuse the site: no automated scraping, no attempts to disrupt it and no false enquiries.",
      "Sample images are illustrative. Where an image shows a past project, the finish and shade of your own project can differ.",
    ],
  },
  {
    id: "ip",
    title: "11. Ownership of content",
    body: [
      `The ${site.name} name, logo, written content and site design belong to us or are used with permission. You may share a page link and print your own estimate, but please do not copy or republish our text, photographs, logo or designs for commercial use without written permission. Names of third-party paint or material brands, where mentioned, belong to their owners and are used only to describe compatible products.`,
    ],
  },
  {
    id: "liability",
    title: "12. Limits of liability",
    body: [
      "We take care on every project, and the warranty above is the main remedy for defective work. To the extent the law allows, we are not liable for indirect or consequential loss, and our total liability for a project is limited to the amount you paid us for that project. Nothing here limits liability that cannot lawfully be limited.",
    ],
  },
  {
    id: "disputes",
    title: "13. Disputes and governing law",
    body: [
      "If something goes wrong, please talk to us first; most issues are solved on a site visit. If we cannot agree, the parties will try mediation before going to court. These terms are governed by the laws of Pakistan and the courts of Lahore have jurisdiction.",
    ],
  },
  {
    id: "changes-terms",
    title: "14. Changes to these terms",
    body: [
      "We may update these terms. The date at the top of this page shows the latest version. Projects already confirmed stay under the terms that applied when you confirmed them.",
    ],
  },
];

export const privacySections: LegalSection[] = [
  {
    id: "who",
    title: "1. Who we are",
    body: [
      `${site.name} is a wall-texture and facade-finishes contractor based in Lahore. This policy explains what personal information we collect through this website, why, and the choices you have.`,
    ],
  },
  {
    id: "collect",
    title: "2. What we collect",
    list: [
      "Quote and warranty forms: your name, mobile number, optional email, area or address, project details (surface area, finish, shade, preferred visit date) and any notes you type.",
      "Referral code, if you arrived through a referral link. It is kept in your browser for 30 days and attached to your enquiry.",
      "Calculator and visualizer inputs stay in your browser unless you send them to us with a quote request.",
      "Technical data: your IP address is used briefly to stop abusive form submissions. If you accept analytics cookies we also receive anonymous usage statistics (pages viewed, button clicks, device type).",
    ],
  },
  {
    id: "use",
    title: "3. How we use it",
    body: ["We do not sell your details and we do not send marketing messages unless you have asked for them."],
    list: [
      "To prepare quotations, arrange site visits and handle warranty claims.",
      "To contact you about your enquiry by phone, WhatsApp or email.",
      "To keep the website secure and understand which pages are useful.",
      "To meet legal, tax and accounting duties once you become a client.",
    ],
  },
  {
    id: "photos",
    title: "4. Photos in the visualizer",
    body: [
      "When you load a room photo into the colour visualizer it is processed locally in your browser. It is not sent to our servers. If you want us to see a photo, you can share it with us yourself on WhatsApp.",
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies and analytics",
    body: [
      'We use a small cookie to remember your language choice. Analytics and advertising tools (Google Analytics, Meta Pixel), if switched on, load only after you accept them in the cookie banner. You can change your mind at any time with "Manage cookies" in the footer.',
    ],
  },
  {
    id: "sharing",
    title: "6. Who we share it with",
    body: [
      "Only people and services that help us run the business: our estimators and site managers, our hosting and form-delivery providers, and analytics providers if you consented. They may process data only for those purposes. We may disclose information if the law requires it.",
    ],
  },
  {
    id: "keep",
    title: "7. How long we keep it",
    body: [
      "Enquiries that do not become projects are deleted or anonymised after about 24 months. Client records and warranty files are kept for the length of the warranty and for the period needed for accounting and legal purposes.",
    ],
  },
  {
    id: "rights",
    title: "8. Your choices",
    body: [
      `You can ask to see, correct or delete the details we hold about you, or object to us contacting you, by writing to ${site.email} or calling ${site.phone}. We will reply within a reasonable time and may need to confirm who you are first.`,
    ],
  },
  {
    id: "security",
    title: "9. Security",
    body: [
      "We use secure connections, limit who can open enquiries and keep only what we need. No online system is perfectly secure, so please do not send bank card numbers, passwords or CNIC images through the forms. We never ask for them.",
    ],
  },
  {
    id: "children",
    title: "10. Children",
    body: ["This website is meant for property owners and professionals. It is not directed at children."],
  },
  {
    id: "updates",
    title: "11. Updates",
    body: ["We will post changes to this policy on this page and update the date at the top."],
  },
];
