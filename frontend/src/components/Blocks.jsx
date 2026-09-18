import { Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Eyebrow = ({ children, className = "" }) => (
  <p className={`text-xs uppercase font-mono tracking-[0.22em] text-[#C9A227] font-semibold ${className}`}>
    {children}
  </p>
);

export const SectionHead = ({ eyebrow, title, sub, center = false }) => (
  <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug text-[#063B2B]">{title}</h2>
    {sub && <p className="mt-4 text-base sm:text-lg text-[#123D2D]/80 leading-relaxed">{sub}</p>}
  </div>
);

const SPICE_LABELS = ["No heat", "Mild", "Gentle", "Medium", "Hot", "Fiery"];

export const SpiceMeter = ({ level = 0, showLabel = true }) => (
  <span className="inline-flex items-center gap-1.5" data-testid="spice-meter" aria-label={`Spice level ${level} of 5`}>
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Flame key={i} className={`w-3.5 h-3.5 ${i <= level ? "text-[#C9A227] fill-[#C9A227]" : "text-[#D7E4DC]"}`} />
      ))}
    </span>
    {showLabel && <span className="font-mono text-[11px] text-[#5F6F67] uppercase tracking-wider">{SPICE_LABELS[level]}</span>}
  </span>
);

export const GoldBadge = ({ children, testId }) => (
  <span data-testid={testId}
    className="bg-[#C9A227]/10 text-[#8a6f14] border border-[#C9A227]/40 font-mono text-[11px] px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 uppercase tracking-wider">
    {children}
  </span>
);

export const SampleTag = () => (
  <span className="bg-[#1B8A63]/10 text-[#1B8A63] border border-[#1B8A63]/30 font-mono text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider" data-testid="sample-tag">
    Sample listing
  </span>
);

export const EmptyState = ({ title, message, children, testId = "empty-state" }) => (
  <div className="text-center py-16 px-6 bg-white border border-dashed border-[#D7E4DC] rounded-xl" data-testid={testId}>
    <h3 className="font-display text-xl font-semibold text-[#063B2B]">{title}</h3>
    <p className="mt-2 text-sm text-[#5F6F67] max-w-md mx-auto leading-relaxed">{message}</p>
    {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
  </div>
);

export const CardGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="loading-skeleton" aria-label="Loading NoodleWala information...">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white border border-[#D7E4DC] rounded-xl overflow-hidden">
        <Skeleton className="h-44 w-full rounded-none" />
        <div className="p-5 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    ))}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="text-center py-12 px-6 bg-white border border-[#D7E4DC] rounded-xl" data-testid="error-state" role="alert">
    <p className="text-sm text-[#5F6F67]">{message || "We could not load this right now. Please try again."}</p>
    {onRetry && (
      <button onClick={onRetry} data-testid="error-retry-button"
        className="mt-4 text-sm font-semibold text-[#00704A] underline underline-offset-4 hover:text-[#063B2B]">
        Try again
      </button>
    )}
  </div>
);
