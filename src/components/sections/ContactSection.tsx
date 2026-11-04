import { Mail, MapPinned, Phone } from "lucide-react";
import { ContactForm } from "@/components/features/ContactForm";
import { site } from "@/data/site";

const crews = ["DHA Phase 1-9 & Prism", "Bahria Town", "Gulberg MM Alam", "Model Town", "Lake City", "Johar Town", "WAPDA Town", "Valencia"];

export function ContactSection() {
  return (
    <section id="contact" className="container-page pb-16 sm:pb-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-clay-500 uppercase">Direct Operations</p>
          <h2 className="mt-2 text-[1.75rem] font-bold sm:text-4xl">Get in Touch</h2>
          <p className="mt-3 text-ink-soft">
            Visit our architectural texture studio or call our project estimators directly for technical support.
          </p>
          <ul className="mt-8 grid gap-6">
            <li className="flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-clay-50 text-clay-500"><MapPinned aria-hidden="true" className="size-6" /></span>
              <div>
                <h3 className="font-sans text-base font-bold tracking-normal">Lahore Head Office &amp; Sample Studio</h3>
                <p className="text-sm text-ink-soft">{site.address}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-clay-50 text-clay-500"><Phone aria-hidden="true" className="size-6" /></span>
              <div>
                <h3 className="font-sans text-base font-bold tracking-normal">Phone &amp; Engineering Helpline</h3>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-sm font-semibold text-clay-600 hover:underline">{site.phone}</a>
                <p className="text-xs text-ink-muted">Available Monday – Saturday, 9:00 AM – 7:00 PM</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-clay-50 text-clay-500"><Mail aria-hidden="true" className="size-6" /></span>
              <div>
                <h3 className="font-sans text-base font-bold tracking-normal">Architectural Specifications</h3>
                <a href={`mailto:${site.email}`} className="text-sm font-semibold text-clay-600 hover:underline">{site.email}</a>
              </div>
            </li>
          </ul>
          <div className="mt-8">
            <p className="text-xs font-semibold tracking-wider text-ink-muted uppercase">Active Daily Crews In:</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {crews.map((c) => (
                <li key={c} className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-soft">{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-lift sm:p-8">
          <h3 className="text-xl font-bold">Send a Quick Message</h3>
          <p className="mt-1 mb-6 text-sm text-ink-soft">Tell us about your project and a project manager will respond shortly.</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
