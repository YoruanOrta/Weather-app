#!/bin/bash

echo "🌤️  Weather App - Setup Rápido"
echo "================================"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Node.js
if ! command -v node &> /dev/null
then
    echo -e "${YELLOW}❌ Node.js no está instalado${NC}"
    echo "Por favor instala Node.js desde: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js encontrado: $(node --version)${NC}"

# Instalar dependencias
echo ""
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
npm install

# Crear archivo .env
if [ ! -f .env ]; then
    echo ""
    echo -e "${YELLOW}⚙️  Configurando variables de entorno...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  IMPORTANTE: Edita el archivo .env y añade tu API Key de OpenWeatherMap${NC}"
    echo "   Obtén tu API Key gratis en: https://openweathermap.org/api"
fi

echo ""
echo -e "${GREEN}✅ Instalación completada!${NC}"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Edita el archivo .env y añade tu API Key"
echo "   2. Ejecuta: npm run dev"
echo "   3. Abre http://localhost:5173 en tu navegador"
echo ""
echo -e "${BLUE}🚀 Comandos disponibles:${NC}"
echo "   npm run dev      - Inicia el servidor de desarrollo"
echo "   npm run build    - Crea el build de producción"
echo "   npm run preview  - Preview del build de producción"
echo ""
echo -e "${GREEN}¡Disfruta de tu Weather App! ☀️${NC}"