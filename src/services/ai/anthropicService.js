/**
 * Anthropic AI Service
 * Core service for interacting with Claude API via backend proxy
 * 
 * NOTE: Direct browser usage of Anthropic SDK is not recommended for production.
 * This service uses a backend proxy approach for security and compatibility.
 */

class AnthropicService {
  constructor() {
    this.isInitialized = false;
    this.config = {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      model: import.meta.env.VITE_AI_MODEL || 'claude-3-5-sonnet-20241022',
      maxTokens: parseInt(import.meta.env.VITE_AI_MAX_TOKENS) || 1024,
      temperature: parseFloat(import.meta.env.VITE_AI_TEMPERATURE) || 0.7,
      useMockData: import.meta.env.VITE_USE_MOCK_AI === 'true' || true, // Default to mock for now
    };
    this.isInitialized = true;
  }

  /**
   * Check if AI features are enabled and available
   */
  isAvailable() {
    const isEnabled = import.meta.env.VITE_ENABLE_AI_FEATURES !== 'false';
    return isEnabled && this.isInitialized;
  }

  /**
   * Send a message to Claude and get a response
   * @param {string} systemPrompt - System instructions for Claude
   * @param {string} userMessage - User's message/prompt
   * @param {Object} options - Additional options (temperature, maxTokens, etc.)
   * @returns {Promise<string>} - Claude's response
   */
  async sendMessage(systemPrompt, userMessage, options = {}) {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available.');
    }

    // Use mock data for development
    if (this.config.useMockData) {
      return this.generateMockResponse(systemPrompt, userMessage);
    }

    try {
      // Call backend proxy endpoint
      const response = await fetch(`${this.config.apiBaseUrl}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemPrompt,
          userMessage,
          model: options.model || this.config.model,
          maxTokens: options.maxTokens || this.config.maxTokens,
          temperature: options.temperature || this.config.temperature,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'AI service error');
      }

      const data = await response.json();
      return data.text || '';
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  /**
   * Generate mock response for development/testing
   * @private
   */
  async generateMockResponse(systemPrompt, userMessage) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Parse the user message to extract property details
    const lines = userMessage.split('\n');
    let title = 'this property';
    let location = 'the area';
    let price = 'an affordable price';
    let amenities = 'modern amenities';

    lines.forEach(line => {
      if (line.includes('Property Title:')) {
        title = line.split(':')[1].trim();
      } else if (line.includes('Location:')) {
        location = line.split(':')[1].trim().split('(')[0].trim();
      } else if (line.includes('Monthly Rent:')) {
        price = line.split(':')[1].trim();
      } else if (line.includes('Amenities:')) {
        amenities = line.split(':')[1].trim();
      }
    });

    // Generate a realistic property description
    const descriptions = [
      `Welcome to ${title}, a charming property located in the heart of ${location}. This well-maintained space offers excellent value at ${price} per month, making it perfect for students and young professionals seeking quality accommodation.

The property features ${amenities}, ensuring your comfort and convenience. Its prime location provides easy access to schools, universities, shopping centers, and public transportation, making your daily commute a breeze.

The neighborhood is safe, vibrant, and welcoming, with plenty of dining options, cafes, and recreational facilities nearby. Whether you're studying, working, or exploring the city, this property serves as an ideal home base.

Don't miss this opportunity to secure your perfect living space. Contact us today to schedule a viewing and experience the comfort and convenience this property has to offer!`,

      `Discover your new home at ${title}, strategically situated in ${location}. Priced at just ${price} monthly, this property combines affordability with quality living.

Inside, you'll find ${amenities} that cater to modern lifestyle needs. The space is designed for comfort and functionality, perfect for those who value both style and practicality.

Location is everything, and this property delivers. You're minutes away from major universities, business districts, and entertainment hubs. Public transportation is readily accessible, and the area boasts excellent security with 24/7 surveillance.

The community is friendly and diverse, creating a welcoming atmosphere for residents. Local markets, restaurants, and convenience stores are just a short walk away, ensuring you have everything you need within reach.

Schedule your visit today and see why this property could be your perfect match. Our team is ready to assist you in making this your new home!`,

      `${title} presents an exceptional living opportunity in ${location}. At ${price} per month, this property offers outstanding value without compromising on quality or location.

The unit comes equipped with ${amenities}, thoughtfully selected to enhance your daily living experience. Every detail has been considered to provide a comfortable and convenient lifestyle.

Situated in one of the most sought-after areas, you'll enjoy proximity to educational institutions, corporate offices, and lifestyle destinations. The neighborhood is known for its safety, cleanliness, and vibrant community spirit.

Transportation is effortless with multiple options available nearby. Whether you prefer jeepneys, buses, or ride-sharing services, getting around the city is convenient and affordable.

This is more than just a place to stay—it's a community where you can thrive. Contact us now to arrange a viewing and take the first step toward your new home!`
    ];

    // Return a random description
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  /**
   * Send a streaming message to Claude
   * @param {string} systemPrompt - System instructions
   * @param {string} userMessage - User's message
   * @param {Function} onChunk - Callback for each chunk of text
   * @param {Object} options - Additional options
   */
  async sendStreamingMessage(systemPrompt, userMessage, onChunk, options = {}) {
    // For mock data, simulate streaming
    if (this.config.useMockData) {
      const fullText = await this.generateMockResponse(systemPrompt, userMessage);
      const words = fullText.split(' ');
      let accumulated = '';

      for (const word of words) {
        accumulated += (accumulated ? ' ' : '') + word;
        onChunk(word + ' ', accumulated);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      return fullText;
    }

    // Backend streaming implementation would go here
    throw new Error('Streaming not yet implemented for backend proxy');
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return {
      ...this.config,
      useMockData: this.config.useMockData,
    };
  }
}

// Create singleton instance
const anthropicService = new AnthropicService();

console.log('✅ Anthropic AI Service initialized (Mock Mode)');

export default anthropicService;
