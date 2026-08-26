import type { Metadata } from "next";
import TemplateFlow from "@/components/TemplateFlow";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Preset Helora conversation flows for dentists, restaurants, and hotels. Adopt one, or rewrite it in plain English.",
};

export default function TemplatesPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs uppercase tracking-[0.22em] text-glow">Conversation design</p>
      <h1 className="mt-3 max-w-3xl font-serif text-5xl text-cream md:text-6xl">
        One tool. Nine starting desks.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-mist">
        Helora is a single receptionist. These are the flows it can adopt on day
        one. Change a rule in a sentence — Saturday seatings, emergency triage,
        late checkout — and the voice follows.
      </p>
      <div className="mt-14">
        <TemplateFlow />
      </div>
    </section>
  );
}
