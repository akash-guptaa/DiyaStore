export interface ProductImage {
  url: string;
  alt: string;
  isMain: boolean;
  sortOrder: number;
}

export interface ProductSpecifications {
  material: string;
  color: string;
  dimensions: string;
  [key: string]: string;
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
  specifications: ProductSpecifications;
  stockQuantity: number;
  status: 'draft' | 'published';
  featured: boolean;
  rating: number | null;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productCode: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderCustomer {
  name: string;
  mobile: string;
}

export interface Order {
  orderId: string;
  customer: OrderCustomer;
  items: OrderItem[];
  total: number;
  status: 'pending_whatsapp_confirmation' | 'confirmed' | 'processing' | 'ready_for_pickup' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  storeLogoUrl: string;
  heroHeadline: string;
  heroSubtitle: string;
  whatsappNumber: string;
  primaryContact: string;
  altContact: string;
  address: string;
  googleMapsUrl: string;
}
