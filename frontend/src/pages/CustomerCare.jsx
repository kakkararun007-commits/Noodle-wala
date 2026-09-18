import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, MessageCircle, Search, Ticket } from "lucide-react";
import { getKnowledge, usePageTitle } from "@/lib/api";
import { SectionHead, ErrorState } from "@/components/Blocks";
import TicketDialog from "@/components/TicketDialog";
import TicketLookup from "@/components/TicketLookup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CustomerCare() {
  usePageTitle("Customer Care", "NoodleWala customer care — AI assistant, knowledge base, support tickets and contact options.")();
  const [ticketOpen, setTicketOpen] = useState(false);
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState(false);
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState(null);

  const load = (query = "") => {
    setError(false);
    getKnowledge(query ? { q: query } : {}).then(setArticles).catch(() => setError(true));
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16" data-testid="customer-care-page">
      <SectionHead eyebrow="Customer care" title="How Can We Help?"
        sub="Start with the NoodleWala Assistant for instant answers from approved content. Create a support ticket when you need the team, and track it anytime." />

      <div className="mt-10 grid sm:grid-cols-3 gap-5">
        <button onClick={() => window.dispatchEvent(new CustomEvent("nw:open-ai"))} data-testid="care-open-ai"
          className="text-left bg-[#063B2B] rounded-xl p-6 hover:shadow-[0_12px_28px_-6px_rgba(6,59,43,0.25)] transition-shadow group">
          <MessageCircle className="w-7 h-7 text-[#C9A227]" />
          <h3 className="mt-3 font-display text-lg font-semibold text-white">Ask the NoodleWala Assistant</h3>
          <p className="mt-1.5 text-sm text-white/70 leading-relaxed">Instant answers about noodles, stores, Try & Buy and franchise enquiries.</p>
          <span className="mt-3 inline-block text-xs font-semibold text-[#C9A227] group-hover:underline">Open chat</span>
        </button>
        <button onClick={() => setTicketOpen(true)} data-testid="care-create-ticket"
          className="text-left bg-white border border-[#D7E4DC] rounded-xl p-6 hover:border-[#1B8A63]/50 hover:shadow-[0_12px_28px_-6px_rgba(6,59,43,0.12)] transition-all group">
          <Ticket className="w-7 h-7 text-[#00704A]" />
          <h3 className="mt-3 font-display text-lg font-semibold text-[#063B2B]">Create a Support Ticket</h3>
          <p className="mt-1.5 text-sm text-[#5F6F67] leading-relaxed">Product, store, order, Try & Buy or franchise support — routed to the right team.</p>
          <span className="mt-3 inline-block text-xs font-semibold text-[#00704A] group-hover:underline">Start a request</span>
        </button>
        <div className="bg-white border border-[#D7E4DC] rounded-xl p-6" data-testid="care-contact-options">
          <h3 className="font-display text-lg font-semibold text-[#063B2B]">Other ways to reach us</h3>
          <ul className="mt-3 space-y-2 text-sm text-[#123D2D]/80">
            <li><Link to="/contact" className="text-[#00704A] font-semibold hover:underline" data-testid="care-contact-link">Contact form</Link> — general, partnership and store enquiries</li>
            <li><Link to="/franchise" className="text-[#00704A] font-semibold hover:underline" data-testid="care-franchise-link">Franchise desk</Link> — applications and callbacks</li>
            <li><Link to="/stores" className="text-[#00704A] font-semibold hover:underline" data-testid="care-stores-link">Store enquiries</Link> — via the store locator</li>
          </ul>
        </div>
      </div>

      <section className="mt-14 bg-white border border-[#D7E4DC] rounded-2xl p-6 sm:p-8" data-testid="care-ticket-status">
        <h2 className="font-display text-2xl font-bold text-[#063B2B]">Check Ticket Status</h2>
        <p className="mt-2 text-sm text-[#5F6F67]">Enter your ticket number and the mobile number used at submission. Ticket details are shared only after verification.</p>
        <div className="mt-5"><TicketLookup /></div>
      </section>

      <section className="mt-14" data-testid="care-knowledge">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead eyebrow="Knowledge base" title="Popular Help Topics" />
          <form className="flex gap-2 w-full sm:w-auto" onSubmit={(e) => { e.preventDefault(); load(q); }}>
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F6F67]" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} data-testid="care-kb-search"
                placeholder="Search help topics" aria-label="Search knowledge base"
                className="pl-10 border-[#D7E4DC] bg-white rounded-full" />
            </div>
            <Button type="submit" variant="outline" className="border-[#00704A] text-[#00704A] rounded-full" data-testid="care-kb-search-button">Search</Button>
          </form>
        </div>
        {error ? <div className="mt-8"><ErrorState onRetry={() => load(q)} /></div> : !articles ? (
          <p className="mt-8 text-sm text-[#5F6F67]">Loading NoodleWala information...</p>
        ) : articles.length === 0 ? (
          <p className="mt-8 text-sm text-[#5F6F67]" data-testid="care-kb-empty">No help topics matched your search. Try the assistant or create a ticket.</p>
        ) : (
          <div className="mt-8 divide-y divide-[#D7E4DC] bg-white border border-[#D7E4DC] rounded-xl overflow-hidden" data-testid="care-kb-list">
            {articles.map((a, i) => (
              <div key={a.id}>
                <button onClick={() => setOpenId(openId === a.id ? null : a.id)} data-testid={`kb-article-${i}`}
                  aria-expanded={openId === a.id}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left hover:bg-[#F7FAF6] transition-colors">
                  <span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#C9A227]">{a.category}</span>
                    <span className="block font-semibold text-[#063B2B] text-sm mt-0.5">{a.title}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#5F6F67] shrink-0 transition-transform ${openId === a.id ? "rotate-180" : ""}`} />
                </button>
                {openId === a.id && (
                  <p className="px-5 sm:px-6 pb-5 text-sm text-[#123D2D]/85 leading-relaxed" data-testid={`kb-article-content-${i}`}>{a.content}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="mt-10 text-xs text-[#5F6F67] leading-relaxed max-w-2xl" data-testid="care-disclaimer">
        The NoodleWala Assistant is an AI, not a human employee; its answers may require confirmation. We collect only the details needed to handle your request, with your consent.
      </p>

      <TicketDialog open={ticketOpen} onOpenChange={setTicketOpen} />
    </div>
  );
}
