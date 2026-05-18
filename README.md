# API Integration Guide

Next.js monorepo — backend API routes live in `app/api/`, frontend pages/components call them directly.

---

## How It Works

Since this is a monorepo, your frontend and backend are in the same project. You don't need a full URL — just call `/api/...` and Next.js routes it automatically.

```
your-project/
├── app/
│   ├── api/                  ← backend (route handlers)
│   │   ├── blogs/route.js
│   │   ├── auth/login/route.js
│   │   └── ...
│   ├── blogs/page.jsx        ← frontend pages
│   ├── dashboard/page.jsx
│   └── ...
├── components/               ← React components
└── lib/
    └── api.js                ← shared fetch utility  ← start here
```

---

## Step 1 — Create the Fetch Utility

Create `lib/api.js`. This is the only file every component imports for API calls.

```js
// lib/api.js

export async function apiFetch(path, options) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // sends auth cookies automatically
    ...options,
  });

  if (res.status === 401) {
    window.location.href = '/login';
    throw new Error('Unauthenticated');
  }

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Something went wrong');
  }

  return res.json();
}
```

---

## Step 2 — Fetching Data in Components

### In a Next.js Server Component (recommended for pages)

Server components fetch on the server — no loading states needed.

```jsx
// app/blogs/page.jsx
import { cookies } from 'next/headers';

async function getBlogs() {
  const res = await fetch('http://localhost:3000/api/blogs', {
    headers: { Cookie: cookies().toString() }, // forward auth cookies
    cache: 'no-store', // or 'force-cache' if data doesn't change often
  });
  return res.json();
}

export default async function BlogsPage() {
  const { blogs } = await getBlogs();

  return (
    <div>
      {blogs.map(blog => (
        <div key={blog.id}>{blog.title}</div>
      ))}
    </div>
  );
}
```

> **Note:** Use the full URL (`http://localhost:3000/api/...`) in Server Components. The short `/api/...` path only works in the browser (Client Components).

---

### In a React Client Component (for interactive UI)

Add `'use client'` at the top whenever the component needs state, onClick, forms, etc.

```jsx
// components/BlogList.jsx
'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/blogs')
      .then(data => setBlogs(data.blogs))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {blogs.map(blog => (
        <li key={blog.id}>{blog.title}</li>
      ))}
    </ul>
  );
}
```

---

### Reusable useFetch Hook

If you find yourself repeating the pattern above, extract it into a hook:

```js
// hooks/useFetch.js
'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export function useFetch(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(path)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [path]);

  return { data, loading, error };
}
```

```jsx
// usage in any client component
const { data, loading, error } = useFetch(`/blogs/${id}`);
```

---

## Step 3 — Sending Data (POST / PUT / DELETE)

Use `apiFetch` with a method and body for any mutation.

```jsx
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function CreateBlogForm() {
  const [title, setTitle] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const blog = await apiFetch('/blogs', {
        method: 'POST',
        body: JSON.stringify({ title }),
      });
      console.log('Created:', blog);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button type="submit">Create</button>
    </form>
  );
}
```

---

## Auth Routes — `/api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login, sets session cookie |
| `POST` | `/api/auth/register` | Create new account |
| `GET` | `/api/auth/me` | Get current logged-in user |
| `POST` | `/api/auth/logout` | Destroy session |
| `GET` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/auth/password/forgot` | Send password reset email |
| `POST` | `/api/auth/password/reset` | Reset password with token |

```js
// Login
await apiFetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

// Get current user
const user = await apiFetch('/auth/me');

// Logout
await apiFetch('/auth/logout', { method: 'POST' });
```

---

## Blog Routes — `/api/blogs`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/blogs` | List all posts (paginated) |
| `POST` | `/api/blogs` | Create a post |
| `GET` | `/api/blogs/[id]` | Get a single post |
| `PUT` | `/api/blogs/[id]` | Update a post |
| `DELETE` | `/api/blogs/[id]` | Delete a post |
| `POST` | `/api/blogs/[id]/like` | Like / unlike |
| `GET` | `/api/blogs/[id]/reviews` | List reviews |
| `POST` | `/api/blogs/[id]/reviews` | Add a review |

```js
const { blogs } = await apiFetch('/blogs?page=1&limit=10');
const post = await apiFetch(`/blogs/${id}`);

await apiFetch(`/blogs/${id}/like`, { method: 'POST' });

await apiFetch('/blogs', {
  method: 'POST',
  body: JSON.stringify({ title, content }),
});
```

---

## Admin Routes — `/api/admin`

> ⚠️ Requires admin role. Returns `403` if the logged-in user is not an admin.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin` | Dashboard summary |
| `GET` | `/api/admin/featured` | Get featured content |
| `PUT` | `/api/admin/featured` | Update featured content |
| `GET` | `/api/admin/reviews` | All reviews across users |
| `DELETE` | `/api/admin/reviews` | Bulk delete reviews |
| `GET` | `/api/admin/reports` | List reports |
| `GET` | `/api/admin/reports/[id]` | Get a report |
| `DELETE` | `/api/admin/reports/[id]` | Dismiss a report |

```js
const stats = await apiFetch('/admin');
await apiFetch(`/admin/reports/${id}`, { method: 'DELETE' });
```

---

## User Routes — `/api/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/[id]` | Get public profile |
| `GET` | `/api/users/[id]/blogs` | User's blog posts |
| `GET` | `/api/users/[id]/products` | User's products |
| `GET` | `/api/users/[id]/locations` | User's locations |
| `POST` | `/api/users/[id]/locations` | Add a location |
| `PUT` | `/api/users/[id]/locations/[lid]` | Update a location |
| `DELETE` | `/api/users/[id]/locations/[lid]` | Delete a location |

```js
const profile = await apiFetch(`/users/${userId}`);
const blogs   = await apiFetch(`/users/${userId}/blogs`);

await apiFetch(`/users/${userId}/locations`, {
  method: 'POST',
  body: JSON.stringify({ name, lat, lng }),
});
```

---

## Product Routes — `/api/products`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List products (filterable) |
| `POST` | `/api/products` | Create a listing |
| `GET` | `/api/products/[id]` | Get a product |
| `PUT` | `/api/products/[id]` | Update a product |
| `DELETE` | `/api/products/[id]` | Delete a product |
| `POST` | `/api/products/[id]/interact` | Track interaction |
| `POST` | `/api/products/[id]/like` | Like / unlike |
| `POST` | `/api/products/[id]/purchase` | Purchase |
| `POST` | `/api/products/[id]/report` | Report listing |
| `GET` | `/api/products/[id]/reviews` | Get reviews |
| `POST` | `/api/products/[id]/reviews` | Post a review |
| `GET` | `/api/products/random` | Random product |

```js
const items  = await apiFetch('/products?category=electronics&minPrice=10');
const random = await apiFetch('/products/random');

await apiFetch(`/products/${id}/purchase`, {
  method: 'POST',
  body: JSON.stringify({ quantity: 1 }),
});
```

---

## Order Routes — `/api/orders`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | Current user's orders |
| `POST` | `/api/orders` | Create an order |
| `GET` | `/api/orders/[id]` | Order details |
| `GET` | `/api/orders/stats` | Order statistics |
| `POST` | `/api/orders/[id]/dislike` | Flag an order |
| `GET` | `/api/orders/[id]/messages` | Messages on an order |
| `POST` | `/api/orders/[id]/messages` | Send a message |

```js
const orders = await apiFetch('/orders');
const stats  = await apiFetch('/orders/stats');

await apiFetch(`/orders/${orderId}/messages`, {
  method: 'POST',
  body: JSON.stringify({ content: 'When does this ship?' }),
});
```

---

## Donation Routes — `/api/donations`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/donations` | List donations |
| `POST` | `/api/donations` | Create a donation |
| `GET` | `/api/donations/[id]` | Get a donation |

```js
await apiFetch('/donations', {
  method: 'POST',
  body: JSON.stringify({ amount: 10 }),
});
```

---

## Quick Tips

**Dynamic route params** — replace `[id]` with the actual value:
```js
apiFetch(`/blogs/${blogId}`);
apiFetch(`/users/${userId}/locations/${locationId}`);
```

**Server Component vs Client Component:**
- Use **Server Components** (`app/page.jsx` with no `'use client'`) for initial page data loads — faster, no loading spinner needed.
- Use **Client Components** (`'use client'`) for anything interactive: forms, buttons, real-time updates, anything that changes after the page loads.

**Refreshing data after a mutation in Next.js:**
```js
import { useRouter } from 'next/navigation';

const router = useRouter();

async function handleDelete(id) {
  await apiFetch(`/blogs/${id}`, { method: 'DELETE' });
  router.refresh(); // re-fetches server component data on the page
}
```