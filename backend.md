# 3D Print Marketplace — API & Frontend Integration Guide

## Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [Auth](#auth)
4. [API Reference](#api-reference)
   - [Users](#users)
   - [Products](#products)
   - [Reviews](#reviews)
   - [Blogs](#blogs)
   - [Custom Orders](#custom-orders)
   - [Bulk Orders](#bulk-orders)
   - [Reports](#reports)
   - [Donations](#donations)
5. [Frontend Integration (Next.js)](#frontend-integration-nextjs)
   - [API Client Setup](#api-client-setup)
   - [Auth Hook](#auth-hook)
   - [Example: Fetching Products](#example-fetching-products)
   - [Example: Submitting a Review](#example-submitting-a-review)
   - [Example: Creating a Custom Order](#example-creating-a-custom-order)
   - [Example: Blog Pages](#example-blog-pages)
6. [Roles & Permissions](#roles--permissions)
7. [Seeding the Database](#seeding-the-database)
8. [Test Accounts](#test-accounts)
9. [Error Handling](#error-handling)

---

## Project Overview

A Next.js full-stack marketplace for 3D printable models. Users can browse and purchase models, leave reviews, submit custom print orders, read blogs, and donate. Admins manage products, blogs, and reports.

**Stack:** Next.js App Router · MongoDB · Mongoose · JWT auth

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in values
cp .env.example .env

# 3. Required env vars
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_here

# 4. Seed the database
node seed.js

# 5. Run dev server
npm run dev
```

---

## Auth

All protected routes require a JWT passed as a Bearer token in the `Authorization` header.

```
Authorization: Bearer <token>
```

### Login

```
POST /api/auth/login
```

**Body:**
```json
{
  "email": "alice@marketplace.dev",
  "password": "Alice1234!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "_id": "...", "name": "Alice Student", "role": "customer" }
}
```

### Register

```
POST /api/auth/register
```

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Secret1234!"
}
```

---

## API Reference

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/me` | ✅ Any | Get own profile |
| PATCH | `/api/users/me` | ✅ Any | Update own profile |
| GET | `/api/users` | ✅ Admin | List all users |
| PATCH | `/api/users/:id` | ✅ Admin | Update any user |
| DELETE | `/api/users/:id` | ✅ Admin | Delete user |

---

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | ❌ | List approved products (paginated) |
| GET | `/api/products/:id` | ❌ | Get single product |
| POST | `/api/products` | ✅ Any | Upload a new product |
| PATCH | `/api/products/:id` | ✅ Owner/Admin | Update product |
| DELETE | `/api/products/:id` | ✅ Owner/Admin | Delete product |
| POST | `/api/products/:id/like` | ✅ Any | Like/unlike a product |
| PATCH | `/api/products/:id/approve` | ✅ Admin | Approve product |
| PATCH | `/api/products/:id/reject` | ✅ Admin | Reject product |

**Query params for GET `/api/products`:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `category` | string | Filter by category |
| `search` | string | Full-text search |
| `featured` | boolean | Featured only |

**Product categories:** `figurines` · `tools` · `home` · `jewelry` · `art` · `mechanical` · `educational` · `cosplay` · `other`

---

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products/:id/reviews` | ❌ | Get all reviews for a product |
| POST | `/api/products/:id/reviews` | ✅ Any | Add a review (one per user per product) |

**POST body:**
```json
{
  "rating": 5,
  "title": "Amazing print",
  "body": "Came out perfect on first try."
}
```

> **Note:** One review per user per product is enforced. Attempting a second review returns `400 Already reviewed`.

---

### Blogs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/blogs` | ❌ | List published blogs (paginated) |
| GET | `/api/blogs/:id` | ❌ | Get single blog (increments views) |
| POST | `/api/blogs` | ✅ Admin | Create blog post |
| PATCH | `/api/blogs/:id` | ✅ Admin | Update blog post |
| DELETE | `/api/blogs/:id` | ✅ Admin | Delete blog post |
| POST | `/api/blogs/:id/like` | ✅ Any | Like/unlike a blog |

**POST/PATCH body:**
```json
{
  "title": "My Post",
  "content": "Full post content here...",
  "excerpt": "Short summary shown in listings.",
  "category": "guides",
  "tags": ["fdm", "beginner"],
  "status": "published",
  "coverImage": "https://..."
}
```

> **Note:** `content` is the required field (not `body`). Setting `status: "published"` auto-sets `publishedAt`.

**Query params for GET `/api/blogs`:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `search` | string | Full-text search |
| `category` | string | Filter by category |

---

### Custom Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | ✅ Any | Submit a custom order |
| GET | `/api/orders` | ✅ Any | Get own orders |
| POST | `/api/orders/:id/messages` | ✅ Owner/Admin | Add message to order |

**POST `/api/orders` body:**
```json
{
  "orderType": "custom_part",
  "description": "Mounting bracket for 52mm motor",
  "sketchUrl": "https://files.example.com/sketch.png"
}
```

**Order types:** `custom_sketch` · `custom_part` · `bulk_order`

**Order statuses:** `submitted` → `in_discussion` → `approved` → `printing` → `completed` · `cancelled`

> **Note:** When an admin replies to an order with status `submitted`, it automatically moves to `in_discussion`.

---

### Bulk Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders/bulk` | ✅ Any | Submit a bulk manufacturing request |

**POST body:**
```json
{
  "description": "Cable management clips for office fitout",
  "expectedUnits": 1000,
  "filamentType": "PETG",
  "deliveryDeadline": "2025-09-01"
}
```

**Response includes `discountMultiplier`:**
- `partner` role → `0.85` (15% discount)
- all others → `1.0`

---

### Reports

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/products/:id/report` | ✅ Any | Report a product |
| GET | `/api/reports` | ✅ Admin | List all reports |
| PATCH | `/api/reports/:id` | ✅ Admin | Update report status |

**POST body:**
```json
{
  "category": "copyright",
  "details": "This appears to be copied from Thingiverse."
}
```

---

### Donations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/donations` | ❌ | Submit a donation (anonymous ok) |
| GET | `/api/donations` | ✅ Admin | List all donations |

**POST body:**
```json
{
  "donationType": "funds",
  "amount": 50,
  "message": "Keep it up!"
}
```

```json
{
  "donationType": "resources",
  "resourceDetails": "2x 1kg spools of PLA (black)",
  "message": "Dropping off Tuesday"
}
```

---

## Frontend Integration (Next.js)

### API Client Setup

Create `lib/api.js` — a thin fetch wrapper that auto-attaches the JWT and handles errors consistently.

```js
// lib/api.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function request(path, options = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

export const api = {
  get:    (path)         => request(path),
  post:   (path, body)   => request(path, { method: "POST",   body: JSON.stringify(body) }),
  patch:  (path, body)   => request(path, { method: "PATCH",  body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: "DELETE" }),
};
```

---

### Auth Hook

```js
// hooks/useAuth.js
"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/api/users/me")
        .then((data) => setUser(data.user))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    const data = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

**Add to your root layout:**

```jsx
// app/layout.jsx
import { AuthProvider } from "@/hooks/useAuth";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

---

### Example: Fetching Products

**Server Component (recommended for SEO):**

```jsx
// app/products/page.jsx
import { ProductCard } from "@/components/ProductCard";

export default async function ProductsPage({ searchParams }) {
  const params = new URLSearchParams({
    page:     searchParams.page     || "1",
    category: searchParams.category || "",
    search:   searchParams.search   || "",
  });

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?${params}`,
    { next: { revalidate: 60 } } // ISR — revalidate every 60s
  ).then((r) => r.json());

  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {data.products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      {/* pagination using data.page, data.pages */}
    </div>
  );
}
```

**Client Component (when you need interactivity like likes):**

```jsx
"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export function ProductCard({ product }) {
  const [likes, setLikes] = useState(product.likes.length);

  async function handleLike() {
    const data = await api.post(`/api/products/${product._id}/like`);
    setLikes(data.likes);
  }

  return (
    <div>
      <h2>{product.name}</h2>
      <p>${product.price === 0 ? "Free" : product.price}</p>
      <button onClick={handleLike}>❤️ {likes}</button>
    </div>
  );
}
```

---

### Example: Submitting a Review

```jsx
"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export function ReviewForm({ productId }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle]   = useState("");
  const [body, setBody]     = useState("");
  const [error, setError]   = useState(null);
  const [done, setDone]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await api.post(`/api/products/${productId}/reviews`, { rating, title, body });
      setDone(true);
    } catch (err) {
      setError(err.message); // e.g. "Already reviewed"
    }
  }

  if (!user) return <p>Log in to leave a review.</p>;
  if (done)  return <p>Thanks for your review!</p>;

  return (
    <form onSubmit={handleSubmit}>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} stars</option>)}
      </select>
      <input  value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Your review" />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Example: Creating a Custom Order

```jsx
"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export function CustomOrderForm() {
  const [orderType, setOrderType]     = useState("custom_part");
  const [description, setDescription] = useState("");
  const [sketchUrl, setSketchUrl]     = useState("");
  const [success, setSuccess]         = useState(false);
  const [error, setError]             = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/api/orders", { orderType, description, sketchUrl });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (success) return <p>Order submitted! We'll be in touch.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
        <option value="custom_sketch">Custom Sketch</option>
        <option value="custom_part">Custom Part</option>
      </select>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe what you need..."
        required
      />
      <input
        value={sketchUrl}
        onChange={(e) => setSketchUrl(e.target.value)}
        placeholder="Sketch URL (optional)"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Submit Order</button>
    </form>
  );
}
```

---

### Example: Blog Pages

**Blog listing (Server Component):**

```jsx
// app/blogs/page.jsx
export default async function BlogsPage() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, {
    next: { revalidate: 120 },
  }).then((r) => r.json());

  return (
    <div>
      {data.blogs.map((blog) => (
        <div key={blog._id}>
          <h2>{blog.title}</h2>
          <p>{blog.excerpt}</p>
          <a href={`/blogs/${blog._id}`}>Read more</a>
        </div>
      ))}
    </div>
  );
}
```

**Single blog (Server Component with dynamic route):**

```jsx
// app/blogs/[id]/page.jsx
export default async function BlogPage({ params }) {
  // views are auto-incremented server-side on each GET
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${params.id}`,
    { cache: "no-store" } // don't cache — views need to update
  ).then((r) => r.json());

  const { blog } = data;

  return (
    <article>
      <h1>{blog.title}</h1>
      <p>By {blog.author.name} · {blog.views} views</p>
      <div>{blog.content}</div>
    </article>
  );
}
```

---

## Roles & Permissions

| Role | Can Do |
|------|--------|
| `customer` | Browse, purchase, review, like, submit custom orders, donate |
| `partner` | Same as customer + 15% bulk order discount |
| `curator` | Same as customer (extended permissions can be added) |
| `admin` | Everything — manage users, approve/reject products, manage blogs, view reports |

**Checking role in a component:**

```jsx
import { useAuth } from "@/hooks/useAuth";

export function AdminOnly({ children }) {
  const { user } = useAuth();
  if (!user || user.role !== "admin") return null;
  return children;
}
```

---

## Seeding the Database

Always run the seed before running your test suite to reset state:

```bash
node seed.js
```

This will:
- Drop all existing collections (users, products, reviews, blogs, reports, donations, customorders)
- Re-insert all demo data with consistent IDs
- Hash all passwords via bcrypt

> **Important:** The seed wipes everything. Never run it against production.

---

## Test Accounts

| Name | Email | Password | Role |
|------|-------|----------|------|
| Admin User | admin@marketplace.dev | Admin1234! | admin |
| Partner Corp | partner@marketplace.dev | Partner1234! | partner |
| Curator Sam | curator@marketplace.dev | Curator1234! | curator |
| Alice Student | alice@marketplace.dev | Alice1234! | customer |
| Bob Builder | bob@marketplace.dev | Bob1234! | customer |
| Carol Inactive | carol@marketplace.dev | Carol1234! | customer (disabled) |

---

## Error Handling

All API errors follow this shape:

```json
{
  "success": false,
  "error": "Human readable message here"
}
```

Common status codes:

| Code | Meaning |
|------|---------|
| 400 | Bad request / validation failed |
| 401 | Missing or invalid token |
| 403 | Authenticated but not authorized (wrong role) |
| 404 | Resource not found |
| 500 | Server error (check logs) |

**Global error handler in `lib/api.js`** already throws with `data.error` so you can catch it anywhere:

```js
try {
  await api.post("/api/orders", body);
} catch (err) {
  console.error(err.message); // "Order type and description are required"
}
```