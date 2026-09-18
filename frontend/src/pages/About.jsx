import { Link } from "react-router-dom";
import { usePageTitle } from "@/lib/api";
import { Eyebrow, SectionHead } from "@/components/Blocks";
import { Button } from "@/components/ui/button";

const PILLARS = [
  { t: "Product discovery", d: "A catalogue organised by origin, flavour and format — so finding a new favourite feels like travel." },
  { t: "International food cultures", d: "Noodles carry the stories of the places they come from. We bring those stories to one shelf." },
  { t: "Neighbourhood convenience", d: "Compact specialty stores designed to fit into everyday Indian neighbourhoods." },
  { t: "Store-based experience", d: "Retail you can walk through, ask questions in, and taste your way across." },
  { t: "Try & Buy sampling", d: "Our signature tasting experience at participating stores — try before you choose." },
  { t: "Digital ordering potential", d: "Online ordering, pickup and delivery are part of the roadmap, subject to launch." },
  { t: "Franchise-led expansion", d: "The network is being developed with local partners, city by city." },
];

export default function About() {
  usePageTitle("About NoodleWala", "NoodleWala is built around a simple idea: noodles deserve their own destination.")();
  return (
    <div data-testid="about-page">
      <section className="bg-[#063B2B] text-white border-b border-[#1B8A63]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Eyebrow>About NoodleWala</Eyebrow>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08]">
              Noodles deserve their own destination.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
              NoodleWala is built around a simple idea: the world's most loved comfort food — in all its regional glory — belongs in a specialty store of its own. Our vision is to build a modern specialty retail concept that brings together noodles from Asia, India, and the wider world.
            </p>
          </div>
          <img src="https://images.unsplash.com/photo-1623341214825-9f4f963727da?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
            alt="A crafted bowl of ramen — the NoodleWala craft"
            className="rounded-2xl border border-[#1B8A63]/40 w-full h-[300px] sm:h-[380px] object-cover" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHead eyebrow="What we are building" title="One Brand. Many Noodle Cultures."
          sub="The NoodleWala network is being developed across India. Store availability, services and experiences are subject to launch and location." />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PILLARS.map((p) => (
            <div key={p.t} className="bg-white border border-[#D7E4DC] rounded-xl p-6" data-testid={`about-pillar-${p.t.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
              <h3 className="font-display text-lg font-semibold text-[#063B2B]">{p.t}</h3>
              <p className="mt-1.5 text-sm text-[#5F6F67] leading-relaxed">{p.d}</p>
            </div>
          ))}
          <div className="bg-[#063B2B] rounded-xl p-6 flex flex-col justify-between">
            <p className="font-mono text-[10px] tracking-[0.22em] text-[#C9A227] uppercase">The road ahead</p>
            <p className="mt-3 text-sm text-white/80 leading-relaxed">
              Our vision is to build India's specialty noodle destination — with digital ordering, delivery and more, rolled out as the network grows.
            </p>
            <Button asChild className="mt-5 bg-[#C9A227] hover:bg-[#b8922a] text-[#063B2B] rounded-full w-fit font-semibold">
              <Link to="/franchise" data-testid="about-franchise-cta">Join the Journey</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-[#D7E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <img src="https://images.unsplash.com/photo-1601600576337-c1d8a0d1373c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
            alt="Curated specialty noodle packaging on retail shelves — NoodleWala sourcing"
            className="rounded-2xl border border-[#D7E4DC] w-full h-[300px] object-cover" loading="lazy" />
          <div>
            <SectionHead eyebrow="Sourcing & curation" title="Curated, Not Collected"
              sub="Every product on a NoodleWala shelf is selected for authenticity, quality and discovery value. Product details are published only after verification — where information is missing, we say so." />
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="bg-[#00704A] hover:bg-[#063B2B] text-white rounded-full px-6">
                <Link to="/collections" data-testid="about-collections-cta">Explore Collections</Link>
              </Button>
              <Button asChild variant="outline" className="border-[#00704A] text-[#00704A] rounded-full">
                <Link to="/try-and-buy" data-testid="about-trybuy-cta">About Try & Buy</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
