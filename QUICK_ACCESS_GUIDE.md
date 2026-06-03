# 🚀 Quick Access Guide - Dormitory Platform

## After Deployment: How to Open Owner Dashboard

### ✅ Simple 3-Step Process:

1. **Open your deployed website**
   ```
   https://your-domain.com/owner/login
   ```

2. **Login with Owner credentials**:
   - **Email**: `owner@dormy.ph`
   - **Password**: (any password - currently using mock auth)

3. **You're in!** 
   - You'll be automatically redirected to: `/owner/dashboard`
   - Full owner portal access ✅

---

## 📍 All Access URLs

### 🏠 **Tenant Portal** (Public)
```
URL: https://your-domain.com/
No login required for browsing
```

### 🏢 **Owner Dashboard** (Protected)
```
Login: https://your-domain.com/owner/login
Dashboard: https://your-domain.com/owner/dashboard

Credentials:
Email: owner@dormy.ph
Password: (any password)
```

### ⚙️ **Admin Dashboard** (Protected)
```
Login: https://your-domain.com/admin/login
Dashboard: https://your-domain.com/admin/dashboard

Credentials:
Email: admin@dormy.ph
Password: (any password)
```

---

## 🧪 Testing Locally (Development)

```bash
# 1. Start server
npm run dev

# 2. Open in browser:
http://localhost:5173/owner/login

# 3. Login with: owner@dormy.ph
# 4. Access: http://localhost:5173/owner/dashboard
```

---

## 🌐 Deploy to Vercel (Easiest)

```bash
# 1. Install Vercel
npm i -g vercel

# 2. Deploy
vercel

# 3. Access your site
https://your-project.vercel.app/owner/login
```

---

## 📝 Quick Reference Table

| What | URL | Credentials |
|------|-----|-------------|
| **Owner Login** | `/owner/login` | owner@dormy.ph |
| **Owner Dashboard** | `/owner/dashboard` | (after login) |
| **Add Property** | `/owner/properties/add` | (after login) |
| **View Properties** | `/owner/properties` | (after login) |
| **View Bookings** | `/owner/bookings` | (after login) |
| **View Tenants** | `/owner/tenants` | (after login) |
| **Settings** | `/owner/settings` | (after login) |

---

## ⚠️ Important Notes

**Current Setup (Mock Auth)**:
- ✅ All features working
- ✅ No real database needed yet
- ✅ Perfect for demo/testing
- ⚠️ Uses localStorage for mock data

**For Production**:
- Need real backend API
- Need database (PostgreSQL/MySQL/MongoDB)
- Need real authentication (JWT/Sessions)
- Need to replace mock auth code

---

## 🎯 That's It!

After deployment, just go to:
```
https://your-domain.com/owner/login
```

Login with `owner@dormy.ph` and you're in the Owner Dashboard! 🎉

---

**Pro Tip**: Bookmark `/owner/login` for quick access!

