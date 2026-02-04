# ⚡ Guía de Inicio Rápido - Weather App

## 🚀 Instalación en 3 pasos

### 1️⃣ Instalar dependencias

```bash
npm install
```

### 2️⃣ Configurar API Key

Crea un archivo `.env` (copia de `.env.example`):

```bash
cp .env.example .env
```

Edita `.env` y añade tu API Key:

```env
VITE_WEATHER_API_KEY=TU_API_KEY_AQUI
```

**¿Dónde obtener la API Key?**

1. Ve a <https://openweathermap.org/api>
2. Crea una cuenta GRATIS
3. Copia tu API Key del dashboard
4. Pégala en el archivo `.env`

### 3️⃣ Iniciar la aplicación

```bash
npm run dev
```

¡Listo! Abre <http://localhost:5173> en tu navegador 🎉

---

## 🛠️ Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Crea el build optimizado para producción |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | Verifica errores en el código |

---

## 📱 Características Principales

✨ **Diseño Responsivo**

- Funciona perfectamente en laptop, tablet y móvil
- Diseño adaptativo con TailwindCSS

🌍 **Geolocalización Automática**

- Detecta tu ubicación automáticamente
- Muestra el clima de tu ciudad al abrir

🔍 **Búsqueda Global**

- Busca el clima en cualquier ciudad del mundo
- Resultados instantáneos

📊 **Pronóstico Extendido**

- Previsión de 5 días
- Datos detallados (temperatura, humedad, viento, etc.)

⚡ **PWA (Progressive Web App)**

- Instálala como app nativa
- Funciona offline con caché
- Actualizaciones automáticas

---

## 🎨 Stack Tecnológico

- **React 18** - Librería UI moderna
- **TypeScript** - Seguridad de tipos
- **Vite** - Build tool ultra rápido (HMR instantáneo)
- **TailwindCSS** - Estilos utility-first
- **SWC** - Compilador de JavaScript ultra rápido
- **PWA** - App instalable

---

## 🐛 Solución de Problemas

**❌ Error: "Failed to fetch"**

- Verifica tu conexión a internet
- Asegúrate de tener la API Key correcta en `.env`

**❌ Error: "API key not found"**

- Asegúrate de crear el archivo `.env`
- La variable debe llamarse `VITE_WEATHER_API_KEY`
- Reinicia el servidor después de editar `.env`

**❌ Geolocalización no funciona**

- Da permisos de ubicación al navegador
- Usa HTTPS o localhost (no funciona en HTTP)

**❌ Los cambios no se reflejan**

- El Hot Module Replacement (HMR) es automático
- Si no funciona, reinicia el servidor con `Ctrl+C` y `npm run dev`

---

## 📦 Estructura del Proyecto

```
weather-app/
├── src/
│   ├── components/        # Componentes React
│   ├── hooks/            # Custom hooks (useGeolocation)
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   ├── utils/            # Utilidades (formatters)
│   ├── App.tsx           # Componente principal
│   └── main.tsx          # Entry point
├── public/               # Assets estáticos
├── index.html           # HTML principal
├── vite.config.ts       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind
└── package.json         # Dependencias

```

---

## 🌟 Próximas Mejoras

Ideas para expandir la app:

- [ ] Tema oscuro/claro
- [ ] Múltiples idiomas
- [ ] Gráficos interactivos
- [ ] Alertas del clima
- [ ] Comparar ciudades
- [ ] Historial de búsquedas
- [ ] Compartir en redes sociales
- [ ] Widget para escritorio

---

## 📞 Soporte

¿Tienes problemas?

1. Lee la documentación completa en `README.md`
2. Verifica los issues en GitHub
3. Crea un nuevo issue si es necesario

---

**¡Hecho con ❤️ usando las tecnologías más modernas!**
