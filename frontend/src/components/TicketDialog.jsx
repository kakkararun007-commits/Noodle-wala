import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTicket } from "@/lib/api";

export const TICKET_CATEGORIES = [
  "General Enquiry", "Product Information", "Product Quality", "Product Availability",
  "Store Experience", "Try & Buy Enquiry", "Try & Buy Complaint", "Order Support",
  "Pickup Support", "Delivery Support", "Payment Support", "Refund or Return",
  "Franchise Enquiry", "Franchise Partner Support", "Website Issue",
  "Technical Support", "Feedback", "Other",
];

const EMPTY = { name: "", mobile: "", email: "", contact_method: "Mobile", category: "", subject: "", description: "", consent: false, website: "" };

export default function TicketDialog({ open, onOpenChange, presetCategory, conversationId }) {
  const [form, setForm] = useState({ ...EMPTY, category: presetCategory || "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [failMsg, setFailMsg] = useState(null);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: null })); };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!/^[+]?[0-9\s-]{8,16}$/.test(form.mobile.trim())) e.mobile = "Enter a valid mobile number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.category) e.category = "Select a category";
    if (form.subject.trim().length < 4) e.subject = "Add a short subject";
    if (form.description.trim().length < 10) e.description = "Describe your request in at least 10 characters";
    if (!form.consent) e.consent = "Consent is required to submit your request";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setFailMsg(null);
    try {
      const res = await createTicket({
        name: form.name.trim(), mobile: form.mobile.trim(), email: form.email.trim() || null,
        contact_method: form.contact_method, category: form.category, subject: form.subject.trim(),
        description: form.description.trim(), consent: form.consent, website: form.website,
        source: "Website", conversation_id: conversationId || null,
      });
      setResult(res.ticket);
    } catch (err) {
      setFailMsg(err?.response?.data?.detail && typeof err.response.data.detail === "string"
        ? err.response.data.detail
        : "I could not submit your request right now. Please try again, or use the alternate customer care contact option.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => { setForm({ ...EMPTY }); setResult(null); setFailMsg(null); setErrors({}); };

  const err = (k) => errors[k] ? <p className="text-xs text-red-700 mt-1" role="alert" data-testid={`ticket-error-${k}`}>{errors[k]}</p> : null;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setTimeout(reset, 300); }}>
      <DialogContent className="bg-white border-[#D7E4DC] max-w-lg max-h-[90vh] overflow-y-auto" data-testid="ticket-dialog">
        {!result ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-[#063B2B]">Create a Customer Care Request</DialogTitle>
              <DialogDescription className="text-sm text-[#5F6F67]">
                Submit a request to the NoodleWala customer care team. You will receive a ticket number after successful submission.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-4 mt-2" noValidate>
              <input type="text" value={form.website} onChange={(e) => set("website", e.target.value)}
                className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="t-name">Full name *</Label>
                  <Input id="t-name" data-testid="ticket-name-input" value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1.5 border-[#D7E4DC]" />
                  {err("name")}
                </div>
                <div>
                  <Label htmlFor="t-mobile">Mobile number *</Label>
                  <Input id="t-mobile" data-testid="ticket-mobile-input" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} className="mt-1.5 border-[#D7E4DC]" placeholder="Used to check status later" />
                  {err("mobile")}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="t-email">Email (optional)</Label>
                  <Input id="t-email" type="email" data-testid="ticket-email-input" value={form.email} onChange={(e) => set("email", e.target.value)} className="mt-1.5 border-[#D7E4DC]" />
                  {err("email")}
                </div>
                <div>
                  <Label>Preferred contact</Label>
                  <Select value={form.contact_method} onValueChange={(v) => set("contact_method", v)}>
                    <SelectTrigger className="mt-1.5 border-[#D7E4DC]" data-testid="ticket-contact-method"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger className="mt-1.5 border-[#D7E4DC]" data-testid="ticket-category-select"><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent className="max-h-64">
                    {TICKET_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {err("category")}
              </div>
              <div>
                <Label htmlFor="t-subject">Subject *</Label>
                <Input id="t-subject" data-testid="ticket-subject-input" value={form.subject} onChange={(e) => set("subject", e.target.value)} className="mt-1.5 border-[#D7E4DC]" />
                {err("subject")}
              </div>
              <div>
                <Label htmlFor="t-desc">Describe your request *</Label>
                <Textarea id="t-desc" rows={4} data-testid="ticket-description-input" value={form.description} onChange={(e) => set("description", e.target.value)} className="mt-1.5 border-[#D7E4DC]" />
                {err("description")}
              </div>
              <div className="flex items-start gap-2.5">
                <Checkbox id="t-consent" data-testid="ticket-consent-checkbox" checked={form.consent}
                  onCheckedChange={(v) => set("consent", !!v)} className="mt-0.5 border-[#1B8A63]" />
                <Label htmlFor="t-consent" className="text-xs text-[#5F6F67] leading-relaxed font-normal">
                  I consent to NoodleWala using these details to respond to my customer care request. *
                </Label>
              </div>
              {err("consent")}
              {failMsg && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert" data-testid="ticket-submit-error">{failMsg}</p>}
              <Button type="submit" disabled={submitting} data-testid="ticket-submit-button"
                className="w-full bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full">
                {submitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting your customer care request...</>) : "Submit Request"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-6" data-testid="ticket-success">
            <CheckCircle2 className="w-12 h-12 text-[#00704A] mx-auto" />
            <h3 className="mt-4 font-display text-xl font-semibold text-[#063B2B]">
              Your NoodleWala customer care request has been submitted successfully.
            </h3>
            <div className="mt-6 bg-[#F7FAF6] border border-[#D7E4DC] rounded-xl p-5 text-left space-y-2 text-sm">
              <p><span className="text-[#5F6F67]">Ticket number:</span> <span className="font-mono font-semibold text-[#063B2B]" data-testid="ticket-number">{result.ticket_number}</span></p>
              <p><span className="text-[#5F6F67]">Category:</span> {result.category}</p>
              <p><span className="text-[#5F6F67]">Summary:</span> {result.subject}</p>
              <p><span className="text-[#5F6F67]">Submitted:</span> {new Date(result.created_at).toLocaleString()}</p>
              <p><span className="text-[#5F6F67]">Status:</span> <span className="font-semibold text-[#00704A]">{result.status}</span></p>
            </div>
            <p className="mt-4 text-xs text-[#5F6F67] leading-relaxed">
              Keep your ticket number and mobile number handy to check status anytime from the Customer Care page.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline" className="border-[#00704A] text-[#00704A] rounded-full">
                <a href="/customer-care" data-testid="ticket-check-status-link">Check Ticket Status</a>
              </Button>
              <Button onClick={() => onOpenChange(false)} data-testid="ticket-done-button"
                className="bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full">Done</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
