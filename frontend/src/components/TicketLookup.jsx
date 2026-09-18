import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lookupTicket } from "@/lib/api";

export default function TicketLookup() {
  const [number, setNumber] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setTicket(null);
    if (!number.trim() || !mobile.trim()) {
      setError("Enter your ticket number and the mobile number used at submission.");
      return;
    }
    setLoading(true);
    try {
      const t = await lookupTicket(number.trim(), mobile.trim());
      setTicket(t);
    } catch (err) {
      setError(err?.response?.data?.detail || "We could not check your ticket right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="ticket-lookup">
      <form onSubmit={submit} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end" noValidate>
        <div>
          <Label htmlFor="tl-number">Ticket number</Label>
          <Input id="tl-number" data-testid="ticket-lookup-number" placeholder="NW-123456" value={number}
            onChange={(e) => setNumber(e.target.value)} className="mt-1.5 border-[#D7E4DC] bg-white" />
        </div>
        <div>
          <Label htmlFor="tl-mobile">Mobile number</Label>
          <Input id="tl-mobile" data-testid="ticket-lookup-mobile" placeholder="Used at submission" value={mobile}
            onChange={(e) => setMobile(e.target.value)} className="mt-1.5 border-[#D7E4DC] bg-white" />
        </div>
        <Button type="submit" disabled={loading} data-testid="ticket-lookup-submit"
          className="bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full px-6">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (<><Search className="w-4 h-4 mr-1.5" /> Check</>)}
        </Button>
      </form>

      {error && <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert" data-testid="ticket-lookup-error">{error}</p>}

      {ticket && (
        <div className="mt-6 bg-white border border-[#D7E4DC] rounded-xl p-6" data-testid="ticket-status-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-sm font-semibold text-[#063B2B]" data-testid="ticket-status-number">{ticket.ticket_number}</p>
              <p className="text-xs text-[#5F6F67] mt-0.5">{ticket.category} • Submitted {new Date(ticket.created_at).toLocaleDateString()}</p>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#00704A]/10 text-[#00704A] border border-[#00704A]/30" data-testid="ticket-status-value">
              {ticket.status}
            </span>
          </div>
          <h4 className="mt-4 font-display text-lg font-semibold text-[#063B2B]">{ticket.subject}</h4>
          <p className="mt-1 text-sm text-[#123D2D]/80 leading-relaxed">{ticket.description}</p>
          {ticket.resolution_notes && (
            <p className="mt-3 text-sm text-[#00704A] bg-[#00704A]/5 border border-[#00704A]/20 rounded-lg px-3 py-2">{ticket.resolution_notes}</p>
          )}
          <p className="mt-4 text-xs text-[#5F6F67]">Last updated {new Date(ticket.updated_at).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
