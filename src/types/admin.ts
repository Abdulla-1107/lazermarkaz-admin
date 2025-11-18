export interface Product {
  id: string;
  name_uz: string;
  name_en: string;
  name_ru: string;
  description_uz: string;
  description_en: string;
  description_ru: string;
  price: number;
  size?: string;
  categoryId: string;
  image?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name_uz: string;
  name_en: string;
  name_ru: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  email?: string;
  oferta: boolean;
  totalPrice: number;
  status: "Yangi" | "Jarayonda" | "Yakunlangan";
  items: OrderItem[];
  createdAt: string;
  products?: any[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
