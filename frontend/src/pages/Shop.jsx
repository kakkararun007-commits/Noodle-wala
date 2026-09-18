import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { getProducts, getProductMeta, usePageTitle } from "@/lib/api";
import { SectionHead, CardGridSkeleton, EmptyState, ErrorState } from "@/components/Blocks";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SPICE_OPTIONS = [
  { v: "", l: "Any heat" }, { v: "0", l: "No heat" }, { v: "1", l: "Mild" }, { v: "2", l: "Gentle" },
  { v: "3", l: "Medium" }, { v: "4", l: "Hot" }, { v: "5", l: "Fiery" },
];

export default function Shop() {
  usePageTitle("Explore Noodles", "Browse the NoodleWala sample catalogue by origin, category and spice level.")();
  const [params, setParams] = useSearchParams();
  const [meta, setMeta] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState(params.get("search") || "");
  const [filters, setFilters] = useState({
    origin: params.get("origin") || "", category: params.get("category") || "",
    spice: params.get("spice") || "", sort: params.get("sort") || "",
    try_buy: params.get("try_buy") === "1",
  });

  useEffect(() => { getProductMeta().then(setMeta).catch(() => {}); }, []);

  const load = (f = filters, s = search) => {
    setError(false);
    setData(null);
    const q = {};
    if (s.trim()) q.search = s.trim();
    if (f.origin) q.origin = f.origin;
    if (f.category) q.category = f.category;
    if (f.spice !== "") q.spice = f.spice;
    if (f.try_buy) q.try_buy = true;
    if (f.sort) q.sort = f.sort;
    getProducts(q).then(setData).catch(() => setError(true));
  };
  useEffect(() => { load(); }, [filters]); // eslint-disable-line

  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  const activeCount = useMemo(() => [filters.origin, filters.category, filters.spice, filters.try_buy || "x"].filter(Boolean).length - 1, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16" data-testid="shop-page">
      <SectionHead eyebrow="Explore noodles" title="The Noodle Shelf"
        sub="Search and filter the NoodleWala sample catalogue. Listings are demonstration entries; pricing is shared in-store." />

      <form className="mt-8 flex gap-2 max-w-xl" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F6F67]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} data-testid="shop-search-input"
            placeholder="Search noodles, flavours, categories..." aria-label="Search products"
            className="w-full border border-[#D7E4DC] rounded-full pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00704A]" />
        </div>
        <Button type="submit" data-testid="shop-search-button" className="bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full px-6">Search</Button>
      </form>

      <div className="mt-8 grid lg:grid-cols-[240px_1fr] gap-8 items-start">
        <aside className="bg-white border border-[#D7E4DC] rounded-xl p-5 space-y-5 lg:sticky lg:top-24" data-testid="shop-filters">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#5F6F67]">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters {activeCount > 0 && <span className="text-[#C9A227]">({activeCount})</span>}
          </p>
          <div>
            <label className="text-xs font-semibold text-[#123D2D]">Origin</label>
            <Select value={filters.origin || "all"} onValueChange={(v) => set("origin", v === "all" ? "" : v)}>
              <SelectTrigger className="mt-1.5 border-[#D7E4DC]" data-testid="shop-filter-origin"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All origins</SelectItem>
                {(meta?.origins || []).map((o) => <SelectItem key={o.slug} value={o.slug}>{o.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#123D2D]">Category</label>
            <Select value={filters.category || "all"} onValueChange={(v) => set("category", v === "all" ? "" : v)}>
              <SelectTrigger className="mt-1.5 border-[#D7E4DC]" data-testid="shop-filter-category"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {(meta?.categories || []).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#123D2D]">Spice level</label>
            <Select value={filters.spice === "" ? "any" : filters.spice} onValueChange={(v) => set("spice", v === "any" ? "" : v)}>
              <SelectTrigger className="mt-1.5 border-[#D7E4DC]" data-testid="shop-filter-spice"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SPICE_OPTIONS.map((o) => <SelectItem key={o.l} value={o.v === "" ? "any" : o.v}>{o.l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#123D2D]">Sort by</label>
            <Select value={filters.sort || "name"} onValueChange={(v) => set("sort", v === "name" ? "" : v)}>
              <SelectTrigger className="mt-1.5 border-[#D7E4DC]" data-testid="shop-sort"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A–Z</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="spice">Spiciest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2.5">
            <Checkbox id="f-tb" data-testid="shop-filter-trybuy" checked={filters.try_buy}
              onCheckedChange={(v) => set("try_buy", !!v)} className="border-[#1B8A63]" />
            <label htmlFor="f-tb" className="text-xs font-semibold text-[#123D2D]">Try & Buy eligible</label>
          </div>
          <Button variant="ghost" size="sm" data-testid="shop-filters-clear"
            className="text-[#5F6F67] hover:text-[#00704A] px-0"
            onClick={() => { setFilters({ origin: "", category: "", spice: "", sort: "", try_buy: false }); setSearch(""); setParams({}); }}>
            Clear all filters
          </Button>
        </aside>

        <div>
          {error ? <ErrorState onRetry={() => load()} /> : !data ? <CardGridSkeleton count={6} /> : data.products.length === 0 ? (
            <EmptyState testId="shop-empty" title="No matching noodles"
              message="We could not find matching noodle products. Try changing your filters or exploring another collection.">
              <Button variant="outline" className="border-[#00704A] text-[#00704A] rounded-full" data-testid="shop-empty-clear"
                onClick={() => { setFilters({ origin: "", category: "", spice: "", sort: "", try_buy: false }); setSearch(""); setTimeout(() => load({ origin: "", category: "", spice: "", sort: "", try_buy: false }, ""), 0); }}>
                Clear filters
              </Button>
            </EmptyState>
          ) : (
            <>
              <p className="text-xs text-[#5F6F67] mb-4 font-mono uppercase tracking-wider" data-testid="shop-result-count">
                {data.total} sample {data.total === 1 ? "product" : "products"}
              </p>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="shop-grid">
                {data.products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
