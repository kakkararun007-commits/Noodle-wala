import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { getTryAndBuy, usePageTitle } from "@/lib/api";
import { SectionHead, CardGridSkeleton, EmptyState, ErrorState, Eyebrow, GoldBadge } from "@/components/Blocks";
import StoreCard from "@/components/StoreCard";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

const STEPS = [
  "Find a participating NoodleWala store.",
  "Explore the eligible noodle options.",
  "Visit the store and request a sample.",
  "Taste the product using the store's approved sampling process.",
  "Choose your favourite and purchase it.",
];

export default function TryAndBuy() {
  usePageTitle("Try & Buy", "Taste noodles before you buy at participating NoodleWala stores through the Try & Buy sampling experience.")();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const load = () => { setError(false); getTryAndBuy().then(setData).catch(() => setError(true)); };
  useEffect(load, []);

  return (
    <div data-testid="try-and-buy-page">
      <section className="bg-[#063B2B] text-white border-b border-[#1B8A63]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Eyebrow>The NoodleWala tasting ritual</Eyebrow>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08]">TRY BEFORE YOU CHOOSE.</h1>
            <p className="mt-5 text-base sm:text-lg text-white/80 leading-relaxed max-w-lg">
              Discover new noodle flavours at participating NoodleWala stores through our Try & Buy sampling experience — a controlled tasting facility where you can sample selected noodle types or flavours before purchasing.
            </p>
            <p className="mt-4 text-xs text-white/50 leading-relaxed max-w-lg" data-testid="trybuy-qualifier">
              Try & Buy is a store-level service, available only at participating locations and subject to each store's operating rules.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="bg-[#C9A227] hover:bg-[#b8922a] text-[#063B2B] rounded-full px-6 font-semibold">
                <a href="#participating-stores" data-testid="trybuy-stores-cta">Find Participating Stores</a>
              </Button>
              <Button asChild variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-full bg-transparent">
                <Link to={`/contact?type=${encodeURIComponent("Try & Buy")}`} data-testid="trybuy-enquiry-cta">Enquire</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img src="https://images.pexels.com/photos/16671586/pexels-photo-16671586.jpeg?auto=compress&cs=tinysrgb&w=940"
              alt="Noodle tasting with chopsticks — NoodleWala Try & Buy"
              className="rounded-2xl border border-[#1B8A63]/40 w-full h-[320px] sm:h-[400px] object-cover" />
            <span className="absolute top-4 right-4"><GoldBadge>Tasting bar</GoldBadge></span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHead eyebrow="How it works" title="Five Steps to Your New Favourite" center />
        <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STEPS.map((s, i) => (
            <li key={i} className="bg-white border border-[#D7E4DC] rounded-xl p-5 text-center" data-testid={`trybuy-step-${i + 1}`}>
              <span className="w-9 h-9 rounded-full bg-[#00704A] text-white font-mono text-sm flex items-center justify-center mx-auto">{i + 1}</span>
              <p className="mt-3 text-sm text-[#123D2D] leading-relaxed">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="participating-stores" className="bg-white border-y border-[#D7E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <SectionHead eyebrow="Participating stores" title="Where You Can Taste Today"
            sub="Participation, days and sampling windows are configured per store. Demo listings are sample entries." />
          {error ? <div className="mt-10"><ErrorState onRetry={load} /></div> : !data ? (
            <div className="mt-10"><CardGridSkeleton count={2} /></div>
          ) : data.stores.length === 0 ? (
            <div className="mt-10">
              <EmptyState testId="trybuy-stores-empty" title="No participating stores yet"
                message="Try & Buy is rolling out with the NoodleWala network. Register your interest and we will keep you informed.">
                <Button asChild className="bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full">
                  <Link to={`/contact?type=${encodeURIComponent("Try & Buy")}`} data-testid="trybuy-register-interest">Register Interest</Link>
                </Button>
              </EmptyState>
            </div>
          ) : (
            <div className="mt-10 grid sm:grid-cols-2 gap-6" data-testid="trybuy-stores-grid">
              {data.stores.map((s) => <StoreCard key={s.id} store={s} />)}
            </div>
          )}
        </div>
      </section>

      {data?.products?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <SectionHead eyebrow="Eligible products" title="On the Tasting Menu"
            sub="Sample listings currently marked as Try & Buy eligible. Eligibility is confirmed at the store." />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="trybuy-products-grid">
            {data.products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <section className="bg-white border-t border-[#D7E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10">
          <div>
            <SectionHead eyebrow="Terms" title="Good to Know" />
            <ul className="mt-6 space-y-3">
              {(data?.policy?.terms || []).map((t, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#123D2D]/85 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] mt-2 shrink-0" />{t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHead eyebrow="Hygiene & safety" title="Sampling, Done Responsibly" />
            <ul className="mt-6 space-y-3">
              {(data?.policy?.hygiene || []).map((t, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#123D2D]/85 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-[#1B8A63] mt-0.5 shrink-0" />{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-[#F7FAF6] border border-[#D7E4DC] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-[#123D2D]/80 leading-relaxed max-w-xl">
              Questions about sampling, allergens or store participation? The NoodleWala Assistant can help — or raise a customer care request.
            </p>
            <Button variant="outline" className="border-[#00704A] text-[#00704A] rounded-full shrink-0" data-testid="trybuy-ai-cta"
              onClick={() => window.dispatchEvent(new CustomEvent("nw:open-ai"))}>
              <MessageCircle className="w-4 h-4 mr-1.5" /> Ask the Assistant
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
