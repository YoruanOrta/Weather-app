import { useState, useEffect } from 'react';
import { WeatherCard }    from './components/WeatherCard';
import { ForecastCard }   from './components/ForecastCard';
import { SearchBar }      from './components/SearchBar';
import { Loading }        from './components/Loading';
import { ErrorMessage }   from './components/ErrorMessage';
import { RainBackground } from './components/RainBackground';
import { weatherService }   from './services/weatherService';
import { geocodingService } from './services/geocodingService';
import { useGeolocation }   from './hooks/useGeolocation';
import type { WeatherData, ForecastData } from './types/weather';

function App() {
  const [weather,  setWeather]  = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const { coords, error: geoError, loading: geoLoading } = useGeolocation();

  useEffect(() => {
    if (coords) {
      fetchWeatherByCoords(coords.latitude, coords.longitude);
    } else if (geoError) {
      setError('No se pudo acceder a tu ubicacion. Por favor, permite el acceso en tu navegador o busca una ciudad manualmente.');
    }
  }, [coords, geoError]);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(city),
        weatherService.getForecast(city)
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError('No se pudo encontrar la ciudad. Intenta con otra busqueda.');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherData, forecastData, geocodingData] = await Promise.all([
        weatherService.getCurrentWeatherByCoords(lat, lon),
        weatherService.getForecastByCoords(lat, lon),
        geocodingService.getLocationDetails(lat, lon)
      ]);

      const neighbourhood = geocodingService.getBestNeighbourhood(geocodingData);
      const cityFromGeo   = geocodingService.getBestCity(geocodingData);

      if (neighbourhood && neighbourhood !== weatherData.name)
        weatherData.neighbourhood = neighbourhood;
      if (cityFromGeo && cityFromGeo !== weatherData.name && neighbourhood)
        weatherData.region = cityFromGeo;

      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError('No se pudo obtener el clima de tu ubicacion.');
      console.error('Error fetching weather by coords:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (city: string) => fetchWeather(city);

  const handleUseLocation = () => {
    if (coords) fetchWeatherByCoords(coords.latitude, coords.longitude);
    else setError('No se pudo acceder a tu ubicacion. Verifica los permisos del navegador.');
  };

  // Calcular si es de noche usando la hora LOCAL del lugar (con timezone offset)
  const isNight = (() => {
    if (!weather) return false;
    
    // Obtener hora local del lugar usando timezone offset
    const timezone = (weather as any).timezone || 0;
    const utcNow = new Date();
    const localMs = utcNow.getTime() + utcNow.getTimezoneOffset() * 60000 + timezone * 1000;
    const localHour = new Date(localMs).getHours();
    
    // Es de noche si está entre 6pm (18:00) y 6am (6:00)
    return localHour >= 18 || localHour < 6;
  })();

  return (
    <>
      <RainBackground
        weatherCode={weather?.weather[0]?.id}
        isNight={isNight}
      />

      <div className="min-h-screen py-8 px-4 relative">
        <div className="container mx-auto">
          <header className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-2xl mb-2">
              ☁️ Weather App
            </h1>
            <p className="text-white/90 text-lg drop-shadow-lg">
              El clima en tiempo real, donde quieras
            </p>
          </header>

          <SearchBar
            onSearch={handleSearch}
            onUseLocation={handleUseLocation}
            isLoading={loading || geoLoading}
          />

          {(loading || geoLoading) && <Loading />}
          {error && !loading && !geoLoading && <ErrorMessage message={error} />}
          {weather && !loading && !geoLoading && !error && (
            <>
              <WeatherCard  weather={weather}   />
              {forecast && <ForecastCard forecast={forecast} />}
            </>
          )}

          <footer className="text-center mt-12 text-white/70 text-sm drop-shadow-lg">
            <p>Desarrollado con React + TypeScript + TailwindCSS</p>
            <p className="mt-1">Datos proporcionados por WeatherAPI y OpenWeatherMap</p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;