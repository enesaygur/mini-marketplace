export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    title: string;
    imageUrl: string | null;
  };
}

export interface Order {
  id: number;
  buyerId: number;
  status: string;
  stripeSessionId: string | null;
  createdAt: string;
  items: OrderItem[];
}
