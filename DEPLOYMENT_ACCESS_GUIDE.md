# Deployment & Access Guide

## 🚀 How to Access Different Portals After Deployment

This guide explains how to access the **Tenant Portal**, **Owner Dashboard**, and **Admin Dashboard** after deploying the Dormitory Platform.

---

## 📍 Portal URLs

After deployment, your platform will have these main access points:

### 1. **Tenant Portal** (Default)
- **URL**: `https://your-domain.com/`
- **Who**: Students looking for accommodation
- **Access**: Public (no login required for browsing)

### 2. **Owner Dashboard**
- **URL**: `https://your-domain.com/owner` or `https://your-domain.com/owner/dashboard`
- **Who**: Property owners/landlords
- **Access**: Requires Owner login

### 3. **Admin Dashboard**
- **URL**: `https://your-domain.com/admin` or `https://your-domain.com/admin/dashboard`
- **Who**: Platform administrators
- **Access**: Requires Admin login

---

## 🔐 How to Login as Owner (Development/Testing)

Currently, the platform uses **mock authentication** for development. Here's how to access the Owner Dashboard:

### **Method 1: Direct Login (Recommended)**

1. **Navigate to Owner Login Page**:
   ```
   https://your-domain.com/owner/login
   ```

2. **Use Mock Owner Credentials**:
   - **Email**: `owner@dormy.ph`
   - **Password**: Any password (mock auth accepts any)
   - The system will automatically log you in as an Owner

3. **You'll be redirected to**:
   ```
   https://your-domain.com/owner/dashboard
   ```

### **Method 2: From Homepage**

1. Go to homepage: `https://your-domain.com/`
2. Click "Login" or "Sign In" button
3. Look for "Login as Owner" or switch to Owner login
4. Enter owner credentials
5. System redirects to Owner Dashboard

---

## 🔐 How to Login as Admin (Development/Testing)

### **Method 1: Direct Login (Recommended)**

1. **Navigate to Admin Login Page**:
   ```
   https://your-domain.com/admin/login
   ```

2. **Use Mock Admin Credentials**:
   - **Email**: `admin@dormy.ph`
   - **Password**: Any password (mock auth accepts any)
   - The system will automatically log you in as an Admin

3. **You'll be redirected to**:
   ```
   https://your-domain.com/admin/dashboard
   ```

---

## 👤 Mock User Accounts (Current Setup)

The platform currently has 3 mock user accounts for testing:

### **1. Tenant Account**
```javascript
Email: tenant@dormy.ph
Password: (any password)
Role: Tenant
Access: Tenant Portal, Browse, Book, etc.
```

### **2. Owner Account**
```javascript
Email: owner@dormy.ph
Password: (any password)
Role: Owner
Access: Owner Dashboard, Property Management, etc.
```

### **3. Admin Account**
```javascript
Email: admin@dormy.ph
Password: (any password)
Role: Admin
Access: Admin Dashboard, User Management, etc.
```

---

## 🛠️ For Production: Backend Integration Required

### Current State (Mock Auth)
- ✅ Frontend is 100% complete
- ✅ All UI and features working
- ⚠️ Using mock authentication (localStorage)
- ⚠️ No real database

### What You Need for Production:

1. **Backend API Server**
   - Authentication endpoints
   - User management
   - Property management
   - Booking system
   - Payment processing

2. **Database**
   - PostgreSQL, MySQL, or MongoDB
   - User accounts
   - Property listings
   - Bookings
   - Transactions

3. **Authentication System**
   - JWT tokens or Sessions
   - Password hashing (bcrypt)
   - Role-based access control (RBAC)
   - OAuth (optional - Google/Facebook)

4. **Replace Mock Authentication**

**Current Code** (`src/app/providers/AuthProvider.jsx`):
```javascript
// Mock login - line 82-103
const login = async (email, password, role = ROLES.TENANT) => {
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data
  let mockUser;
  if (role === ROLES.OWNER) {
    mockUser = MOCK_USERS.owner;
  }
  // ... etc
};
```

**Replace with Real API**:
```javascript
const login = async (email, password, role = ROLES.TENANT) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('dormy_token', data.token);
      localStorage.setItem('dormy_user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
    }
    
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

---

## 📱 Access Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                    Homepage                         │
│              (your-domain.com)                      │
└────────────────┬────────────────────────────────────┘
                 │
                 ├─── Browse as Guest (Public)
                 │
                 ├─── Login Button
                 │       │
                 │       ├─── Tenant Login → Tenant Portal
                 │       │         (tenant@dormy.ph)
                 │       │
                 │       ├─── Owner Login → Owner Dashboard
                 │       │         (owner@dormy.ph)
                 │       │         /owner/dashboard
                 │       │
                 │       └─── Admin Login → Admin Dashboard
                 │                 (admin@dormy.ph)
                 │                 /admin/dashboard
                 │
                 └─── Direct URLs:
                       - /owner/login → Owner Login Page
                       - /admin/login → Admin Login Page
```

---

## 🧪 Testing Locally (Before Deployment)

### 1. Start Development Server

```bash
npm run dev
```

Server will start at: `http://localhost:5173`

### 2. Access Different Portals

**Tenant Portal**:
- URL: `http://localhost:5173/`
- Browse without login

**Owner Dashboard**:
- URL: `http://localhost:5173/owner/login`
- Login with: `owner@dormy.ph`
- Dashboard: `http://localhost:5173/owner/dashboard`

**Admin Dashboard**:
- URL: `http://localhost:5173/admin/login`
- Login with: `admin@dormy.ph`
- Dashboard: `http://localhost:5173/admin/dashboard`

---

## 🌐 Deployment Steps

### 1. Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized files.

### 2. Deploy to Hosting (Choose One)

#### **Option A: Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

Your app will be at: `https://your-project.vercel.app`

#### **Option B: Netlify**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

#### **Option C: GitHub Pages**

1. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/Web-Dormitory/',
  // ... rest of config
});
```

2. Build and deploy:
```bash
npm run build
npx gh-pages -d dist
```

Your app will be at: `https://allendg.github.io/Web-Dormitory/`

### 3. Access After Deployment

Once deployed, access portals using:
- Tenant: `https://your-domain.com/`
- Owner: `https://your-domain.com/owner/login`
- Admin: `https://your-domain.com/admin/login`

---

## 🔑 Creating Real User Accounts (Future)

When you integrate with a real backend, users will:

### **Tenant Registration**:
1. Go to: `/signup`
2. Fill in: Name, Email, Password
3. Role: Automatically set to "Tenant"
4. Verify email (optional)
5. Login and access tenant features

### **Owner Registration**:
1. Go to: `/owner/signup`
2. Fill in: Name, Email, Password, Business Details
3. Role: Set to "Owner"
4. Verify identity (ID, business permits)
5. Admin approves account
6. Login and access owner dashboard

### **Admin Accounts**:
- Created manually by system administrators
- Database insert or admin panel
- Cannot self-register (security)

---

## 🚨 Important Notes

### **Security (Production)**:

1. **Never expose admin credentials**
2. **Use environment variables** for sensitive data
3. **Implement rate limiting** on login endpoints
4. **Enable HTTPS** (SSL certificate)
5. **Add CAPTCHA** to prevent bot attacks
6. **Set up password reset** flow
7. **Enable 2FA** for admin accounts

### **Current State**:
- ✅ All frontend features complete
- ✅ All UI/UX implemented
- ✅ Routing configured
- ⚠️ Mock authentication (development only)
- ⚠️ No real database (needs backend)
- ⚠️ No payment processing (needs gateway)

---

## 📞 Quick Reference

### URLs After Deployment:

| Portal | URL | Login Required |
|--------|-----|---------------|
| Homepage | `/` | No |
| Browse Properties | `/find-rentals` | No |
| Tenant Login | `/login` | - |
| Owner Login | `/owner/login` | - |
| Admin Login | `/admin/login` | - |
| Owner Dashboard | `/owner/dashboard` | Yes (Owner) |
| Admin Dashboard | `/admin/dashboard` | Yes (Admin) |

### Mock Credentials:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Tenant | `tenant@dormy.ph` | Any | Tenant features |
| Owner | `owner@dormy.ph` | Any | Owner dashboard |
| Admin | `admin@dormy.ph` | Any | Admin dashboard |

---

## 🎯 Next Steps

1. **Deploy frontend** (This is ready!)
2. **Test all portals** with mock accounts
3. **Develop backend API** (if not done)
4. **Replace mock auth** with real authentication
5. **Connect database**
6. **Integrate payment gateway**
7. **Production launch** 🚀

---

**Created**: June 3, 2026  
**Status**: Frontend 100% Complete  
**Next**: Backend Integration

For questions or issues, refer to the main README.md or project documentation.

