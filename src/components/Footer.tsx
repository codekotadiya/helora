import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-2xl">
            <Logo />
          </div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-mist">
            The AI receptionist for dentists, restaurants, and hotels. Keep your
            number. Let Helora think on the first ring.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-mist">
          <Link href="/dentists" className="hover:text-cream">
            Dentists
          </Link>
          <Link href="/restaurants" className="hover:text-cream">
            Restaurants
          </Link>
          <Link href="/hotels" className="hover:text-cream">
            Hotels
          </Link>
          <Link href="/templates" className="hover:text-cream">
            Templates
          </Link>
          <Link href="/demo" className="hover:text-cream">
            Request a demo
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl justify-between border-t border-line px-5 py-5 text-xs text-muted">
        <span>© {new Date().getFullYear()} Helora · Evolution Tech</span>
        <span>Austin · built to answer</span>
      </div>
    </footer>
  );
}
