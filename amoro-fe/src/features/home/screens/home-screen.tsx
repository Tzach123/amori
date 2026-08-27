import { HeroSection } from "../components/hero-section";
import { CollectionsSection } from "../components/collections-section";
import { FeaturedCollectionSection } from "../components/featured-collection-section";
import { ValuePropsSection } from "../components/value-props-section";
import { BrandStorySection } from "../components/brand-story-section";
import { NewsletterSection } from "../components/newsletter-section";

export function HomeScreen() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-8 sm:px-6">
      <HeroSection />
      <CollectionsSection />
      <FeaturedCollectionSection />
      <ValuePropsSection />
      <BrandStorySection />
      <NewsletterSection />
    </div>
  );
}
