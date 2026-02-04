import { Cloud, Droplets, Wind, Eye, Gauge, Clock } from 'lucide-react';
import type { WeatherData } from '../types/weather';
import { formatDate, formatTime, getWindDirection, capitalizeFirst } from '../utils/formatters';
import { weatherService } from '../services/weatherService';

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard = ({ weather }: WeatherCardProps) => {
  const getCountryDisplay = () => {
    const country = weather.sys.country;
    const region = weather.region;
    if (region === 'Puerto Rico' || country === 'PR') return 'PR';
    if (country === 'US' || country === 'USA' || country === 'United States' || country === 'United States of America') return 'USA';
    return country;
  };

  // Hora local del lugar usando timezone offset de la API
  const getLocalTime = () => {
    const offset = (weather as any).timezone;
    if (offset != null) {
      const utcNow = new Date();
      const localMs = utcNow.getTime() + utcNow.getTimezoneOffset() * 60000 + offset * 1000;
      const local = new Date(localMs);
      let h = local.getHours();
      const m = local.getMinutes().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'p. m.' : 'a. m.';
      h = h % 12 || 12;
      return `${h}:${m} ${ampm}`;
    }
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'p. m.' : 'a. m.';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 text-white animate-fade-in">
        <div className="flex flex-col items-center">

          {/* 1. Barrio */}
          {weather.neighbourhood && (
            <h2 className="text-4xl font-bold mb-1">{weather.neighbourhood}</h2>
          )}

          {/* 2. Ciudad */}
          <p className={`opacity-95 mb-1 ${weather.neighbourhood ? 'text-2xl' : 'text-4xl font-bold'}`}>
            {weather.name}
          </p>

          {/* 3. Pais */}
          <p className="text-xl opacity-90 mb-2">{getCountryDisplay()}</p>

          {/* Fecha | Hora en una linea */}
          <div className="flex items-center gap-4 mb-6 opacity-80">
            <p className="text-base">{formatDate(weather.dt)}</p>
            <span className="text-white/40">|</span>
            <p className="text-base flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {getLocalTime()}
            </p>
          </div>

          {/* Icono + Temperatura */}
          <div className="flex items-center justify-center mb-6">
            <img
              src={weatherService.getWeatherIconUrl(weather.weather[0].icon)}
              alt={weather.weather[0].description}
              className="w-32 h-32"
            />
            <div className="text-7xl font-bold ml-4">
              {Math.round(weather.main.temp)}°F
            </div>
          </div>

          {/* Descripcion + Sensacion termica */}
          <p className="text-2xl capitalize mb-2">
            {capitalizeFirst(weather.weather[0].description)}
          </p>
          <p className="text-lg opacity-90">
            Sensacion termica: {Math.round(weather.main.feels_like)}°F
          </p>
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 animate-slide-up">
        <DetailCard icon={<Droplets className="w-6 h-6" />} label="Humedad" value={`${weather.main.humidity}%`} />
        <DetailCard icon={<Wind className="w-6 h-6" />} label="Viento" value={`${weather.wind.speed.toFixed(1)} mph ${getWindDirection(weather.wind.deg)}`} />
        <DetailCard icon={<Gauge className="w-6 h-6" />} label="Presion" value={`${weather.main.pressure} hPa`} />
        <DetailCard icon={<Eye className="w-6 h-6" />} label="Visibilidad" value={`${(weather.visibility / 1000).toFixed(1)} km`} />
        <DetailCard icon={<Cloud className="w-6 h-6" />} label="Nubosidad" value={`${weather.clouds.all}%`} />
        <DetailCard icon={<span className="text-2xl">🌅</span>} label="Amanecer/Atardecer" value={`${formatTime(weather.sys.sunrise)} / ${formatTime(weather.sys.sunset)}`} />
      </div>
    </div>
  );
};

interface DetailCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailCard = ({ icon, label, value }: DetailCardProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 hover:bg-white/20 transition-all">
      <div className="flex items-center gap-3 mb-2 text-sky-200">
        {icon}
        <span className="font-semibold text-white/80">{label}</span>
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
};