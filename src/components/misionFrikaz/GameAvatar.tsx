// ============================================================================
// COMPONENTE: AVATAR ILUSTRADO DE VIDEOJUEGO
// Frikaz S.A.S. — Exclusivamente avatares ilustrados oficiales para los 6 cargos
// ============================================================================

import React, { useState } from 'react';
import { getAvatarUrlPorCargo, GAME_IMAGES } from '../../services/gameAssets';
import { ShieldCheck, HardHat, Truck, UserCheck, Flame, Award } from 'lucide-react';

interface GameAvatarProps {
  cargoNombre?: string;
  avatarUrl?: string;
  nombre?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  borderAccent?: boolean;
  priority?: boolean;
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-11 h-11',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32',
};

export const GameAvatar: React.FC<GameAvatarProps> = ({
  cargoNombre = '',
  avatarUrl,
  nombre = 'Colaborador Frikaz',
  size = 'md',
  className = '',
  borderAccent = true,
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);

  // Obtener URL oficial ilustrada (si la URL dada es de Unsplash o está rota, se mapea al cargo oficial)
  const resolvedUrl = React.useMemo(() => {
    if (avatarUrl && !avatarUrl.includes('unsplash.com') && !avatarUrl.includes('http')) {
      return avatarUrl;
    }
    return getAvatarUrlPorCargo(cargoNombre);
  }, [avatarUrl, cargoNombre]);

  // JPG fallback en caso de navegador antiguo
  const jpgFallback = React.useMemo(() => {
    return resolvedUrl.replace('.webp', '.jpg');
  }, [resolvedUrl]);

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  if (hasError) {
    // Fallback vectorial dinámico según el cargo
    const norm = (cargoNombre || '').toLowerCase();
    let bgGradient = 'from-amber-600 to-orange-700';
    let Icon = Flame;

    if (norm.includes('gerent')) {
      bgGradient = 'from-blue-700 to-indigo-900';
      Icon = Award;
    } else if (norm.includes('conduct')) {
      bgGradient = 'from-amber-500 to-amber-700';
      Icon = Truck;
    } else if (norm.includes('pelad') || norm.includes('selecc')) {
      bgGradient = 'from-teal-600 to-emerald-800';
      Icon = HardHat;
    } else if (norm.includes('empaq')) {
      bgGradient = 'from-yellow-600 to-amber-800';
      Icon = UserCheck;
    }

    return (
      <div
        className={`${sizeClass} rounded-full bg-gradient-to-br ${bgGradient} flex items-center justify-center text-white font-black shadow-md border-2 border-amber-400/80 shrink-0 ${className}`}
        title={`${nombre} (${cargoNombre})`}
      >
        <Icon className="w-1/2 h-1/2" />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-block shrink-0 rounded-full overflow-hidden ${sizeClass} ${
        borderAccent ? 'ring-2 ring-amber-400/80 shadow-md shadow-amber-500/20' : ''
      } ${className}`}
    >
      <picture>
        <source srcSet={resolvedUrl} type="image/webp" />
        <source srcSet={jpgFallback} type="image/jpeg" />
        <img
          src={resolvedUrl}
          alt={`Avatar ilustrado de ${cargoNombre || nombre}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover object-center bg-slate-800"
        />
      </picture>
    </div>
  );
};
