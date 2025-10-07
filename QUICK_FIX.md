# Quick Fix - Restart Development Server

The autoprefixer module has been installed, but the running dev server needs to be restarted to pick it up.

## How to Fix:

1. **Stop the current server:**
   - Go to your terminal where `npm run dev` is running
   - Press `Ctrl + C` (or `Cmd + C` on Mac)
   - Wait for the server to stop completely

2. **Restart the server:**
   ```bash
   npm run dev
   ```

3. **Visit localhost:3000**
   - The error should be gone
   - You should see your landing page!

## If Still Having Issues:

Try clearing the Next.js cache:
```bash
# Stop the server first, then:
rm -rf .next
npm run dev
```

Or on Windows:
```bash
rmdir /s .next
npm run dev
```

## Expected Result:

After restart, you should see:
```
✓ Ready in [time]
○ Compiling / ...
✓ Compiled / in [time]
```

Then visit: http://localhost:3000

You'll see your Food Ordering System landing page with:
- Featured restaurants from database
- Dark mode toggle
- Responsive navigation
- Categories section