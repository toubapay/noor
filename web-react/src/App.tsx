import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader } from '@/components/common/Loader';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

const SplashPage = lazy(() => import('@/pages/splash/SplashPage'));
const OnboardPage = lazy(() => import('@/pages/onboard/OnboardPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const VerifyOtpPage = lazy(() => import('@/pages/auth/VerifyOtpPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const ModuleSelectPage = lazy(() => import('@/pages/module/ModuleSelectPage'));
const HomePage = lazy(() => import('@/pages/home/HomePage'));
const CategoryPage = lazy(() => import('@/pages/category/CategoryPage'));
const StoreListPage = lazy(() => import('@/pages/store/StoreListPage'));
const StoreDetailsPage = lazy(() => import('@/pages/store/StoreDetailsPage'));
const ItemDetailsPage = lazy(() => import('@/pages/item/ItemDetailsPage'));
const SearchPage = lazy(() => import('@/pages/search/SearchPage'));
const CartPage = lazy(() => import('@/pages/cart/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/checkout/CheckoutPage'));
const OrderListPage = lazy(() => import('@/pages/order/OrderListPage'));
const OrderDetailsPage = lazy(() => import('@/pages/order/OrderDetailsPage'));
const OrderTrackPage = lazy(() => import('@/pages/order/OrderTrackPage'));
const AddressListPage = lazy(() => import('@/pages/address/AddressListPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const EditProfilePage = lazy(() => import('@/pages/profile/EditProfilePage'));
const WalletPage = lazy(() => import('@/pages/wallet/WalletPage'));
const LoyaltyPage = lazy(() => import('@/pages/loyalty/LoyaltyPage'));
const ReferAndEarnPage = lazy(() => import('@/pages/refer_and_earn/ReferAndEarnPage'));
const FlashSalePage = lazy(() => import('@/pages/flash_sale/FlashSalePage'));
const NotificationPage = lazy(() => import('@/pages/notification/NotificationPage'));
const FavouritePage = lazy(() => import('@/pages/favourite/FavouritePage'));
const ChatListPage = lazy(() => import('@/pages/chat/ChatListPage'));
const ChatPage = lazy(() => import('@/pages/chat/ChatPage'));
const BrandsPage = lazy(() => import('@/pages/brands/BrandsPage'));
const BrandDetailsPage = lazy(() => import('@/pages/brands/BrandDetailsPage'));
const ParcelBookingPage = lazy(() => import('@/pages/parcel/ParcelBookingPage'));
const RentalPage = lazy(() => import('@/pages/rental_module/RentalPage'));
const VerificationPage = lazy(() => import('@/pages/verification/VerificationPage'));
const SupportPage = lazy(() => import('@/pages/support/SupportPage'));
const CmsPage = lazy(() => import('@/pages/html/CmsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/splash" element={<SplashPage />} />
        <Route path="/onboard" element={<OnboardPage />} />

        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/select-module" element={<ModuleSelectPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/stores" element={<StoreListPage />} />
          <Route path="/store/:id" element={<StoreDetailsPage />} />
          <Route path="/item/:id" element={<ItemDetailsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/brands/:id" element={<BrandDetailsPage />} />
          <Route path="/flash-sale" element={<FlashSalePage />} />
          <Route path="/flash-sale/:id" element={<FlashSalePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about-us" element={<CmsPage />} />
          <Route path="/privacy-policy" element={<CmsPage />} />
          <Route path="/terms-and-conditions" element={<CmsPage />} />
          <Route path="/refund-policy" element={<CmsPage />} />
          <Route path="/shipping-policy" element={<CmsPage />} />
          <Route path="/cancellation-policy" element={<CmsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/rental" element={<RentalPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrderListPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/orders/:id/track" element={<OrderTrackPage />} />
            <Route path="/addresses" element={<AddressListPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/loyalty" element={<LoyaltyPage />} />
            <Route path="/refer-and-earn" element={<ReferAndEarnPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/favourites" element={<FavouritePage />} />
            <Route path="/chat" element={<ChatListPage />} />
            <Route path="/chat/:id" element={<ChatPage />} />
            <Route path="/parcel/book" element={<ParcelBookingPage />} />
            <Route path="/verification" element={<VerificationPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
