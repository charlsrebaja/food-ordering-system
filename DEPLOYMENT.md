# Deployment Guide - Food Ordering System

Complete guide for deploying your Food Ordering System to production.

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub repository
- [ ] Neon PostgreSQL database created
- [ ] Environment variables documented
- [ ] Build tested locally (`npm run build`)
- [ ] Database seeded with initial data

## 🗄️ Database Setup (Neon)

### Step 1: Create Neon Account & Project

1. Visit [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Click "Create a project"
4. Choose your region (closest to users)
5. Name your project (e.g., "food-ordering-prod")

### Step 2: Get Connection String

1. In Neon dashboard, go to your project
2. Navigate to "Connection Details"
3. Copy the connection string
4. Should look like:
   ```
   postgresql://username:password@hostname.neon.tech/database?sslmode=require
   ```

### Step 3: Initialize Database

```bash
# Set DATABASE_URL in your environment
export DATABASE_URL="your-neon-connection-string"

# Push schema to production database
npx prisma db push

# Seed with initial data (optional for production)
npm run seed
```

## 🚀 Vercel Deployment

### Method 1: Vercel Dashboard (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**:
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=your-generated-secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   GOOGLE_CLIENT_ID=your-google-id (optional)
   GOOGLE_CLIENT_SECRET=your-google-secret (optional)
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Visit your live URL

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Adding Environment Variables via CLI

```bash
# Add environment variables
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production

# Add optional OAuth variables
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
```

## 🔐 Environment Variables Reference

### Required Variables

```env
# Database
DATABASE_URL="postgresql://username:password@hostname.neon.tech/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-production-domain.com"
```

### Optional Variables

```env
# Google OAuth (if using)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Generating Secure Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🔧 Post-Deployment Configuration

### 1. Update OAuth Redirect URLs

If using Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to your OAuth client
3. Add authorized redirect URI:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```

### 2. Configure Custom Domain (Optional)

In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` environment variable

### 3. Enable Preview Deployments

Vercel automatically creates preview deployments for:
- Pull requests
- Branch pushes

Configure in Vercel project settings.

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Enable in Vercel Dashboard
2. Go to project → Analytics
3. View performance metrics

### Database Monitoring

Neon provides:
- Connection pooling
- Query performance metrics
- Storage usage
- Automatic backups

Access in Neon dashboard under "Monitoring"

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to:
- `main` branch → Production
- Other branches → Preview deployments
- Pull requests → Preview deployments

### Manual Deployments

```bash
# Deploy specific branch
vercel --prod --branch=your-branch

# Redeploy last deployment
vercel --prod --force
```

## 🐛 Troubleshooting

### Build Failures

**Issue**: Prisma Client not generated
```bash
# Solution: Ensure postinstall script runs
# In package.json:
"scripts": {
  "postinstall": "prisma generate"
}
```

**Issue**: Type errors during build
```bash
# Solution: Check TypeScript configuration
npm run build  # Test locally first
```

### Database Connection Issues

**Issue**: Cannot connect to database
```bash
# Solutions:
# 1. Verify DATABASE_URL is correct
# 2. Check Neon database is active
# 3. Ensure SSL mode is required
# 4. Test connection locally:
npx prisma db pull
```

**Issue**: SSL certificate errors
```bash
# Ensure connection string includes:
?sslmode=require
```

### Authentication Issues

**Issue**: OAuth redirect errors
- Verify redirect URLs in OAuth provider
- Check NEXTAUTH_URL matches deployment URL
- Ensure callback URLs are whitelisted

**Issue**: Session not persisting
- Verify NEXTAUTH_SECRET is set
- Clear browser cookies
- Check domain configuration

### Performance Issues

**Issue**: Slow cold starts
```bash
# Solutions:
# 1. Ensure database connection pooling
# 2. Optimize Prisma queries
# 3. Use Vercel Edge Runtime where possible
```

## 📈 Scaling Considerations

### Database Scaling

Neon offers:
- **Starter**: Free tier (0.5 GiB storage)
- **Pro**: Paid tier (unlimited storage, compute)
- Auto-scaling compute
- Connection pooling

### Application Scaling

Vercel provides:
- Automatic scaling
- Edge network (CDN)
- Serverless functions
- DDoS protection

### Performance Optimization

```javascript
// 1. Enable Next.js Image Optimization
// Already configured in next.config.js

// 2. Use React Server Components
// Default in app/ directory

// 3. Implement caching
export const revalidate = 3600 // Revalidate every hour

// 4. Optimize database queries
// Use select to fetch only needed fields
const restaurants = await prisma.restaurant.findMany({
  select: { id: true, name: true, image: true }
})
```

## 🔒 Security Best Practices

### Environment Variables
- Never commit `.env` files
- Rotate secrets regularly
- Use different secrets for each environment

### Database Security
- Use SSL connections (Neon default)
- Implement rate limiting
- Regular backups (Neon automatic)

### Application Security
- Keep dependencies updated
- Implement CSRF protection (NextAuth default)
- Use proper authentication middleware
- Sanitize user inputs

## 📦 Rollback Procedure

If deployment has issues:

1. **Via Vercel Dashboard**:
   - Go to Deployments
   - Find previous working deployment
   - Click "..." → "Promote to Production"

2. **Via CLI**:
   ```bash
   vercel rollback
   ```

## 🎯 Production Checklist

Before going live:

- [ ] All environment variables set
- [ ] Database migrations completed
- [ ] SSL certificate configured
- [ ] Custom domain configured (if applicable)
- [ ] OAuth providers configured
- [ ] Admin account created
- [ ] Sample data seeded
- [ ] Performance tested
- [ ] Error monitoring enabled
- [ ] Backup strategy confirmed
- [ ] Documentation updated

## 📞 Support Resources

- **Vercel Support**: support@vercel.com
- **Neon Support**: [Neon Discord](https://discord.gg/neon)
- **Next.js Issues**: [GitHub Issues](https://github.com/vercel/next.js/issues)
- **Prisma Issues**: [GitHub Issues](https://github.com/prisma/prisma/issues)

## 🔄 Updates & Maintenance

### Deploying Updates

```bash
# 1. Make changes locally
# 2. Test thoroughly
npm run build
npm run start

# 3. Commit and push
git add .
git commit -m "Description of changes"
git push origin main

# 4. Vercel auto-deploys
```

### Database Migrations

```bash
# For schema changes:
# 1. Update prisma/schema.prisma
# 2. Generate migration
npx prisma migrate dev --name description

# 3. Apply to production
npx prisma migrate deploy
```

### Regular Maintenance

- Weekly: Check error logs
- Monthly: Review performance metrics
- Quarterly: Update dependencies
- As needed: Rotate secrets

---

## 🎉 Congratulations!

Your Food Ordering System is now live in production!

Monitor your deployment and gather user feedback for continuous improvement.