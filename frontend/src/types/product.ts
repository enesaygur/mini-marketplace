export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  sellerId: number;
  createdAt: string;
  seller: {
    id: number;
    email: string;
  };
}
