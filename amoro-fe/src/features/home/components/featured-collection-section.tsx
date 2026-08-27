"use client";

import { Heart } from "lucide-react";
import { useFeaturedProducts, ProductCard } from "@/features/products";

export function FeaturedCollectionSection() {
  const { data: products, isLoading } = useFeaturedProducts();

  if (isLoading || !products?.length) return null;

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-heading text-2xl text-foreground">הקולקציה</h2>
        <Heart className="size-4 fill-primary text-primary" />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
