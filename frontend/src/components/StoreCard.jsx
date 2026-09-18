import { Link } from "react-router-dom";
import { Clock, MapPin, Navigation, Package, Truck } from "lucide-react";
import { GoldBadge, SampleTag } from "@/components/Blocks";

const TB_STATUS = {
  available: { label: "Try & Buy available", cls: "bg-[#C9A227]/10 text-[#8a6f14] border-[#C9A227]/40" },
  selected_days: { label: "Try & Buy on selected days", cls: "bg-[#C9A227]/10 text-[#8a6f14] border-[#C9A227]/40" },
  temporarily_unavailable: { label: "Try & Buy paused", cls: "bg-[#5F6F67]/10 text-[#5F6F67] border-[#5F6F67]/30" },
  coming_soon: { label: "Try & Buy coming soon", cls: "bg-[#1B8A63]/10 text-[#1B8A63] border-[#1B8A63]/30" },
  not_participating: { label: "Not participating in Try & Buy", cls: "bg-[#5F6F67]/10 text-[#5F6F67] border-[#5F6F67]/30" },
};

export default function StoreCard({ store }) {
  const s = store;
  const tb = TB_STATUS[s.try_buy?.status] || TB_STATUS.not_participating;
  return (
    <article className="bg-white border border-[#D7E4DC] rounded-xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(6,59,43,0.05)] hover:shadow-[0_12px_28px_-6px_rgba(6,59,43,0.12)] hover:border-[#1B8A63]/50 transition-shadow duration-300"
      data-testid={`store-card-${s.id}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-lg font-semibold text-[#063B2B]">{s.name}</h3>
            {s.is_sample && <SampleTag />}
          </div>
          <p className="mt-1 text-sm text-[#5F6F67] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" /> {s.area}, {s.city}, {s.state} {s.pin_code}
          </p>
        </div>
        <span className={`shrink-0 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${
          s.status === "open" ? "bg-[#00704A]/10 text-[#00704A] border-[#00704A]/30" : "bg-[#C9A227]/10 text-[#8a6f14] border-[#C9A227]/40"}`}
          data-testid={`store-status-${s.id}`}>
          {s.status === "open" ? "Open" : "Coming soon"}
        </span>
      </div>

      <p className="mt-2 text-xs text-[#5F6F67] flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {s.hours}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${tb.cls}`}
          data-testid={`store-trybuy-${s.id}`}>{tb.label}</span>
        {s.pickup_enabled && (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#1B8A63]/30 bg-[#1B8A63]/10 text-[#1B8A63]">
            <Package className="w-3 h-3" /> Pickup
          </span>
        )}
        {s.delivery_enabled && (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#1B8A63]/30 bg-[#1B8A63]/10 text-[#1B8A63]">
            <Truck className="w-3 h-3" /> Delivery
          </span>
        )}
      </div>

      {s.try_buy?.time_window && (s.try_buy.status === "available" || s.try_buy.status === "selected_days") && (
        <p className="mt-3 text-xs text-[#123D2D]/70">
          Sampling: {s.try_buy.days} • {s.try_buy.time_window}
        </p>
      )}
      <p className="mt-2 text-xs text-[#5F6F67] leading-relaxed">{s.description}</p>

      <div className="mt-4 pt-4 border-t border-[#D7E4DC] flex flex-wrap gap-2">
        {s.directions_url ? (
          <a href={s.directions_url} target="_blank" rel="noopener noreferrer" data-testid={`store-directions-${s.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00704A] hover:text-[#063B2B]">
            <Navigation className="w-3.5 h-3.5" /> Directions
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-[#5F6F67]">
            <Navigation className="w-3.5 h-3.5" /> Directions link coming soon
          </span>
        )}
        <Link to="/try-and-buy" data-testid={`store-trybuy-cta-${s.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00704A] hover:text-[#063B2B]">
          Try & Buy details
        </Link>
        <Link to={`/contact?type=${encodeURIComponent("Store Location")}`} data-testid={`store-enquiry-${s.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00704A] hover:text-[#063B2B]">
          Enquire
        </Link>
      </div>
    </article>
  );
}
