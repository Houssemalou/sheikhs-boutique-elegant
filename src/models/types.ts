export interface ProductDTO {
  id: number;
  name: string;
  description?: string;
  photoPath: string;
  category?: string;
  price: number;
  originalPrice: number;
  stock: number;
  status: string;
  discount?: number; 
  promo: boolean;
  images?: string[]; // Tableau d'images supplémentaires
}

export interface CategoryResDTO {
  id: number;
  name: string;
  description: string;
  products: ProductDTO[];
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}


export interface CartItem {
  product: ProductDTO;
  quantity: number;
  selectedColor?: string;
}

export interface OrderData {
  items: CartItem[] | CartItemDTO[];
  total: number;
  customerInfo: CustomerInfo;
  shippingMethod?: 'standard' | 'express';
  paymentMethod?: 'cash';
}

export interface CartItemDTO {
  productName: string;
  quantity: number;
 
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

