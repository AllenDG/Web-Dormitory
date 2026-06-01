import anthropicService from './anthropicService';

/**
 * Listing Writer Service
 * Generates compelling property descriptions using AI
 */

const SYSTEM_PROMPT = `You are an expert real estate copywriter specializing in rental property listings in the Philippines. Your task is to create compelling, accurate, and engaging property descriptions that attract potential tenants.

Guidelines:
- Write in a warm, professional, and inviting tone
- Highlight key features and amenities naturally
- Include location benefits and nearby attractions
- Use descriptive language that helps readers visualize the space
- Keep descriptions between 150-250 words
- Focus on lifestyle benefits, not just features
- Use Filipino context (e.g., mention proximity to universities, malls, transport)
- Avoid exaggeration or false claims
- Write in clear, grammatically correct English
- End with a call-to-action

Format:
- Start with an engaging opening sentence
- Follow with 2-3 paragraphs describing the property
- Include a closing sentence that encourages action`;

class ListingWriterService {
  /**
   * Generate a property description based on property details
   * @param {Object} propertyData - Property information
   * @param {string} propertyData.title - Property title
   * @param {string} propertyData.location - Property location/city
   * @param {string} propertyData.propertyType - Type of property (apartment, condo, etc.)
   * @param {Array<string>} propertyData.amenities - List of amenities
   * @param {number} propertyData.price - Monthly rent price
   * @param {string} propertyData.bedType - Bed type (single, double, etc.)
   * @param {number} propertyData.availablePerson - Number of persons
   * @param {string} propertyData.address - Full address (optional)
   * @returns {Promise<string>} - Generated description
   */
  async generateDescription(propertyData) {
    // Validate input
    if (!propertyData || !propertyData.title) {
      throw new Error('Property title is required');
    }

    // Build user message with property details
    const userMessage = this.buildPrompt(propertyData);

    try {
      const description = await anthropicService.sendMessage(
        SYSTEM_PROMPT,
        userMessage,
        {
          maxTokens: 512,
          temperature: 0.7,
        }
      );

      return description.trim();
    } catch (error) {
      console.error('Failed to generate description:', error);
      throw error;
    }
  }

  /**
   * Generate a description with streaming (for real-time display)
   * @param {Object} propertyData - Property information
   * @param {Function} onChunk - Callback for each chunk of text
   * @returns {Promise<string>} - Complete generated description
   */
  async generateDescriptionStreaming(propertyData, onChunk) {
    if (!propertyData || !propertyData.title) {
      throw new Error('Property title is required');
    }

    const userMessage = this.buildPrompt(propertyData);

    try {
      const description = await anthropicService.sendStreamingMessage(
        SYSTEM_PROMPT,
        userMessage,
        onChunk,
        {
          maxTokens: 512,
          temperature: 0.7,
        }
      );

      return description.trim();
    } catch (error) {
      console.error('Failed to generate streaming description:', error);
      throw error;
    }
  }

  /**
   * Build the prompt from property data
   * @private
   */
  buildPrompt(propertyData) {
    const {
      title,
      location,
      propertyType,
      amenities = [],
      price,
      bedType,
      availablePerson,
      address,
    } = propertyData;

    // Format price
    const formattedPrice = price
      ? new Intl.NumberFormat('en-PH', {
          style: 'currency',
          currency: 'PHP',
          minimumFractionDigits: 0,
        }).format(price)
      : 'Price available upon inquiry';

    // Build amenities list
    const amenitiesList = amenities.length > 0
      ? amenities.join(', ')
      : 'Basic amenities included';

    // Build capacity info
    const capacityInfo = availablePerson
      ? `Suitable for ${availablePerson} ${availablePerson === 1 ? 'person' : 'persons'}`
      : '';

    const bedInfo = bedType ? `with ${bedType} bed` : '';

    const prompt = `Write a compelling property description for the following rental listing:

Property Title: ${title}
Location: ${location || 'Metro Manila'}${address ? ` (${address})` : ''}
Property Type: ${propertyType || 'Rental property'}
Monthly Rent: ${formattedPrice}
${capacityInfo}${bedInfo ? ' ' + bedInfo : ''}
Amenities: ${amenitiesList}

Create an engaging description that will attract potential tenants. Focus on the lifestyle benefits and what makes this property special. Make it sound inviting and professional.`;

    return prompt;
  }

  /**
   * Improve an existing description
   * @param {string} currentDescription - Current property description
   * @param {string} improvementFocus - What to improve (e.g., "more engaging", "shorter", "highlight amenities")
   * @returns {Promise<string>} - Improved description
   */
  async improveDescription(currentDescription, improvementFocus = 'more engaging and professional') {
    if (!currentDescription) {
      throw new Error('Current description is required');
    }

    const userMessage = `Improve the following property description to make it ${improvementFocus}:

Current Description:
${currentDescription}

Provide an improved version that maintains accuracy while being more compelling.`;

    try {
      const improvedDescription = await anthropicService.sendMessage(
        SYSTEM_PROMPT,
        userMessage,
        {
          maxTokens: 512,
          temperature: 0.7,
        }
      );

      return improvedDescription.trim();
    } catch (error) {
      console.error('Failed to improve description:', error);
      throw error;
    }
  }

  /**
   * Check if the service is available
   */
  isAvailable() {
    return anthropicService.isAvailable();
  }
}

// Create singleton instance
const listingWriterService = new ListingWriterService();

export default listingWriterService;
