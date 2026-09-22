# 🌿 EcoCampus — Sustainable Campus Marketplace

**EcoCampus** is a modern full-stack marketplace platform that lets university students share items on campus, reduce waste, and support the student economy.
> React · Node.js · PostgreSQL · JWT · Tailwind CSS · React Native (Expo)

---

## ✨ Features

- 🔒 **Secure Authentication** — Bcrypt password hashing + JWT session management, centralized auth middleware
- 👤 **Register & Login** — Create a new account and sign in from the web
- 📱 **Multi-Platform** — React web dashboard + React Native mobile app
- 🗂️ **Category System** — Listings are organized into categories, with category selection and tag display
- 💚 **Donation System** — Items priced at 0 are automatically marked as donations
- 🖼️ **Image Upload** — Upload images via file picker (JPG/PNG/GIF/WEBP, max 5MB) or provide a URL
- 🔍 **Search, Filtering & Pagination** — Text search, category filter, price range, status filter, sorting, pagination
- 📄 **Product Detail Page** — Modal on web, dedicated screen on mobile; shows image, seller, category, status, description
- ❤️ **Favorites Management** — Add/remove favorites via heart icon on web and mobile; dedicated Favorites tab with instant refresh
- 🏷️ **Product Status** — Active / Reserved / Sold badges, shown on both web and mobile
- 📊 **Dashboard Analytics** — Live tracking of total listings, items for sale, and donation counts
- ✏️ **Listing Editing** — Edit your existing listings and change status, from web or mobile
- 🗑️ **Listing Management** — Create, edit, and delete your own listings (unauthorized actions are rejected server-side)
- 📱 **Full Mobile Support** — Login, registration, listing creation/editing/deletion, image selection from gallery, pull-to-refresh, profile page, auth guard, and secure token management (expo-secure-store), all via Expo. Advanced filtering with a debounced search bar, category/status chips, price range filter, and infinite scroll
- 🛡️ **Security Hardening** — Helmet security headers, general and auth-specific rate limiting (brute-force protection), server-side validation on all inputs, restricted CORS
- ✅ **Comprehensive Tests** — Jest + Supertest on the backend (53 tests), Vitest + Testing Library on web (26 tests), Jest + ts-jest on mobile (20 tests) — 99 tests in total
- 👤 **Profile Page** — User info, membership date, list of own listings, and stats (web + mobile)
- 🗑️ **Account Deletion** — Permanent account deletion with password verification; all of the user's listings and favorites are cascade-deleted (web + mobile)
- 🌙 **Dark Mode** — Follows system preference, persisted via localStorage, manual toggle (on sidebar and auth pages)
- 🎨 **Vintage Paper Theme** — Custom color palette (moss/clay/mustard), tag component, receipt-style auth cards
- ✨ **Animations** — Fade-in/up page transitions, modal scale-in, toast slide-in, hover effects, loading skeletons
- 📱 **Mobile Sidebar** — Slide-out drawer via hamburger menu, mobile header
- 🔤 **Custom Typography** — Archivo (headings), IBM Plex Sans (body), IBM Plex Mono (code) — Google Fonts

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Security | JWT, Bcryptjs, Helmet, express-rate-limit, express-validator |
| Testing & Quality | Jest, Supertest, Vitest, @testing-library/react, ts-jest, ESLint |
| Web Frontend | React 19, Tailwind CSS v3, Axios, Lucide React, Vitest |
| Web Fonts | Google Fonts — Archivo, IBM Plex Sans, IBM Plex Mono |
| Mobile | React Native (Expo), jest, ts-jest, react-test-renderer |
| Build Tool | Vite |
| Image Upload | Multer |

---

## 📁 Project Structure

```
Eco_campus/
├── backend/
│   ├── config/db.js              # PostgreSQL connection (Pool)
│   ├── controllers/
│   │   ├── authController.js     # Register, login, profile, account deletion
│   │   ├── productController.js  # Product CRUD + detail + filtering
│   │   ├── categoryController.js # Category listing
│   │   └── favoriteController.js # Favorite toggle + listing
│   ├── db/
│   │   ├── seed.js               # Demo data (user, category, product)
│   │   └── schema.js             # Reads migration SQL files
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_categories.sql
│   │   ├── 003_create_products.sql
│   │   └── 004_add_product_status.sql  # status column (active/sold/reserved)
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT verification (centralized)
│   │   ├── rateLimiter.js              # General + auth-specific rate limiting
│   │   └── validationMiddleware.js     # Input validation via express-validator
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/*
│   │   ├── productRoutes.js    # /api/products/* (includes Multer upload)
│   │   ├── categoryRoutes.js   # /api/categories
│   │   └── favoriteRoutes.js   # /api/favorites/*
│   ├── tests/
│   │   ├── auth.test.js        # Auth tests (16 tests — register, login, profile, account deletion)
│   │   ├── products.test.js    # Product tests (23 tests)
│   │   ├── categories.test.js  # Category tests (4 tests)
│   │   ├── favorites.test.js   # Favorite tests (10 tests)
│   │   └── helpers/            # Mock DB, seed, auth helpers
│   ├── uploads/                # Uploaded images (served statically)
│   ├── server.js               # Express server (helmet, CORS, rate limiter)
│   ├── setup-db.js             # Database setup via migrations + seed
│   ├── run-migrations.js       # Migration runner (_migrations tracking)
│   └── .env.example
├── web/
│   ├── src/
│   │   ├── context/
│   │   │   └── ThemeContext.jsx        # Dark/light theme management (Context + localStorage)
│   ├── components/
│   │   │   ├── LoginPage.jsx          # Login form (receipt design)
│   │   │   ├── RegisterPage.jsx       # Registration form (receipt design)
│   │   │   ├── Dashboard.jsx          # Main panel + search/filter/pagination + hamburger drawer
│   │   │   ├── ProductForm.jsx        # Add/edit listing (file input + status)
│   │   │   ├── ProductTable.jsx       # Table/card view + tag badge
│   │   │   ├── ProductDetail.jsx      # Product detail modal
│   │   │   ├── StatsCard.jsx          # Stats cards
│   │   │   ├── ProfilePage.jsx        # Profile page
│   │   │   ├── Toast.jsx              # Notification component
│   │   ├── __tests__/             # Component tests (Vitest + Testing Library)
│   │   │   ├── ProductTable.test.jsx
│   │   │   └── ProductDetail.test.jsx
│   │   └── services/
│   │       ├── api.js             # Axios API layer
│   │       └── __tests__/
│   │           └── api.test.js    # API service tests
│   ├── vitest.config.ts
│   ├── test-setup.js
│   └── vite.config.js                 # Backend proxy configuration
├── mobile/
│   ├── app/
│   │   ├── _layout.tsx            # Stack navigator
│   │   ├── login.tsx              # Login screen
│   │   ├── register.tsx           # Registration screen
│   │   ├── detail.tsx             # Product detail screen
│   │   ├── edit-product.tsx       # Edit listing (status + image)
│   │   ├── modal.tsx
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx        # Tab navigator
│   │   │   ├── index.tsx          # Listing feed + search/filter chips + infinite scroll
│   │   │   ├── favorites.tsx      # Favorites tab (pull-to-refresh)
│   │   │   ├── add-product.tsx    # Add listing (pick image from gallery)
│   │   │   └── profile.tsx        # Profile screen
│   │   └── __tests__/             # Component tests
│   │   │   ├── index.test.tsx
│   │   │   ├── detail.test.tsx
│   │   │   └── favorites.test.tsx
│   ├── __mocks__/                 # Jest manual mocks
│   │   ├── axios.ts
│   │   └── expo-constants.ts
│   ├── services/
│   │   ├── __tests__/
│   │   │   └── api.test.ts       # API service tests (16 tests)
│   │   ├── api.ts                 # Axios API layer (FormData support)
│   │   └── auth.ts                # Token management (expo-secure-store)
│   ├── constants/theme.ts         # Eco color palette
│   ├── jest.config.js
│   ├── jest-setup.js
│   ├── tsconfig.jest.json
│   ├── babel.config.js
│   └── metro.config.js                # Metro config required for Expo Router
└── README.md
```

---

## 🚀 Setup

### Requirements
- Node.js 18+
- npm
- Docker (for PostgreSQL) or a local PostgreSQL installation

### 1. Clone the repo

```bash
git clone https://github.com/OsmanBzdmr/Eco_campus
cd Eco_campus
```

### 2. Start PostgreSQL (Docker)

```bash
docker run -d --name ecocampus-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ecocampus -p 5432:5432 postgres:16
```

### 3. Set up the database

```bash
cd backend
cp .env.example .env
npm install
node setup-db.js
```

`setup-db.js` automatically creates the database, tables, and seed data.

> ⚠️ **Important:** `JWT_SECRET` in the `.env` file is required — the server refuses to start for security reasons if it's empty or missing. To generate a strong random value:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```
> Paste the resulting value into the `JWT_SECRET=` line in `.env`.

**Test user:**
- Email: `test@university.edu`
- Password: `test123`

### 4. Start the backend

```bash
node server.js
# http://localhost:5000
```

> 🧪 **Tests (optional):** You can run the automated tests written for all three platforms:
> ```bash
> # Backend (53 tests — auth, products, categories, favorites)
> cd backend && npm test
>
> # Web (26 tests — API services, component rendering)
> cd web && npm test
>
> # Mobile (20 tests — API services, component rendering)
> cd mobile && npm test
> ```

### 5. Start the web dashboard

```bash
cd ../web
npm install
npm run dev
# http://localhost:5173
```

### 6. Start the mobile app

```bash
cd ../mobile
npm install
npx expo start
# Scan the QR code with the Expo Go app
```

> 📱 **Note:** The mobile app opens with a login-first flow. After signing in, you can view listings, filter them, and add a listing by picking an image from the gallery.

#### Mobile connection issues

If your phone and computer are on the same Wi-Fi network but Expo Go still can't connect (`failed to download remote update`, an endless "loading" screen, etc.), the network is most likely applying **AP/client isolation** (common on school, campus, or guest networks). In that case, use tunnel mode:

```bash
npx expo start --tunnel
```

Since tunnel mode requires the backend to be reachable from outside as well, you may need to expose the backend separately with `npx ngrok http 5000` and temporarily point the `getBaseUrl()` function in `mobile/services/api.ts` to that address. On non-isolated networks such as home or office, the standard `npx expo start` (LAN mode) is sufficient.

If you get a `Cannot find module 'babel-preset-expo'` error:
```bash
cd mobile
npm install babel-preset-expo@~54.0.11
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user (rate-limited) | — |
| POST | `/api/auth/login` | Log in, returns a JWT (rate-limited) | — |
| GET | `/api/auth/me` | Logged-in user's profile + stats + listings | ✅ |
| DELETE | `/api/auth/me` | Delete account — requires password verification; all listings and favorites are cascade-deleted | ✅ |
| GET | `/api/categories` | Get categories | — |
| GET | `/api/products` | Get listings (filtering + pagination + sorting) | — |
| GET | `/api/products/:id` | Single product detail (with username + category_name) | — |
| POST | `/api/products` | Create a new listing (image upload via multipart/form-data) | ✅ |
| PUT | `/api/products/:id` | Update a listing — partial update, including status | ✅ |
| DELETE | `/api/products/:id` | Delete a listing (owner only) | ✅ |
| POST | `/api/favorites/:id` | Toggle a favorite (add/remove) | ✅ |
| GET | `/api/favorites` | Get the favorites list | ✅ |

> **GET /api/products** parameters:
> - `search` — text search on title/description
> - `category_id` — category filter
> - `min_price` / `max_price` — price range
> - `status` — status filter (`active`, `sold`, `reserved`)
> - `page` / `limit` — pagination (limit 1–100)
> - `sort` — sort field (`id`, `title`, `price`, `created_at`)
> - `order` — sort direction (`asc`, `desc`)
>
> When pagination is active, the `X-Total-Count`, `X-For-Sale-Count`, `X-Donation-Count`, `X-Page`, `X-Limit`, `X-Total-Pages` response headers are returned.

> **POST/PUT /api/products:** An image file (`image` field) can be sent with `Content-Type: multipart/form-data`. If no file is sent, the `image_url` field is used instead.

---

## ⚙️ Environment Variables

Create `backend/.env` from `.env.example`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecocampus
JWT_SECRET=your_strong_random_value_here
PORT=5000
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=10
```

If `JWT_SECRET` is not set, the server errors out and shuts down on startup. Use the command from the setup step to generate a random value. The `.env` file included with the project ships with a pre-generated strong random value — make sure to regenerate your own for production.

> **For the web app:** A Vite proxy is used (`vite.config.js` → `server.proxy`). `/api/*` requests are automatically forwarded to `http://localhost:5000`.

## 📝 License

MIT License — free to use.
