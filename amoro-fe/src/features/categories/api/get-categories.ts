import { apiGet } from "@/lib/api-client";
import type { Category } from "../types/category";

export function getCategories(params?: { topLevel?: boolean }) {
  return apiGet<Category[]>("/categories", params);
}
