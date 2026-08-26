import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-32 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-glow">404</p>
      <h1 className="mt-3 font-serif text-5xl text-cream">This desk is empty.</h1>
      <p className="mt-4 text-mist">The page isn’t on the board. Helora is still on the main line.</p>
      <Link href="/" className="btn-coral mt-8 inline-flex rounded-full px-6 py-3 text-sm font-medium">
        Back to Helora
      </Link>
    </div>
  );
}
