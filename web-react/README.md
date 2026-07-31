# Noor — Web (React PWA)

React + TypeScript web client for the Noor multi-vendor app (food, grocery,
pharmacy, e-commerce, parcel), talking to the same Laravel API as the
Flutter mobile app in this repo (`baseUrl` in `lib/util/app_constants.dart`).
Installable as a Progressive Web App (offline shell, add-to-home-screen).

## Stack

- Vite + React 18 + TypeScript
- React Router v6 (routing)
- Redux Toolkit (auth/cart/module/address/ui state)
- TanStack Query (server state / caching for all API calls)
- Axios (API client — mirrors headers from `lib/api/api_client.dart`: zone id,
  module id, `X-localization`, lat/lng, bearer token)
- Firebase Auth (Google / Facebook / Apple sign-in)
- react-i18next (fr / en / ar, fr is default to match the Senegal market)
- Tailwind CSS
- vite-plugin-pwa (service worker, manifest, offline shell, install prompt)

## Getting started

```bash
cd web-react
cp .env.example .env      # fill in the values below
npm install
npm run dev                # http://localhost:5173
```

### Required environment variables (`.env`)

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Laravel API base URL (defaults to the same one the Flutter app uses: `https://admin.marcheocass.com`) |
| `VITE_GOOGLE_MAPS_API_KEY` | Places autocomplete / geocoding for the address picker |
| `VITE_FIREBASE_*` | **Web** app config from the Firebase console — a *separate* app registration from the existing Android (`google-services.json`) / iOS (`GoogleService-Info.plist`) ones, needed to enable Google/Facebook/Apple login |
| `VITE_FACEBOOK_APP_ID` | Facebook JS SDK app id (used by Firebase's FacebookAuthProvider flow) |
| `VITE_PUSHER_APP_KEY` / `VITE_PUSHER_CLUSTER` | Realtime order/chat updates (not yet wired — see Known gaps) |

Without Firebase env vars set, social login buttons will show a clear error
toast instead of silently failing; email/phone + password auth works out of
the box against the live API.

## Scripts

```bash
npm run dev        # dev server
npm run build       # type-check (tsc -b) + production build to dist/
npm run preview     # serve the production build locally
npm run lint        # eslint
```

## Structure

```
src/
  api/           axios client + one function per backend endpoint
  config/        constants mirroring app_constants.dart (endpoints, storage keys, modules)
  store/         Redux Toolkit slices (auth, cart, module, address, ui)
  firebase/      Firebase app init + social sign-in helpers
  i18n/          react-i18next setup + fr/en/ar locale files
  hooks/         useAuth, useCart, useAddToCart, useGeolocation, useInstallPrompt, ...
  components/    shared UI (layout: Header/Footer/BottomNav; common: cards, loaders, ...)
  pages/         one folder per feature module (auth, home, store, item, cart,
                 checkout, order, wallet, loyalty, chat, parcel, ...), mirroring
                 lib/features/ in the Flutter app
  App.tsx        route table (lazy-loaded pages)
```

## Feature coverage

Full navigable coverage of the Flutter app's modules. Core commerce (auth,
module select, home, categories, stores, item details, search, cart,
checkout, coupons, orders + tracking, addresses, profile) is fully wired to
the live API. Secondary modules (wallet, loyalty, refer & earn, flash sale,
chat, notifications, favourites, brands, parcel booking, verification,
support/CMS pages) are functional but simpler than their Flutter
counterparts. The vehicle-rental / ride-hailing module (`rental` in the API)
is a placeholder page — it needs live map tracking and trip booking that
depend on the Google Maps key above; wire it up once that key is available.

## PWA

- `vite-plugin-pwa` (`generateSW` mode) precaches the app shell + static
  assets, and uses `NetworkFirst` for `/api/*` calls and `CacheFirst` for
  images.
- `navigateFallback` points at `index.html` so client-side routes work when
  the shell is served from cache (standard SPA offline pattern) — the app
  itself still degrades gracefully to empty-state screens when a specific
  API call has no network and no cache entry.
- `public/offline.html` is a minimal static fallback page, not currently
  wired into the service worker's routing (would need a custom
  `injectManifest` strategy to show it only for uncached navigations while
  keeping the SPA fallback for everything else — worth adding if genuinely
  offline-first behavior becomes a priority).
- An install button appears in the header automatically once the browser
  fires `beforeinstallprompt` (desktop Chrome/Edge, Android Chrome). iOS
  Safari has no install prompt API — users add to home screen manually via
  the share sheet.
- Icons are in `public/icons/` (192/512, plus maskable variants for
  Android's adaptive icon masking).

## Known gaps / follow-ups

- Realtime order status + chat currently poll (`refetchInterval`) instead of
  using Pusher/websockets like the Flutter app (`dart_pusher_channels`).
- Google Maps address picker (autocomplete, pin-drop, geocoding) is stubbed
  behind the existing `/api/v1/config/place-api-*` endpoints but has no map
  UI yet — add `@react-google-maps/api` once `VITE_GOOGLE_MAPS_API_KEY` is set.
- Online payment gateway redirect/iframe flow (PayDunya-style flows, per
  `payInWevView`/`useReactWebsite` in `app_constants.dart`) isn't implemented;
  `digital_payment` is selectable at checkout but the mutation doesn't yet
  handle the gateway redirect step.
- Vehicle rental / ride-hailing (`rental_module`) is a placeholder.
