"use client";

import { Heart } from "lucide-react";
import { useTopLevelCategories } from "@/features/categories";
import { useFeaturedProducts, ProductCard } from "@/features/products";

export function FeaturedCollectionSection() {
  const { data: categories } = useTopLevelCategories();
  const { data: products, isLoading } = useFeaturedProducts();

  if (isLoading || !products?.length) return null;

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-heading text-2xl text-foreground">הקולקציה</h2>
        <Heart className="size-4 fill-primary text-primary" />
      </div>

      {(categories ?? []).map((category) => {
        const categoryProducts = products.filter(
          (product) => product.categoryId === category.id
        );
        if (!categoryProducts.length) return null;

        return (
          <div key={category.id} className="flex flex-col gap-4">
            <h3 className="text-center text-sm font-medium text-muted-foreground">
              {category.name}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
