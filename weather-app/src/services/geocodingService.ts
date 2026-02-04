import axios from 'axios';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

export interface GeocodingResult {
  neighbourhood?: string;
  suburb?: string;
  village?: string;
  town?: string;
  city?: string;
  municipality?: string;
  state?: string;
  country?: string;
}

export const geocodingService = {
  async getLocationDetails(lat: number, lon: number): Promise<GeocodingResult> {
    try {
      // Solo una consulta con zoom 12 para barrios generales
      const response = await axios.get(NOMINATIM_URL, {
        params: {
          lat,
          lon,
          format: 'json',
          addressdetails: 1,
          'accept-language': 'es',
          zoom: 12 // Nivel general para barrios principales
        },
        headers: {
          'User-Agent': 'WeatherApp/1.0'
        }
      });

      const address = response.data.address || {};
      
      return {
        neighbourhood: address.neighbourhood || address.suburb || address.quarter,
        village: address.village,
        town: address.town,
        city: address.city || address.municipality,
        municipality: address.municipality,
        state: address.state,
        country: address.country
      };
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      return {};
    }
  },

  // Verificar si un nombre de barrio es demasiado específico
  isTooSpecific(name: string): boolean {
    const tooSpecificPatterns = [
      /^calle/i,
      /^avenida/i,
      /^sector\s+\d+/i,
      /^carretera/i,
      /^km\s*\d+/i,
      /^PR-\d+/i,
      /^\d+$/,
      /^urb\./i,
      /^bo\./i
    ];
    
    return tooSpecificPatterns.some(pattern => pattern.test(name));
  },

  // Función para obtener el mejor nombre de barrio
  getBestNeighbourhood(geocoding: GeocodingResult): string | null {
    const candidates = [
      geocoding.neighbourhood,
      geocoding.suburb
    ].filter(Boolean);
    
    for (const candidate of candidates) {
      if (candidate && !this.isTooSpecific(candidate)) {
        return candidate;
      }
    }
    
    return null;
  },

  // Función para obtener el mejor nombre de ciudad/pueblo
  getBestCity(geocoding: GeocodingResult): string | null {
    return geocoding.city || geocoding.town || geocoding.municipality || null;
  }
};