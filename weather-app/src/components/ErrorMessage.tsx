import { CloudOff } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md text-center shadow-xl">
        <CloudOff className="w-20 h-20 text-red-300 mb-4 mx-auto" />
        <p className="text-xl text-red-200 font-semibold">
          {message}
        </p>
        <p className="text-white/60 mt-2">
          Intenta buscar otra ciudad o verifica tu conexión
        </p>
      </div>
    </div>
  );
};