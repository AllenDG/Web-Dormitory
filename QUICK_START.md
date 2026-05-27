# 🚀 Quick Start Guide

Get your modernized Dormy platform up and running in minutes!

## ⚡ Fast Track (3 Steps)

### 1. Install Dependencies (if not done)
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to: `http://localhost:5173`

**That's it! Your app is running! 🎉**

## 📱 What You'll See

### Homepage (/)
- Modern hero section with search
- Platform features showcase
- Featured property listings
- Call-to-action section

### Find Rentals (/find-rentals)
- Advanced search and filters
- Property grid with images
- Favorites functionality
- Real-time filtering

### Other Pages
- `/about-us` - Team and mission
- `/how-it-works` - Platform guide
- `/contact` - Contact form
- `/favorites` - Saved properties

## 🎨 Customization Quick Wins

### 1. Update Branding
Edit `src/components/theme/myTheme.js`:
```javascript
colors: {
  primary: {
    500: "#0084FF", // Change this to your brand color
  },
}
```

### 2. Update Contact Info
Edit `src/features/contact/ContactPage.jsx`:
```javascript
const contactInfo = [
  {
    details: 'your-email@domain.com', // Update email
  },
  {
    details: '+63 XXX XXX XXXX', // Update phone
  },
];
```

### 3. Add More Properties
Edit `src/data/rentalListing.json` - add more property objects.

### 4. Update Team Info
Edit `src/features/about/AboutPage.jsx`:
```javascript
const team = [
  {
    name: 'Your Name',
    role: 'Your Role',
    image: 'your-image-url',
  },
];
```

## 🔧 Common Tasks

### Add a New Page
1. Create file: `src/features/my-feature/MyPage.jsx`
2. Add route in `src/app/router/routes.jsx`
3. Add link in `src/shared/components/Navbar.jsx`

### Change Theme Colors
Edit `src/components/theme/myTheme.js`

### Add New Property
Add object to `src/data/rentalListing.json`

### Modify Navbar Links
Edit `src/shared/components/Navbar.jsx`

## 📦 Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

Build output will be in `dist/` folder.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or change port in vite.config.js
server: { port: 3000 }
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check for linting errors
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## 📚 Next Steps

1. ✅ **Explore the app** - Click around and test features
2. ✅ **Read README.md** - Comprehensive documentation
3. ✅ **Check MODERNIZATION_SUMMARY.md** - See what changed
4. ✅ **Review PROJECT_STRUCTURE.md** - Understand architecture
5. ✅ **Set up Owner Portal** - See WORKSPACE_SETUP.md

## 💡 Pro Tips

### Development
- Use React DevTools browser extension
- Enable TanStack Query DevTools (bottom-left icon)
- Check browser console for errors
- Use Chakra UI theme inspector

### Performance
- Images are lazy-loaded automatically
- Routes are code-split
- Use production build for testing performance

### State Management
```javascript
// Access rental store anywhere
import useRentalStore from './shared/stores/useRentalStore';
const { rentals, addRental } = useRentalStore();

// Access UI store anywhere
import useUIStore from './shared/stores/useUIStore';
const { openModal, closeModal } = useUIStore();
```

## 🎯 Key Features to Test

- [ ] Search properties on homepage
- [ ] Filter properties by price/amenities
- [ ] Add properties to favorites
- [ ] View property details
- [ ] Toggle dark/light mode
- [ ] Test mobile responsive design
- [ ] Submit contact form
- [ ] Navigate all pages

## 📞 Need Help?

- **Documentation**: Check the markdown files in root
- **Issues**: Review console errors
- **Questions**: Refer to README.md

## 🎉 You're All Set!

Your modernized Dormy platform is ready to use. Start customizing and building amazing features!

**Happy coding! 🚀**
