import apiClient from '@/api/client';
import { Endpoints } from '@/config/constants';
import type {
  Address, Banner, Brand, CartItem, Category, ConfigModel, CouponModel, FlashSale, Item, LoyaltyTransaction,
  Module, NotificationModel, Order, ParcelCategory, Store, User, WalletTransaction, WishlistItem, ChatConversation,
  ChatMessage, Review,
} from '@/types';

// ---- Config / bootstrap ----
export const getConfig = () => apiClient.get<ConfigModel>(Endpoints.config).then((r) => r.data);
export const getModules = () => apiClient.get<Module[]>(Endpoints.module).then((r) => r.data);
export const getBanners = () => apiClient.get<Banner[]>(Endpoints.banners).then((r) => r.data);
export const getZoneId = (lat: number, lng: number) =>
  apiClient.get(Endpoints.getZoneId, { params: { lat, lng } }).then((r) => r.data);
export const placeAutocomplete = (query: string) =>
  apiClient.get(Endpoints.placeAutocomplete, { params: { search_text: query } }).then((r) => r.data);
export const placeDetails = (placeId: string) =>
  apiClient.get(Endpoints.placeDetails, { params: { placeid: placeId } }).then((r) => r.data);
export const geocode = (lat: number, lng: number) =>
  apiClient.get(Endpoints.geocode, { params: { lat, lng } }).then((r) => r.data);

// ---- Auth ----
export const login = (payload: { email_or_phone: string; password: string }) =>
  apiClient.post(Endpoints.login, payload).then((r) => r.data);
export const register = (payload: Record<string, unknown>) =>
  apiClient.post(Endpoints.register, payload).then((r) => r.data);
export const socialLogin = (payload: { unique_id: string; email?: string; medium: string; token: string }) =>
  apiClient.post(Endpoints.socialLogin, payload).then((r) => r.data);
export const socialRegister = (payload: Record<string, unknown>) =>
  apiClient.post(Endpoints.socialRegister, payload).then((r) => r.data);
export const forgotPassword = (emailOrPhone: string) =>
  apiClient.post(Endpoints.forgotPassword, { email_or_phone: emailOrPhone }).then((r) => r.data);
export const verifyOtpToken = (payload: { email_or_phone: string; reset_token?: string; otp: string }) =>
  apiClient.post(Endpoints.verifyToken, payload).then((r) => r.data);
export const resetPassword = (payload: { reset_token: string; password: string; confirm_password: string }) =>
  apiClient.post(Endpoints.resetPassword, payload).then((r) => r.data);
export const guestLogin = () => apiClient.post(Endpoints.guestLogin).then((r) => r.data);

// ---- Customer / profile ----
export const getCustomerInfo = () => apiClient.get<User>(Endpoints.customerInfo).then((r) => r.data);
export const updateProfile = (formData: FormData) =>
  apiClient.post(Endpoints.updateProfile, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const removeAccount = () => apiClient.post(Endpoints.removeAccount).then((r) => r.data);

// ---- Categories / items / stores ----
export const getCategories = () => apiClient.get<Category[]>(Endpoints.categories).then((r) => r.data);
export const getSubCategories = (parentId: number) =>
  apiClient.get<Category[]>(`${Endpoints.subCategories}${parentId}`).then((r) => r.data);
export const getCategoryItems = (categoryId: number, params: Record<string, unknown> = {}) =>
  apiClient.get(`${Endpoints.categoryItems}${categoryId}`, { params }).then((r) => r.data);
export const getCategoryStores = (categoryId: number, params: Record<string, unknown> = {}) =>
  apiClient.get(`${Endpoints.categoryStores}${categoryId}`, { params }).then((r) => r.data);
export const getPopularCategories = () => apiClient.get<Category[]>(Endpoints.popularCategories).then((r) => r.data);

export const getLatestItems = (params: Record<string, unknown> = {}) =>
  apiClient.get<{ items: Item[]; total_size: number }>(Endpoints.latestItems, { params }).then((r) => r.data);
export const getPopularItems = (params: Record<string, unknown> = {}) =>
  apiClient.get<{ items: Item[]; total_size: number }>(Endpoints.popularItems, { params }).then((r) => r.data);
export const getDiscountedItems = (params: Record<string, unknown> = {}) =>
  apiClient.get<{ items: Item[]; total_size: number }>(Endpoints.discountedItems, { params }).then((r) => r.data);
export const getItemDetails = (itemId: number) =>
  apiClient.get<Item>(`${Endpoints.itemDetails}${itemId}`).then((r) => r.data);
export const submitItemReview = (payload: Record<string, unknown>) =>
  apiClient.post(Endpoints.itemReviewSubmit, payload).then((r) => r.data);
export const searchItemsOrStores = (name: string, params: Record<string, unknown> = {}) =>
  apiClient.get(Endpoints.itemOrStoreSearch, { params: { name, ...params } }).then((r) => r.data);

export const getStores = (params: Record<string, unknown> = {}) =>
  apiClient.get<{ stores: Store[]; total_size: number }>(Endpoints.stores, { params }).then((r) => r.data);
export const getPopularStores = (params: Record<string, unknown> = {}) =>
  apiClient.get<Store[]>(Endpoints.popularStores, { params }).then((r) => r.data);
export const getLatestStores = (params: Record<string, unknown> = {}) =>
  apiClient.get<Store[]>(Endpoints.latestStores, { params }).then((r) => r.data);
export const getRecommendedStores = () => apiClient.get<Store[]>(Endpoints.recommendedStores).then((r) => r.data);
export const getStoreDetails = (storeId: number) =>
  apiClient.get<Store>(`${Endpoints.storeDetails}${storeId}`).then((r) => r.data);
export const getStoreReviews = (storeId: number, offset = 1) =>
  apiClient.get<{ reviews: Review[] }>(Endpoints.storeReviews, { params: { store_id: storeId, offset } }).then((r) => r.data);

export const getBrands = () => apiClient.get<Brand[]>(Endpoints.brands).then((r) => r.data);
export const getBrandItems = (brandId: number, params: Record<string, unknown> = {}) =>
  apiClient.get(Endpoints.brandItems, { params: { brand_id: brandId, ...params } }).then((r) => r.data);

// There's no module-agnostic "latest items" endpoint in this API - every
// item list is scoped by the moduleId header. Rather than switching the
// user's actual (not-yet-chosen) module, this passes a one-off header
// override for a single request; the interceptor in api/client.ts only
// sets moduleId from localStorage when one exists, so this override isn't
// clobbered while no module is selected yet.
export const getShopLatestProducts = (moduleId: number) =>
  apiClient
    .get<{ items: Item[] }>(Endpoints.popularItems, {
      params: { type: 'all', offset: 1, limit: 10 },
      headers: { moduleId: String(moduleId) },
    })
    .then((r) => r.data);

export const getFlashSales = () => apiClient.get<FlashSale[]>(Endpoints.flashSales).then((r) => r.data);
export const getFlashSaleItems = (flashSaleId: number) =>
  apiClient.get<Item[]>(Endpoints.flashSaleItems, { params: { flash_sale_id: flashSaleId } }).then((r) => r.data);

// ---- Cart ----
export const getCartList = () => apiClient.get<CartItem[]>(Endpoints.cartList).then((r) => r.data);
export const addToCart = (payload: Record<string, unknown>) =>
  apiClient.post(Endpoints.cartAdd, payload).then((r) => r.data);
export const updateCartItem = (payload: Record<string, unknown>) =>
  apiClient.put(Endpoints.cartUpdate, payload).then((r) => r.data);
export const removeCartItem = (cartId: number) =>
  apiClient.delete(Endpoints.cartRemoveItem, { params: { cart_id: cartId } }).then((r) => r.data);
export const clearCart = (cartIds: number[]) =>
  apiClient.delete(Endpoints.cartRemoveAll, { params: { cart_ids: JSON.stringify(cartIds) } }).then((r) => r.data);

// ---- Address ----
export const getAddresses = () => apiClient.get<Address[]>(Endpoints.addressList).then((r) => r.data);
export const addAddress = (payload: Record<string, unknown>) =>
  apiClient.post(Endpoints.addressAdd, payload).then((r) => r.data);
export const updateAddress = (id: number, payload: Record<string, unknown>) =>
  apiClient.put(`${Endpoints.addressUpdate}${id}`, payload).then((r) => r.data);
export const removeAddress = (id: number) =>
  apiClient.delete(Endpoints.addressRemove, { params: { address_id: id } }).then((r) => r.data);

// ---- Orders ----
export const placeOrder = (payload: Record<string, unknown>) =>
  apiClient.post(Endpoints.placeOrder, payload).then((r) => r.data);
export const getRunningOrders = (offset = 1) =>
  apiClient.get<{ orders: Order[] }>(Endpoints.runningOrders, { params: { offset, limit: 10 } }).then((r) => r.data);
export const getOrderHistory = (offset = 1) =>
  apiClient.get<{ orders: Order[] }>(Endpoints.orderHistory, { params: { offset, limit: 10 } }).then((r) => r.data);
export const getOrderDetails = (orderId: number) =>
  apiClient.get<Order>(Endpoints.orderDetails, { params: { order_id: orderId } }).then((r) => r.data);
export const cancelOrder = (orderId: number, reason: string) =>
  apiClient.post(Endpoints.orderCancel, { order_id: orderId, cancellation_reason: reason }).then((r) => r.data);
export const trackOrder = (orderId: string) =>
  apiClient.get<Order>(Endpoints.orderTrack, { params: { order_id: orderId } }).then((r) => r.data);
export const getOrderCancellationReasons = () => apiClient.get(Endpoints.orderCancellationReasons).then((r) => r.data);
export const getParcelCategories = () => apiClient.get<ParcelCategory[]>(Endpoints.parcelCategory).then((r) => r.data);

// ---- Coupons ----
export const getCoupons = () => apiClient.get<CouponModel[]>(Endpoints.couponList).then((r) => r.data);
export const applyCoupon = (code: string, storeId: number) =>
  apiClient.get(Endpoints.couponApply, { params: { code, store_id: storeId } }).then((r) => r.data);

// ---- Wallet / loyalty ----
export const getWalletTransactions = (offset = 1) =>
  apiClient.get<{ transactions: WalletTransaction[] }>(Endpoints.walletTransactions, { params: { offset } }).then((r) => r.data);
export const getLoyaltyTransactions = (offset = 1) =>
  apiClient.get<{ transactions: LoyaltyTransaction[] }>(Endpoints.loyaltyTransactions, { params: { offset } }).then((r) => r.data);
export const transferLoyaltyPoints = () => apiClient.get(Endpoints.loyaltyPointTransfer).then((r) => r.data);

// ---- Wishlist ----
export const getWishlist = () => apiClient.get<WishlistItem[]>(Endpoints.wishList).then((r) => r.data);
export const addToWishlist = (itemId: number) =>
  apiClient.post(Endpoints.wishListAdd, { item_id: itemId }).then((r) => r.data);
export const removeFromWishlist = (itemId: number) =>
  apiClient.delete(Endpoints.wishListRemove, { params: { item_id: itemId } }).then((r) => r.data);

// ---- Notifications ----
export const getNotifications = () => apiClient.get<NotificationModel[]>(Endpoints.notifications).then((r) => r.data);

// ---- Chat ----
export const getConversations = () => apiClient.get<ChatConversation[]>(Endpoints.conversationList).then((r) => r.data);
export const getMessages = (conversationId: number, offset = 1) =>
  apiClient.get<{ messages: ChatMessage[] }>(Endpoints.messageList, { params: { conversation_id: conversationId, offset } }).then((r) => r.data);
export const sendMessage = (payload: FormData) =>
  apiClient.post(Endpoints.sendMessage, payload, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);

// ---- Static content ----
export const getAboutUs = () => apiClient.get(Endpoints.aboutUs).then((r) => r.data);
export const getPrivacyPolicy = () => apiClient.get(Endpoints.privacyPolicy).then((r) => r.data);
export const getTermsAndConditions = () => apiClient.get(Endpoints.termsAndConditions).then((r) => r.data);
export const getRefundPolicy = () => apiClient.get(Endpoints.refundPolicy).then((r) => r.data);
export const getShippingPolicy = () => apiClient.get(Endpoints.shippingPolicy).then((r) => r.data);
export const getCancellationPolicy = () => apiClient.get(Endpoints.cancellationPolicy).then((r) => r.data);
