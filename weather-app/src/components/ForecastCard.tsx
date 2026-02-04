import type { ForecastData } from '../types/weather';
import { capitalizeFirst } from '../utils/formatters';
import { weatherService } from '../services/weatherService';

interface ForecastCardProps {
  forecast: ForecastData;
}

interface DayData {
  dt: number;
  tempMax: number;
  tempMin: number;
  icon: string;
  description: string;
  humidity: number;
  windSpeed: number;
}

export const ForecastCard = ({ forecast }: ForecastCardProps) => {
  // Agrupar por dia y calcular max/min
  const getDailyForecast = (): DayData[] => {
    const days = new Map<string, { temps: number[]; items: any[] }>();

    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];
      if (!days.has(dateKey)) {
        days.set(dateKey, { temps: [], items: [] });
      }
      const entry = days.get(dateKey)!;
      entry.temps.push(item.main.temp);
      entry.items.push(item);
    });

    const result: DayData[] = [];

    days.forEach((entry) => {
      // Tomar el item mas cercano al mediodia como representante
      let best = entry.items[0];
      let bestDiff = Infinity;
      entry.items.forEach((item) => {
        const h = new Date(item.dt * 1000).getHours();
        const diff = Math.abs(h - 12);
        if (diff < bestDiff) { bestDiff = diff; best = item; }
      });

      result.push({
        dt: best.dt,
        tempMax: Math.round(Math.max(...entry.temps)),
        tempMin: Math.round(Math.min(...entry.temps)),
        icon: best.weather[0].icon,
        description: best.weather[0].description,
        humidity: best.main.humidity,
        windSpeed: best.wind.speed,
      });
    });

    return result.slice(0, 5);
  };

  const dailyForecast = getDailyForecast();
  if (dailyForecast.length === 0) return null;

  // Nombres de dia en espanol
  const getDayName = (dt: number) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const d = new Date(dt * 1000);
    return `${capitalizeFirst(days[d.getDay()])} ${d.getDate()} ${months[d.getMonth()]}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-slide-up">
      <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-4">
        Pronostico de 5 dias
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {dailyForecast.map((day) => (
          <div
            key={day.dt}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 hover:bg-white/20 transition-all hover:scale-105"
          >
            {/* Dia */}
            <p className="text-sm font-semibold text-white/80 text-center mb-2">
              {getDayName(day.dt)}
            </p>

            {/* Icono */}
            <div className="flex justify-center mb-2">
              <img
                src={weatherService.getWeatherIconUrl(day.icon)}
                alt={day.description}
                className="w-16 h-16"
              />
            </div>

            {/* Max / Min */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <p className="text-xl font-bold text-white">{day.tempMax}°</p>
                <span className="text-white/30">/</span>
                <p className="text-lg text-white/55">{day.tempMin}°</p>
              </div>
              <p className="text-xs text-white/60 capitalize mt-1">
                {day.description}
              </p>
            </div>

            {/* Humedad y viento */}
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex justify-between text-xs text-white/60">
                <span>💧 {day.humidity}%</span>
                <span>💨 {day.windSpeed.toFixed(1)}mph</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};