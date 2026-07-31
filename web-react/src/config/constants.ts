// Mirrors lib/util/app_constants.dart from the Flutter app so both clients
// talk to the exact same Laravel API surface.

export const AppConfig = {
  appName: 'Noor',
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://admin.marcheocass.com',
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
};

export const Modules = {
  food: 'food',
  grocery: 'grocery',
  pharmacy: 'pharmacy',
  ecommerce: 'ecommerce',
  parcel: 'parcel',
  rental: 'rental',
} as const;
export type ModuleType = (typeof Modules)[keyof typeof Modules];

export const OrderStatus = {
  pending: 'pending',
  accepted: 'accepted',
  processing: 'processing',
  confirmed: 'confirmed',
  handover: 'handover',
  pickedUp: 'picked_up',
  delivered: 'delivered',
  canceled: 'canceled',
  failed: 'failed',
  refunded: 'refunded',
  returned: 'returned',
} as const;

export const Languages = [
  { languageName: 'Français', languageCode: 'fr', countryCode: 'SN' },
  { languageName: 'English', languageCode: 'en', countryCode: 'US' },
  { languageName: 'العربية', languageCode: 'ar', countryCode: 'SA' },
] as const;

// LocalStorage keys — namespaced like the Flutter app's SharedPreferences keys.
export const StorageKeys = {
  token: 'noor_token',
  languageCode: 'noor_language_code',
  userAddress: 'noor_user_address',
  moduleId: 'noor_module_id',
  cacheModuleId: 'noor_cache_module_id',
  cartList: 'noor_cart_list',
  guestId: 'noor_guest_id',
  zoneIds: 'noor_zone_ids',
  theme: 'noor_theme',
};

// HTTP header names the API expects (see ApiClient.updateHeader in the Flutter app).
export const HeaderKeys = {
  zoneId: 'zoneId',
  moduleId: 'moduleId',
  localization: 'X-localization',
  latitude: 'latitude',
  longitude: 'longitude',
};

export const Endpoints = {
  // Config / static
  config: '/api/v1/config',
  banners: '/api/v1/banners',
  aboutUs: '/api/v1/about-us',
  privacyPolicy: '/api/v1/privacy-policy',
  termsAndConditions: '/api/v1/terms-and-conditions',
  cancellationPolicy: '/api/v1/cancelation',
  refundPolicy: '/api/v1/refund-policy',
  shippingPolicy: '/api/v1/shipping-policy',
  module: '/api/v1/module',
  zoneList: '/api/v1/zone/list',
  checkZone: '/api/v1/zone/check',
  getZoneId: '/api/v1/config/get-zone-id',
  distanceMatrix: '/api/v1/config/distance-api',
  placeAutocomplete: '/api/v1/config/place-api-autocomplete',
  placeDetails: '/api/v1/config/place-api-details',
  geocode: '/api/v1/config/geocode-api',

  // Auth
  login: '/api/v1/auth/login',
  register: '/api/v1/auth/sign-up',
  socialLogin: '/api/v1/auth/social-login',
  socialRegister: '/api/v1/auth/social-register',
  forgotPassword: '/api/v1/auth/forgot-password',
  verifyToken: '/api/v1/auth/verify-token',
  resetPassword: '/api/v1/auth/reset-password',
  verifyPhone: '/api/v1/auth/verify-phone',
  checkEmail: '/api/v1/auth/check-email',
  verifyEmail: '/api/v1/auth/verify-email',
  guestLogin: '/api/v1/auth/guest/request',
  firebaseVerify: '/api/v1/auth/firebase-verify-token',
  firebaseResetPassword: '/api/v1/auth/firebase-reset-password',
  updateInfo: '/api/v1/auth/update-info',

  // Customer
  customerInfo: '/api/v1/customer/info',
  updateProfile: '/api/v1/customer/update-profile',
  removeAccount: '/api/v1/customer/remove-account',
  cmFirebaseToken: '/api/v1/customer/cm-firebase-token',

  // Categories / items / stores
  categories: '/api/v1/categories',
  subCategories: '/api/v1/categories/childes/',
  categoryItems: '/api/v1/categories/items/',
  categoryStores: '/api/v1/categories/stores/',
  popularCategories: '/api/v1/categories/popular',
  featuredCategoryItems: '/api/v1/categories/featured/items',
  latestItems: '/api/v1/items/latest',
  popularItems: '/api/v1/items/popular',
  mostReviewedItems: '/api/v1/items/most-reviewed',
  recommendedItems: '/api/v1/items/recommended',
  discountedItems: '/api/v1/items/discounted',
  suggestedItems: '/api/v1/items/suggested',
  basicMedicine: '/api/v1/items/basic',
  itemDetails: '/api/v1/items/details/',
  setMenu: '/api/v1/items/set-menu',
  itemReviewSubmit: '/api/v1/items/reviews/submit',
  itemOrStoreSearch: '/api/v1/items/item-or-store-search',

  stores: '/api/v1/stores/get-stores',
  popularStores: '/api/v1/stores/popular',
  latestStores: '/api/v1/stores/latest',
  topOfferStores: '/api/v1/stores/top-offer-near-me',
  recommendedStores: '/api/v1/stores/recommended',
  storeDetails: '/api/v1/stores/details/',
  storeReviews: '/api/v1/stores/reviews',
  storeBanners: '/api/v1/banners/',
  visitAgainStores: '/api/v1/customer/visit-again',

  brands: '/api/v1/brand',
  brandItems: '/api/v1/brand/items',

  flashSales: '/api/v1/flash-sales',
  flashSaleItems: '/api/v1/flash-sales/items',

  campaignsBasic: '/api/v1/campaigns/basic',
  campaignsItem: '/api/v1/campaigns/item',
  basicCampaignDetails: '/api/v1/campaigns/basic-campaign-details',

  // Cart
  cartList: '/api/v1/customer/cart/list',
  cartAdd: '/api/v1/customer/cart/add',
  cartUpdate: '/api/v1/customer/cart/update',
  cartRemoveAll: '/api/v1/customer/cart/remove',
  cartRemoveItem: '/api/v1/customer/cart/remove-item',

  // Address
  addressList: '/api/v1/customer/address/list',
  addressAdd: '/api/v1/customer/address/add',
  addressUpdate: '/api/v1/customer/address/update/',
  addressRemove: '/api/v1/customer/address/delete',

  // Orders
  placeOrder: '/api/v1/customer/order/place',
  placePrescriptionOrder: '/api/v1/customer/order/prescription/place',
  runningOrders: '/api/v1/customer/order/running-orders',
  orderHistory: '/api/v1/customer/order/list',
  orderDetails: '/api/v1/customer/order/details',
  orderCancel: '/api/v1/customer/order/cancel',
  orderCancellationReasons: '/api/v1/customer/order/cancellation-reasons',
  orderTrack: '/api/v1/customer/order/track',
  codSwitch: '/api/v1/customer/order/payment-method',
  walletSwitch: '/api/v1/customer/order/wallet-payment',
  refundReasons: '/api/v1/customer/order/refund-reasons',
  refundRequest: '/api/v1/customer/order/refund-request',
  getOrderTax: '/api/v1/customer/order/get-Tax',
  getSurgePrice: '/api/v1/customer/order/get-surge-price',
  paymentFailedDetails: '/api/v1/customer/order/payment-failed',
  offlinePaymentSave: '/api/v1/customer/order/offline-payment',
  offlinePaymentUpdate: '/api/v1/customer/order/offline-payment-update',
  offlineMethodList: '/api/v1/offline_payment_method_list',
  parcelInstructions: '/api/v1/customer/order/parcel-instructions',
  parcelCategory: '/api/v1/parcel-category',
  parcelReturn: '/api/v1/customer/order/parcel-return',
  parcelCancellationReasons: '/api/v1/get-parcel-cancellation-reasons',

  lastLocation: '/api/v1/delivery-man/last-location',
  deliveryManReviewSubmit: '/api/v1/delivery-man/reviews/submit',

  // Coupons
  couponList: '/api/v1/coupon/list',
  couponApply: '/api/v1/coupon/apply',

  // Wallet / loyalty
  walletTransactions: '/api/v1/customer/wallet/transactions',
  addFund: '/api/v1/customer/wallet/add-fund',
  walletBonuses: '/api/v1/customer/wallet/bonuses',
  loyaltyTransactions: '/api/v1/customer/loyalty-point/transactions',
  loyaltyPointTransfer: '/api/v1/customer/loyalty-point/point-transfer',
  cashbackList: '/api/v1/cashback/list',
  cashbackAmount: '/api/v1/cashback/getCashback',

  // Wishlist
  wishList: '/api/v1/customer/wish-list',
  wishListAdd: '/api/v1/customer/wish-list/add',
  wishListRemove: '/api/v1/customer/wish-list/remove',

  // Notifications
  notifications: '/api/v1/customer/notifications',

  // Messaging / chat
  conversationList: '/api/v1/customer/message/list',
  searchConversationList: '/api/v1/customer/message/search-list',
  messageList: '/api/v1/customer/message/details',
  sendMessage: '/api/v1/customer/message/send',
  automatedMessage: '/api/v1/customer/automated-message',

  // Misc / other
  otherBanners: '/api/v1/other-banners',
  whyChoose: '/api/v1/other-banners/why-choose',
  videoContent: '/api/v1/other-banners/video-content',
  commonCondition: '/api/v1/common-condition',
  conditionWiseItems: '/api/v1/common-condition/items/',
  advertisementList: '/api/v1/advertisement/list',
  newsletterSubscribe: '/api/v1/newsletter/subscribe',
  landingPage: '/api/v1/flutter-landing-page',
  metaData: '/api/v1/get-metadata',

  // Vendor / delivery-man registration
  storeRegister: '/api/v1/auth/vendor/register',
  dmRegister: '/api/v1/auth/delivery-man/store',
  businessPlan: '/api/v1/vendor/business_plan',
  businessPlanPayment: '/api/v1/vendor/subscription/payment/api',
  storePackages: '/api/v1/vendor/package-view',
};
