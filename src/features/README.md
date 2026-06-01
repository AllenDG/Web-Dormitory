# Features Directory

This directory contains all feature modules for the Dormy application, organized by functionality.

---

## 📁 Directory Structure

### Tenant Features
Features specifically for tenants (students looking for accommodation):

- **`rentals/`** - Property browsing and search
  - FindRentalsPage - 2-column grid layout with map
  - RentalDetailPage - Property details with inquiry modal
  - Components: PropertyGridCard, PropertyListCard, FilterSidebar, SendInquiryModal

- **`appointments/`** - Property visit scheduling
  - ScheduleVisitPage - 3-step wizard for booking visits

- **`favorites/`** - Saved properties
  - FavoritesPage - User's favorite properties list

- **`budget-finder/`** - Budget-based property search
  - Components for budget-based filtering

### Owner Features
Features specifically for property owners:

- **`owner/`** - Property management
  - `dashboard/` - Owner dashboard overview
  - `properties/` - Property CRUD operations
  - `bookings/` - Booking management
  - `tenants/` - Tenant management
  - `settings/` - Owner account settings

### Shared Features
Features accessible to all users:

- **`home/`** - Landing page
  - LandingPage - Main homepage
  - Components: HeroSection, FeaturedListings, CTASection, etc.

- **`about/`** - About Us page
  - AboutPage - Company information

- **`contact/`** - Contact Us page
  - ContactPage - Contact form and information

- **`how-it-works/`** - How It Works page
  - HowItWorksPage - Platform explanation

- **`auth/`** - Authentication
  - LoginPage - Route-based login (tenant/owner)
  - SignUpPage - Route-based signup (tenant/owner)

- **`error/`** - Error pages
  - NotFoundPage - 404 page

---

## 🔄 Import Patterns

### Using Barrel Exports
Each feature folder has an `index.js` barrel export for convenient imports:

```javascript
// ✅ Good - Using barrel exports
import { FindRentalsPage, RentalDetailPage } from '../features/rentals';
import { LoginPage, SignUpPage } from '../features/auth';
import { AboutPage } from '../features/about';

// ❌ Avoid - Direct file imports
import FindRentalsPage from '../features/rentals/FindRentalsPage';
import LoginPage from '../features/auth/LoginPage';
```

### Component Imports
```javascript
// From rentals components
import { 
  PropertyGridCard, 
  PropertyListCard, 
  SendInquiryModal 
} from '../features/rentals/components';

// From home components
import { 
  HeroSection, 
  CTASection 
} from '../features/home/components';
```

---

## 📝 Feature Documentation

### Rentals Feature
**Purpose**: Property browsing and search functionality

**Pages**:
- `FindRentalsPage` - Main search page with 2-column grid and map
- `RentalDetailPage` - Detailed property view with inquiry modal

**Components**:
- `PropertyGridCard` - Grid view property card
- `PropertyListCard` - List view property card (legacy)
- `FilterSidebar` - Advanced filtering sidebar
- `SendInquiryModal` - Quick inquiry modal with templates

**Routes**:
- `/find-rentals` - Search page
- `/listing/:id` - Property details

---

### Appointments Feature
**Purpose**: Property visit scheduling

**Pages**:
- `ScheduleVisitPage` - 3-step wizard for booking visits
  - Step 1: Personal Information
  - Step 2: Date & Time Selection
  - Step 3: Confirmation

**Routes**:
- `/schedule-visit/:propertyId` - Schedule visit

---

### Auth Feature
**Purpose**: User authentication (tenant and owner)

**Pages**:
- `LoginPage` - Route-based login
  - `/login` → Tenant login
  - `/owner/login` → Owner login
- `SignUpPage` - Route-based signup
  - `/signup` → Tenant signup
  - `/owner/signup` → Owner signup

**Features**:
- Auto-detects user type from route
- No radio buttons
- Interactive, minimalist design
- Background decorations
- Animated icon badges

---

### Owner Feature
**Purpose**: Property management for owners

**Pages**:
- `DashboardPage` - Overview dashboard
- `PropertiesPage` - Property list
- `AddPropertyPage` - Add new property
- `EditPropertyPage` - Edit existing property
- `BookingsPage` - Manage bookings
- `TenantsPage` - Manage tenants
- `SettingsPage` - Account settings

**Routes**:
- `/owner/dashboard` - Dashboard
- `/owner/properties` - Properties list
- `/owner/properties/add` - Add property
- `/owner/properties/edit/:id` - Edit property
- `/owner/bookings` - Bookings
- `/owner/tenants` - Tenants
- `/owner/settings` - Settings

---

## 🎨 Design System

### Consistent Elements
All features follow the design system:

- **Border Radius**: 8px
- **Primary Color**: #2563EB (primary.600)
- **Font**: Poppins
- **Animations**: 0.2s-0.3s transitions
- **Spacing**: Consistent padding/margins
- **Shadows**: sm, md, lg, xl

### Component Patterns
```javascript
// Card with 8px border radius
<Card p={6} borderRadius="8px">
  {/* Content */}
</Card>

// Button with hover effect
<Button
  colorScheme="primary"
  borderRadius="8px"
  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
  transition="all 0.2s"
>
  Click Me
</Button>

// Input with focus state
<Input
  borderRadius="8px"
  _focus={{ 
    borderColor: 'primary.500', 
    boxShadow: '0 0 0 1px primary.500' 
  }}
/>
```

---

## 🔧 Adding New Features

### Step 1: Create Feature Folder
```bash
mkdir src/features/my-feature
```

### Step 2: Create Page Component
```javascript
// src/features/my-feature/MyFeaturePage.jsx
/**
 * My Feature Page
 * 
 * Description of what this feature does
 * 
 * @component
 */
const MyFeaturePage = () => {
  return (
    <Box>
      {/* Your content */}
    </Box>
  );
};

export default MyFeaturePage;
```

### Step 3: Create Barrel Export
```javascript
// src/features/my-feature/index.js
/**
 * My Feature - Barrel Export
 * 
 * @module features/my-feature
 */

export { default as MyFeaturePage } from './MyFeaturePage';
```

### Step 4: Add Route
```javascript
// src/app/router/routes.jsx
import { MyFeaturePage } from '../features/my-feature';

{
  path: '/my-feature',
  element: <MyFeaturePage />,
}
```

---

## 📊 Feature Status

### ✅ Complete & Production-Ready
- Rentals (2-column grid, inquiry modal)
- Auth (route-based, no radio buttons)
- Appointments (3-step wizard)
- Home (landing page)
- About (company info)
- Contact (contact form)
- How It Works (platform explanation)

### 🚧 In Development
- Budget Finder (needs enhancement)
- Chatbot (empty)
- Booking (empty)

### 📋 Planned
- User Dashboard (tenant)
- Reviews & Ratings
- Payment Integration
- Notifications

---

## 🧪 Testing

### Unit Tests
```bash
npm test src/features/rentals
```

### Integration Tests
```bash
npm test:integration
```

### E2E Tests
```bash
npm test:e2e
```

---

## 📝 Code Standards

### JSDoc Comments
All components should have JSDoc comments:

```javascript
/**
 * Component Name
 * 
 * Brief description of what this component does
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Title text
 * @returns {JSX.Element} Rendered component
 */
```

### File Naming
- Pages: `PascalCase` + `Page.jsx` (e.g., `FindRentalsPage.jsx`)
- Components: `PascalCase.jsx` (e.g., `PropertyCard.jsx`)
- Utilities: `camelCase.js` (e.g., `formatPrice.js`)
- Barrel exports: `index.js`

### Import Order
1. React imports
2. Third-party imports
3. Chakra UI imports
4. Local component imports
5. Utility imports
6. Style imports

---

## 🔗 Related Documentation

- [Design System](../../shared/styles/README.md)
- [Component Library](../../shared/components/README.md)
- [Routing](../../app/router/README.md)
- [State Management](../../shared/stores/README.md)

---

**Last Updated**: May 30, 2026  
**Maintainer**: Development Team  
**Status**: Active Development
