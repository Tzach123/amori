import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/get-categories";

export function useTopLevelCategories() {
  return useQuery({
    queryKey: ["categories", { topLevel: true }],
    queryFn: () => getCategories({ topLevel: true }),
  });
}
