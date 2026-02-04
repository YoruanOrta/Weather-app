import { useEffect, useRef, useMemo } from 'react';

interface Raindrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  thickness: number;
}

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  opacity: number;
}

interface Splash {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  active: boolean;
}

// Imagenes distintas para cada condicion
const BG_IMAGES: Record<string, string> = {
  rain:        'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=1920&q=80&fit=crop',
  storm:       'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1920&q=80&fit=crop',
  snow:        'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920&q=80&fit=crop',
  cloudy:      'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&q=80&fit=crop',
  clear_day:   'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?w=1920&q=80&fit=crop',
  clear_night: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=1920&q=80&fit=crop',
  mist:        'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1920&q=80&fit=crop',
  default:     'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?w=1920&q=80&fit=crop',
};

function resolveCondition(code: number, isNight: boolean): string {
  // Tormenta
  if (code >= 200 && code < 300) return 'storm';
  
  // Lluvia
  if (code >= 300 && code < 400) return 'rain';
  if (code >= 500 && code < 600) return 'rain';
  
  // Nieve
  if (code >= 600 && code < 700) return 'snow';
  
  // Niebla
  if (code === 701 || code === 721 || code === 741) return 'mist';
  
  // Atmosfera (humo, polvo, etc)
  if (code >= 700 && code < 800) return 'cloudy';
  
  // Despejado
  if (code === 800) return isNight ? 'clear_night' : 'clear_day';
  
  // Nubes
  // 801 = pocas nubes (11-25%) → mostrar como despejado
  // 802 = nubes dispersas (25-50%) → mostrar como despejado
  // 803 = nubes rotas (51-84%) → mostrar como nublado
  // 804 = nublado (85-100%) → mostrar como nublado
  if (code === 801 || code === 802) {
    return isNight ? 'clear_night' : 'clear_day';
  }
  if (code > 800) return 'cloudy';
  
  return 'default';
}

interface RainBackgroundProps {
  weatherCode?: number;
  isNight?: boolean;
}

export const RainBackground = ({ weatherCode, isNight = false }: RainBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const dropsRef = useRef<Raindrop[]>([]);
  const snowRef = useRef<Snowflake[]>([]);
  const splashRef = useRef<Splash[]>([]);

  const condition = weatherCode != null ? resolveCondition(weatherCode, isNight) : 'default';
  const bgImage = BG_IMAGES[condition] || BG_IMAGES.default;
  const showRain = condition === 'rain' || condition === 'storm';
  const showSnow = condition === 'snow';

  const rainDrops = useMemo(() => {
    if (!showRain) return [];
    const W = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const H = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const drops: Raindrop[] = [];
    for (let i = 0; i < 320; i++) {
      drops.push({
        x: Math.random() * W,
        y: Math.random() * H,
        length: Math.random() * 25 + 12,
        speed: Math.random() * 6 + 4,
        opacity: Math.random() * 0.35 + 0.15,
        thickness: Math.random() * 1.5 + 0.5,
      });
    }
    return drops;
  }, [showRain]);

  const snowFlakes = useMemo(() => {
    if (!showSnow) return [];
    const W = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const H = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const flakes: Snowflake[] = [];
    for (let i = 0; i < 200; i++) {
      flakes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        drift: Math.random() * 2 - 1,
        opacity: Math.random() * 0.6 + 0.4,
      });
    }
    return flakes;
  }, [showSnow]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    dropsRef.current = rainDrops.map(d => ({ ...d }));
    snowRef.current = snowFlakes.map(s => ({ ...s }));
    splashRef.current = [];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width;
      const H = canvas.height;

      if (showRain) {
        dropsRef.current.forEach((drop, i) => {
          const g = ctx.createLinearGradient(drop.x, drop.y, drop.x + 2, drop.y + drop.length);
          g.addColorStop(0, 'rgba(255,255,255,0)');
          g.addColorStop(0.4, `rgba(200,215,240,${drop.opacity})`);
          g.addColorStop(1, `rgba(255,255,255,${drop.opacity * 0.8})`);

          ctx.beginPath();
          ctx.strokeStyle = g;
          ctx.lineWidth = drop.thickness;
          ctx.lineCap = 'round';
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + 2, drop.y + drop.length);
          ctx.stroke();

          drop.y += drop.speed;
          drop.x += 1;

          if (drop.y > H) {
            splashRef.current.push({ x: drop.x, y: H - 2, radius: 0, opacity: 0.5, active: true });
            dropsRef.current[i] = {
              x: Math.random() * W,
              y: -drop.length,
              length: Math.random() * 25 + 12,
              speed: Math.random() * 6 + 4,
              opacity: Math.random() * 0.35 + 0.15,
              thickness: Math.random() * 1.5 + 0.5,
            };
          }
        });

        splashRef.current = splashRef.current.filter(s => s.active);
        splashRef.current.forEach(s => {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(200,220,255,${s.opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          s.radius += 1.5;
          s.opacity -= 0.04;
          if (s.opacity <= 0) s.active = false;
        });
      }

      if (showSnow) {
        snowRef.current.forEach((flake, i) => {
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${flake.opacity})`;
          ctx.fill();

          flake.y += flake.speed;
          flake.x += flake.drift;

          if (flake.y > H) {
            snowRef.current[i] = {
              x: Math.random() * W,
              y: -10,
              radius: Math.random() * 3 + 1,
              speed: Math.random() * 1 + 0.5,
              drift: Math.random() * 2 - 1,
              opacity: Math.random() * 0.6 + 0.4,
            };
          }
        });
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [rainDrops, snowFlakes, showRain, showSnow]);

  return (
    <>
      <div
        key={`${condition}-${bgImage}`}
        className="fixed inset-0 -z-30 transition-all duration-1000"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 -z-20 bg-black/45" />
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />
    </>
  );
};