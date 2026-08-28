import { apiGet } from "@/lib/api-client";
import type { Product } from "../types/product";

export function getProducts(params?: {
  featured?: boolean;
  categorySlug?: string;
  limit?: number;
}) {
  return apiGet<Product[]>("/products", params);
}
