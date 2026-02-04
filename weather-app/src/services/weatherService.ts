import axios from 'axios';
import type { WeatherData, ForecastData } from '../types/weather';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo';
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';
const WEATHER_API_URL = 'https://api.weatherapi.com/v1';
const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

// Mapear descripciones de WeatherAPI a codigos de OpenWeather
const mapWeatherDescriptionToCode = (description: string): number => {
  const desc = description.toLowerCase();
  
  // Tormenta
  if (desc.includes('thunder') || desc.includes('tormenta')) return 200;
  
  // Lluvia
  if (desc.includes('rain') || desc.includes('lluvia') || desc.includes('drizzle') || desc.includes('llovizna')) {
    if (desc.includes('heavy') || desc.includes('torrencial')) return 502;
    if (desc.includes('light') || desc.includes('ligera')) return 500;
    return 501;
  }
  
  // Nieve
  if (desc.includes('snow') || desc.includes('nieve') || desc.includes('sleet')) return 600;
  
  // Niebla
  if (desc.includes('mist') || desc.includes('fog') || desc.includes('niebla')) return 741;
  
  // Despejado
  if (desc.includes('clear') || desc.includes('despejado') || desc.includes('sunny') || desc.includes('soleado')) {
    return 800;
  }
  
  // Nubes
  if (desc.includes('cloud') || desc.includes('nublado') || desc.includes('overcast') || desc.includes('nube')) {
    if (desc.includes('partly') || desc.includes('parcialmente')) return 801;
    if (desc.includes('broken') || desc.includes('scattered')) return 803;
    return 804;
  }
  
  // Default: despejado
  return 800;
};

// Funcion para convertir respuesta de WeatherAPI a formato compatible
const convertWeatherAPIToStandard = (data: any): any => {
  // Estimar timezone basado en longitud (cada 15 grados = 1 hora)
  // Esto es una aproximación cuando no tenemos el timezone real
  const estimatedTimezone = Math.round(data.location.lon / 15) * 3600;
  
  return {
    temp: data.current.temp_f,
    feels_like: data.current.feelslike_f,
    humidity: data.current.humidity,
    pressure: data.current.pressure_mb,
    wind_speed: data.current.wind_mph,
    wind_deg: data.current.wind_degree,
    visibility: data.current.vis_km * 1000,
    clouds: data.current.cloud,
    description: data.current.condition.text,
    icon: data.current.condition.icon,
    weather_id: mapWeatherDescriptionToCode(data.current.condition.text),
    dt: data.location.localtime_epoch,
    sunrise: data.forecast?.forecastday[0]?.astro?.sunrise,
    sunset: data.forecast?.forecastday[0]?.astro?.sunset,
    timezone: estimatedTimezone,
    name: data.location.name,
    region: data.location.region,
    country: data.location.country,
    lat: data.location.lat,
    lon: data.location.lon
  };
};

const convertOpenWeatherToStandard = (data: any): any => {
  return {
    temp: data.main.temp,
    feels_like: data.main.feels_like,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    wind_speed: data.wind.speed,
    wind_deg: data.wind.deg,
    visibility: data.visibility,
    clouds: data.clouds.all,
    weather_id: data.weather[0].id,
    weather_main: data.weather[0].main,
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    dt: data.dt,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timezone: data.timezone,
    name: data.name,
    region: null,
    country: data.sys.country,
    lat: data.coord.lat,
    lon: data.coord.lon
  };
};

// Funcion para promediar datos de multiples APIs
const averageWeatherData = (weatherAPiData: any, openWeatherData: any): WeatherData => {
  const avgTemp = (weatherAPiData.temp + openWeatherData.temp) / 2;
  const avgFeelsLike = (weatherAPiData.feels_like + openWeatherData.feels_like) / 2;
  const avgHumidity = Math.round((weatherAPiData.humidity + openWeatherData.humidity) / 2);
  const avgPressure = Math.round((weatherAPiData.pressure + openWeatherData.pressure) / 2);
  const avgWindSpeed = (weatherAPiData.wind_speed + openWeatherData.wind_speed) / 2;
  
  return {
    coord: {
      lon: weatherAPiData.lon,
      lat: weatherAPiData.lat
    },
    weather: [{
      id: openWeatherData.weather_id || 800,
      main: openWeatherData.weather_main || weatherAPiData.description,
      description: weatherAPiData.description,
      icon: weatherAPiData.icon
    }],
    base: 'stations',
    main: {
      temp: avgTemp,
      feels_like: avgFeelsLike,
      temp_min: avgTemp,
      temp_max: avgTemp,
      pressure: avgPressure,
      humidity: avgHumidity
    },
    visibility: weatherAPiData.visibility,
    wind: {
      speed: avgWindSpeed,
      deg: weatherAPiData.wind_deg
    },
    clouds: {
      all: weatherAPiData.clouds
    },
    dt: weatherAPiData.dt,
    sys: {
      country: weatherAPiData.country,
      sunrise: typeof weatherAPiData.sunrise === 'string' ? 
        new Date(`${new Date(weatherAPiData.dt * 1000).toDateString()} ${weatherAPiData.sunrise}`).getTime() / 1000 : 
        weatherAPiData.sunrise || 0,
      sunset: typeof weatherAPiData.sunset === 'string' ? 
        new Date(`${new Date(weatherAPiData.dt * 1000).toDateString()} ${weatherAPiData.sunset}`).getTime() / 1000 : 
        weatherAPiData.sunset || 0
    },
    timezone: openWeatherData.timezone || 0,
    id: 0,
    name: weatherAPiData.name,
    region: weatherAPiData.region,
    cod: 200
  } as any;
};

const convertForecastAPIToStandard = (data: any): ForecastData => {
  return {
    cod: '200',
    message: 0,
    cnt: data.forecast.forecastday.length,
    list: data.forecast.forecastday.flatMap((day: any) => 
      day.hour.filter((_: any, idx: number) => idx % 3 === 0).map((hour: any) => ({
        dt: hour.time_epoch,
        main: {
          temp: hour.temp_f,
          feels_like: hour.feelslike_f,
          temp_min: hour.temp_f,
          temp_max: hour.temp_f,
          pressure: hour.pressure_mb,
          humidity: hour.humidity
        },
        weather: [{
          id: hour.condition.code,
          main: hour.condition.text,
          description: hour.condition.text,
          icon: hour.condition.icon
        }],
        clouds: {
          all: hour.cloud
        },
        wind: {
          speed: hour.wind_mph,
          deg: hour.wind_degree
        },
        dt_txt: new Date(hour.time_epoch * 1000).toISOString()
      }))
    ),
    city: {
      id: 0,
      name: data.location.name,
      coord: {
        lat: data.location.lat,
        lon: data.location.lon
      },
      country: 'PR',
      population: 0,
      timezone: 0,
      sunrise: 0,
      sunset: 0
    }
  };
};

export const weatherService = {
  async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
      const [weatherAPIResponse, openWeatherResponse] = await Promise.allSettled([
        axios.get(`${WEATHER_API_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=1&aqi=no&alerts=no&lang=es`),
        axios.get(`${OPENWEATHER_API_URL}/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=imperial&lang=es`)
      ]);

      const weatherAPIData = weatherAPIResponse.status === 'fulfilled' ? 
        convertWeatherAPIToStandard(weatherAPIResponse.value.data) : null;
      
      const openWeatherData = openWeatherResponse.status === 'fulfilled' ? 
        convertOpenWeatherToStandard(openWeatherResponse.value.data) : null;

      if (weatherAPIData && openWeatherData) {
        return averageWeatherData(weatherAPIData, openWeatherData);
      }

      if (weatherAPIData) {
        return {
          coord: { lon: weatherAPIData.lon, lat: weatherAPIData.lat },
          weather: [{ 
            id: weatherAPIData.weather_id, 
            main: weatherAPIData.description, 
            description: weatherAPIData.description, 
            icon: weatherAPIData.icon 
          }],
          base: 'stations',
          main: {
            temp: weatherAPIData.temp,
            feels_like: weatherAPIData.feels_like,
            temp_min: weatherAPIData.temp,
            temp_max: weatherAPIData.temp,
            pressure: weatherAPIData.pressure,
            humidity: weatherAPIData.humidity
          },
          visibility: weatherAPIData.visibility,
          wind: { speed: weatherAPIData.wind_speed, deg: weatherAPIData.wind_deg },
          clouds: { all: weatherAPIData.clouds },
          dt: weatherAPIData.dt,
          sys: {
            country: weatherAPIData.country,
            sunrise: typeof weatherAPIData.sunrise === 'string' ? 
              new Date(`${new Date(weatherAPIData.dt * 1000).toDateString()} ${weatherAPIData.sunrise}`).getTime() / 1000 : 0,
            sunset: typeof weatherAPIData.sunset === 'string' ? 
              new Date(`${new Date(weatherAPIData.dt * 1000).toDateString()} ${weatherAPIData.sunset}`).getTime() / 1000 : 0
          },
          timezone: weatherAPIData.timezone,
          id: 0,
          name: weatherAPIData.name,
          region: weatherAPIData.region,
          cod: 200
        } as any;
      }

      throw new Error('No se pudo obtener datos del clima');
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  },

  async getCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      const [weatherAPIResponse, openWeatherResponse] = await Promise.allSettled([
        axios.get(`${WEATHER_API_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=1&aqi=no&alerts=no&lang=es`),
        axios.get(`${OPENWEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=imperial&lang=es`)
      ]);

      const weatherAPIData = weatherAPIResponse.status === 'fulfilled' ? 
        convertWeatherAPIToStandard(weatherAPIResponse.value.data) : null;
      
      const openWeatherData = openWeatherResponse.status === 'fulfilled' ? 
        convertOpenWeatherToStandard(openWeatherResponse.value.data) : null;

      if (weatherAPIData && openWeatherData) {
        return averageWeatherData(weatherAPIData, openWeatherData);
      }

      if (weatherAPIData) {
        return {
          coord: { lon: weatherAPIData.lon, lat: weatherAPIData.lat },
          weather: [{ 
            id: weatherAPIData.weather_id, 
            main: weatherAPIData.description, 
            description: weatherAPIData.description, 
            icon: weatherAPIData.icon 
          }],
          base: 'stations',
          main: {
            temp: weatherAPIData.temp,
            feels_like: weatherAPIData.feels_like,
            temp_min: weatherAPIData.temp,
            temp_max: weatherAPIData.temp,
            pressure: weatherAPIData.pressure,
            humidity: weatherAPIData.humidity
          },
          visibility: weatherAPIData.visibility,
          wind: { speed: weatherAPIData.wind_speed, deg: weatherAPIData.wind_deg },
          clouds: { all: weatherAPIData.clouds },
          dt: weatherAPIData.dt,
          sys: {
            country: weatherAPIData.country,
            sunrise: typeof weatherAPIData.sunrise === 'string' ? 
              new Date(`${new Date(weatherAPIData.dt * 1000).toDateString()} ${weatherAPIData.sunrise}`).getTime() / 1000 : 0,
            sunset: typeof weatherAPIData.sunset === 'string' ? 
              new Date(`${new Date(weatherAPIData.dt * 1000).toDateString()} ${weatherAPIData.sunset}`).getTime() / 1000 : 0
          },
          timezone: weatherAPIData.timezone,
          id: 0,
          name: weatherAPIData.name,
          region: weatherAPIData.region,
          cod: 200
        } as any;
      }

      throw new Error('No se pudo obtener datos del clima');
    } catch (error) {
      console.error('Error fetching weather by coords:', error);
      throw error;
    }
  },

  async getForecast(city: string): Promise<ForecastData> {
    const response = await axios.get(
      `${WEATHER_API_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=5&aqi=no&alerts=no&lang=es`
    );
    return convertForecastAPIToStandard(response.data);
  },

  async getForecastByCoords(lat: number, lon: number): Promise<ForecastData> {
    const response = await axios.get(
      `${WEATHER_API_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=5&aqi=no&alerts=no&lang=es`
    );
    return convertForecastAPIToStandard(response.data);
  },

  getWeatherIconUrl(icon: string): string {
    if (icon.startsWith('http')) return icon;
    if (icon.includes('//cdn.weatherapi.com')) return `https:${icon}`;
    return `https://cdn.weatherapi.com/weather/64x64/day/${icon}.png`;
  }
};