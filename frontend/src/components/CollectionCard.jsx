import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function CollectionCard({ collection, large = false }) {
  const c = collection;
  return (
    <Link to={`/collections/${c.slug}`} data-testid={`collection-card-${c.slug}`}
      className={`group relative block overflow-hidden rounded-xl border border-[#D7E4DC] bg-[#063B2B] ${large ? "sm:col-span-2 h-64 sm:h-72" : "h-64"}`}>
      <img src={c.image_url} alt={`${c.name} noodle collection — NoodleWala`} loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#063B2B] via-[#063B2B]/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#C9A227] border border-[#C9A227]/50 rounded-sm px-2 py-0.5">{c.code}</span>
            <h3 className="mt-2.5 font-display text-xl sm:text-2xl font-bold text-white">{c.name}</h3>
            <p className="mt-1 text-xs sm:text-sm text-white/75 leading-relaxed max-w-sm">{c.description}</p>
            <p className="mt-2 font-mono text-[10px] text-white/60 uppercase tracking-wider">
              {c.product_count ? `${c.product_count} sample ${c.product_count === 1 ? "product" : "products"}` : "Catalogue coming soon"}
            </p>
          </div>
          <span className="shrink-0 w-10 h-10 rounded-full bg-[#C9A227] text-[#063B2B] flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
            <ArrowUpRight className="w-5 h-5" />
          </span>
        </div>
      </div>
      {c.badge && (
        <span className="absolute top-4 left-4 bg-[#C9A227] text-[#063B2B] font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-sm">{c.badge}</span>
      )}
    </Link>
  );
}
