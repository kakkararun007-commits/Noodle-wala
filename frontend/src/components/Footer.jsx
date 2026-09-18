import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const COLS = [
  {
    title: "Explore",
    links: [
      { to: "/shop", label: "Shop", testId: "footer-link-shop" },
      { to: "/collections", label: "Collections", testId: "footer-link-collections" },
      { to: "/try-and-buy", label: "Try & Buy", testId: "footer-link-try-buy" },
      { to: "/about", label: "About NoodleWala", testId: "footer-link-about" },
      { to: "/stores", label: "Find a Store", testId: "footer-link-stores" },
    ],
  },
  {
    title: "Business",
    links: [
      { to: "/franchise", label: "Franchise", testId: "footer-link-franchise" },
      { to: "/contact", label: "Partner With Us", testId: "footer-link-partner" },
      { to: "/contact", label: "Product Supply", testId: "footer-link-supply" },
      { to: "/customer-care", label: "Franchise Support", testId: "footer-link-franchise-support" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { to: "/customer-care", label: "AI Assistant", testId: "footer-link-ai" },
      { to: "/customer-care", label: "Create a Ticket", testId: "footer-link-ticket" },
      { to: "/customer-care", label: "Check Ticket Status", testId: "footer-link-ticket-status" },
      { to: "/contact", label: "Contact Us", testId: "footer-link-contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/about", label: "Privacy Policy", testId: "footer-link-privacy" },
      { to: "/about", label: "Terms and Conditions", testId: "footer-link-terms" },
      { to: "/franchise", label: "Franchise Disclaimer", testId: "footer-link-franchise-disclaimer" },
      { to: "/customer-care", label: "Customer Care Terms", testId: "footer-link-care-terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#063B2B] text-[#F7FAF6] border-t border-[#1B8A63]/30" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <Logo dark />
            <p className="mt-5 text-sm text-[#F7FAF6]/70 leading-relaxed max-w-xs" data-testid="footer-description">
              A specialty retail concept bringing the world of noodles to neighbourhoods across India.
            </p>
            <p className="mt-4 font-mono text-[11px] tracking-[0.2em] text-[#C9A227]">
              JP • KR • CN • TH • VN • ID • IN • WORLD
            </p>
            <p className="mt-3 text-xs text-[#F7FAF6]/50" data-testid="footer-social-note">
              Social profiles will be linked once officially launched.
            </p>
          </div>
          {COLS.map((col) => (
            <nav key={col.title} className="md:col-span-2" aria-label={col.title}>
              <h3 className="font-mono text-xs tracking-[0.22em] text-[#C9A227] mb-4 uppercase">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l, i) => (
                  <li key={l.testId}>
                    <Link to={l.to} data-testid={l.testId}
                      className="text-sm text-[#F7FAF6]/75 hover:text-[#C9A227] transition-colors duration-200">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-[#1B8A63]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#F7FAF6]/60" data-testid="footer-copyright">
            © 2026 NoodleWala.com. All rights reserved.
          </p>
          <p className="font-mono text-[10px] tracking-[0.25em] text-[#C9A227]/80">THE WORLD OF NOODLES</p>
        </div>
      </div>
    </footer>
  );
}
