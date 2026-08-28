import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ImagePlaceholder } from "@/components/image-placeholder";
import type { Category } from "../types/category";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/collections/${category.slug}`}
      className="group relative flex flex-1 flex-col justify-end overflow-hidden rounded-2xl bg-secondary"
    >
      <div className="absolute inset-0">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder label={category.name} className="size-full" />
        )}
      </div>
      <div className="relative flex flex-col gap-2 p-6">
        <h3 className="font-heading text-2xl text-foreground">
          {category.name}
        </h3>
        <Heart className="size-4 fill-primary text-primary" />
        <span className="text-sm font-medium text-foreground underline-offset-4 group-hover:underline">
          לקולקציית ה{category.name} ←
        </span>
      </div>
    </Link>
  );
}
