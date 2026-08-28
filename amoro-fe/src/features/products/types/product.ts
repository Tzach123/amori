export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  categoryId: string;
}
