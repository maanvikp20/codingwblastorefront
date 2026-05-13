AUTH
POST /api/auth/register
POST /api/auth/login
POST /api/auth/reset-password
HEALTH
GET /api/health
PRODUCTS
GET  /api/product
GET  /api/product/random
GET  /api/product/print-of-day
GET  /api/product/by-user?username=seeduser
POST /api/product

GET    /api/product/:id
PATCH  /api/product/:id
DELETE /api/product/:id

POST /api/product/:id/like
POST /api/product/:id/dislike
POST /api/product/:id/comment
DELETE /api/product/:id/comment?commentId=xxx
POST /api/product/:id/report
PATCH /api/product/:id/availability
POST /api/product/:id/donate
ADMIN (requires admin JWT)
GET  /api/admin

GET  /api/admin/products/pending
POST /api/admin/products/:id/review
PATCH /api/admin/products/:id/featured
POST /api/admin/products/:id/print-of-day

GET  /api/admin/reports
PATCH /api/admin/reports/:productId/:reportId

GET  /api/admin/users
PATCH /api/admin/users/:id
BLOG
GET  /api/blog
POST /api/blog

GET    /api/blog/:slug
PATCH  /api/blog/:slug
DELETE /api/blog/:slug
POST   /api/blog/:slug/comment
POST   /api/blog/:slug/like
USER
GET   /api/user
PATCH /api/user
GET   /api/user/recommendations
GET   /api/user/:username
PARTNER
GET  /api/partner
POST /api/partner
GET  /api/partner/:username
SKETCH
GET  /api/sketch
POST /api/sketch
POST /api/sketch/:id/promote
SEARCH
GET /api/search?q=dragon
GET /api/search?q=dragon&type=products
GET /api/search?q=dragon&type=blogs
GET /api/search?q=seeduser&type=users
DONATION
GET /api/donation

Quick test order:

GET /api/health — confirm DB is connected
POST /api/auth/register — create a user
POST /api/auth/login — get your JWT token
GET /api/product/random — confirm seed worked
Everything else using that token in the Authorization: Bearer <token> header