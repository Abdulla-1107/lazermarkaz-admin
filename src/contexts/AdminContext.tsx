import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, Order, ContactMessage } from '@/types/admin';

interface AdminContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  messages: ContactMessage[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  addMessage: (message: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>) => void;
  markMessageAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'admin_products',
  CATEGORIES: 'admin_categories',
  ORDERS: 'admin_orders',
  MESSAGES: 'admin_messages',
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const loadedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const loadedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const loadedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);

    if (loadedProducts) setProducts(JSON.parse(loadedProducts));
    if (loadedCategories) setCategories(JSON.parse(loadedCategories));
    if (loadedOrders) setOrders(JSON.parse(loadedOrders));
    if (loadedMessages) setMessages(JSON.parse(loadedMessages));

    // Initialize with demo data if empty
    if (!loadedCategories) {
      const demoCategories: Category[] = [
        { id: '1', name_uz: 'Elektronika', name_en: 'Electronics', name_ru: 'Электроника', createdAt: new Date().toISOString() },
        { id: '2', name_uz: 'Kiyim', name_en: 'Clothing', name_ru: 'Одежда', createdAt: new Date().toISOString() },
      ];
      setCategories(demoCategories);
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(demoCategories));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  // Product operations
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...product } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Category operations
  const addCategory = (category: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...category,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...category } : c));
  };

  const deleteCategory = (id: string) => {
    const hasProducts = products.some(p => p.categoryId === id);
    if (hasProducts) {
      throw new Error('Bu kategoriyada mahsulotlar mavjud. Avval mahsulotlarni o\'chiring.');
    }
    setCategories(categories.filter(c => c.id !== id));
  };

  // Order operations
  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setOrders([...orders, newOrder]);
  };

  const updateOrder = (id: string, order: Partial<Order>) => {
    setOrders(orders.map(o => o.id === id ? { ...o, ...order } : o));
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  // Message operations
  const addMessage = (message: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>) => {
    const newMessage: ContactMessage = {
      ...message,
      id: generateId(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);
  };

  const markMessageAsRead = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        categories,
        orders,
        messages,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addOrder,
        updateOrder,
        deleteOrder,
        addMessage,
        markMessageAsRead,
        deleteMessage,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
