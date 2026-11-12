import { NormaPhvaItem } from '../types/phvaEvidence';
import { NORMS_PLANEAR } from './normsPlanear';
import { NORMS_HACER } from './normsHacer';
import { NORMS_VERIFICAR } from './normsVerificar';
import { NORMS_ACTUAR } from './normsActuar';

// Las 74 normas completas y oficiales para Frikaz S.A.S. distribuidas en el Ciclo PHVA
export const INITIAL_PHVA_NORMS: NormaPhvaItem[] = [
  ...NORMS_PLANEAR,
  ...NORMS_HACER,
  ...NORMS_VERIFICAR,
  ...NORMS_ACTUAR,
];
