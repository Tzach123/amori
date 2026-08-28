import Image from "next/image";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { formatPrice } from "../utils/format-price";
import type { Product } from "../types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex w-36 shrink-0 flex-col gap-2 sm:w-44">
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 640px) 176px, 144px"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder label={product.name} className="size-full" />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
        <p className="text-sm text-muted-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );
}
