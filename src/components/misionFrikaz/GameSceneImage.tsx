// ============================================================================
// COMPONENTE: IMAGEN DE ESCENARIO / ZONA DE VIDEOJUEGO
// Soporte multiformato (WebP + JPG fallback), carga diferida e integridad offline
// ============================================================================

import React, { useState } from 'react';
import { Factory, AlertTriangle, ShieldCheck } from 'lucide-react';

interface GameSceneImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  aspectRatioClass?: string;
}

export const GameSceneImage: React.FC<GameSceneImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  aspectRatioClass = 'h-full w-full',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Normalizar ruta para evitar dependencias de /src/ en producción
  const normalizedSrc = React.useMemo(() => {
    if (!src) return '/assets/images/game_factory_hero.webp';
    // Si la ruta contiene /src/assets/images/, convertirla a /assets/images/
    let path = src.replace('/src/assets/images/', '/assets/images/');
    // Si termina en .jpg, preferir .webp si existe
    if (path.endsWith('.jpg') && !path.includes('unsplash')) {
      path = path.replace('.jpg', '.webp');
    }
    return path;
  }, [src]);

  const jpgFallback = React.useMemo(() => {
    return normalizedSrc.replace('.webp', '.jpg');
  }, [normalizedSrc]);

  if (hasError) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-950 flex flex-col items-center justify-center p-6 text-center border border-slate-800 ${aspectRatioClass} ${className}`}
      >
        <Factory className="w-12 h-12 text-amber-500/60 mb-2 animate-pulse" />
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{alt}</span>
        <span className="text-[10px] text-slate-500 mt-1">Planta de Producción Frikaz S.A.S. (Bosa, Bogotá)</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectRatioClass}`}>
      {/* Skeleton / Placeholder mientras decodifica */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center">
          <Factory className="w-8 h-8 text-slate-700" />
        </div>
      )}
      <picture>
        <source srcSet={normalizedSrc} type="image/webp" />
        <source srcSet={jpgFallback} type="image/jpeg" />
        <img
          src={normalizedSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        />
      </picture>
    </div>
  );
};
