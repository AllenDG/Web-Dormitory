# API Integration Guide

## 🗺️ Map & Location APIs

### Option 1: Mapbox (Recommended)

**Why Mapbox?**
- Free tier: 50,000 requests/month
- Excellent documentation
- React integration available
- Accurate geocoding
- Beautiful map styles
- Good performance

**Setup**:
```bash
npm install mapbox-gl react-map-gl
```

**Get API Key**:
1. Sign up at https://www.mapbox.com/
2. Go to Account → Tokens
3. Create new token
4. Copy access token

**Environment Variable**:
```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

**Basic Implementation**:
```javascript
// src/services/mapService.js
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export const initializeMap = (container, options = {}) => {
  return new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [121.0244, 14.5547], // Manila coordinates
    zoom: 12,
    ...options
  });
};

export const addMarker = (map, coordinates, options = {}) => {
  return new mapboxgl.Marker(options)
    .setLngLat(coordinates)
    .addTo(map);
};

export const geocodeAddress = async (address) => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
  );
  return response.json();
};

export const reverseGeocode = async (lng, lat) => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
  );
  return response.json();
};

export const calculateDistance = (from, to) => {
  // Haversine formula
  const R = 6371; // Earth's radius in km
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLon = (to.lng - from.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};
```

**React Component**:
```javascript
// src/components/MapView.jsx
import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { initializeMap, addMarker } from '../services/mapService';

const MapView = ({ properties, center, zoom = 12 }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;
    
    map.current = initializeMap(mapContainer.current, {
      center: center || [121.0244, 14.5547],
      zoom
    });

    // Add markers for properties
    properties.forEach(property => {
      addMarker(map.current, [property.longitude, property.latitude], {
        color: '#1D4ED8'
      }).setPopup(
        new mapboxgl.Popup().setHTML(
          `<h3>${property.title}</h3><p>₱${property.price}/month</p>`
        )
      );
    });
  }, [properties, center, zoom]);

  return (
    <Box
      ref={mapContainer}
      w="full"
      h="500px"
      borderRadius="lg"
      overflow="hidden"
    />
  );
};

export default MapView;
```

---

### Option 2: OpenStreetMap with Leaflet

**Why OpenStreetMap?**
- Completely free
- No API key required
- Open source
- Good for basic mapping

**Setup**:
```bash
npm install leaflet react-leaflet
```

**Implementation**:
```javascript
// src/components/MapView.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({ properties, center = [14.5547, 121.0244], zoom = 12 }) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '500px', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {properties.map(property => (
        <Marker
          key={property.id}
          position={[property.latitude, property.longitude]}
        >
          <Popup>
            <strong>{property.title}</strong>
            <br />
            ₱{property.price}/month
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
```

---

## 🤖 AI Integration APIs

### Option 1: OpenAI API (Recommended)

**Why OpenAI?**
- Most advanced AI
- Great for conversational search
- Good documentation
- Reliable

**Setup**:
```bash
npm install openai
```

**Get API Key**:
1. Sign up at https://platform.openai.com/
2. Go to API Keys
3. Create new secret key
4. Copy key

**Environment Variable**:
```env
VITE_OPENAI_API_KEY=your_openai_key_here
```

**Implementation**:
```javascript
// src/services/aiService.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo, use backend in production
});

export const getRecommendations = async (userQuery, properties) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful dormitory search assistant in the Philippines. 
          Help students find the best dorms based on their needs. 
          Be conversational, friendly, and provide specific recommendations.`
        },
        {
          role: "user",
          content: `${userQuery}\n\nAvailable properties: ${JSON.stringify(properties.slice(0, 5))}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI Error:', error);
    return 'Sorry, I could not process your request. Please try again.';
  }
};

export const parseNaturalLanguageQuery = async (query) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Extract search filters from natural language queries. 
          Return JSON with: location, budget, roomType, amenities.
          Example: "Find solo rooms near UP Diliman under 5000" 
          Returns: {"location": "UP Diliman", "budget": 5000, "roomType": "solo"}`
        },
        {
          role: "user",
          content: query
        }
      ],
      max_tokens: 200,
      temperature: 0.3
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Parse Error:', error);
    return null;
  }
};

export const generatePropertyDescription = async (property) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Generate a friendly, conversational description for a dormitory listing."
        },
        {
          role: "user",
          content: `Property: ${property.title}, Price: ₱${property.price}, Location: ${property.city}, Amenities: ${property.amenities.join(', ')}`
        }
      ],
      max_tokens: 150,
      temperature: 0.8
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Description Error:', error);
    return property.description;
  }
};
```

**React Component**:
```javascript
// src/components/AIAssistant.jsx
import { useState } from 'react';
import { Box, Input, Button, VStack, Text } from '@chakra-ui/react';
import { getRecommendations } from '../services/aiService';

const AIAssistant = ({ properties }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await getRecommendations(query, properties);
    setResponse(result);
    setLoading(false);
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="600" fontSize="lg">AI Assistant</Text>
        <form onSubmit={handleSubmit}>
          <VStack spacing={3}>
            <Input
              placeholder="Ask me anything... e.g., 'Find affordable dorms near UP'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              type="submit"
              colorScheme="primary"
              w="full"
              isLoading={loading}
            >
              Ask AI
            </Button>
          </VStack>
        </form>
        {response && (
          <Box p={4} bg="gray.50" borderRadius="md">
            <Text>{response}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default AIAssistant;
```

---

### Option 2: Google Gemini API

**Why Gemini?**
- Free tier available
- Good performance
- Google's latest AI

**Setup**:
```bash
npm install @google/generative-ai
```

**Get API Key**:
1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Copy key

**Environment Variable**:
```env
VITE_GEMINI_API_KEY=your_gemini_key_here
```

**Implementation**:
```javascript
// src/services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const getGeminiRecommendations = async (userQuery, properties) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a dormitory search assistant. 
    User query: ${userQuery}
    Available properties: ${JSON.stringify(properties.slice(0, 5))}
    Provide helpful recommendations.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Error:', error);
    return 'Sorry, I could not process your request.';
  }
};
```

---

## 🔍 Search APIs

### Option 1: Algolia

**Why Algolia?**
- Fast search
- Typo tolerance
- Faceted filtering
- Free tier: 10,000 requests/month

**Setup**:
```bash
npm install algoliasearch react-instantsearch
```

**Get API Key**:
1. Sign up at https://www.algolia.com/
2. Create application
3. Get Application ID and API Key

**Implementation**:
```javascript
// src/services/searchService.js
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_KEY
);

const index = searchClient.initIndex('dormitories');

export const searchProperties = async (query, filters = {}) => {
  try {
    const { hits } = await index.search(query, {
      filters: buildFilters(filters),
      hitsPerPage: 20
    });
    return hits;
  } catch (error) {
    console.error('Search Error:', error);
    return [];
  }
};

const buildFilters = (filters) => {
  const conditions = [];
  
  if (filters.minPrice) conditions.push(`price >= ${filters.minPrice}`);
  if (filters.maxPrice) conditions.push(`price <= ${filters.maxPrice}`);
  if (filters.city) conditions.push(`city:"${filters.city}"`);
  if (filters.roomType) conditions.push(`roomType:"${filters.roomType}"`);
  
  return conditions.join(' AND ');
};
```

---

## 📍 Geolocation API

**Browser Geolocation** (Free, built-in):

```javascript
// src/services/locationService.js
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

export const watchLocation = (callback) => {
  if (!navigator.geolocation) {
    return null;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    (error) => {
      console.error('Location Error:', error);
    }
  );
};
```

---

## 🔐 Security Best Practices

### API Keys
- **Never** commit API keys to git
- Use environment variables
- Use `.env.local` for local development
- Use Vercel environment variables for production

### Backend Proxy (Recommended)
For production, create a backend proxy to hide API keys:

```javascript
// backend/api/ai.js (Example with Next.js API routes)
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: query }]
    });
    
    res.status(200).json({ result: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'AI request failed' });
  }
}
```

---

## 💰 Cost Estimates

### Free Tiers
- **Mapbox**: 50,000 requests/month
- **OpenStreetMap**: Unlimited (free)
- **OpenAI**: $5 free credit (then pay-as-you-go)
- **Gemini**: Free tier available
- **Algolia**: 10,000 requests/month
- **Browser Geolocation**: Free

### Recommended for MVP
1. **Map**: Mapbox (free tier sufficient)
2. **AI**: Gemini (free tier) or OpenAI ($5 credit)
3. **Search**: Client-side filtering (free) or Algolia
4. **Location**: Browser Geolocation (free)

**Total Cost**: $0-10/month for MVP

---

## 📝 Environment Variables Template

Create `.env.local`:
```env
# Mapbox
VITE_MAPBOX_TOKEN=your_mapbox_token

# OpenAI (choose one)
VITE_OPENAI_API_KEY=your_openai_key

# Gemini (alternative)
VITE_GEMINI_API_KEY=your_gemini_key

# Algolia (optional)
VITE_ALGOLIA_APP_ID=your_app_id
VITE_ALGOLIA_SEARCH_KEY=your_search_key
```

---

## ✅ Quick Start Checklist

- [ ] Choose map API (Mapbox recommended)
- [ ] Sign up and get API key
- [ ] Install dependencies
- [ ] Add environment variables
- [ ] Test basic integration
- [ ] Choose AI API (Gemini for free tier)
- [ ] Sign up and get API key
- [ ] Test AI responses
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test on production

---

**Note**: Start with free tiers and upgrade as needed based on usage.
