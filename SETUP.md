# Setup Guide - Food Ordering System

Complete step-by-step guide to set up the Food Ordering System on your local machine.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js**: Version 18 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **Git**: For version control ([Download](https://git-scm.com/))
- **Code Editor**: VS Code recommended ([Download](https://code.visualstudio.com/))
- **PostgreSQL Database**: Neon account (free tier available)

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Navigate to project directory
cd food-ordering

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env
# Edit .env with your database credentials

# 4. Initialize database
npm run prisma:push
npm run seed

# 5. Start development server
npm run dev
```

Visit http://localhost:3000 🎉

## 📝 Detailed Setup Steps

### Step 1: Project Setup

The project structure is already created. Here's what you have:

```
food-ordering/
├── app/              # Next.js pages and API routes
├── components/       # React components
├── lib/             # Utilities and configurations
├── prisma/          # Database schema and migrations
├── public/          # Static assets
└── types/           # TypeScript type definitions
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install

# This installs:
# - Next.js 14
# - React 18
# - Prisma ORM
# - NextAuth.js
# - Tailwind CSS
# - shadcn/ui components
# - And more...
```

**Verify installation:**

```bash
npm list --depth=0
```

### Step 3: Database Setup

#### Option A: Using Neon (Recommended)

1. **Create Neon Account**:

   - Visit https://neon.tech
   - Sign up (free tier available)
   - Click "Create a project"

2. **Get Connection String**:

   - In Neon dashboard, find "Connection Details"
   - Copy the connection string
   - It looks like:
     ```
     postgresql://user:pass@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```

3. **Configure Environment**:

   ```bash
   # Create .env file
   cp .env.example .env

   # Edit .env file
   DATABASE_URL="your-neon-connection-string"
   ```

#### Option B: Using Local PostgreSQL

```bash
# Install PostgreSQL locally (if not installed)
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql
# Windows: Download from postgresql.org

# Create database
createdb food_ordering

# Update .env
DATABASE_URL="postgresql://user:password@localhost:5432/food_ordering"
```

### Step 4: Configure NextAuth

Generate a secure secret:

```bash
# Using OpenSSL (Mac/Linux)
openssl rand -base64 32

# Using Node.js (All platforms)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add to `.env`:

```env
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 5: Initialize Database Schema

```bash
# Push schema to database
npm run prisma:push

# Generate Prisma Client
npm run prisma:generate

# Seed with demo data
npm run seed
```

**Expected output:**

```
✓ Prisma schema loaded
✓ Generated Prisma Client
✓ Database seeded successfully
```

### Step 6: Verify Setup

```bash
# Start development server
npm run dev
```

Open http://localhost:3000 and verify:

- [ ] Landing page loads
- [ ] Featured restaurants display
- [ ] Dark mode toggle works
- [ ] Navigation bar appears

### Step 7: Test Authentication

1. **Navigate to Login**:

   - Click "Login" in navigation
   - Or visit http://localhost:3000/login

2. **Use Demo Credentials**:

   ```
   Email: customer@example.com
   Password: password123
   ```

3. **Test Different Roles**:

   ```
   Admin:
   - Email: admin@example.com
   - Password: password123

   Staff:
   - Email: staff@example.com
   - Password: password123
   ```

## 🔧 Optional: Google OAuth Setup

### Step 1: Create Google OAuth Client

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project (or select existing)
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Application type: "Web application"
6. Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

### Step 2: Configure Environment

Add to `.env`:

```env
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Step 3: Test OAuth

1. Restart dev server
2. Go to login page
3. Click "Sign in with Google"
4. Authorize the application

## 📊 Prisma Studio (Database GUI)

Explore your database visually:

```bash
npm run prisma:studio
```

Opens at http://localhost:5555

Features:

- View all tables
- Edit records
- Create new records
- Filter and search

## 🎨 Development Tools

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}
```

### TypeScript

The project uses strict TypeScript:

```bash
# Check types
npx tsc --noEmit

# Or use Next.js build
npm run build
```

## 🐛 Troubleshooting

### Problem: Dependencies fail to install

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: Database connection fails

**Solutions:**

1. **Check DATABASE_URL format:**

   ```env
   # Correct format for Neon:
   postgresql://user:pass@host.neon.tech/db?sslmode=require
   ```

2. **Verify Neon database is active:**

   - Log into Neon dashboard
   - Check if project is running
   - Regenerate password if needed

3. **Test connection:**
   ```bash
   npx prisma db pull
   ```

### Problem: Prisma Client not generated

**Solution:**

```bash
# Manually generate
npx prisma generate

# Or use npm script
npm run prisma:generate
```

### Problem: Seed fails

**Solutions:**

1. **Check database is empty:**

   ```bash
   npx prisma migrate reset
   ```

2. **Manual seed:**

   ```bash
   npx tsx prisma/seed.ts
   ```

3. **Check error messages:**
   - Unique constraint violations?
   - Connection issues?
   - Data format errors?

### Problem: Port 3000 already in use

**Solution:**

```bash
# Use different port
PORT=3001 npm run dev

# Or kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problem: Authentication not working

**Solutions:**

1. **Clear browser data:**

   - Clear cookies
   - Clear local storage
   - Use incognito mode

2. **Verify environment variables:**

   ```bash
   # Check variables are loaded
   echo $NEXTAUTH_SECRET
   echo $NEXTAUTH_URL
   ```

3. **Restart server:**
   ```bash
   # Environment changes require restart
   npm run dev
   ```

### Problem: Images not loading

**Solution:**

Update `next.config.js`:

```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};
```

## 📚 Next Steps

Now that setup is complete:

1. **Explore the codebase:**

   - Review `app/page.tsx` for landing page
   - Check `components/` for reusable components
   - Examine `prisma/schema.prisma` for data models

2. **Read documentation:**

   - [README.md](README.md) - Project overview
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
   - [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture

3. **Start developing:**

   - Add new features
   - Customize styling
   - Implement additional pages

4. **Test thoroughly:**
   - Create test users
   - Place test orders
   - Test different roles

## 🎯 Development Checklist

Before starting development:

- [ ] Dependencies installed
- [ ] Database connected
- [ ] Environment variables configured
- [ ] Database seeded
- [ ] Development server running
- [ ] Authentication tested
- [ ] Prisma Studio accessible
- [ ] VS Code configured

## 💡 Pro Tips

### 1. Use TypeScript Effectively

```typescript
// Define types for better autocomplete
import { Prisma } from "@prisma/client";

type RestaurantWithItems = Prisma.RestaurantGetPayload<{
  include: { menuItems: true };
}>;
```

### 2. Optimize Database Queries

```typescript
// Use select to fetch only needed fields
const restaurants = await prisma.restaurant.findMany({
  select: {
    id: true,
    name: true,
    image: true,
  },
});
```

### 3. Leverage Server Components

```typescript
// app/page.tsx - Runs on server, no client bundle
export default async function Home() {
  const data = await fetchData(); // Direct database access
  return <Component data={data} />;
}
```

### 4. Use Environment Variables Properly

```typescript
// Never expose secrets to client
// ❌ Wrong
const key = process.env.SECRET_KEY;

// ✅ Correct - use in API routes/server components only
```

### 5. Hot Reload Configuration

```bash
# Fast Refresh is enabled by default
# Changes to components reload instantly
# Changes to API routes require manual refresh
```

## 📞 Getting Help

If you encounter issues:

1. **Check documentation:** README.md, this file, DEPLOYMENT.md
2. **Review error messages:** Often contain solutions
3. **Search GitHub issues:** Check Next.js and Prisma repos
4. **Community support:**
   - Next.js Discord
   - Prisma Discord
   - Stack Overflow

## ✅ Setup Complete!

Congratulations! Your development environment is ready.

Start building amazing features! 🚀

---

**Next:** Read [README.md](README.md) for project overview and features.
