import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapPin, Search } from "lucide-react";
import { getStores, createContact, usePageTitle } from "@/lib/api";
import { SectionHead, CardGridSkeleton, EmptyState, ErrorState } from "@/components/Blocks";
import StoreCard from "@/components/StoreCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Stores() {
  usePageTitle("Find a Store", "Find NoodleWala stores near you — search by city, area or PIN code and check Try & Buy, pickup and delivery availability.")();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [interest, setInterest] = useState({ name: "", mobile: "", city: "" });
  const [interestMsg, setInterestMsg] = useState(null);
  const [sending, setSending] = useState(false);

  const load = (query = q) => {
    setError(false);
    getStores(query.trim() ? { q: query.trim() } : {}).then(setData).catch(() => setError(true));
  };
  useEffect(() => { load(params.get("q") || ""); }, []); // eslint-disable-line

  const submitInterest = async (e) => {
    e.preventDefault();
    setInterestMsg(null);
    if (interest.name.trim().length < 2 || !/^[+]?[0-9\s-]{8,16}$/.test(interest.mobile.trim()) || interest.city.trim().length < 2) {
      setInterestMsg({ ok: false, text: "Enter your name, a valid mobile number, and your city." });
      return;
    }
    setSending(true);
    try {
      const res = await createContact({
        name: interest.name.trim(), mobile: interest.mobile.trim(), email: null, city: interest.city.trim(),
        enquiry_type: "Store Location",
        message: `Registering interest for a NoodleWala store in ${interest.city.trim()}.`,
        consent: true, website: "",
      });
      setInterestMsg({ ok: true, text: res.message });
      setInterest({ name: "", mobile: "", city: "" });
    } catch {
      setInterestMsg({ ok: false, text: "We could not register your interest right now. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16" data-testid="stores-page">
      <SectionHead eyebrow="Store locator" title="FIND NOODLEWALA NEAR YOU."
        sub="Search by city, locality or PIN code. Store details, Try & Buy, pickup and delivery availability are shown per store. The network is expanding across India." />

      <form className="mt-8 flex gap-2 max-w-xl" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F6F67]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} data-testid="stores-search-input"
            placeholder="City, area or PIN code" aria-label="Search stores"
            className="w-full border border-[#D7E4DC] rounded-full pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00704A]" />
        </div>
        <Button type="submit" data-testid="stores-search-button" className="bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full px-6">Search</Button>
      </form>

      {data?.cities?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2" data-testid="stores-city-chips">
          {data.cities.map((c) => (
            <button key={c} onClick={() => { setQ(c); load(c); }} data-testid={`stores-city-${c.toLowerCase()}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#00704A] bg-white border border-[#00704A]/30 rounded-full px-3 py-1.5 hover:bg-[#00704A] hover:text-white transition-colors">
              <MapPin className="w-3 h-3" /> {c}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {error ? <ErrorState onRetry={() => load()} /> : !data ? <CardGridSkeleton count={3} /> : data.stores.length === 0 ? (
          <EmptyState testId="stores-empty" title="No stores found in this area"
            message="NoodleWala stores are expanding across India. Register your location or interest, and we will keep you informed about future availability." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="stores-grid">
            {data.stores.map((s) => <StoreCard key={s.id} store={s} />)}
          </div>
        )}
      </div>

      <section className="mt-14 bg-white border border-[#D7E4DC] rounded-2xl p-6 sm:p-8" data-testid="stores-interest-section">
        <h2 className="font-display text-2xl font-bold text-[#063B2B]">Want NoodleWala in your neighbourhood?</h2>
        <p className="mt-2 text-sm text-[#5F6F67] leading-relaxed max-w-xl">
          Register your interest and the team will keep you informed about future availability in your city.
        </p>
        <form onSubmit={submitInterest} className="mt-5 grid sm:grid-cols-4 gap-3 items-start" noValidate>
          <Input placeholder="Full name" aria-label="Full name" data-testid="interest-name" value={interest.name}
            onChange={(e) => setInterest((i) => ({ ...i, name: e.target.value }))} className="border-[#D7E4DC]" />
          <Input placeholder="Mobile number" aria-label="Mobile number" data-testid="interest-mobile" value={interest.mobile}
            onChange={(e) => setInterest((i) => ({ ...i, mobile: e.target.value }))} className="border-[#D7E4DC]" />
          <Input placeholder="Your city" aria-label="Your city" data-testid="interest-city" value={interest.city}
            onChange={(e) => setInterest((i) => ({ ...i, city: e.target.value }))} className="border-[#D7E4DC]" />
          <Button type="submit" disabled={sending} data-testid="interest-submit"
            className="bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full">
            {sending ? "Registering..." : "Register Interest"}
          </Button>
        </form>
        {interestMsg && (
          <p className={`mt-3 text-sm rounded-lg px-4 py-2.5 border ${interestMsg.ok ? "text-[#00704A] bg-[#00704A]/5 border-[#00704A]/20" : "text-red-700 bg-red-50 border-red-200"}`}
            role="alert" data-testid="interest-message">{interestMsg.text}</p>
        )}
      </section>
    </div>
  );
}
