# 🌤️ Weather App

Una aplicación del clima moderna y responsiva construida con las tecnologías más recientes y optimizadas.

## ✨ Características

- 🎨 **Diseño Moderno**: Interfaz limpia y atractiva con gradientes y animaciones
- 📱 **100% Responsivo**: Optimizado para laptop, tablet y móvil
- 🌍 **Geolocalización**: Detecta automáticamente tu ubicación
- 🔍 **Búsqueda de Ciudades**: Busca el clima en cualquier ciudad del mundo
- 📊 **Pronóstico Extendido**: Previsión del tiempo para los próximos 5 días
- ⚡ **PWA**: Instalable como aplicación nativa
- 🚀 **Rendimiento Optimizado**: Carga rápida y caché inteligente
- 🌐 **Multiidioma**: Interfaz en español

## 🛠️ Tecnologías

- **React 18** - Librería UI moderna
- **TypeScript** - Tipado estático para mayor seguridad
- **Vite** - Build tool ultra rápido
- **TailwindCSS** - Framework CSS utility-first
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos modernos
- **PWA** - Progressive Web App

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- API Key de OpenWeatherMap (gratis)

## 🚀 Instalación

1. **Clona el repositorio**

```bash
git clone https://github.com/tu-usuario/weather-app.git
cd weather-app
```

2. **Instala las dependencias**

```bash
npm install
```

3. **Configura la API Key**

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` y añade tu API Key de OpenWeatherMap:

```env
VITE_WEATHER_API_KEY=tu_api_key_aqui
```

**Obtener API Key gratis:**

- Ve a [OpenWeatherMap](https://openweathermap.org/api)
- Crea una cuenta gratuita
- Genera tu API Key en el panel de control

4. **Inicia el servidor de desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Build para Producción

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `dist/`

## 🌐 Preview de Producción

```bash
npm run preview
```

## 📱 Características PWA

La aplicación se puede instalar como PWA:

1. En el navegador, busca el ícono de instalación en la barra de direcciones
2. Haz clic en "Instalar"
3. La app se instalará como aplicación nativa

**Beneficios:**

- Funciona offline (caché de 30 minutos)
- Ícono en el escritorio/pantalla de inicio
- Experiencia de app nativa
- Notificaciones push (futuro)

## 🎨 Personalización

### Cambiar el tema de colores

Edita `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      // Añade tus colores personalizados
    }
  }
}
```

### Añadir más datos del clima

1. Revisa la [documentación de OpenWeatherMap API](https://openweathermap.org/api)
2. Actualiza `src/types/weather.ts` con nuevos tipos
3. Modifica `src/services/weatherService.ts` para obtener más datos
4. Actualiza los componentes para mostrar la información

## 📊 Estructura del Proyecto

```
weather-app/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes React
│   │   ├── WeatherCard.tsx
│   │   ├── ForecastCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorMessage.tsx
│   ├── hooks/          # Custom hooks
│   │   └── useGeolocation.ts
│   ├── services/       # Servicios API
│   │   └── weatherService.ts
│   ├── types/          # TypeScript types
│   │   └── weather.ts
│   ├── utils/          # Funciones utilidad
│   │   └── formatters.ts
│   ├── App.tsx         # Componente principal
│   ├── main.tsx        # Entry point
│   └── index.css       # Estilos globales
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🐛 Solución de Problemas

**Error: "API key inválida"**

- Verifica que tu API key esté correcta en el archivo `.env`
- Asegúrate de que la variable se llame `VITE_WEATHER_API_KEY`
- Reinicia el servidor de desarrollo después de cambiar `.env`

### Error de geolocalización

- Asegúrate de dar permisos de ubicación al navegador
- Usa HTTPS o localhost (la geolocalización no funciona en HTTP)

### La app no se actualiza

- Borra la caché del navegador
- Verifica que el service worker esté actualizado

## 🤝 Contribuciones

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 🙏 Créditos

- Datos del clima: [OpenWeatherMap](https://openweathermap.org/)
- Iconos: [Lucide Icons](https://lucide.dev/)
- Framework: [React](https://react.dev/)

## 📧 Contacto

Tu Nombre - [@tu_twitter](https://twitter.com/tu_twitter)

Link del Proyecto: [https://github.com/tu-usuario/weather-app](https://github.com/tu-usuario/weather-app)

---

**¡Hecho con ❤️ y ☕!**
