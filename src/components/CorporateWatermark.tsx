import React from 'react';

export type WatermarkIntensity = 'sutil' | 'corporativa' | 'fuerte' | 'desactivada';

export interface CorporateWatermarkProps {
  intensity?: WatermarkIntensity;
  showControlBadge?: boolean;
  onIntensityChange?: (intensity: WatermarkIntensity) => void;
}

/**
 * Componente desactivado según requerimiento del usuario (sin marcas de agua)
 */
export const CorporateWatermark: React.FC<CorporateWatermarkProps> = () => {
  return null;
};
