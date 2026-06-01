import anthropicService from './anthropicService';

/**
 * Search Parser Service
 * Converts natural language search queries into structured filters
 * Example: "2 bedroom near university under 10k" → { bedrooms: 2, location: "near university", maxPrice: 10000 }
 */

const SYSTEM_PROMPT = `You are a search query parser for a Philippine rental property platform. Your task is to convert natural language search queries into structured JSON filters.

Extract the following information when present:
- location: City, area, or landmark (e.g., "Quezon City", "near UP Diliman", "Makati CBD")
- minPrice: Minimum monthly rent in PHP
- maxPrice: Maximum monthly rent in PHP
- bedType: Type of bed (single, double, queen, king)
- propertyType: Type of property (apartment, condo, studio, house, room, bedspace)
- amenities: Array of amenities (wifi, aircon, parking, kitchen, etc.)
- availablePerson: Number of persons
- nearbyPlaces: Array of nearby places (university, mall, MRT, etc.)

Common Filipino terms to recognize:
- "bedspace" = shared room
- "condo" = condominium
- "studio type" = studio apartment
- "walking distance" = nearby
- "near" = proximity to landmark
- "k" or "K" = thousand (e.g., "10k" = 10000)

Return ONLY valid JSON with extracted fields. If a field is not mentioned, omit it.

Examples:
Input: "2 bedroom condo in Makati under 25k with parking"
Output: {"propertyType": "condo", "location": "Makati", "maxPrice": 25000, "amenities": ["parking"]}

Input: "studio near UP Diliman 8k to 12k with wifi"
Output: {"propertyType": "studio", "location": "near UP Diliman", "minPrice": 8000, "maxPrice": 12000, "amenities": ["wifi"]}

Input: "bedspace for 1 person in QC with aircon"
Output: {"propertyType": "bedspace", "availablePerson": 1, "location": "QC", "amenities": ["aircon"]}`;

class SearchParserService {
  /**
   * Parse natural language search query into structured filters
   * @param {string} query - Natural language search query
   * @returns {Promise<Object>} - Structured filter object
   */
  async parseQuery(query) {
    if (!query || query.trim().length === 0) {
      return {};
    }

    // If query is very short or simple, return basic filter
    if (query.trim().length < 3) {
      return { location: query.trim() };
    }

    try {
      const userMessage = `Parse this search query: "${query}"`;
      
      const response = await anthropicService.sendMessage(
        SYSTEM_PROMPT,
        userMessage,
        {
          maxTokens: 256,
          temperature: 0.3, // Lower temperature for more consistent parsing
        }
      );

      // Parse JSON response
      const filters = this.extractJSON(response);
      
      // Validate and normalize filters
      return this.normalizeFilters(filters);
    } catch (error) {
      console.error('Failed to parse search query:', error);
      
      // Fallback: treat entire query as location search
      return { location: query.trim() };
    }
  }

  /**
   * Extract JSON from AI response
   * @private
   */
  extractJSON(text) {
    try {
      // Try to parse directly
      return JSON.parse(text);
    } catch (e) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }

      // Try to find JSON object in text
      const objectMatch = text.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        return JSON.parse(objectMatch[0]);
      }

      return {};
    }
  }

  /**
   * Normalize and validate filters
   * @private
   */
  normalizeFilters(filters) {
    const normalized = {};

    // Location
    if (filters.location) {
      normalized.location = String(filters.location).trim();
    }

    // Price range
    if (filters.minPrice && !isNaN(filters.minPrice)) {
      normalized.minPrice = Math.max(0, parseInt(filters.minPrice));
    }
    if (filters.maxPrice && !isNaN(filters.maxPrice)) {
      normalized.maxPrice = Math.max(0, parseInt(filters.maxPrice));
    }

    // Ensure minPrice <= maxPrice
    if (normalized.minPrice && normalized.maxPrice && normalized.minPrice > normalized.maxPrice) {
      [normalized.minPrice, normalized.maxPrice] = [normalized.maxPrice, normalized.minPrice];
    }

    // Property type
    if (filters.propertyType) {
      const validTypes = ['apartment', 'condo', 'studio', 'house', 'room', 'bedspace'];
      const type = String(filters.propertyType).toLowerCase();
      if (validTypes.includes(type)) {
        normalized.propertyType = type;
      }
    }

    // Bed type
    if (filters.bedType) {
      const validBedTypes = ['single', 'double', 'queen', 'king'];
      const bedType = String(filters.bedType).toLowerCase();
      if (validBedTypes.includes(bedType)) {
        normalized.bedType = bedType;
      }
    }

    // Available persons
    if (filters.availablePerson && !isNaN(filters.availablePerson)) {
      normalized.availablePerson = Math.max(1, parseInt(filters.availablePerson));
    }

    // Amenities
    if (Array.isArray(filters.amenities) && filters.amenities.length > 0) {
      normalized.amenities = filters.amenities
        .map(a => String(a).toLowerCase().trim())
        .filter(a => a.length > 0);
    }

    // Nearby places
    if (Array.isArray(filters.nearbyPlaces) && filters.nearbyPlaces.length > 0) {
      normalized.nearbyPlaces = filters.nearbyPlaces
        .map(p => String(p).trim())
        .filter(p => p.length > 0);
    }

    return normalized;
  }

  /**
   * Generate search suggestions based on partial query
   * @param {string} partialQuery - Partial search query
   * @returns {Promise<Array<string>>} - Array of suggested queries
   */
  async generateSuggestions(partialQuery) {
    if (!partialQuery || partialQuery.trim().length < 2) {
      return this.getDefaultSuggestions();
    }

    // For mock mode, return contextual suggestions
    if (anthropicService.config.useMockData) {
      return this.getMockSuggestions(partialQuery);
    }

    // Real implementation would call AI service
    return this.getDefaultSuggestions();
  }

  /**
   * Get default search suggestions
   * @private
   */
  getDefaultSuggestions() {
    return [
      'Studio near university under 10k',
      '2 bedroom condo in Makati with parking',
      'Bedspace in Quezon City with wifi',
      'Apartment near MRT under 15k',
      'Room for 2 persons with aircon',
    ];
  }

  /**
   * Get contextual mock suggestions
   * @private
   */
  getMockSuggestions(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('studio')) {
      return [
        'Studio near university under 10k',
        'Studio in Makati with wifi',
        'Studio type in Quezon City',
      ];
    }
    
    if (lowerQuery.includes('condo')) {
      return [
        '2 bedroom condo in Makati with parking',
        'Condo near BGC under 30k',
        'Condo in Ortigas with gym',
      ];
    }
    
    if (lowerQuery.includes('bed')) {
      return [
        'Bedspace in Quezon City with wifi',
        '2 bedroom apartment near MRT',
        'Bedspace for students under 5k',
      ];
    }

    if (lowerQuery.match(/\d/)) {
      return [
        '2 bedroom condo in Makati',
        '1 bedroom apartment in QC',
        '3 bedroom house in Paranaque',
      ];
    }

    return this.getDefaultSuggestions();
  }

  /**
   * Check if service is available
   */
  isAvailable() {
    return anthropicService.isAvailable();
  }
}

// Create singleton instance
const searchParserService = new SearchParserService();

export default searchParserService;
