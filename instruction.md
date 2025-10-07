I want you to act as a senior full-stack web developer and help me build a complete, modern Food Ordering System using the following stack:

## Tech Stack:

Frontend: Next.js 14 (App Router, TypeScript)

UI/UX: Tailwind CSS + shadcn/ui components (modern, responsive design)

Backend: Prisma ORM connected to Neon Postgres

Auth: NextAuth.js (with role-based access for Admin, Restaurant Staff, and Customer)

Deployment: Vercel (Frontend) + Neon (Database)

🧩 Project Overview

Build a complete Food Ordering Platform where customers can browse restaurants, view menus, add items to a cart, and place orders.
Admins can manage restaurants, menu items, and users. Staff can view and manage incoming orders.

🚀 Core Features
👨‍🍳 Public / Customer Side

Landing page (hero section, featured restaurants, categories)

Restaurant listings page

Menu and food item display

Add to cart & checkout system

Order summary & status tracking

Login / Register with email or OAuth

User profile & order history page

🧑‍💼 Admin Side

Dashboard with stats (Total Orders, Revenue, Restaurants, Users)

Manage restaurants (Add / Edit / Delete)

Manage menu items (CRUD)

Manage users & roles

Manage orders (update status: Pending, Preparing, Ready, Delivered)

👩‍🍳 Staff Side

View assigned restaurant orders

Update order statuses

Basic restaurant inventory overview

🗄️ Database Models (Prisma)

Include these main models with relations:

User → id, name, email, password, role

Restaurant → id, name, description, image, ownerId (User)

Category → id, name

MenuItem → id, name, description, price, image, restaurantId, categoryId

Order → id, userId, restaurantId, total, status, createdAt

OrderItem → id, orderId, menuItemId, quantity

Cart (optional, if session-based)

🎨 UI / UX Requirements

Fully responsive using Tailwind and shadcn/ui

Clean dashboard layout (sidebar + main content)

Modal forms for add/edit actions

Toast notifications for success/error

Elegant dark mode support

🔐 Authentication & Authorization

Use NextAuth.js with Credentials + OAuth (Google)

Role-based routes:

/admin/* → Admin only

/staff/* → Staff only

/ /menu /orders → Customer

Protect API routes with middleware

📦 Pages / Routes Structure
/                 → Landing Page
/restaurants      → Restaurant list
/restaurant/[id]  → Restaurant details + Menu
/cart             → Shopping cart
/checkout         → Checkout flow
/orders           → My Orders
/profile          → User profile

/admin
  /dashboard
  /restaurants
  /menu-items
  /orders
  /users

/staff
  /dashboard
  /orders

⚙️ Additional Features

Search and filter restaurants by cuisine or location

Order tracking with real-time updates (using WebSockets or polling)

Admin analytics (charts using Recharts)

Seed script for demo data

Environment variable configuration for Neon + NextAuth

🧰 Deliverables

Complete Next.js project with full folder structure

Prisma schema with migrations ready for Neon

Fully styled UI (Tailwind + shadcn)

Working authentication

CRUD pages for Admin and Staff

Customer ordering flow end-to-end

Optional: integration with Stripe (for future payment feature)

Please:

Scaffold the project structure step-by-step.

Include example Prisma schema.

Show how to configure Neon connection.

Add seed data example.

Build NextAuth setup for roles.

Create example UI components (e.g., RestaurantCard, MenuItemCard).

Implement routing and role protection.

Suggest deployment steps for Neon + Vercel.

Use best practices, TypeScript types, file-based routing (App Router), reusable components, and clean architecture.
Optimize for readability, maintainability, and scalability.