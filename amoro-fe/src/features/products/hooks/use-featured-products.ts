import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/get-products";

export function useFeaturedProducts(limit = 12) {
  return useQuery({
    queryKey: ["products", { featured: true, limit }],
    queryFn: () => getProducts({ featured: true, limit }),
  });
}
