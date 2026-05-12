# CodingWBla Storefront — 3D Print Store

A full-stack Next.js 15 / React 19 marketplace for 3D prints, built for the West-MEC program.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Email | Nodemailer |
| Payments | Stripe |
| File Storage | Cloudinary |

---

## Quick Start

```bash
npm install
cp .env.local.example .env.local   # fill in your secrets
npm run dev
```

---

## File Structure

```
codingwblastorefront/
├── app/api/
│   ├── auth/
│   │   ├── login/route.js          POST — login
│   │   ├── register/route.js       POST — register
│   │   └── reset-password/route.js POST — request/confirm password reset
│   ├── health/route.js             GET  — DB health check
│   │
│   ├── product/
│   │   ├── route.js                GET (filters) / POST (create)
│   │   ├── random/route.js         GET  — random product
│   │   ├── print-of-day/route.js   GET  — print of the day
│   │   ├── by-user/route.js        GET  — search products by username
│   │   └── [id]/
│   │       ├── route.js            GET / PATCH / DELETE
│   │       ├── like/route.js       POST — like/unlike
│   │       ├── dislike/route.js    POST — dislike/undislike (score algorithm)
│   │       ├── comment/route.js    POST / DELETE — comments
│   │       ├── report/route.js     POST — report product
│   │       ├── availability/route.js PATCH — update availability
│   │       └── donate/route.js     POST — donate/back crowdfunding
│   │
│   ├── admin/
│   │   ├── route.js                GET  — dashboard stats
│   │   ├── products/
│   │   │   ├── pending/route.js    GET  — pending approval queue
│   │   │   └── [id]/
│   │   │       ├── review/route.js       POST — approve/reject/flag
│   │   │       ├── featured/route.js     PATCH — set featured
│   │   │       └── print-of-day/route.js POST — set print of day
│   │   ├── reports/
│   │   │   ├── route.js                        GET — all reports
│   │   │   └── [productId]/[reportId]/route.js PATCH — resolve report
│   │   └── users/
│   │       ├── route.js            GET  — list/search users
│   │       └── [id]/route.js       PATCH — change role / toggle active
│   │
│   ├── blog/
│   │   ├── route.js                GET / POST
│   │   └── [slug]/
│   │       ├── route.js            GET / PATCH / DELETE
│   │       ├── comment/route.js    POST — add comment
│   │       └── like/route.js       POST — like/unlike
│   │
│   ├── user/
│   │   ├── route.js                GET (me) / PATCH (update profile)
│   │   ├── recommendations/route.js GET — personalised feed
│   │   └── [username]/route.js     GET — public profile
│   │
│   ├── partner/
│   │   ├── route.js                GET (list) / POST (apply)
│   │   └── [username]/route.js     GET — partner profile + products
│   │
│   ├── sketch/
│   │   ├── route.js                GET (list) / POST (create)
│   │   └── [id]/promote/route.js   POST — promote sketch to full product
│   │
│   ├── search/route.js             GET — global full-text search
│   └── donation/route.js           GET — user donation history
│
├── controllers/
│   ├── authController.js           register, login, getMe
│   ├── productController.js        CRUD, random, dislike algo, filters,
│   │                               print-of-day, comments, reports,
│   │                               availability, donations, search-by-user
│   ├── adminController.js          dashboard, approval, featured,
│   │                               print-of-day, reports, user management
│   ├── userController.js           profile, update, recommendations
│   ├── blogController.js           CRUD, comments, likes
│   ├── partnerController.js        list, profile, apply, approve
│   └── sketchController.js        create, list, promote
│
├── models/
│   ├── User.js       — auth, roles, liked/disliked lists, partner info
│   ├── Product.js    — full listing with comments, reports, availability,
│   │                   crowdfunding, like/dislike score (Wilson lower bound)
│   ├── Review.js     — per-product star reviews
│   └── Blog.js       — posts with slug, comments, likes
│
├── middleware/
│   ├── errorHandling.js  withErrorHandling HOC + ApiError class
│   ├── requireAuth.js    JWT extraction + requireAuth HOC
│   └── requireAdmin.js   requireAdmin HOC
│
├── middleware.js     Next.js Edge Middleware — fast admin route guard
│
├── lib/
│   ├── MongoDB.js    cached Mongoose connection
│   └── jwt.js        signToken / verifyToken / decodeToken
│
├── services/
│   ├── authService.js    password reset emails
│   └── emailService.js   Nodemailer wrapper
│
└── utils/
    ├── validators.js     input validation helpers
    ├── formatResponse.js success/error/paginate helpers
    └── signToken.js      re-export shim
```

---

## Feature Map → Implementation

| Feature | Where |
|---------|-------|
| Random print | `GET /api/product/random` |
| Dislike algorithm | `POST /api/product/[id]/dislike` — Wilson score, updates user preferences |
| Filters | `GET /api/product?category=&tags=&difficulty=&minPrice=&...` |
| Print of the day | `GET /api/product/print-of-day` — auto-selects by score if not set |
| Admin approve listings | `POST /api/admin/products/[id]/review` |
| Admin set featured | `PATCH /api/admin/products/[id]/featured` |
| Admin set print of day | `POST /api/admin/products/[id]/print-of-day` |
| Report system | `POST /api/product/[id]/report` + admin resolve |
| Comments | `POST/DELETE /api/product/[id]/comment` |
| Availability | `PATCH /api/product/[id]/availability` |
| Partner page | `GET /api/partner` + `GET /api/partner/[username]` |
| Blog system | `GET/POST /api/blog` + full CRUD per slug |
| Crowdfunding/donations | `POST /api/product/[id]/donate` |
| Search by user | `GET /api/product/by-user?username=xxx` |
| Rough sketches | `GET/POST /api/sketch` + `/promote` |
| Recommendations | `GET /api/user/recommendations` (dislike-aware) |

---

## Team Assignments (from todo.md)

- **Maanvik** — dislike algorithm, admin page, report system, comments, availability
- **Karam** — controllers, routes, filters, search by user
- **Jose** — MongoDB middleware, partner page, blog, crowdfunding/donations, rough sketches