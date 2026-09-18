import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SpiceMeter, SampleTag, GoldBadge } from "@/components/Blocks";

export default function ProductCard({ product }) {
  const p = product;
  return (
    <article className="group bg-white border border-[#D7E4DC] rounded-xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(6,59,43,0.05)] hover:shadow-[0_12px_28px_-6px_rgba(6,59,43,0.12)] hover:border-[#1B8A63]/50 transition-shadow duration-300 flex flex-col"
      data-testid={`product-card-${p.slug}`}>
      <Link to={`/products/${p.slug}`} className="block relative h-44 overflow-hidden bg-[#F7FAF6]" tabIndex={-1} aria-hidden="true">
        <img src={p.image_url} alt={`${p.name} — NoodleWala sample product`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        {p.try_buy_eligible && (
          <span className="absolute top-3 left-3"><GoldBadge testId={`try-buy-badge-${p.slug}`}>Try & Buy</GoldBadge></span>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#5F6F67]">{p.category}</span>
          {p.is_sample && <SampleTag />}
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold text-[#063B2B] leading-snug">{p.name}</h3>
        <p className="mt-1 text-xs text-[#5F6F67] uppercase tracking-wider font-mono">{p.origin_slug?.replace("-", " ")}</p>
        <p className="mt-2 text-sm text-[#123D2D]/80 leading-relaxed line-clamp-2">{p.flavour_profile}</p>
        <div className="mt-3"><SpiceMeter level={p.spice_level} /></div>
        <div className="mt-4 pt-4 border-t border-[#D7E4DC] flex items-center justify-between">
          <span className="text-xs text-[#5F6F67]">{p.price ? `₹${p.price}` : "Pricing shared in-store"}</span>
          <Link to={`/products/${p.slug}`} data-testid={`product-view-${p.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#00704A] hover:text-[#063B2B] transition-colors">
            View Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
