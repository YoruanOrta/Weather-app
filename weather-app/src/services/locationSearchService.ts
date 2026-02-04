import axios from 'axios';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo';
const WEATHER_API_URL = 'https://api.weatherapi.com/v1';

export interface LocationSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
  displayName: string;
}

export const locationSearchService = {
  async searchLocations(query: string): Promise<LocationSuggestion[]> {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const response = await axios.get(`${WEATHER_API_URL}/search.json`, {
        params: {
          key: WEATHER_API_KEY,
          q: query.trim()
        }
      });

      return response.data.map((location: any) => ({
        id: location.id,
        name: location.name,
        region: location.region,
        country: location.country,
        lat: location.lat,
        lon: location.lon,
        url: location.url,
        displayName: this.formatDisplayName(location)
      }));
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  },

  formatDisplayName(location: any): string {
    const parts = [];
    
    if (location.name) {
      parts.push(location.name);
    }
    
    if (location.region && location.region !== location.name) {
      parts.push(location.region);
    }
    
    if (location.country) {
      parts.push(location.country);
    }
    
    return parts.join(', ');
  },

  createSearchQuery(location: LocationSuggestion): string {
    return `${location.name}, ${location.country}`;
  }
};