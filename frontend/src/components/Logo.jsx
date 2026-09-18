export default function Logo({ dark = false, compact = false }) {
  const word = dark ? "text-[#F7FAF6]" : "text-[#063B2B]";
  const tag = dark ? "text-[#C9A227]" : "text-[#00704A]";
  return (
    <span className="inline-flex items-center gap-2.5 select-none" data-testid="brand-logo">
      <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
        <rect width="32" height="32" rx="7" fill={dark ? "#C9A227" : "#063B2B"} />
        <path d="M6 15h20a10 10 0 0 1-20 0z" fill={dark ? "#063B2B" : "#C9A227"} />
        <path d="M9 15c2-4 4 4 7 0s4 4 7 0" stroke="#F7FAF6" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M19 5l6 8M23 4l5 8" stroke="#F7FAF6" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="leading-none">
        <span className={`block font-display font-bold text-lg tracking-tight ${word}`}>
          NoodleWala<span className="text-[#C9A227]">.com</span>
        </span>
        {!compact && (
          <span className={`block font-mono text-[9px] tracking-[0.28em] mt-1 ${tag}`}>
            THE WORLD OF NOODLES
          </span>
        )}
      </span>
    </span>
  );
}
