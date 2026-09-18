import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center" data-testid="not-found-page">
      <p className="font-mono text-xs tracking-[0.25em] text-[#C9A227] uppercase">404</p>
      <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-[#063B2B]">This shelf is empty.</h1>
      <p className="mt-3 text-sm text-[#5F6F67] leading-relaxed">
        The page you're looking for doesn't exist or has moved. Let's get you back to the noodles.
      </p>
      <div className="mt-7 flex justify-center gap-3">
        <Button asChild className="bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full">
          <Link to="/" data-testid="notfound-home">Back to Home</Link>
        </Button>
        <Button asChild variant="outline" className="border-[#00704A] text-[#00704A] rounded-full">
          <Link to="/shop" data-testid="notfound-shop">Explore Noodles</Link>
        </Button>
      </div>
    </div>
  );
}
