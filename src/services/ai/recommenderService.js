import anthropicService from './anthropicService';

/**
 * Smart Recommender Service
 * Provides personalized property recommendations based on user preferences and behavior
 */

const SYSTEM_PROMPT = `You are a property recommendation expert for a Philippine rental platform. Your task is to analyze user preferences and behavior to recommend the most suitable properties.

Consider these factors:
- User's budget range
- Preferred locations
- Required amenities
- Property type preferences
- Previous searches and favorites
- Lifestyle indicators (student, professional, family)

Provide recommendations with reasoning that explains why each property is a good match.

Output format:
{
  "recommendations": [
    {
      "propertyId": "property-id",
      "score": 0-100,
      "reasons": ["reason 1", "reason 2", "reason 3"]
    }
  ]
}`;

class RecommenderService {
  /**
   * Get personalized property recommendations
   * @param {Object} userProfile - User preferences and behavior
   * @param {Array} availableProperties - List of properties to rank
   * @param {number} limit - Maximum number of recommendations
   * @returns {Promise<Array>} - Ranked property recommendations
   */
  async getRecommendations(userProfile, availableProperties, limit = 5) {
    if (!availableProperties || availableProperties.length === 0) {
      return [];
    }

    // Use mock recommendations for development
    if (anthropicService.config.useMockData) {
      return this.generateMockRecommendations(userProfile, availableProperties, limit);
    }

    try {
      const userMessage = this.buildRecommendationPrompt(userProfile, availableProperties);
      
      const response = await anthropicService.sendMessage(
        SYSTEM_PROMPT,
        userMessage,
        {
          maxTokens: 512,
          temperature: 0.5,
        }
      );

      const result = JSON.parse(response);
      return this.processRecommendations(result.recommendations, availableProperties, limit);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      // Fallback to simple scoring
      return this.generateMockRecommendations(userProfile, availableProperties, limit);
    }
  }

  /**
   * Build recommendation prompt
   * @private
   */
  buildRecommendationPrompt(userProfile, properties) {
    const profile = {
      budget: userProfile.budget || 'Not specified',
      locations: userProfile.preferredLocations || [],
      amenities: userProfile.requiredAmenities || [],
      propertyType: userProfile.propertyType || 'Any',
      searchHistory: userProfile.recentSearches || [],
      favorites: userProfile.favoriteCount || 0,
    };

    const propertyList = properties.slice(0, 20).map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      location: p.city,
      type: p.propertyType || 'apartment',
      amenities: p.amenities || [],
    }));

    return `User Profile:
${JSON.stringify(profile, null, 2)}

Available Properties:
${JSON.stringify(propertyList, null, 2)}

Recommend the top ${Math.min(5, properties.length)} properties for this user and explain why each is a good match.`;
  }

  /**
   * Process AI recommendations
   * @private
   */
  processRecommendations(recommendations, properties, limit) {
    const propertyMap = new Map(properties.map(p => [p.id, p]));
    
    return recommendations
      .filter(rec => propertyMap.has(rec.propertyId))
      .map(rec => ({
        property: propertyMap.get(rec.propertyId),
        score: rec.score,
        reasons: rec.reasons || [],
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Generate mock recommendations using simple scoring
   * @private
   */
  generateMockRecommendations(userProfile, properties, limit) {
    const scoredProperties = properties.map(property => {
      let score = 50; // Base score
      const reasons = [];

      // Budget matching
      if (userProfile.budget) {
        const { min, max } = userProfile.budget;
        if (property.price >= min && property.price <= max) {
          score += 20;
          reasons.push(`Within your budget (₱${min.toLocaleString()} - ₱${max.toLocaleString()})`);
        } else if (property.price < min) {
          score += 10;
          reasons.push('Great value - below your budget');
        }
      }

      // Location matching
      if (userProfile.preferredLocations && userProfile.preferredLocations.length > 0) {
        const matchesLocation = userProfile.preferredLocations.some(loc =>
          property.city?.toLowerCase().includes(loc.toLowerCase()) ||
          property.address?.toLowerCase().includes(loc.toLowerCase())
        );
        if (matchesLocation) {
          score += 15;
          reasons.push('In your preferred location');
        }
      }

      // Amenities matching
      if (userProfile.requiredAmenities && userProfile.requiredAmenities.length > 0) {
        const propertyAmenities = (property.amenities || []).map(a => a.toLowerCase());
        const matchedAmenities = userProfile.requiredAmenities.filter(req =>
          propertyAmenities.some(pa => pa.includes(req.toLowerCase()))
        );
        
        if (matchedAmenities.length > 0) {
          score += matchedAmenities.length * 5;
          reasons.push(`Has ${matchedAmenities.length} of your required amenities`);
        }
      }

      // Property type matching
      if (userProfile.propertyType && property.propertyType) {
        if (property.propertyType.toLowerCase() === userProfile.propertyType.toLowerCase()) {
          score += 10;
          reasons.push('Matches your preferred property type');
        }
      }

      // Recent searches matching
      if (userProfile.recentSearches && userProfile.recentSearches.length > 0) {
        const recentTerms = userProfile.recentSearches.join(' ').toLowerCase();
        const propertyText = `${property.title} ${property.description} ${property.city}`.toLowerCase();
        
        if (recentTerms.split(' ').some(term => term.length > 3 && propertyText.includes(term))) {
          score += 8;
          reasons.push('Similar to your recent searches');
        }
      }

      // Popularity boost (if property has high rating or views)
      if (property.rating && property.rating >= 4.5) {
        score += 5;
        reasons.push('Highly rated property');
      }

      // New listing boost
      if (property.isNew) {
        score += 3;
        reasons.push('Newly listed');
      }

      // Ensure score is within 0-100
      score = Math.min(100, Math.max(0, score));

      // Add default reason if none
      if (reasons.length === 0) {
        reasons.push('Quality property in good location');
      }

      return {
        property,
        score,
        reasons,
      };
    });

    // Sort by score and return top N
    return scoredProperties
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get recommendations based on a specific property (similar properties)
   * @param {Object} property - Reference property
   * @param {Array} availableProperties - List of properties to search
   * @param {number} limit - Maximum number of recommendations
   * @returns {Promise<Array>} - Similar property recommendations
   */
  async getSimilarProperties(property, availableProperties, limit = 4) {
    if (!property || !availableProperties || availableProperties.length === 0) {
      return [];
    }

    // Filter out the reference property
    const otherProperties = availableProperties.filter(p => p.id !== property.id);

    // Create a user profile based on the property
    const syntheticProfile = {
      budget: {
        min: property.price * 0.8,
        max: property.price * 1.2,
      },
      preferredLocations: [property.city],
      requiredAmenities: property.amenities || [],
      propertyType: property.propertyType,
    };

    return this.getRecommendations(syntheticProfile, otherProperties, limit);
  }

  /**
   * Get trending properties (most popular/viewed)
   * @param {Array} properties - List of properties
   * @param {number} limit - Maximum number to return
   * @returns {Array} - Trending properties
   */
  getTrendingProperties(properties, limit = 6) {
    if (!properties || properties.length === 0) {
      return [];
    }

    // Sort by views, rating, or recency
    return properties
      .map(property => ({
        property,
        score: (property.views || 0) * 0.5 + (property.rating || 0) * 10,
        reasons: ['Popular choice', 'Frequently viewed'],
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get properties for first-time users (no profile data)
   * @param {Array} properties - List of properties
   * @param {number} limit - Maximum number to return
   * @returns {Array} - Featured properties for new users
   */
  getFeaturedForNewUsers(properties, limit = 6) {
    if (!properties || properties.length === 0) {
      return [];
    }

    // Show diverse, high-quality properties
    return properties
      .filter(p => p.rating >= 4.0 || p.isFeatured)
      .map(property => ({
        property,
        score: 80,
        reasons: ['Featured property', 'Great for first-time renters'],
      }))
      .slice(0, limit);
  }

  /**
   * Check if service is available
   */
  isAvailable() {
    return anthropicService.isAvailable();
  }
}

// Create singleton instance
const recommenderService = new RecommenderService();

export default recommenderService;
