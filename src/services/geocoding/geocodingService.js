/**
 * Geocoding Service
 * Uses Google Maps Geocoding API to convert addresses to coordinates
 * and validate Philippines addresses
 */

class GeocodingService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  }

  /**
   * Check if service is available
   */
  isAvailable() {
    return !!this.apiKey && this.apiKey !== 'your_google_maps_api_key_here';
  }

  /**
   * Geocode an address to get coordinates
   * @param {string} address - Full address to geocode
   * @returns {Promise<Object>} Geocoded location data
   */
  async geocodeAddress(address) {
    if (!this.isAvailable()) {
      throw new Error('Google Maps API key is not configured');
    }

    if (!address || address.trim().length === 0) {
      throw new Error('Address is required');
    }

    try {
      const url = `${this.baseUrl}?address=${encodeURIComponent(address)}&key=${this.apiKey}&region=ph`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        
        return {
          success: true,
          address: result.formatted_address,
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          placeId: result.place_id,
          addressComponents: this._parseAddressComponents(result.address_components),
          bounds: result.geometry.bounds,
          locationType: result.geometry.location_type,
          viewport: result.geometry.viewport,
        };
      } else {
        throw new Error(this._getErrorMessage(data.status));
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  /**
   * Validate if address is in Philippines
   * @param {string} address - Address to validate
   * @returns {Promise<Object>} Validation result
   */
  async validatePhilippinesAddress(address) {
    try {
      const result = await this.geocodeAddress(address);
      
      // Check if coordinates are within Philippines bounds
      const isInPhilippines = this._isWithinPhilippines(
        result.latitude,
        result.longitude
      );

      // Check if country is Philippines
      const country = result.addressComponents.country;
      const isPhilippinesCountry = country?.toLowerCase().includes('philippines');

      return {
        success: true,
        isValid: isInPhilippines && isPhilippinesCountry,
        location: result,
        message: isInPhilippines && isPhilippinesCountry
          ? 'Valid Philippines address'
          : 'Address is not in Philippines',
      };
    } catch (error) {
      return {
        success: false,
        isValid: false,
        message: error.message,
      };
    }
  }

  /**
   * Reverse geocode coordinates to address
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>} Address data
   */
  async reverseGeocode(lat, lng) {
    if (!this.isAvailable()) {
      throw new Error('Google Maps API key is not configured');
    }

    if (!lat || !lng) {
      throw new Error('Latitude and longitude are required');
    }

    try {
      const url = `${this.baseUrl}?latlng=${lat},${lng}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        
        return {
          success: true,
          address: result.formatted_address,
          latitude: lat,
          longitude: lng,
          placeId: result.place_id,
          addressComponents: this._parseAddressComponents(result.address_components),
        };
      } else {
        throw new Error(this._getErrorMessage(data.status));
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  /**
   * Get coordinates from Place ID
   * @param {string} placeId - Google Place ID
   * @returns {Promise<Object>} Location data
   */
  async getLocationFromPlaceId(placeId) {
    if (!this.isAvailable()) {
      throw new Error('Google Maps API key is not configured');
    }

    try {
      const url = `${this.baseUrl}?place_id=${placeId}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        
        return {
          success: true,
          address: result.formatted_address,
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          placeId: result.place_id,
          addressComponents: this._parseAddressComponents(result.address_components),
        };
      } else {
        throw new Error(this._getErrorMessage(data.status));
      }
    } catch (error) {
      console.error('Place ID geocoding error:', error);
      throw error;
    }
  }

  /**
   * Check if coordinates are within Philippines bounds
   * @private
   */
  _isWithinPhilippines(lat, lng) {
    // Philippines approximate bounds
    const PHILIPPINES_BOUNDS = {
      north: 21.5,
      south: 4.5,
      east: 127.0,
      west: 116.0,
    };

    return (
      lat >= PHILIPPINES_BOUNDS.south &&
      lat <= PHILIPPINES_BOUNDS.north &&
      lng >= PHILIPPINES_BOUNDS.west &&
      lng <= PHILIPPINES_BOUNDS.east
    );
  }

  /**
   * Parse address components into structured object
   * @private
   */
  _parseAddressComponents(components) {
    const parsed = {
      streetNumber: null,
      route: null,
      barangay: null,
      city: null,
      province: null,
      region: null,
      country: null,
      postalCode: null,
    };

    components.forEach((component) => {
      const types = component.types;

      if (types.includes('street_number')) {
        parsed.streetNumber = component.long_name;
      }
      if (types.includes('route')) {
        parsed.route = component.long_name;
      }
      if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
        parsed.barangay = component.long_name;
      }
      if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        parsed.city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        parsed.province = component.long_name;
      }
      if (types.includes('administrative_area_level_0')) {
        parsed.region = component.long_name;
      }
      if (types.includes('country')) {
        parsed.country = component.long_name;
      }
      if (types.includes('postal_code')) {
        parsed.postalCode = component.long_name;
      }
    });

    return parsed;
  }

  /**
   * Get error message from status code
   * @private
   */
  _getErrorMessage(status) {
    const messages = {
      ZERO_RESULTS: 'No results found for this address',
      OVER_QUERY_LIMIT: 'API query limit exceeded. Please try again later.',
      REQUEST_DENIED: 'Geocoding request was denied. Check your API key.',
      INVALID_REQUEST: 'Invalid geocoding request',
      UNKNOWN_ERROR: 'Geocoding failed due to server error. Please try again.',
    };

    return messages[status] || `Geocoding failed with status: ${status}`;
  }

  /**
   * Format coordinates for display
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} precision - Decimal places (default: 6)
   * @returns {string} Formatted coordinates
   */
  formatCoordinates(lat, lng, precision = 6) {
    return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
  }

  /**
   * Calculate distance between two coordinates (in km)
   * Uses Haversine formula
   * @param {number} lat1 - First latitude
   * @param {number} lng1 - First longitude
   * @param {number} lat2 - Second latitude
   * @param {number} lng2 - Second longitude
   * @returns {number} Distance in kilometers
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = this._toRadians(lat2 - lat1);
    const dLng = this._toRadians(lng2 - lng1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this._toRadians(lat1)) *
        Math.cos(this._toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Convert degrees to radians
   * @private
   */
  _toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
}

// Export singleton instance
export const geocodingService = new GeocodingService();
export default geocodingService;
