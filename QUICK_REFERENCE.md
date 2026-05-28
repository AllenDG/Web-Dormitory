# Quick Reference Guide

## 🎨 Design Tokens

### Colors
```css
/* Primary */
--primary-main: #4DA8DA;
--primary-dark: #1D4ED8;

/* Background */
--bg-main: #F8FAFC;
--bg-card: #FFFFFF;

/* Text */
--text-primary: #0F172A;
--text-secondary: #475569;

/* Border */
--border-color: #E2E8F0;
```

### Typography
```css
/* Font Family */
font-family: 'Poppins', sans-serif;

/* Sizes */
--text-5xl: 48px;  /* Hero */
--text-4xl: 36px;  /* Page titles */
--text-3xl: 30px;  /* Sections */
--text-2xl: 24px;  /* Cards */
--text-xl: 20px;   /* Subsections */
--text-lg: 18px;   /* Large body */
--text-base: 16px; /* Body */
--text-sm: 14px;   /* Small */
--text-xs: 12px;   /* Captions */

/* Weights */
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing
```css
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px
```

### Border Radius
```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px; /* MAXIMUM */
```

---

## 📦 Component Patterns

### Button
```jsx
<Button
  colorScheme="primary"
  size="lg"
  borderRadius="md"
  fontWeight="500"
>
  Search Dorms
</Button>
```

### Card
```jsx
<Box
  bg="white"
  p={6}
  borderRadius="lg"
  boxShadow="sm"
  _hover={{ boxShadow: 'md' }}
>
  {/* Content */}
</Box>
```

### Input
```jsx
<Input
  placeholder="Enter location"
  size="lg"
  borderRadius="md"
  borderColor="gray.200"
  _focus={{
    borderColor: 'primary.500',
    boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)'
  }}
/>
```

---

## 🗺️ API Quick Start

### Mapbox
```javascript
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [121.0244, 14.5547],
  zoom: 12
});
```

### Gemini AI
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const result = await model.generateContent(prompt);
const response = await result.response;
const text = response.text();
```

### Geolocation
```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    // Use coordinates
  },
  (error) => console.error(error),
  { enableHighAccuracy: true }
);
```

---

## 🎯 Common Tasks

### Add New Page
1. Create page in `src/features/[feature-name]/`
2. Add route in `src/app/router/routes.jsx`
3. Add navigation link in `Navbar.jsx`

### Add New Component
1. Create in `src/shared/components/`
2. Export from `index.js`
3. Import where needed

### Add API Service
1. Create in `src/shared/services/`
2. Export functions
3. Use in components

---

## ♿ Accessibility Checklist

- [ ] Color contrast ≥ 4.5:1
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Alt text on images
- [ ] Semantic HTML
- [ ] Touch targets ≥ 44x44px

---

## 📱 Responsive Breakpoints

```javascript
{
  base: '0px',    // Mobile
  sm: '480px',    // Small mobile
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px' // Extra large
}
```

---

## 🔧 Environment Variables

```env
# .env.local
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_GEMINI_API_KEY=your_gemini_key
VITE_OPENAI_API_KEY=your_openai_key (optional)
```

---

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub
```

---

## 🚀 Deployment

```bash
# Build for production
npm run build

# Preview build
npm run preview

# Deploy to Vercel
vercel --prod
```

---

## 📊 Performance Targets

- Page load: < 2s
- Time to interactive: < 3s
- First contentful paint: < 1s
- Lighthouse score: > 90

---

## 🐛 Common Issues

### Map not showing
- Check API key
- Check container height
- Check import statements

### AI not responding
- Check API key
- Check rate limits
- Check error logs

### Styles not applying
- Check theme import
- Check Chakra provider
- Check component props

---

## 📚 Documentation Files

1. **ENHANCEMENT_DOCUMENTATION.md** - Full specs
2. **IMPLEMENTATION_ROADMAP.md** - Implementation plan
3. **API_INTEGRATION_GUIDE.md** - API setup
4. **REDESIGN_SUMMARY.md** - Overview
5. **QUICK_REFERENCE.md** - This file

---

## 💡 Tips

- Start with core components
- Test on real devices
- Get feedback early
- Keep it simple
- Document as you go
- Follow accessibility guidelines
- Use design tokens
- Maintain consistency

---

**Quick Links**:
- [Chakra UI Docs](https://chakra-ui.com/)
- [Mapbox Docs](https://docs.mapbox.com/)
- [Gemini API](https://ai.google.dev/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
