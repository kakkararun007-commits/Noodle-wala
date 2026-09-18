import { useEffect, useState } from "react";
import { getCollections, usePageTitle } from "@/lib/api";
import { SectionHead, CardGridSkeleton, ErrorState } from "@/components/Blocks";
import CollectionCard from "@/components/CollectionCard";

export default function Collections() {
  usePageTitle("Collections", "Explore NoodleWala noodle collections by origin — Japan, Korea, China, Thailand, Vietnam, Indonesia, India and World Specials.")();
  const [collections, setCollections] = useState(null);
  const [error, setError] = useState(false);
  const load = () => { setError(false); getCollections().then(setCollections).catch(() => setError(true)); };
  useEffect(load, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16" data-testid="collections-page">
      <SectionHead eyebrow="Origin collections" title="A Map You Can Taste"
        sub="Eight curated noodle cultures — from Japanese ramen traditions to Indian everyday classics, plus limited World Specials. Collection content is managed by the NoodleWala team." />
      {error ? <div className="mt-10"><ErrorState onRetry={load} /></div> : !collections ? (
        <div className="mt-10"><CardGridSkeleton count={8} /></div>
      ) : (
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5" data-testid="collections-grid">
          {collections.map((c, i) => <CollectionCard key={c.slug} collection={c} large={i < 2} />)}
        </div>
      )}
    </div>
  );
}
