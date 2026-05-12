# CodingWBla Storefront — TODO

## Core Setup
- [x] Project structure with Next.js App Router
- [x] MongoDB connection (lib/MongoDB.js)
- [x] JWT auth (lib/jwt.js)
- [x] Error handling middleware
- [x] requireAuth / requireAdmin middleware
- [x] Edge middleware (middleware.js) protecting /api/admin/*
- [x] .env.local.example

## Models
- [x] User (roles, partner info, liked/disliked lists)
- [x] Product (comments, availability, reports, crowdfunding, score)
- [x] Review
- [x] Blog (slug, comments, likes)

## Auth — Karam
- [x] Register route
- [x] Login route
- [x] Password reset (request + confirm)
- [ ] Email verification on register

## Products — Karam
- [x] Create / Read / Update / Delete
- [x] Filters (category, tags, material, difficulty, price, availability)
- [x] Random print endpoint
- [x] Print of the Day (auto + admin-set)
- [x] Search by user

## Dislike Algorithm — Maanvik
- [x] Dislike/undislike toggles
- [x] Wilson score lower bound on Product model
- [x] User disliked/liked lists updated
- [x] Recommendation feed excludes disliked categories/tags

## Admin Page — Maanvik
- [x] Dashboard stats
- [x] Approve / reject / flag listings
- [x] Set featured products
- [x] Set print of day
- [x] User management (role change, activate/deactivate)

## Report System — Maanvik / Jose
- [x] Users can report products (with reason enum)
- [x] Admin can view all reports
- [x] Admin can resolve reports (reviewed / dismissed / actioned)

## Comments — Maanvik
- [x] Add comment to product
- [x] Delete comment (owner or admin)
- [x] Soft-delete (marks as [deleted], preserves thread)
- [ ] Reply to comment (sub-document exists, route TODO)

## Availability — Maanvik
- [x] Status field (available / limited / unavailable / preorder)
- [x] Stock count
- [x] Preorder date
- [x] Update availability route (owner or admin)

## Partner Page — Jose
- [x] List approved partners
- [x] Partner profile with their products
- [x] Apply to become a partner
- [ ] Admin approve partner (use PATCH /api/admin/users/[id] with role=partner)

## Blog System — Jose
- [x] Blog model with slug, categories, SEO fields
- [x] List / Get / Create / Update / Delete
- [x] Comments on blog posts
- [x] Like / unlike posts
- [ ] Rich text / markdown rendering (frontend)

## Crowdfunding / Donations — Jose
- [x] Crowdfunding sub-document on Product
- [x] Donate endpoint with Stripe payment intent support
- [x] Goal / raised / backers tracking
- [ ] Stripe webhook to confirm payment (backend TODO)

## Rough Sketches — Jose
- [x] isRoughSketch flag on Product
- [x] Create sketch endpoint
- [x] List sketches endpoint
- [x] Promote sketch → full product

## Search — Karam
- [x] Global full-text search (products + blogs + users)
- [x] Search by user

## Email — Jose
- [x] Nodemailer service
- [x] Password reset emails

## Remaining / Nice-to-Have
- [ ] Comment replies route
- [ ] Stripe webhook handler
- [ ] Image upload route (Cloudinary)
- [ ] Email verification flow
- [ ] Rate limiting on auth routes
- [ ] Frontend pages (Next.js pages/components)
- [ ] Postman collection
