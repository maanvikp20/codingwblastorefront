# 3D Print Store — Storefront

A student-run e-commerce storefront for a 3D printing shop at **West-MEC North East Campus**. Built by the **Coding program** for the **Advanced Manufacturing program**, it lets customers browse in-stock prints, filter by category and material, and submit custom orders — while giving admins tools to manage the lifecycle of products and orders.

🔗 **Live site:** [codingwblastorefront.vercel.app](https://codingwblastorefront.vercel.app)

---

## Features

- **Product catalog** — Browse prints with sorting (featured, price, name, likes, rating) and filtering by category, price range, material (PLA, PETG, ABS, TPU, Resin), and status (featured, free, top-rated)
- **Product categories** — Figurines, Tools, Home, Jewelry, Art, Mechanical, Educational, Cosplay, and more
- **User authentication** — Register and log in to access personalized features
- **Blog** — Updates and posts from the shop
- **Custom orders** — Submit your own design files for a student-printed turnaround
- **About page** — Overview of the West-MEC Advanced Manufacturing program and certifications

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero image and featured/popular products |
| `/products` | Full product catalog with filters and sorting |
| `/blog` | Blog posts from the shop |
| `/about` | Program info, equipment, and certifications |
| `/orders` | Custom order submission |
| `/auth` | Login and registration |
| `/admin` | Admin panel (protected) |

---

## Admin Panel

Accessible only to authorized users. The admin panel manages the state of models across the platform:

- **Products** — approve, reject, or flag submissions for review
- **Orders** — move custom orders through workflow states (pending → reviewed → approved, etc.)

All state transitions are handled here, keeping the public-facing catalog and order queue clean and curated.

---

## About the Program

This storefront was built by students in the West-MEC **Coding program** as a project for the **Advanced Manufacturing program** — a 2-year, 14-standard curriculum covering:

- AI, machine learning, and robotic process automation
- Electrical systems, hydraulics, pneumatics, and PLCs
- Industrial robotics (Universal Robots, KUKA)
- Sensors, data communication, and Industry 4.0
- Cleanroom simulation (semiconductor/pharma prep)

**Certifications earned:** NC3 (multiple levels), Universal Robots, KUKA CORE

---

## Tech

- Deployed on **Vercel**
- Images served via **Cloudinary**
- Built with **Next.js**

For backend architecture and API details, see [backend.md](./backend.md).

---

## Contact

- **Email:** support@3dprintstore.com
- **Location:** West-MEC North East Campus
- **Hours:** Mon–Fri 9am–5pm · Sat 10am–3pm
