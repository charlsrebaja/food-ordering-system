# Food Ordering System

A modern, full-stack food ordering platform built with Next.js 14, Prisma, NextAuth.js, and Tailwind CSS.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM + PostgreSQL (Neon)
- **Authentication**: NextAuth.js with role-based access
- **State Management**: Zustand
- **Deployment**: Vercel (Frontend) + Neon (Database)

## 📋 Features

### Public/Customer Features
- ✅ Landing page with hero section and featured restaurants
- ✅ Restaurant listings and search
- ✅ Menu browsing with categories
- ✅ Shopping cart functionality
- ✅ Order placement and tracking
- ✅ User authentication (Email + OAuth)
- ✅ Order history
- ✅ User profile management

### Admin Features
- ✅ Dashboard with analytics
- ✅ Restaurant management (CRUD)
- ✅ Menu item management (CRUD)
- ✅ Order management and status updates
- ✅ User management
- ✅ Role-based access control

### Staff Features
- ✅ Staff dashboard
- ✅ Order management for assigned restaurant
- ✅ Order status updates
- ✅ Restaurant inventory overview

## 🛠️ Project Structure

```
food-ordering/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── auth/                 # NextAuth API routes
│   ├── admin/                    # Admin dashboard pages
│   ├── staff/                    # Staff dashboard pages
│   ├── restaurant/               # Restaurant pages
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── navbar.tsx               # Navigation bar
│   ├── footer.tsx               # Footer
│   ├── restaurant-card.tsx      # Restaurant card component
│   ├── menu-item-card.tsx       # Menu item card component
│   └── providers.tsx            # Context providers
├── lib/                         # Utilities and configs
│   ├── auth.ts                  # NextAuth configuration
│   ├── prisma.ts                # Prisma client
│   └── utils.ts                 # Utility functions
├── prisma/                      # Database
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed script
├── types/                       # TypeScript types
│   └── next-auth.d.ts          # NextAuth type extensions
├── middleware.ts                # Route protection middleware
├── .env.example                 # Environment variables template
└── package.json                 # Dependencies
```

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (recommend Neon for serverless)
- Git

### Step 1: Clone and Install

```bash
# Clone the repository (if from git)
git clone <your-repo-url>
cd food-ordering

# Install dependencies
npm install
```

### Step 2: Environment Setup

Create a `.env` file in the root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@hostname/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="generate-a-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 3: Database Setup with Neon

1. **Create Neon Account**: Go to [neon.tech](https://neon.tech) and sign up
2. **Create Project**: Create a new project in Neon dashboard
3. **Get Connection String**: Copy the connection string from Neon dashboard
4. **Update .env**: Paste the connection string into `DATABASE_URL`

### Step 4: Initialize Database

```bash
# Push schema to database
npm run prisma:push

# Generate Prisma Client
npm run prisma:generate

# Seed database with demo data
npm run seed
```

### Step 5: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Core Models

**User**
- Stores user information with role-based access (ADMIN, STAFF, CUSTOMER)
- Handles authentication credentials

**Restaurant**
- Restaurant information and metadata
- Linked to owner (User) and menu items

**Category**
- Food categories for organization
- Used for filtering and browsing

**MenuItem**
- Individual food items with pricing
- Linked to restaurant and category

**Order**
- Customer orders with status tracking
- Includes order items and total

**OrderItem**
- Line items within an order
- Tracks quantity and price

**CartItem**
- Shopping cart functionality
- User-specific cart items

## 🔐 Authentication

The system uses NextAuth.js with multiple authentication strategies:

### Providers
1. **Credentials Provider**: Email/password authentication
2. **Google OAuth**: Social login (optional)

### User Roles
- **ADMIN**: Full system access
- **STAFF**: Restaurant and order management
- **CUSTOMER**: Browse, order, and track

### Protected Routes
Routes are protected using middleware:
- `/admin/*` - Admin only
- `/staff/*` - Staff and Admin only
- `/profile/*`, `/orders/*`, `/checkout/*` - Authenticated users

## 🔑 Demo Credentials

After running the seed script, use these credentials:

```
Admin:
Email: admin@example.com
Password: password123

Staff:
Email: staff@example.com
Password: password123

Customer:
Email: customer@example.com
Password: password123
```

## 🎨 UI Components

Built with shadcn/ui for consistent, accessible components:

- Button, Card, Input, Label
- Toast notifications
- Dialog modals
- Dropdown menus
- Tabs, Separators
- Badge, Avatar

## 📱 Features Implementation Status

### ✅ Completed
- Project structure and configuration
- Database schema and migrations
- Authentication system with NextAuth
- Seed data for testing
- Landing page
- Navbar and Footer
- Restaurant and menu item cards
- UI component library
- Dark mode support

### 🚧 To Be Implemented
- Restaurants listing page
- Individual restaurant/menu page
- Shopping cart page and API
- Checkout flow
- Order history page
- User profile page
- Admin dashboard with analytics
- Admin CRUD operations (restaurants, menu items, users)
- Staff dashboard
- Staff order management
- Search and filter functionality
- Order real-time updates
- Payment integration (Stripe)

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**: Push your code to a GitHub repository

2. **Import to Vercel**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)
   - `GOOGLE_CLIENT_ID` (if using OAuth)
   - `GOOGLE_CLIENT_SECRET` (if using OAuth)

4. **Run Database Migrations**:
   ```bash
   # In Vercel dashboard, add build command
   npm run prisma:generate && npm run build
   ```

### Neon Database (Production)

Your Neon database is already production-ready:
- Auto-scaling
- Automatic backups
- SSL enabled by default
- No manual maintenance required

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema to database
npm run prisma:studio    # Open Prisma Studio
npm run seed             # Seed database

# Linting
npm run lint         # Run ESLint
```

## 🛠️ Development Workflow

### Adding New Features

1. **Database Changes**:
   ```bash
   # Update prisma/schema.prisma
   npm run prisma:push
   npm run prisma:generate
   ```

2. **Create API Routes**: Add to `app/api/`

3. **Create Pages**: Add to appropriate `app/` directory

4. **Add Components**: Create in `components/`

### Best Practices

- Use TypeScript for type safety
- Follow the App Router conventions
- Use server components by default
- Add "use client" only when needed
- Implement proper error handling
- Use loading and error boundaries

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Neon Documentation](https://neon.tech/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**:
- Verify `DATABASE_URL` in `.env`
- Check Neon database status
- Ensure SSL mode is enabled

**Authentication Not Working**:
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies

**Build Errors**:
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review Next.js and Prisma docs

---

Built with ❤️ using Next.js 14 and modern web technologies