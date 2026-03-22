# Frontend-Static Architecture Breakdown

## 1) Core Framework & Bundler
- Framework: React 18.3.1 with TypeScript 5.8.3.
- Bundler: Vite 5.4.19.
- React plugin: @vitejs/plugin-react-swc (SWC-based React transform).
- App entry: src/main.tsx mounts src/App.tsx.
- Dev server defaults in Vite config: host ::, port 8080, HMR overlay disabled.
- Additional dev plugin: lovable-tagger, enabled only in development mode.

## 2) Styling Engine
- Tailwind CSS 3.4.17 + PostCSS.
- PostCSS plugins: tailwindcss and autoprefixer.
- Tailwind plugin: tailwindcss-animate.
- Tailwind strategy:
  - class-based dark mode (darkMode: ["class"])
  - CSS variables driven theme tokens (HSL var() pattern)
  - extended tokens for app surfaces and sidebar theme
  - custom accordion keyframes/animations
- Base styles are pulled from src/index.css.

## 3) UI Component Library
- Yes, components.json exists and matches shadcn/ui schema.
- shadcn indicators:
  - schema URL: ui.shadcn.com/schema.json
  - alias map for components, ui, hooks, lib, utils
  - Tailwind config and CSS paths wired to tailwind.config.ts and src/index.css
- Primitive layer: extensive Radix UI usage via @radix-ui/* packages.
- Utility stack: class-variance-authority, clsx, tailwind-merge.

## 4) Icons
- Icon library: lucide-react.
- Used across layout, pages, and shadcn-style ui components.

## 5) Routing
- Router library: react-router-dom 6.30.1.
- Routing setup location: src/App.tsx.
- Pattern: BrowserRouter + Routes/Route with nested layout route.
- Route tree:
  - /
  - /products
  - /products/:id
  - /register
  - /profile
  - /orders
  - /cart
  - /checkout
  - /checkout/complete
  - * (NotFound fallback)
- Shared shell layout is applied via a parent route element (Layout + Outlet pattern).

## 6) State & Data Fetching
- Global app state:
  - Auth state via Context API (AuthProvider), persisted in localStorage key lpa_auth.
  - Cart state via Context API (CartProvider), persisted in localStorage key lpa_cart.
- Data-fetching libraries:
  - @tanstack/react-query is configured globally via QueryClientProvider in App.
  - Current domain hooks (useProducts/useProduct/useCheckout) use React state/effect + service calls directly, not useQuery/useMutation yet.
- Data source behavior:
  - Services are mock-driven (src/services/mockData.ts).
  - Async behavior is simulated with setTimeout-style delays.
  - Checkout currently logs a transaction payload and returns a generated mock order id.

## 7) Path Aliases
- Alias is configured as @/* -> ./src/*.
- Present in TypeScript config and Vite resolve.alias:
  - tsconfig.json + tsconfig.app.json (paths)
  - vite.config.ts (@ resolves to ./src)
- Imported throughout codebase as @/...

## 8) Notes For Environment Replication
- Keep these core packages aligned for a faithful migration:
  - react, react-dom, react-router-dom
  - vite, @vitejs/plugin-react-swc, typescript
  - tailwindcss, postcss, autoprefixer, tailwindcss-animate
  - @tanstack/react-query
  - shadcn-compatible setup (components.json, aliasing, tailwind tokens)
  - @radix-ui/* packages and lucide-react
- Preserve tsconfig aliasing and Vite alias parity to avoid import breaks.
- Preserve Context + localStorage behavior if you need migration parity before backend integration.
