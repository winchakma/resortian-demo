# Resortian — Claude Project Guide

**Resortian** is a premium hotel booking web application for Bangladesh destinations (Cox's Bazar, Sylhet, Sundarbans, Bandarban, etc.). Built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## Tech Stack

| Layer            | Choice                                            |
| ---------------- | ------------------------------------------------- |
| Framework        | Next.js 16.2.3 (App Router)                       |
| Runtime          | React 19.2.4                                      |
| Language         | TypeScript 5                                      |
| Styling          | Tailwind CSS v4 (`@import "tailwindcss"`)         |
| Font             | DM Sans via `next/font/google`                    |
| Icons            | `lucide-react` v1                                 |
| Theming          | `next-themes` (light/dark, attribute `class`)     |
| Forms            | `react-hook-form` + `@hookform/resolvers` + `yup` |
| Notifications    | `react-hot-toast` (bottom-right, 4s duration)     |
| Containerization | Docker + docker-compose                           |

---

## Project Structure

```
resortian/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (DM Sans font, Providers wrapper)
│   ├── page.tsx                # Home page (Server Component)
│   ├── providers.tsx           # Client boundary: ThemeProvider + CartProvider + Toaster
│   ├── globals.css             # Tailwind v4 import + custom theme tokens
│   ├── cart/
│   │   └── page.tsx
│   ├── checkout/
│   │   └── page.tsx
│   └── hotels/
│       └── [slug]/
│           └── page.tsx        # async Server Component, params is Promise<{slug}>
├── sections/                   # Full-page section components (usually Server Components)
│   ├── Header.tsx              # "use client" — sticky nav + cart badge + mobile menu
│   ├── Hero.tsx
│   ├── FeaturedStays.tsx
│   ├── PopularDestinations.tsx
│   ├── WhyChooseUs.tsx
│   ├── GetTheApp.tsx
│   └── Footer.tsx
├── components/
│   └── ui/                     # Reusable UI components
│       ├── BookRoomButton.tsx
│       ├── Button.tsx
│       ├── CartContent.tsx     # "use client"
│       ├── CheckoutContent.tsx # "use client" — react-hook-form + yup
│       ├── DestinationCard.tsx
│       ├── FilterModal.tsx
│       ├── HotelCard.tsx
│       ├── Logo.tsx
│       ├── MobileMenu.tsx
│       ├── ReviewForm.tsx
│       ├── RoomCard.tsx        # "use client" — add to cart
│       ├── SearchForm.tsx      # "use client"
│       ├── SectionHeading.tsx
│       └── ThemeToggle.tsx     # "use client"
├── context/
│   └── CartContext.tsx         # "use client" — cart state + localStorage persistence
├── hooks/
│   └── useSearchForm.ts        # "use client" — search form state
├── types/
│   └── index.ts                # All shared TypeScript interfaces
└── utils/
    └── api.ts                  # Mock async data functions (no real API yet)
```

---

## Core Patterns

### App Router & Server vs. Client Components

- **Default is Server Component** — no directive needed
- Pages in `app/` are Server Components unless they need interactivity
- Dynamic params are `Promise<{slug}>` in Next.js 16 — always `await` them:
  ```tsx
  export default async function HotelDetailsPage({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
    const { slug } = await params;
  ```
- `"use client"` is used when: hooks, event handlers, browser APIs (localStorage), or `useCart`/`useTheme` are needed

### Path Aliases

Always use `@/` for absolute imports. Configured in `tsconfig.json`:

- `@/components/...`, `@/sections/...`, `@/context/...`, `@/hooks/...`, `@/types`, `@/utils/...`

### Theme System

Tailwind v4 syntax (not v3). The config lives entirely in `globals.css`:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-primary-50: #f0fdf4;
  --color-primary-600: #34a853; /* brand green */
  --color-primary-700: #2b8c45;
  /* ... full scale primary-50 → primary-950 */
  --font-sans: var(--font-dm-sans);
}
```

- **Brand color**: `primary-600` = `#34A853` (Google green)
- **Dark mode**: Toggled via `.dark` class on `<html>` (managed by `next-themes`)
- **Default theme**: `light`, with `enableSystem`
- Use `dark:` prefix for dark-mode variants. Avoid hardcoded colors; always use semantic tokens.

### Form Validation Pattern

All forms use `react-hook-form` + `yup`. Reference `CheckoutContent.tsx` as the canonical pattern:

```tsx
"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^01[3-9]\d{8}$/, "Enter a valid phone number")
    .required("Phone is required"),
});

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: yupResolver(schema),
});
```

For Bangladeshi phone numbers, always validate against: `/^01[3-9]\d{8}$/`

### Cart System

- Context: `context/CartContext.tsx` — provides `items`, `addItem`, `removeItem`, `clearCart`, `totalItems`, `totalAmount`
- Persisted to `localStorage` under key `"resortian_cart"`
- Hydration-safe: items are loaded from `localStorage` only after mount (`hydrated` state guard)
- `CartItem` gets a unique `cartId` = `{hotelId}-{roomId}-{Date.now()}`
- Access with `useCart()` hook — throws if used outside `CartProvider`

### Notifications

Use `react-hot-toast` for all user feedback:

```tsx
import toast from "react-hot-toast";

toast.success("Room added to cart!");
toast.error("Something went wrong.");
```

The `<Toaster>` is rendered inside `Providers`. Do NOT add another one.

### Data Layer

All data lives in `utils/api.ts` as mock async functions with artificial delays (`delay()`). Currently there is **no real backend API**. When a real API is connected, these functions will be replaced.

Key functions:

- `getFeaturedStays()` → `Hotel[]`
- `getHotelBySlug(slug)` → `Hotel | null`
- `getHotelReviews(hotelId)` → `Review[]`
- `searchHotels(query)` → `Hotel[]` (filters by location)
- `getPopularDestinations()` → `Destination[]`
- `getNavLinks()`, `getFooterData()`

### Currency

The currency is BDT (Bangladeshi Taka). Always display with `৳` prefix:

```tsx
৳{price.toLocaleString()}
```

---

## Key Type Definitions (`types/index.ts`)

```ts
interface Hotel {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
  description: string;
  amenities: string[];
  rooms: Room[];
}

interface Room {
  id: string;
  hotel_id: number;
  name: string;
  description: string;
  price: number;
  capacity: number;
  image: string;
  view: string;
  size: string;
  amenities: string[];
  badge?: string;
}

interface CartItem {
  cartId: string;
  hotelId: string;
  hotelName: string;
  hotelSlug: string;
  hotelLocation: string;
  roomId: string;
  roomName: string;
  roomImage: string;
  price: number;
  currency: string;
  view: string;
  size: string;
  capacity: number;
}

interface SearchFormData {
  location: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}
```

---

## Styling Conventions

- **Tailwind v4** — config is CSS-only (`globals.css`), no `tailwind.config.js`
- Use `className` with Tailwind utility classes only — no inline `style` unless unavoidable
- Consistent spacing scale: `max-w-7xl`, `px-4 sm:px-6 lg:px-8`, `py-12`
- Card pattern: `rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900`
- Section wrapper: `<section className="py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">...</div></section>`
- Interactive states: always include `transition-colors` and hover variants
- Avoid `style={{}}` for theming — use CSS variables or Tailwind tokens

### Color Usage

| Purpose      | Class                                                                    |
| ------------ | ------------------------------------------------------------------------ |
| Brand / CTA  | `bg-primary-600`, `text-primary-600`                                     |
| Rating stars | `fill-amber-400 text-amber-400`                                          |
| Success      | `#34A853` (toast iconTheme)                                              |
| Error        | `#ef4444` (toast iconTheme)                                              |
| Backgrounds  | `bg-gray-50 dark:bg-gray-950` (page), `bg-white dark:bg-gray-900` (card) |

---

## Component Conventions

### Page Layout Pattern

Every page follows this shell:

```tsx
<>
  <Header />
  <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
    {/* page content */}
  </main>
  <Footer />
</>
```

### Memoization

Use `memo` for sub-components with stable props that are inside frequently re-rendering parents. See `Header.tsx` — `CartIndicator` and `NavLinks` are separate memoized components to prevent re-renders from cart state changes.

### Loading Images

Use `next/image` (`<Image>`) for all images. External images from `images.unsplash.com` are allowed (configured in `next.config.ts`). Always provide `sizes` prop.

### Icons

Import from `lucide-react`. Standard size: `h-4 w-4` or `h-5 w-5`.

---

## Development Commands

```bash
npm run dev     # Start dev server (http://localhost:3000)
npm run build   # Production build
npm run lint    # ESLint check
```

Docker:

```bash
docker-compose up   # Run in container
```

---

## Current Feature Status

| Feature                                                           | Status                                                 |
| ----------------------------------------------------------------- | ------------------------------------------------------ |
| Home page (Hero, FeaturedStays, PopularDestinations, WhyChooseUs) | ✅ Done                                                |
| Hotel detail page (`/hotels/[slug]`)                              | ✅ Done                                                |
| Room selection + cart                                             | ✅ Done                                                |
| Cart page (`/cart`)                                               | ✅ Done                                                |
| Checkout page (`/checkout`) with form validation                  | ✅ Done                                                |
| Review form                                                       | ✅ Basic done                                          |
| Search with filters (`FilterModal`)                               | ✅ Done                                                |
| Dark mode toggle                                                  | ✅ Done                                                |
| Mobile menu                                                       | ✅ Done                                                |
| GetTheApp section                                                 | 🚧 Built but commented out                             |
| Real API backend                                                  | ❌ Not yet — currently all mock data in `utils/api.ts` |
| Auth / User accounts                                              | ❌ Not yet                                             |
| Actual payment gateway                                            | ❌ Not yet                                             |

---

## Important Notes for AI Assistance

1. **Tailwind v4 syntax**: Do NOT use `tailwind.config.js` or v3 plugin syntax. All customization is in `globals.css` using `@theme inline {}`.

2. **React 19**: Use the canonical `use client` / `use server` model. React 19 has stable Server Actions — use them for form submissions where appropriate.

3. **Next.js 16 dynamic params**: `params` in page components is a `Promise<{...}>` — always `await params` before destructuring.

4. **No `pages/` directory**: This project is 100% App Router. Never create files in `pages/`.

5. **Cart is client-only**: The cart uses `localStorage` — never try to read it in Server Components.

6. **Mock data**: All hotel/room data is hardcoded in `utils/api.ts`. Don't try to call an external API — it doesn't exist yet. When adding new hotels or data, add it there.

7. **Form validation**: Always use `react-hook-form` + `yup` for forms. Never use uncontrolled forms or manual `useState` validation patterns.

8. **Section vs Component**: Put full-viewport/full-width page sections in `sections/`. Put reusable/composable pieces in `components/ui/`.
