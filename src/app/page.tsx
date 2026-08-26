import Link from "next/link";
import LiveCall from "@/components/LiveCall";
import SceneCanvas from "@/components/scene/SceneCanvas";
import TemplateFlow from "@/components/TemplateFlow";
import { faqs, steps, templates, verticals } from "@/lib/content";

export default function Home() {
  const featured = templates[0];

  return (
    <div>
      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          <SceneCanvas />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-ink/25 to-ink" />
        <div className="noise" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:pb-24">
          <p className="rise text-xs uppercase tracking-[0.28em] text-glow">
            Voice receptionist · dentists · restaurants · hotels
          </p>
          <h1 className="rise rise-2 mt-5 max-w-4xl font-serif text-5xl leading-[0.98] text-cream md:text-7xl lg:text-[5.6rem]">
            The front desk
            <br />
            that thinks.
          </h1>
          <p className="rise rise-3 mt-6 max-w-xl text-lg leading-8 text-mist">
            Helora answers on the number you already have. Not a scripted menu —
            a conversation that books, remembers, and hands off with context.
          </p>
          <div className="rise rise-4 mt-8 flex flex-wrap gap-3">
            <Link
              href="/demo"
              className="btn-coral rounded-full px-6 py-3 text-sm font-medium"
            >
              Request a demo
            </Link>
            <Link
              href="/templates"
              className="rounded-full border border-cream/20 px-6 py-3 text-sm text-cream hover:border-cream/50"
            >
              See conversation templates
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-panel/40">
        <div className="mx-auto grid max-w-6xl gap-px bg-line md:grid-cols-3">
          {Object.values(verticals).map((v) => (
            <Link
              key={v.id}
              href={v.href}
              className="bg-ink px-8 py-10 transition hover:bg-panel"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-glow">{v.label}</div>
              <h2 className="mt-3 font-serif text-3xl text-cream">{v.headline}</h2>
              <p className="mt-3 text-sm leading-6 text-mist">{v.lede}</p>
              <span className="mt-5 inline-block text-sm text-cream">Explore {v.label.toLowerCase()} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-40" />
        <div className="relative mx-auto max-w-6xl px-5">
          <p className="text-xs uppercase tracking-[0.22em] text-glow">One product</p>
          <h2 className="mt-3 max-w-3xl font-serif text-4xl text-cream md:text-6xl">
            Keep the line. Change the brain on it.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-mist">
            Port, forward, or add a local number. Helora picks up first, talks
            like your desk, and only rings a human when the call needs one.
            Dentists, restaurants, and hotels all run on the same tool — the
            difference is the template.
          </p>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-3xl border border-line bg-panel/50 p-6">
                <div className="font-serif text-3xl text-glow">{s.n}</div>
                <h3 className="mt-4 text-xl text-cream">{s.title}</h3>
                <p className="mt-3 text-sm leading-6 text-mist">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-panel/30 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-glow">Not an IVR</p>
            <h2 className="mt-3 font-serif text-4xl text-cream md:text-5xl">
              A call that can think, book, and escalate.
            </h2>
            <ul className="mt-8 space-y-4 text-mist">
              <li>Multi-turn voice with caller memory — not a decision tree you get lost in.</li>
              <li>Tools: calendar, SMS, knowledge base, payments when you turn them on.</li>
              <li>Warm transfer with a spoken summary so your staff isn’t starting at zero.</li>
              <li>Plain-English edits: “Saturday after 7 is a two-hour seating.” That’s a rule.</li>
            </ul>
          </div>
          <LiveCall sample={featured.sample} title={featured.name} />
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs uppercase tracking-[0.22em] text-glow">Preset flows</p>
          <h2 className="mt-3 max-w-3xl font-serif text-4xl text-cream md:text-5xl">
            Adopt a template. Or rewrite it until it sounds like you.
          </h2>
          <p className="mt-4 max-w-2xl text-mist leading-7">
            Nine starting desks across three industries. Same Helora. Pick one,
            then change a sentence.
          </p>
          <div className="mt-12">
            <TemplateFlow />
          </div>
        </div>
      </section>

      <section className="border-t border-line py-24">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-serif text-4xl text-cream">Straight answers</h2>
          <div className="mt-10 grid gap-px bg-line md:grid-cols-2">
            {faqs.map((f) => (
              <div key={f.q} className="bg-ink p-7">
                <h3 className="text-lg text-cream">{f.q}</h3>
                <p className="mt-3 text-sm leading-7 text-mist">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-line">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.18),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-5 py-28 text-center">
          <h2 className="font-serif text-5xl text-cream md:text-6xl">
            Hear it on your number.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-mist leading-7">
            Tell us the desk. Pick a template. We’ll put Helora on a test call
            so you can interrupt it, rewrite it, and decide.
          </p>
          <Link
            href="/demo"
            className="btn-coral mt-8 inline-flex rounded-full px-8 py-3.5 text-sm font-medium"
          >
            Request a demo
          </Link>
        </div>
      </section>
    </div>
  );
}
