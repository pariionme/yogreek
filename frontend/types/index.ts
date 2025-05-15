export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  order_number: string;
  order_date: string;
  estimated_delivery: string;
  shipping_address: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
  };
  payment_method: string;
  shipping_method: string;
  status: string;
  total_amount: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: string;
    product: Product;
  }>;
  created_at: string;
  updated_at: string;
}
