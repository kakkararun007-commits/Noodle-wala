import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { createLead, getConfig, usePageTitle } from "@/lib/api";
import { Eyebrow, SectionHead } from "@/components/Blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WHY = [
  { t: "Specialty noodle retail concept", d: "A focused category destination instead of a generic grocery shelf." },
  { t: "International & Indian assortment", d: "Curated noodles across origins, cuisines and price points." },
  { t: "Compact store format", d: "Indicative store area of approximately 250–300 sq ft, subject to location assessment." },
  { t: "Standardized branding", d: "Store design guidance and merchandising systems, as per approved terms." },
  { t: "Training & launch support", d: "Approximately 2 days of training, with support terms subject to approval." },
  { t: "Try & Buy differentiation", d: "An experiential sampling model that turns discovery into loyalty." },
];

const PROCESS = ["Enquire & apply", "Application review", "Discussion & qualification", "Location assessment", "Franchise agreement", "Training & launch"];

const EMPTY = {
  name: "", mobile: "", whatsapp: "", email: "", city: "", state: "", preferred_location: "",
  occupation: "", experience: "", investment_range: "", store_ownership: "", timeline: "",
  source: "", message: "", consent_contact: false, consent_privacy: false, website: "",
};

export default function Franchise() {
  usePageTitle("Franchise", "Bring the world of noodles to your city — apply for a NoodleWala franchise. Indicative terms subject to approval.")();
  const [config, setConfig] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [failMsg, setFailMsg] = useState(null);

  useEffect(() => { getConfig().then(setConfig).catch(() => {}); }, []);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: null })); };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!/^[+]?[0-9\s-]{8,16}$/.test(form.mobile.trim())) e.mobile = "Enter a valid mobile number";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.city.trim().length < 2) e.city = "Enter your preferred city";
    if (form.state.trim().length < 2) e.state = "Enter your preferred state";
    if (!form.consent_contact) e.consent_contact = "Required";
    if (!form.consent_privacy) e.consent_privacy = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setFailMsg(null);
    try {
      const res = await createLead({
        name: form.name.trim(), mobile: form.mobile.trim(), whatsapp: form.whatsapp.trim() || null,
        email: form.email.trim(), city: form.city.trim(), state: form.state.trim(),
        preferred_location: form.preferred_location.trim() || null, occupation: form.occupation.trim() || null,
        experience: form.experience.trim() || null, investment_range: form.investment_range || null,
        store_ownership: form.store_ownership || null, timeline: form.timeline || null,
        source: form.source || null, message: form.message.trim() || null,
        consent_contact: form.consent_contact, consent_privacy: form.consent_privacy, website: form.website,
      });
      setSuccess(res.message);
    } catch (err) {
      setFailMsg(typeof err?.response?.data?.detail === "string" ? err.response.data.detail
        : "We could not submit your application right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const err = (k) => errors[k] ? <p className="text-xs text-red-700 mt-1" role="alert" data-testid={`franchise-error-${k}`}>{errors[k]}</p> : null;
  const terms = config?.franchise_terms || {};

  return (
    <div data-testid="franchise-page">
      <section className="bg-[#063B2B] text-white border-b border-[#1B8A63]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Eyebrow>Franchise with NoodleWala</Eyebrow>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] max-w-3xl">
            BRING THE WORLD OF NOODLES TO YOUR CITY.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
            A compact specialty retail format with a curated international noodle assortment, a Try & Buy tasting experience, and launch support — designed for neighbourhood retail and future digital integration.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-[#C9A227] hover:bg-[#b8922a] text-[#063B2B] rounded-full px-7 font-semibold">
              <a href="#franchise-apply" data-testid="franchise-hero-apply">APPLY FOR A FRANCHISE</a>
            </Button>
            <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 rounded-full bg-transparent"
              data-testid="franchise-hero-ai" onClick={() => window.dispatchEvent(new CustomEvent("nw:open-ai"))}>
              <MessageCircle className="w-4 h-4 mr-1.5" /> Ask the Assistant
            </Button>
          </div>
          <p className="mt-6 text-[11px] text-white/50 max-w-2xl leading-relaxed" data-testid="franchise-hero-disclaimer">
            NoodleWala does not guarantee revenue, profit, return on investment, footfall, payback period or franchise approval. All commercial terms are subject to assessment, approval and the final franchise agreement.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHead eyebrow="Why NoodleWala" title="A Category of One" />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY.map((w) => (
            <div key={w.t} className="bg-white border border-[#D7E4DC] rounded-xl p-6" data-testid={`franchise-why-${w.t.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
              <h3 className="font-display text-lg font-semibold text-[#063B2B]">{w.t}</h3>
              <p className="mt-1.5 text-sm text-[#5F6F67] leading-relaxed">{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-[#D7E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-12">
          <div>
            <SectionHead eyebrow="Indicative business parameters" title="The Shape of the Model"
              sub="All parameters below are indicative, subject to location assessment, approval, and the final franchise agreement. They are editable by the NoodleWala team." />
            <dl className="mt-8 space-y-4">
              {Object.entries(terms).map(([k, v]) => (
                <div key={k} className="bg-[#F7FAF6] border border-[#D7E4DC] rounded-xl px-5 py-4" data-testid={`franchise-term-${k.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
                  <dt className="flex items-center gap-2 text-sm font-semibold text-[#063B2B]">
                    {k}
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#8a6f14] bg-[#C9A227]/10 border border-[#C9A227]/40 rounded-full px-2 py-0.5">Indicative</span>
                  </dt>
                  <dd className="mt-1 text-sm text-[#123D2D]/80 leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <SectionHead eyebrow="The process" title="From Enquiry to Opening" />
            <ol className="mt-8 space-y-0">
              {PROCESS.map((s, i) => (
                <li key={s} className="flex gap-4 pb-6 relative" data-testid={`franchise-step-${i + 1}`}>
                  {i < PROCESS.length - 1 && <span className="absolute left-[17px] top-9 bottom-0 w-px bg-[#D7E4DC]" />}
                  <span className="w-9 h-9 rounded-full bg-[#00704A] text-white font-mono text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                  <div className="pt-1.5">
                    <p className="font-semibold text-[#063B2B] text-sm">{s}</p>
                    <p className="text-xs text-[#5F6F67] mt-0.5">Subject to review and approval at each stage.</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-xl px-5 py-4">
              <p className="text-xs text-[#123D2D]/80 leading-relaxed">
                Frequently asked franchise questions are answered by the NoodleWala Assistant using approved content — open the chat anytime, or raise a franchise enquiry ticket from Customer Care.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="franchise-apply" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!success ? (
          <>
            <SectionHead eyebrow="Franchise application" title="Tell Us About Your Plans"
              sub="Share your details and preferred location. The NoodleWala franchise team reviews every application against current requirements." />
            <form onSubmit={submit} className="mt-10 bg-white border border-[#D7E4DC] rounded-2xl p-6 sm:p-8 space-y-5" noValidate data-testid="franchise-form">
              <input type="text" value={form.website} onChange={(e) => set("website", e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <div className="grid sm:grid-cols-2 gap-5">
                <div><Label htmlFor="f-name">Full name *</Label><Input id="f-name" data-testid="franchise-name" value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1.5 border-[#D7E4DC]" />{err("name")}</div>
                <div><Label htmlFor="f-mobile">Mobile number *</Label><Input id="f-mobile" data-testid="franchise-mobile" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} className="mt-1.5 border-[#D7E4DC]" />{err("mobile")}</div>
                <div><Label htmlFor="f-whatsapp">WhatsApp number</Label><Input id="f-whatsapp" data-testid="franchise-whatsapp" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className="mt-1.5 border-[#D7E4DC]" /></div>
                <div><Label htmlFor="f-email">Email *</Label><Input id="f-email" type="email" data-testid="franchise-email" value={form.email} onChange={(e) => set("email", e.target.value)} className="mt-1.5 border-[#D7E4DC]" />{err("email")}</div>
                <div><Label htmlFor="f-city">Preferred city *</Label><Input id="f-city" data-testid="franchise-city" value={form.city} onChange={(e) => set("city", e.target.value)} className="mt-1.5 border-[#D7E4DC]" />{err("city")}</div>
                <div><Label htmlFor="f-state">Preferred state *</Label><Input id="f-state" data-testid="franchise-state" value={form.state} onChange={(e) => set("state", e.target.value)} className="mt-1.5 border-[#D7E4DC]" />{err("state")}</div>
              </div>
              <div><Label htmlFor="f-location">Preferred location / area</Label><Input id="f-location" data-testid="franchise-location" value={form.preferred_location} onChange={(e) => set("preferred_location", e.target.value)} className="mt-1.5 border-[#D7E4DC]" /></div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div><Label htmlFor="f-occupation">Current occupation / business</Label><Input id="f-occupation" data-testid="franchise-occupation" value={form.occupation} onChange={(e) => set("occupation", e.target.value)} className="mt-1.5 border-[#D7E4DC]" /></div>
                <div>
                  <Label>Estimated investment range</Label>
                  <Select value={form.investment_range} onValueChange={(v) => set("investment_range", v)}>
                    <SelectTrigger className="mt-1.5 border-[#D7E4DC]" data-testid="franchise-investment"><SelectValue placeholder="Prefer not to say" /></SelectTrigger>
                    <SelectContent>
                      {["Under ₹10 lakh", "₹10–25 lakh", "₹25–50 lakh", "Above ₹50 lakh", "Prefer not to say"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Store ownership status</Label>
                  <Select value={form.store_ownership} onValueChange={(v) => set("store_ownership", v)}>
                    <SelectTrigger className="mt-1.5 border-[#D7E4DC]" data-testid="franchise-ownership"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["Own a space", "Rented space", "Yet to find a space", "Exploring"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Preferred timeline</Label>
                  <Select value={form.timeline} onValueChange={(v) => set("timeline", v)}>
                    <SelectTrigger className="mt-1.5 border-[#D7E4DC]" data-testid="franchise-timeline"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["Immediately", "1–3 months", "3–6 months", "6+ months", "Just exploring"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>How did you hear about us?</Label>
                  <Select value={form.source} onValueChange={(v) => set("source", v)}>
                    <SelectTrigger className="mt-1.5 border-[#D7E4DC]" data-testid="franchise-source"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["Web search", "Social media", "Friend or family", "Visited a store", "Event", "Other"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label htmlFor="f-experience">Relevant retail or food industry experience</Label><Textarea id="f-experience" rows={2} data-testid="franchise-experience" value={form.experience} onChange={(e) => set("experience", e.target.value)} className="mt-1.5 border-[#D7E4DC]" /></div>
              <div><Label htmlFor="f-message">Message</Label><Textarea id="f-message" rows={3} data-testid="franchise-message" value={form.message} onChange={(e) => set("message", e.target.value)} className="mt-1.5 border-[#D7E4DC]" /></div>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Checkbox id="f-c1" data-testid="franchise-consent-contact" checked={form.consent_contact} onCheckedChange={(v) => set("consent_contact", !!v)} className="mt-0.5 border-[#1B8A63]" />
                  <Label htmlFor="f-c1" className="text-xs text-[#5F6F67] font-normal leading-relaxed">I consent to be contacted by the NoodleWala franchise team about my enquiry. *</Label>
                </div>
                {err("consent_contact")}
                <div className="flex items-start gap-2.5">
                  <Checkbox id="f-c2" data-testid="franchise-consent-privacy" checked={form.consent_privacy} onCheckedChange={(v) => set("consent_privacy", !!v)} className="mt-0.5 border-[#1B8A63]" />
                  <Label htmlFor="f-c2" className="text-xs text-[#5F6F67] font-normal leading-relaxed">I agree to the processing of my details as described in the privacy policy. *</Label>
                </div>
                {err("consent_privacy")}
              </div>
              {failMsg && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert" data-testid="franchise-submit-error">{failMsg}</p>}
              <Button type="submit" disabled={submitting} data-testid="franchise-submit"
                className="w-full bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full py-6 text-base">
                {submitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>) : "SUBMIT FRANCHISE APPLICATION"}
              </Button>
            </form>
          </>
        ) : (
          <div className="bg-white border border-[#D7E4DC] rounded-2xl p-10 text-center" data-testid="franchise-success">
            <CheckCircle2 className="w-12 h-12 text-[#00704A] mx-auto" />
            <h2 className="mt-4 font-display text-2xl font-bold text-[#063B2B]">Application received</h2>
            <p className="mt-3 text-sm text-[#123D2D]/80 leading-relaxed max-w-md mx-auto">{success}</p>
            <Button className="mt-6 bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full" data-testid="franchise-success-home"
              onClick={() => { setSuccess(null); setForm(EMPTY); }}>Submit Another Application</Button>
          </div>
        )}
      </section>
    </div>
  );
}
