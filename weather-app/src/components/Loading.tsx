import { Cloud } from 'lucide-react';

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
      <Cloud className="w-20 h-20 text-white animate-pulse-slow mb-4 drop-shadow-lg" />
      <p className="text-xl text-white font-semibold drop-shadow-lg">Cargando clima...</p>
    </div>
  );
};