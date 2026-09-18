import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Compass, Globe2, MapPin, Search, Sparkles, Store, UtensilsCrossed } from "lucide-react";
import { getCollections, getProducts, getStores, usePageTitle } from "@/lib/api";
import { Eyebrow, SectionHead, CardGridSkeleton, ErrorState, GoldBadge } from "@/components/Blocks";
import CollectionCard from "@/components/CollectionCard";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

const PILLARS = [
  { icon: Globe2, title: "Product discovery", text: "Noodles from different cuisines, countries and price points, curated in one place." },
  { icon: Sparkles, title: "International flavours", text: "From Japanese ramen traditions to Indian street-style favourites." },
  { icon: Store, title: "Neighbourhood convenience", text: "A compact specialty retail format designed for your locality." },
  { icon: UtensilsCrossed, title: "In-store experiences", text: "Try & Buy sampling at participating stores, before you choose." },
  { icon: Compass, title: "Franchise-led expansion", text: "The network is being developed with local franchise partners across India." },
  { icon: MapPin, title: "Digital ordering ahead", text: "Online ordering, pickup and delivery are planned for future releases." },
];

const MARQUEE = ["TOKYO SHOYU", "SICHUAN PEPPERCORN", "GOCHUJANG FIRE", "HANOI STAR ANISE", "BANGKOK TAMARIND", "BANDUNG KECAP MANIS", "DESI MASALA", "WORLD SPECIALS"];

export default function Home() {
  const [collections, setCollections] = useState(null);
  const [featured, setFeatured] = useState(null);
  const [stores, setStores] = useState(null);
  const [error, setError] = useState(false);
  const [cityQ, setCityQ] = useState("");
  const navigate = useNavigate();
  usePageTitle(null)( );

  const load = () => {
    setError(false);
    Promise.all([getCollections(), getProducts({ featured: true, limit: 6 }), getStores()])
      .then(([cols, prods, st]) => { setCollections(cols); setFeatured(prods.products); setStores(st.stores); })
      .catch(() => setError(true));
  };
  useEffect(load, []);

  return (
    <div data-testid="home-page">
      {/* Hero */}
      <section className="bg-[#063B2B] text-white border-b border-[#1B8A63]/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Eyebrow>Noodles from around the world</Eyebrow>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-white">
              TASTE THE WORLD.<br />ONE NOODLE AT A TIME.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-white/80 leading-relaxed max-w-lg">
              From ramen and udon to rice noodles, Korean favourites, and Indian classics, discover a world of noodles under one roof.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-[#C9A227] hover:bg-[#b8922a] text-[#063B2B] rounded-full px-7 font-semibold">
                <Link to="/shop" data-testid="hero-cta-explore">EXPLORE NOODLES <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-full px-7 bg-transparent">
                <Link to="/franchise" data-testid="hero-cta-franchise">BECOME A FRANCHISE PARTNER</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-[#C9A227] hover:text-white hover:bg-white/5 rounded-full">
                <Link to="/stores" data-testid="hero-cta-find-store"><MapPin className="w-4 h-4 mr-1.5" /> FIND A STORE</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1623341214825-9f4f963727da?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
              alt="A premium bowl of Japanese ramen with chopsticks — NoodleWala"
              className="rounded-2xl border border-[#1B8A63]/40 w-full h-[340px] sm:h-[420px] object-cover shadow-2xl" />
            <div className="absolute -bottom-4 left-4 sm:-left-4 bg-white text-[#063B2B] rounded-xl px-5 py-4 shadow-xl border border-[#D7E4DC]">
              <p className="font-mono text-[10px] tracking-[0.2em] text-[#C9A227] uppercase">8 origins • one roof</p>
              <p className="font-display font-bold text-lg mt-0.5">Japan to India, curated</p>
            </div>
            <span className="absolute top-4 right-4"><GoldBadge>Try & Buy • Participating stores</GoldBadge></span>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-[#F7FAF6] border-b border-[#D7E4DC] py-3 overflow-hidden" aria-hidden="true">
        <div className="nw-marquee-track flex whitespace-nowrap gap-8 w-max">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="font-mono text-[11px] tracking-[0.25em] text-[#5F6F67]">{m} <span className="text-[#C9A227] ml-8">•</span></span>
          ))}
        </div>
      </div>

      {/* Brand intro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <SectionHead eyebrow="One brand. Every noodle culture."
          title="ONE DESTINATION. ENDLESS NOODLE DISCOVERIES."
          sub="NoodleWala is a specialty retail concept bringing together noodles from different cuisines, countries, and price points — built for discovery, tasting, and neighbourhood convenience." />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PILLARS.map((p) => (
            <div key={p.title} className="bg-white border border-[#D7E4DC] rounded-xl p-6 hover:border-[#1B8A63]/50 transition-colors" data-testid={`pillar-${p.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
              <p.icon className="w-6 h-6 text-[#C9A227]" />
              <h3 className="mt-3 font-display text-lg font-semibold text-[#063B2B]">{p.title}</h3>
              <p className="mt-1.5 text-sm text-[#5F6F67] leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore by origin */}
      <section className="bg-white border-y border-[#D7E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow="Explore by origin" title="Eight Noodle Cultures. One Shelf."
              sub="Start with a region, follow the flavour. Collections are managed by the NoodleWala team." />
            <Button asChild variant="outline" className="border-[#00704A] text-[#00704A] rounded-full">
              <Link to="/collections" data-testid="home-collections-cta">All Collections <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
            </Button>
          </div>
          {error ? <div className="mt-10"><ErrorState onRetry={load} /></div> : !collections ? (
            <div className="mt-10"><CardGridSkeleton count={4} /></div>
          ) : (
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5" data-testid="home-origins-grid">
              {collections.map((c, i) => <CollectionCard key={c.slug} collection={c} large={i < 2} />)}
            </div>
          )}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead eyebrow="Featured products" title="From the Sample Catalogue"
            sub="A preview of the NoodleWala assortment. Listings marked as samples are demonstration entries managed by our team." />
          <Button asChild variant="outline" className="border-[#00704A] text-[#00704A] rounded-full">
            <Link to="/shop" data-testid="home-shop-cta">Browse All <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
          </Button>
        </div>
        {!featured ? <div className="mt-10"><CardGridSkeleton count={3} /></div> : (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="home-featured-grid">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Try & Buy promo */}
      <section className="bg-white border-y border-[#D7E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative">
            <img src="https://images.pexels.com/photos/16671586/pexels-photo-16671586.jpeg?auto=compress&cs=tinysrgb&w=940"
              alt="Noodles lifted with chopsticks at a NoodleWala Try & Buy tasting"
              className="rounded-2xl border border-[#D7E4DC] w-full h-[320px] sm:h-[400px] object-cover" loading="lazy" />
            <span className="absolute top-4 left-4"><GoldBadge>Sampling experience</GoldBadge></span>
          </div>
          <div className="order-1 lg:order-2">
            <Eyebrow>Try & Buy</Eyebrow>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#063B2B]">TRY BEFORE YOU CHOOSE.</h2>
            <p className="mt-4 text-base sm:text-lg text-[#123D2D]/85 leading-relaxed">
              Discover new noodle flavours at participating NoodleWala stores through our Try & Buy sampling experience — taste selected noodles in a controlled tasting setup before you buy.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-[#123D2D]/80">
              <li className="flex gap-2.5"><span className="w-5 h-5 rounded-full bg-[#C9A227]/15 text-[#8a6f14] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span> Find a participating store near you.</li>
              <li className="flex gap-2.5"><span className="w-5 h-5 rounded-full bg-[#C9A227]/15 text-[#8a6f14] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span> Explore the eligible noodle options.</li>
              <li className="flex gap-2.5"><span className="w-5 h-5 rounded-full bg-[#C9A227]/15 text-[#8a6f14] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span> Visit, taste, and choose your favourite.</li>
            </ul>
            <p className="mt-4 text-xs text-[#5F6F67]">Available at participating stores only. Eligibility, schedules and terms are configured per store.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full px-6">
                <Link to="/try-and-buy" data-testid="home-trybuy-cta">EXPLORE TRY & BUY</Link>
              </Button>
              <Button asChild variant="outline" className="border-[#00704A] text-[#00704A] rounded-full">
                <Link to="/stores" data-testid="home-trybuy-stores-cta">Participating Stores</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Franchise band */}
      <section className="bg-[#063B2B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow>Franchise opportunity</Eyebrow>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">BRING THE WORLD OF NOODLES TO YOUR CITY.</h2>
            <p className="mt-4 text-base text-white/80 leading-relaxed max-w-lg">
              A compact specialty store format with a curated international assortment, store design guidance, training and launch support — subject to approved terms.
            </p>
            <p className="mt-4 text-[11px] text-white/50 leading-relaxed max-w-lg" data-testid="home-franchise-disclaimer">
              Store size, investment, commercial terms, support, and availability are subject to location assessment, approval, and the applicable franchise agreement.
            </p>
            <Button asChild size="lg" className="mt-7 bg-[#C9A227] hover:bg-[#b8922a] text-[#063B2B] rounded-full px-7 font-semibold">
              <Link to="/franchise" data-testid="home-franchise-cta">APPLY FOR A FRANCHISE</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Compact store concept", "Curated product assortment", "Store design guidance", "Training & launch support", "Central procurement possibilities", "Local marketing opportunities"].map((f) => (
              <div key={f} className="border border-[#1B8A63]/40 rounded-xl px-4 py-5 text-sm text-white/85 bg-white/5">{f}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Store discovery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionHead eyebrow="Store discovery" title="FIND NOODLEWALA NEAR YOU."
              sub="Search by city or area to see store details, Try & Buy availability, and pickup or delivery options where configured. The network is expanding across India." />
            <form className="mt-6 flex gap-2 max-w-md" onSubmit={(e) => { e.preventDefault(); navigate(`/stores${cityQ.trim() ? `?q=${encodeURIComponent(cityQ.trim())}` : ""}`); }}>
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F6F67]" />
                <input value={cityQ} onChange={(e) => setCityQ(e.target.value)} data-testid="home-store-search-input"
                  placeholder="Search your city or area" aria-label="Search stores by city or area"
                  className="w-full border border-[#D7E4DC] rounded-full pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00704A]" />
              </div>
              <Button type="submit" data-testid="home-store-search-button" className="bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full px-6">Search</Button>
            </form>
          </div>
          <div className="bg-white border border-[#D7E4DC] rounded-xl p-6" data-testid="home-store-preview">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5F6F67]">Current listings</p>
            {stores ? (
              stores.length ? (
                <ul className="mt-3 space-y-2.5">
                  {stores.map((s) => (
                    <li key={s.id} className="flex items-center justify-between text-sm border-b border-[#F7FAF6] pb-2.5 last:border-0">
                      <span className="text-[#123D2D] font-medium">{s.city} — {s.area}</span>
                      <span className={`font-mono text-[10px] uppercase tracking-wider ${s.status === "open" ? "text-[#00704A]" : "text-[#8a6f14]"}`}>
                        {s.status === "open" ? "Open" : "Coming soon"}{s.is_sample ? " • Demo" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-[#5F6F67]">NoodleWala stores are expanding across India. Register your interest and we will keep you informed about future availability.</p>
              )
            ) : <p className="mt-3 text-sm text-[#5F6F67]">Loading NoodleWala information...</p>}
            <Button asChild variant="outline" className="mt-5 border-[#00704A] text-[#00704A] rounded-full w-full">
              <Link to="/stores" data-testid="home-stores-cta">Open Store Locator</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
