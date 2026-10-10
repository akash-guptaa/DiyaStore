export interface ProductImage {
  url: string;
  alt: string;
  isMain: boolean;
  sortOrder: number;
}

export interface Product {
  id: string; 
  productCode: string; 
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice: number | null;
  categoryId: string;
  images: ProductImage[];
  specifications: Record<string, string>;
  stockQuantity: number;
  status: 'draft' | 'published';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productCode: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string; 
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  customerAddress?: string;
  customerCity?: string;
  customerPincode?: string;
  customerState?: string;
  orderNotes?: string;
  items: OrderItem[];
  total: number;
  status: 'pending_whatsapp_confirmation' | 'confirmed' | 'collect_from_shop' | 'delivered' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  city?: string;
  totalSpent: number;
  orderCount: number;
  lastOrder: string;
  createdAt: string;
}