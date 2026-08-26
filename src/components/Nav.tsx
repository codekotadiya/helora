"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

const links = [
  { href: "/dentists", label: "Dentists" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/hotels", label: "Hotels" },
  { href: "/templates", label: "Templates" },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="pointer-events-auto sticky top-0 z-40 border-b border-line/70 bg-ink/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" aria-label="Helora home" className="text-[22px]">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-mist md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                path === l.href
                  ? "text-cream"
                  : "transition-colors hover:text-cream"
              }
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/demo"
            className="btn-coral rounded-full px-4 py-2 text-sm font-medium tracking-tight"
          >
            Request a demo
          </Link>
        </nav>
        <button
          type="button"
          className="md:hidden text-cream"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-cream" />
          <span className="mt-1.5 block h-0.5 w-6 bg-cream" />
        </button>
      </div>
      {open ? (
        <div className="border-t border-line px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-mist">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link
              href="/demo"
              onClick={() => setOpen(false)}
              className="btn-coral inline-flex w-fit rounded-full px-4 py-2 text-sm font-medium text-ink"
            >
              Request a demo
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
