import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { locationSearchService, LocationSuggestion } from '../services/locationSearchService';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onUseLocation: () => void;
  isLoading: boolean;
}

export const SearchBar = ({ onSearch, onUseLocation, isLoading }: SearchBarProps) => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Buscar sugerencias mientras el usuario escribe
  useEffect(() => {
    const searchSuggestions = async () => {
      if (city.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoadingSuggestions(true);
      try {
        const results = await locationSearchService.searchLocations(city);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    // Debounce: esperar 300ms después de que el usuario deje de escribir
    const debounceTimer = setTimeout(searchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [city]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const searchQuery = locationSearchService.createSearchQuery(suggestion);
    setCity(suggestion.displayName);
    onSearch(searchQuery);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative" ref={suggestionsRef}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Buscar ciudad... (ej: Florida, Madrid, Ponce)"
            disabled={isLoading}
            className="w-full px-6 py-4 pr-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 focus:border-white/60 focus:outline-none text-lg text-white placeholder-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            autoComplete="off"
          />
          {loadingSuggestions ? (
            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-6 h-6 animate-spin" />
          ) : (
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-6 h-6" />
          )}
          
          {/* Sugerencias desplegables */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-black/50 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl max-h-96 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-6 py-4 text-left hover:bg-white/15 transition-colors flex items-center gap-3 ${
                    index === selectedIndex ? 'bg-white/20' : ''
                  } ${index === 0 ? 'rounded-t-2xl' : ''} ${
                    index === suggestions.length - 1 ? 'rounded-b-2xl' : 'border-b border-white/10'
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <MapPin className="w-5 h-5 text-sky-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">
                      {suggestion.name}
                    </p>
                    <p className="text-sm text-white/60 truncate">
                      {suggestion.region && suggestion.region !== suggestion.name && `${suggestion.region}, `}
                      {suggestion.country}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !city.trim()}
          className="px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl shadow-lg hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-all hover:scale-105 active:scale-95"
        >
          Buscar
        </button>
        
        <button
          type="button"
          onClick={onUseLocation}
          disabled={isLoading}
          className="px-6 py-4 bg-sky-500/60 backdrop-blur-md border border-sky-300/30 text-white rounded-2xl shadow-lg hover:bg-sky-500/80 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <MapPin className="w-5 h-5" />
          <span className="hidden sm:inline">Mi ubicación</span>
        </button>
      </form>
      
      {/* Mensaje de ayuda */}
      {city.length > 0 && !showSuggestions && !loadingSuggestions && suggestions.length === 0 && city.length >= 2 && (
        <p className="text-sm text-white/60 mt-2 text-center drop-shadow">
          No se encontraron resultados. Intenta con otro nombre.
        </p>
      )}
    </div>
  );
};