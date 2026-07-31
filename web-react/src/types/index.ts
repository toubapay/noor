export interface Module {
  id: number;
  module_name: string;
  module_type: string;
  thumbnail?: string;
  icon?: string;
}

export interface ConfigModel {
  business_name: string;
  currency_symbol: string;
  base_urls: Record<string, string>;
  module_config?: { module?: Module };
  [key: string]: unknown;
}

export interface Banner {
  id: number;
  title?: string;
  image_full_url?: string;
  banner_type?: number;
  data?: unknown;
}

export interface Category {
  id: number;
  name: string;
  image_full_url?: string;
  position?: number;
  parent_id?: number;
}

export interface Brand {
  id: number;
  name: string;
  image_full_url?: string;
}

export interface FlashSale {
  id: number;
  title: string;
  banner_full_url?: string;
  start_date: string;
  end_date: string;
}

export interface Item {
  id: number;
  name: string;
  description?: string;
  image_full_url?: string;
  price: number;
  discount?: number;
  discount_type?: 'percent' | 'amount';
  avg_rating?: number;
  rating_count?: number;
  store_id: number;
  store?: Store;
  variations?: unknown[];
  add_ons?: unknown[];
  choice_options?: unknown[];
  stock?: number;
}

export interface Store {
  id: number;
  name: string;
  logo_full_url?: string;
  cover_photo_full_url?: string;
  address?: string;
  phone?: string;
  active?: boolean;
  open?: boolean;
  avg_rating?: number;
  rating_count?: number;
  delivery_time?: string;
  minimum_order?: number;
  free_delivery?: boolean;
  discount?: { discount: number; discount_type: string };
  latitude?: string;
  longitude?: string;
}

export interface Address {
  id: number;
  address_type: string;
  address: string;
  latitude: string;
  longitude: string;
  contact_person_number?: string;
  road?: string;
  house?: string;
  floor?: string;
}

export interface CartItem {
  id: number;
  item_id: number;
  item?: Item;
  price: number;
  quantity: number;
  variation?: unknown[];
  add_on_ids?: number[];
  add_on_qtys?: number[];
  discount_amount?: number;
  is_prescribed_item?: 0 | 1;
}

export interface User {
  id: number;
  f_name: string;
  l_name: string;
  email: string;
  phone: string;
  image_full_url?: string;
  wallet_balance?: number;
  loyalty_point?: number;
  ref_code?: string;
}

export interface Order {
  id: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  order_type: string;
  order_amount: number;
  total_tax_amount?: number;
  discount_amount?: number;
  delivery_charge?: number;
  created_at: string;
  delivery_address?: Address;
  order_type_details?: Store;
  details?: unknown[];
  delivery_man?: { f_name: string; l_name: string; phone: string; location?: { latitude: string; longitude: string } };
}

export interface CouponModel {
  id: number;
  code: string;
  title: string;
  discount: number;
  discount_type: string;
  min_purchase?: number;
  max_discount?: number;
  expire_date?: string;
}

export interface WalletTransaction {
  id: number;
  transaction_type: string;
  credit: number;
  debit: number;
  balance: number;
  created_at: string;
}

export interface LoyaltyTransaction {
  id: number;
  transaction_type: string;
  credit: number;
  debit: number;
  balance: number;
  created_at: string;
}

export interface WishlistItem {
  item_id: number;
  item?: Item;
}

export interface NotificationModel {
  id: number;
  title: string;
  description: string;
  image_full_url?: string;
  created_at: string;
}

export interface ParcelCategory {
  id: number;
  parcel_category_name: string;
  image_full_url?: string;
}

export interface Review {
  id: number;
  comment: string;
  rating: number;
  customer?: { f_name: string; l_name: string };
  created_at: string;
}

export interface ChatConversation {
  id: number;
  order_id?: number;
  store?: Store;
  delivery_man?: { f_name: string; l_name: string; image_full_url?: string };
}

export interface ChatMessage {
  id: number;
  message?: string;
  image_full_url?: string[];
  sent_by: 'customer' | 'store' | 'delivery_man' | 'admin';
  created_at: string;
}
