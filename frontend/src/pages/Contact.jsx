import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createContact, usePageTitle } from "@/lib/api";
import { SectionHead } from "@/components/Blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TYPES = ["General Enquiry", "Franchise", "Product & Distribution", "Store Location", "Try & Buy", "Customer Care", "Partnership"];

export default function Contact() {
  usePageTitle("Contact Us", "Contact NoodleWala — franchise, product supply, store locations, Try & Buy, partnerships and general enquiries.")();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ name: "", mobile: "", email: "", city: "", enquiry_type: params.get("type") || "", message: "", consent: false, website: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [failMsg, setFailMsg] = useState(null);

  useEffect(() => {
    const t = params.get("type");
    if (t && TYPES.includes(t)) setForm((f) => ({ ...f, enquiry_type: t }));
  }, [params]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: null })); };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!/^[+]?[0-9\s-]{8,16}$/.test(form.mobile.trim())) e.mobile = "Enter a valid mobile or WhatsApp number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.enquiry_type) e.enquiry_type = "Select an enquiry type";
    if (form.message.trim().length < 5) e.message = "Tell us a little more";
    if (!form.consent) e.consent = "Consent is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setFailMsg(null);
    try {
      const res = await createContact({
        name: form.name.trim(), mobile: form.mobile.trim(), email: form.email.trim() || null,
        city: form.city.trim() || null, enquiry_type: form.enquiry_type,
        message: form.message.trim(), consent: form.consent, website: form.website,
      });
      setSuccess(res.message);
    } catch (err) {
      setFailMsg(typeof err?.response?.data?.detail === "string" ? err.response.data.detail
        : "We could not submit your enquiry right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const err = (k) => errors[k] ? <p className="text-xs text-red-700 mt-1" role="alert" data-testid={`contact-error-${k}`}>{errors[k]}</p> : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16" data-testid="contact-page">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
        <div>
          <SectionHead eyebrow="Contact / Partner with us" title="Let's Talk Noodles."
            sub="Franchise, product supply, store locations, Try & Buy, customer care, partnerships or anything else — pick a topic and the right team picks it up." />
          <ul className="mt-8 space-y-3">
            {TYPES.map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm text-[#123D2D]/85">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" /> {t}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs text-[#5F6F67] leading-relaxed max-w-sm" data-testid="contact-disclaimer">
            We collect only the details needed to respond to your enquiry, with your consent. No response time is promised unless an official service level is announced.
          </p>
        </div>

        {!success ? (
          <form onSubmit={submit} className="bg-white border border-[#D7E4DC] rounded-2xl p-6 sm:p-8 space-y-5" noValidate data-testid="contact-form">
            <input type="text" value={form.website} onChange={(e) => set("website", e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="grid sm:grid-cols-2 gap-5">
              <div><Label htmlFor="c-name">Full name *</Label><Input id="c-name" data-testid="contact-name" value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1.5 border-[#D7E4DC]" />{err("name")}</div>
              <div><Label htmlFor="c-mobile">Mobile / WhatsApp *</Label><Input id="c-mobile" data-testid="contact-mobile" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} className="mt-1.5 border-[#D7E4DC]" />{err("mobile")}</div>
              <div><Label htmlFor="c-email">Email</Label><Input id="c-email" type="email" data-testid="contact-email" value={form.email} onChange={(e) => set("email", e.target.value)} className="mt-1.5 border-[#D7E4DC]" />{err("email")}</div>
              <div><Label htmlFor="c-city">City</Label><Input id="c-city" data-testid="contact-city" value={form.city} onChange={(e) => set("city", e.target.value)} className="mt-1.5 border-[#D7E4DC]" /></div>
            </div>
            <div>
              <Label>Enquiry type *</Label>
              <Select value={form.enquiry_type} onValueChange={(v) => set("enquiry_type", v)}>
                <SelectTrigger className="mt-1.5 border-[#D7E4DC]" data-testid="contact-type"><SelectValue placeholder="Select a topic" /></SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              {err("enquiry_type")}
            </div>
            <div>
              <Label htmlFor="c-message">Message *</Label>
              <Textarea id="c-message" rows={4} data-testid="contact-message" value={form.message} onChange={(e) => set("message", e.target.value)} className="mt-1.5 border-[#D7E4DC]" />
              {err("message")}
            </div>
            <div className="flex items-start gap-2.5">
              <Checkbox id="c-consent" data-testid="contact-consent" checked={form.consent} onCheckedChange={(v) => set("consent", !!v)} className="mt-0.5 border-[#1B8A63]" />
              <Label htmlFor="c-consent" className="text-xs text-[#5F6F67] font-normal leading-relaxed">
                I consent to NoodleWala using these details to respond to my enquiry. *
              </Label>
            </div>
            {err("consent")}
            {failMsg && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert" data-testid="contact-submit-error">{failMsg}</p>}
            <Button type="submit" disabled={submitting} data-testid="contact-submit"
              className="w-full bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full py-6 text-base">
              {submitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>) : "Send Enquiry"}
            </Button>
          </form>
        ) : (
          <div className="bg-white border border-[#D7E4DC] rounded-2xl p-10 text-center" data-testid="contact-success">
            <CheckCircle2 className="w-12 h-12 text-[#00704A] mx-auto" />
            <h2 className="mt-4 font-display text-2xl font-bold text-[#063B2B]">Enquiry received</h2>
            <p className="mt-3 text-sm text-[#123D2D]/80 leading-relaxed max-w-md mx-auto">{success}</p>
            <Button className="mt-6 bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full" data-testid="contact-success-another"
              onClick={() => { setSuccess(null); setForm({ name: "", mobile: "", email: "", city: "", enquiry_type: "", message: "", consent: false, website: "" }); }}>
              Send Another Enquiry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
