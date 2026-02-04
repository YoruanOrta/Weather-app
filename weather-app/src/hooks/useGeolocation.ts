import { useState, useEffect } from 'react';
import type { GeolocationCoords } from '../types/weather';

export const useGeolocation = () => {
  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('La geolocalización no está soportada en tu navegador');
      setLoading(false);
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      setLoading(false);
    };

    const errorHandler = (error: GeolocationPositionError) => {
      setError(error.message);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  }, []);

  return { coords, error, loading };
};