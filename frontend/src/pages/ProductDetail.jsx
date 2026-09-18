import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, MessageCircle } from "lucide-react";
import { getProduct, usePageTitle } from "@/lib/api";
import { SpiceMeter, GoldBadge, SampleTag, ErrorState, CardGridSkeleton } from "@/components/Blocks";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

const NA = <span className="text-[#5F6F67] italic">Information not available</span>;

export default function ProductDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  usePageTitle("Product")();

  const load = () => {
    setError(false);
    getProduct(slug).then(setData).catch(() => setError(true));
  };
  useEffect(load, [slug]); // eslint-disable-line

  if (error) return <div className="max-w-4xl mx-auto px-4 py-16"><ErrorState message="We could not load this product. It may have been removed." onRetry={load} /></div>;
  if (!data) return <div className="max-w-6xl mx-auto px-4 py-16"><CardGridSkeleton count={2} /></div>;

  const p = data.product;
  const rows = [
    ["Brand", p.brand || NA],
    ["Country of origin", p.origin_slug ? p.origin_slug.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()) : NA],
    ["Product type", p.category || NA],
    ["Flavour profile", p.flavour_profile || NA],
    ["Ingredients", p.ingredients || NA],
    ["Allergens", p.allergens || NA],
    ["Preparation", p.preparation || NA],
    ["Pack size", p.pack_size || NA],
    ["Retail price", p.price ? `₹${p.price}` : "Pricing shared in-store"],
    ["Availability", p.availability || NA],
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" data-testid="product-detail-page">
      <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00704A] hover:text-[#063B2B]" data-testid="product-back-link">
        <ArrowLeft className="w-4 h-4" /> Back to Explore Noodles
      </Link>

      <div className="mt-6 grid lg:grid-cols-2 gap-10">
        <div className="relative">
          <img src={p.image_url} alt={`${p.name} — NoodleWala`} className="w-full h-[320px] sm:h-[440px] object-cover rounded-2xl border border-[#D7E4DC]" />
          {p.try_buy_eligible && <span className="absolute top-4 left-4"><GoldBadge>Try & Buy eligible</GoldBadge></span>}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#5F6F67]">{p.category}</span>
            {p.is_sample && <SampleTag />}
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[#063B2B]" data-testid="product-name">{p.name}</h1>
          <div className="mt-3"><SpiceMeter level={p.spice_level} /></div>
          {p.is_vegetarian !== null && p.is_vegetarian !== undefined && (
            <p className="mt-2 text-xs font-mono uppercase tracking-wider text-[#1B8A63]" data-testid="product-diet">
              {p.is_vegetarian ? "Vegetarian" : "Non-vegetarian"}
            </p>
          )}
          {p.is_sample && (
            <p className="mt-4 text-xs text-[#8a6f14] bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-lg px-3 py-2 leading-relaxed" data-testid="product-sample-notice">
              This is a sample catalogue entry for demonstration. Product details, pricing and availability are confirmed in-store and managed by the NoodleWala team.
            </p>
          )}
          <dl className="mt-6 bg-white border border-[#D7E4DC] rounded-xl divide-y divide-[#F7FAF6]" data-testid="product-facts">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[140px_1fr] gap-3 px-5 py-3 text-sm">
                <dt className="text-[#5F6F67]">{k}</dt>
                <dd className="text-[#123D2D]">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full">
              <Link to="/stores" data-testid="product-store-cta"><MapPin className="w-4 h-4 mr-1.5" /> Check Store Availability</Link>
            </Button>
            <Button variant="outline" className="border-[#00704A] text-[#00704A] rounded-full" data-testid="product-ask-ai"
              onClick={() => window.dispatchEvent(new CustomEvent("nw:open-ai"))}>
              <MessageCircle className="w-4 h-4 mr-1.5" /> Ask the Assistant
            </Button>
          </div>
        </div>
      </div>

      {data.related?.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-[#063B2B]">More from this origin</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.related.map((r) => <ProductCard key={r.id} product={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
