"use client";

import { useTopLevelCategories, CategoryCard } from "@/features/categories";

export function CollectionsSection() {
  const { data: categories, isLoading } = useTopLevelCategories();

  if (isLoading || !categories?.length) return null;

  return (
    <section className="grid gap-6 sm:grid-cols-2">
      {categories.map((category) => (
        <div key={category.id} className="flex h-72">
          <CategoryCard category={category} />
        </div>
      ))}
    </section>
  );
}
