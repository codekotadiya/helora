export default function Logo({ className = "h-7" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-[1.15em] w-[1.15em]" aria-hidden>
        <circle cx="16" cy="16" r="4.2" fill="#14B8A6" />
        <circle cx="16" cy="16" r="8.2" fill="none" stroke="#14B8A6" strokeWidth="1.6" />
        <circle cx="16" cy="16" r="12.2" fill="none" stroke="#0F766E" strokeWidth="1.1" opacity="0.75" />
      </svg>
      <span className="font-serif text-[1.15em] tracking-tight text-cream">Helora</span>
    </span>
  );
}
