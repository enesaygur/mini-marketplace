export interface Review {
  id: number;
  rating: number;
  comment: string;
  productId: number;
  userId: number;
  createdAt: string;
  user: {
    id: number;
    email: string;
  };
}
