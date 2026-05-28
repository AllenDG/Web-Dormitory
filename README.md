# Dormy - Modern Student Accommodation Platform

A modern, feature-rich platform for finding and managing student accommodation. Built with React, Vite, and Chakra UI.

## ✨ Features

### For Students
- 🔍 **Advanced Search** - Filter by location, price, amenities, and more
- 🗺️ **Interactive Maps** - View properties on a map
- ❤️ **Favorites** - Save properties for later
- 📅 **Easy Booking** - Schedule property visits
- 💬 **Direct Messaging** - Contact property owners
- 📱 **Responsive Design** - Works on all devices

### For Property Owners
- 🏠 **Property Management** - Add and manage listings
- 📊 **Analytics Dashboard** - Track views and inquiries
- 👥 **Tenant Management** - Manage your tenants
- 💰 **Payment Tracking** - Monitor payments
- 📈 **Performance Insights** - Understand your listings

### Platform Features
- 🎨 **Modern UI/UX** - Clean, intuitive interface
- 🌓 **Dark Mode** - Light and dark themes
- ⚡ **Fast Performance** - Optimized with Vite
- 🔒 **Secure** - Built with security best practices
- ♿ **Accessible** - WCAG compliant

## 🚀 Tech Stack

### Core
- **React 18.3** - UI library
- **Vite 5.4** - Build tool
- **React Router 6** - Routing

### UI & Styling
- **Chakra UI 2.10** - Component library
- **Framer Motion 11** - Animations
- **React Icons 5** - Icon library

### State Management
- **Zustand 5** - Lightweight state management
- **TanStack Query 5** - Server state management

### Forms & Validation
- **React Hook Form 7** - Form handling
- **Zod 3** - Schema validation

### Data Visualization
- **Recharts 2** - Charts and graphs

### Utilities
- **date-fns 4** - Date manipulation

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/AllenDG/Web-Dormitory.git
cd Web_Dormitory
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
Web_Dormitory/
├── src/
│   ├── app/                    # App configuration
│   │   ├── providers/          # Context providers
│   │   └── router/             # Route configuration
│   ├── features/               # Feature modules
│   │   ├── home/               # Landing page
│   │   ├── rentals/            # Property listings
│   │   ├── about/              # About page
│   │   ├── how-it-works/       # How it works
│   │   ├── contact/            # Contact page
│   │   ├── favorites/          # Favorites
│   │   └── error/              # Error pages
│   ├── shared/                 # Shared resources
│   │   ├── components/         # Reusable components
│   │   ├── layouts/            # Layout components
│   │   ├── stores/             # Zustand stores
│   │   ├── hooks/              # Custom hooks
│   │   └── utils/              # Utility functions
│   ├── components/             # Legacy components
│   ├── data/                   # Mock data
│   └── assets/                 # Static assets
├── public/                     # Public assets
└── package.json
```

## 🎯 Key Improvements (v2.0)

### Architecture
- ✅ Clean architecture with feature-based structure
- ✅ Separation of concerns
- ✅ Modern state management (Zustand instead of Redux)
- ✅ Server state management (TanStack Query)
- ✅ Better form handling (React Hook Form + Zod)

### Performance
- ✅ Lazy loading for routes
- ✅ Code splitting
- ✅ Optimized bundle size
- ✅ Modern date library (date-fns instead of moment)

### UI/UX
- ✅ Redesigned landing page with modern hero section
- ✅ Enhanced search and filter experience
- ✅ Improved navigation and layout
- ✅ Better mobile responsiveness
- ✅ Smooth animations and transitions

### Features
- ✅ Favorites system with persistence
- ✅ Advanced filtering
- ✅ Contact page
- ✅ Better error handling
- ✅ Improved accessibility

### Code Quality
- ✅ Removed unnecessary dependencies
- ✅ Better component organization
- ✅ Consistent naming conventions
- ✅ Improved code reusability
- ✅ Better TypeScript support (via Zod)

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build           # Build for production
npm run preview         # Preview production build

# Linting
npm run lint            # Run ESLint
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_NAME=Dormy
VITE_API_URL=http://localhost:4000/api
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- [Allen Walter De Guzman](https://github.com/AllenDG)
- [Patrick Diesta](https://github.com/patriki28)

## 📞 Support

For support, email support@dormy.ph

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Modern UI redesign
- ✅ Clean architecture implementation
- ✅ State management upgrade
- ✅ Performance optimization

### Phase 2 (Next)
- [ ] Backend API integration
- [ ] User authentication
- [ ] Real-time messaging
- [ ] Payment integration
- [ ] Email notifications

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] AI-powered recommendations
- [ ] Virtual property tours
- [ ] Multi-language support

## 🙏 Acknowledgments

- Chakra UI for the amazing component library
- React team for the excellent framework
- Vite team for the blazing fast build tool
- All contributors and supporters

---

Made with ❤️ by the Dormy Team
