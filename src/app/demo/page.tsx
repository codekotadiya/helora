import type { Metadata } from "next";
import DemoForm from "@/components/DemoForm";
import SceneCanvas from "@/components/scene/SceneCanvas";

export const metadata: Metadata = {
  title: "Request a demo",
  description:
    "Hear Helora on your number. Pick a dentist, restaurant, or hotel template and we’ll run a live test call.",
};

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ vertical?: string; template?: string }>;
}) {
  const q = await searchParams;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 opacity-70 lg:block">
        <SceneCanvas compact />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/40" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-glow">Live test call</p>
          <h1 className="mt-3 font-serif text-5xl text-cream md:text-6xl">
            Hear Helora pick up.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-mist">
            Tell us the desk. We’ll put the template on a call to your phone so
            you can interrupt it, correct it, and decide if it sounds like your
            front desk.
          </p>
          <ul className="mt-8 space-y-3 text-sm leading-6 text-mist">
            <li>— Keep your existing number, or we start on a new local line.</li>
            <li>— Dentists, restaurants, and hotels share one product.</li>
            <li>— You leave with a flow you can rewrite in English.</li>
          </ul>
        </div>
        <DemoForm presetVertical={q.vertical} presetTemplate={q.template} />
      </div>
    </section>
  );
}
