import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getCollection, usePageTitle } from "@/lib/api";
import { CardGridSkeleton, EmptyState, ErrorState, Eyebrow } from "@/components/Blocks";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export default function CollectionDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  usePageTitle("Collection")();

  const load = () => { setError(false); getCollection(slug).then(setData).catch(() => setError(true)); };
  useEffect(load, [slug]); // eslint-disable-line

  if (error) return <div className="max-w-4xl mx-auto px-4 py-16"><ErrorState message="We could not load this collection." onRetry={load} /></div>;
  if (!data) return <div className="max-w-7xl mx-auto px-4 py-16"><CardGridSkeleton count={3} /></div>;

  const c = data.collection;
  return (
    <div data-testid="collection-detail-page">
      <section className="relative bg-[#063B2B] text-white overflow-hidden">
        <img src={c.image_url} alt={`${c.name} noodles — NoodleWala collection`}
          className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <Link to="/collections" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9A227] hover:text-white" data-testid="collection-back-link">
            <ArrowLeft className="w-4 h-4" /> All Collections
          </Link>
          <div className="mt-4">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#C9A227] border border-[#C9A227]/50 rounded-sm px-2 py-0.5">{c.code}</span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-white">{c.name}</h1>
            <p className="mt-3 text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">{c.description}</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-white/60">
              {c.product_count ? `${c.product_count} sample ${c.product_count === 1 ? "product" : "products"}` : "Catalogue coming soon"}
            </p>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {data.products.length === 0 ? (
          <EmptyState testId="collection-empty" title="Catalogue coming soon"
            message={`The ${c.name} collection is being curated. Products appear here once published by the NoodleWala team.`}>
            <Button asChild variant="outline" className="border-[#00704A] text-[#00704A] rounded-full">
              <Link to="/shop" data-testid="collection-empty-shop">Browse the full shelf</Link>
            </Button>
          </EmptyState>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="collection-products">
            {data.products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
