export interface Product {
  id: string;
  name: {
    fr: string;
    ar: string;
  };
  description: {
    fr: string;
    ar: string;
  };
  price: number;
  originalPrice?: number;
  image: string;
  category: 'electronics' | 'cosmetics' | 'fashion' | 'home';
  inStock: boolean;
  rating: number;
  reviews: number;
  colors?: string[];
  specifications?: {
    [key: string]: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface OrderData {
  items: CartItem[];
  total: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'cash';
}

export type Language = 'fr' | 'ar';

export type Category = 'electronics' | 'cosmetics' | 'fashion' | 'home' | 'all';