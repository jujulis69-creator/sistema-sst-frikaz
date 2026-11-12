// ============================================================================
// PESTAÑA 3: PARTES INTERESADAS EXTERNAS - FRIKAZ S.A.S.
// Proveedores · Ingeniero Staff · MinTrabajo · MinSalud · Sec. Salud · Clientes
// ============================================================================

import React, { useState } from 'react';
import { ParteInteresada } from '../../../types/partesInteresadas';
import {
  Globe2,
  Building,
  ShieldCheck,
  Scale,
  HeartHandshake,
  Store,
  Users,
  AlertTriangle,
  Shield,
  Clock,
  Search,
  Filter,
} from 'lucide-react';

interface PartesExternasTabProps {
  partes: ParteInteresada[];
}

export const PartesExternasTab: React.FC<PartesExternasTabProps> = ({ partes }) => {
  const [busqueda, setBusqueda] = useState('');
  const partesExternas = partes.filter((p) => p.clasificacion === 'externa');

  const partesFiltradas = partesExternas.filter((p) => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q) ||
      p.necesidadesExpectativas.toLowerCase().includes(q) ||
      p.peligrosSituaciones.toLowerCase().includes(q)
    );
  });

  const getIconoExterno = (nombre: string) => {
    const n = nombre.toLowerCase();
    if (n.includes('proveedor')) return <Store className="h-5 w-5 text-amber-600" />;
    if (n.includes('ingeniero') || n.includes('staff'))
      return <ShieldCheck className="h-5 w-5 text-emerald-600" />;
    if (n.includes('ministerio del trabajo'))
      return <Scale className="h-5 w-5 text-rose-600" />;
    if (n.includes('ministerio de salud') || n.includes('salud y protección'))
      return <HeartHandshake className="h-5 w-5 text-teal-600" />;
    if (n.includes('secretaría') || n.includes('secretaria'))
      return <Building className="h-5 w-5 text-sky-600" />;
    return <Users className="h-5 w-5 text-purple-600" />;
  };

  const getEntidadBadge = (nombre: string) => {
    const n = nombre.toLowerCase();
    if (n.includes('ministerio') || n.includes('secretaría') || n.includes('secretaria')) {
      return {
        label: 'Autoridad / Entidad de Vigilancia',
        cls: 'bg-rose-100 text-rose-800 border-rose-200',
      };
    }
    if (n.includes('ingeniero') || n.includes('staff')) {
      return {
        label: 'Asesor Técnico Especializado',
        cls: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      };
    }
    if (n.includes('proveedor')) {
      return {
        label: 'Cadena de Suministro',
        cls: 'bg-amber-100 text-amber-800 border-amber-200',
      };
    }
    return {
      label: 'Mercado y Consumidores',
      cls: 'bg-sky-100 text-sky-800 border-sky-200',
    };
  };

  return (
    <div className="space-y-6">
      {/* Kicker explicativo */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-md border border-sky-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-sky-300 font-bold text-xs uppercase tracking-wider block">
              Sección B · Contexto Externo y Cumplimiento Legal
            </span>
            <h2 className="text-xl font-black text-white">
              Partes Interesadas Externas de Frikaz S.A.S.
            </h2>
            <p className="text-xs text-sky-200/80 max-w-2xl leading-relaxed">
              Mapeo de autoridades de inspección, vigilancia y control (MinTrabajo, MinSalud, Sec. Salud), asesores técnicos en SST, proveedores de materias primas y clientes/consumidores finales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar parte externa..."
                className="pl-9 pr-4 py-2 rounded-xl bg-white/10 text-white placeholder-slate-400 border border-white/20 text-xs focus:outline-hidden focus:bg-white/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid con las 6 tarjetas de partes externas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {partesFiltradas.map((parte) => {
          const badge = getEntidadBadge(parte.nombre);
          return (
            <div
              key={parte.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                      {getIconoExterno(parte.nombre)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                        {parte.nombre}
                      </h3>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {parte.descripcion}
                </p>

                {/* Necesidades y expectativas */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-[11px] text-slate-900 block">
                    Necesidades y Expectativas Normativas:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {parte.necesidadesExpectativas}
                  </p>
                </div>

                {/* Peligros y posibles afectaciones */}
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                      <AlertTriangle className="h-3 w-3 text-amber-600 shrink-0" />
                      <span>Riesgos o Situaciones Críticas:</span>
                    </div>
                    <p className="text-[11px] text-amber-950 leading-relaxed">
                      {parte.peligrosSituaciones}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/60 space-y-1">
                    <span className="font-bold text-[11px] text-rose-900 block">
                      Posibles Afectaciones a Frikaz S.A.S.:
                    </span>
                    <p className="text-[11px] text-rose-950 leading-relaxed">
                      {parte.posiblesAfectaciones}
                    </p>
                  </div>
                </div>

                {/* Medidas de control */}
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-[11px]">
                    <Shield className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>Medidas de Prevención y Cumplimiento:</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    {parte.medidasPrevencionControl}
                  </p>
                </div>
              </div>

              {/* Pie de tarjeta con seguimiento */}
              <div className="p-3.5 px-5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate max-w-[260px]">
                    <strong>Seguimiento:</strong> {parte.seguimiento}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
