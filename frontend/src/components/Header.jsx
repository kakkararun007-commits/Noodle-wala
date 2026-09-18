import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, MapPin, X } from "lucide-react";
import Logo from "@/components/Logo";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const LINKS = [
  { to: "/shop", label: "Explore Noodles", testId: "nav-link-shop" },
  { to: "/collections", label: "Collections", testId: "nav-link-collections" },
  { to: "/try-and-buy", label: "Try & Buy", testId: "nav-link-try-buy" },
  { to: "/stores", label: "Find a Store", testId: "nav-link-stores" },
  { to: "/franchise", label: "Franchise", testId: "nav-link-franchise" },
  { to: "/about", label: "About", testId: "nav-link-about" },
  { to: "/customer-care", label: "Customer Care", testId: "nav-link-customer-care" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const linkCls = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 hover:text-[#00704A] ${
      isActive ? "text-[#00704A] border-b-2 border-[#C9A227] pb-0.5" : "text-[#123D2D]"
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#F7FAF6]/90 border-b border-[#D7E4DC]/80" data-testid="site-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        <Link to="/" aria-label="NoodleWala.com — The World of Noodles" data-testid="nav-brand-logo">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkCls} data-testid={l.testId}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button variant="outline" asChild
            className="border-[#00704A] text-[#00704A] hover:bg-[#00704A]/5 rounded-full px-5">
            <Link to="/stores" data-testid="nav-btn-find-store">
              <MapPin className="w-4 h-4 mr-1.5" /> FIND A STORE
            </Link>
          </Button>
          <Button asChild className="bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full px-5 shadow-[0_4px_14px_-4px_rgba(0,112,74,0.5)]">
            <Link to="/franchise" data-testid="nav-btn-franchise">GET A FRANCHISE</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="lg:hidden p-2 text-[#063B2B]" aria-label="Open menu" data-testid="nav-mobile-menu-button">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#F7FAF6] w-[300px] p-0" data-testid="nav-mobile-drawer">
            <div className="flex items-center justify-between p-5 border-b border-[#D7E4DC]">
              <Logo compact />
              <SheetClose asChild>
                <button aria-label="Close menu" className="p-2" data-testid="nav-mobile-close"><X className="w-5 h-5" /></button>
              </SheetClose>
            </div>
            <nav className="flex flex-col p-5 gap-1" aria-label="Mobile">
              {[{ to: "/", label: "Home", testId: "nav-link-home-mobile" }, ...LINKS, { to: "/contact", label: "Contact / Partner With Us", testId: "nav-link-contact-mobile" }].map((l) => (
                <button key={l.to} data-testid={l.testId}
                  className="text-left py-3 px-3 rounded-lg text-[#123D2D] font-medium hover:bg-white hover:text-[#00704A] transition-colors"
                  onClick={() => { setOpen(false); navigate(l.to); }}>
                  {l.label}
                </button>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <Button className="bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full" data-testid="nav-mobile-btn-franchise"
                  onClick={() => { setOpen(false); navigate("/franchise"); }}>
                  GET A FRANCHISE
                </Button>
                <Button variant="outline" className="border-[#00704A] text-[#00704A] rounded-full" data-testid="nav-mobile-btn-find-store"
                  onClick={() => { setOpen(false); navigate("/stores"); }}>
                  FIND A STORE
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
