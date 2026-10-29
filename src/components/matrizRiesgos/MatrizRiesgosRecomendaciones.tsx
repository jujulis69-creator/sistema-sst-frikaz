import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  AlertOctagon,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Printer,
  Clock,
  Layers,
  MapPin,
  ChevronRight,
  Filter,
  FileCheck2,
  Wrench,
  Users,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';
import { RiesgoGTC45Item, TABLA_TECNICA_NC } from '../../types/gtc45RiskMatrix';

interface MatrizRiesgosRecomendacionesProps {
  dataset: RiesgoGTC45Item[];
  onSelectRisk?: (riskId: string, area: string) => void;
}

export function MatrizRiesgosRecomendaciones({
  dataset,
  onSelectRisk,
}: MatrizRiesgosRecomendacionesProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all_critical' | 'nivel_1' | 'nc_100_60'>('all_critical');

  // Filter critical risks: Nivel I or NC >= 60
  const riesgosCriticos = useMemo(() => {
    return dataset.filter((r) => {
      const isNivelI = r.interpretacionNR === 'I';
      const isSevereNC = r.nivelConsecuencia >= 60;

      if (selectedFilter === 'nivel_1') return isNivelI;
      if (selectedFilter === 'nc_100_60') return isSevereNC;
      return isNivelI || isSevereNC;
    });
  }, [dataset, selectedFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalCriticos = dataset.filter((r) => r.interpretacionNR === 'I').length;
    const totalMortales = dataset.filter((r) => r.nivelConsecuencia === 100).length;
    const totalMuyGraves = dataset.filter((r) => r.nivelConsecuencia === 60).length;
    const areasAfectadas = new Set(
      dataset.filter((r) => r.interpretacionNR === 'I' || r.nivelConsecuencia >= 60).map((r) => r.zonaLugar)
    ).size;

    return { totalCriticos, totalMortales, totalMuyGraves, areasAfectadas };
  }, [dataset]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-900 rounded-2xl border border-rose-500/40 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold tracking-wide">
              <Sparkles className="h-3.5 w-3.5 text-rose-400" />
              MOTOR DE RECOMENDACIONES INTELIGENTES DE SEGURIDAD (GTC 45 / DEC. 1072)
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Auditoría & Plan de Intervención para Riesgos Críticos</span>
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Diagnóstico preventivo automatizado sobre los peligros con Nivel de Riesgo I (No Aceptable) y Consecuencia Severa
              (NC = 60 ó 100). Estructura el plan de choque conforme a la <strong>Jerarquía de Controles</strong> reglamentaria.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <Printer className="h-4 w-4 text-orange-400" />
              <span>Imprimir Informe de Recomendaciones</span>
            </button>

            <span className="text-[11px] text-slate-400 font-mono">
              Frikaz S.A.S. · Evaluación Vigente 2025
            </span>
          </div>
        </div>

        {/* Executive Metrics Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Riesgos Nivel I</span>
            <span className="text-xl font-black text-rose-400 font-mono">{stats.totalCriticos}</span>
            <span className="block text-[10px] text-rose-300">No Aceptables</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Peligros Mortales (NC 100)</span>
            <span className="text-xl font-black text-rose-500 font-mono">{stats.totalMortales}</span>
            <span className="block text-[10px] text-slate-400">Riesgo vital inminente</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Muy Graves (NC 60)</span>
            <span className="text-xl font-black text-purple-400 font-mono">{stats.totalMuyGraves}</span>
            <span className="block text-[10px] text-slate-400">Secuelas permanentes</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Áreas con Foco Crítico</span>
            <span className="text-xl font-black text-amber-400 font-mono">{stats.areasAfectadas}</span>
            <span className="block text-[10px] text-slate-400">Requieren control</span>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Filtrar recomendaciones:</span>
          <button
            onClick={() => setSelectedFilter('all_critical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'all_critical'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Todos los Peligros Críticos ({dataset.filter((r) => r.interpretacionNR === 'I' || r.nivelConsecuencia >= 60).length})
          </button>
          <button
            onClick={() => setSelectedFilter('nivel_1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'nivel_1'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Solo Nivel I No Aceptable ({stats.totalCriticos})
          </button>
          <button
            onClick={() => setSelectedFilter('nc_100_60')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'nc_100_60'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Solo Severidad Extrema NC 60 y 100 ({stats.totalMortales + stats.totalMuyGraves})
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          {riesgosCriticos.length} fichas de intervención disponibles
        </span>
      </div>

      {/* RECOMMENDATIONS CARDS ACCORDING TO HIERARCHY OF CONTROLS */}
      <div className="space-y-6">
        {riesgosCriticos.map((item, index) => {
          const ncData = TABLA_TECNICA_NC[item.nivelConsecuencia as keyof typeof TABLA_TECNICA_NC] || TABLA_TECNICA_NC[10];

          return (
            <div
              key={item.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-6 shadow-xl space-y-5"
            >
              {/* TOP HEADER OF HAZARD */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[11px] font-black font-mono">
                      PRIORIDAD {index + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono font-bold">
                      {item.codigo || item.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.zonaLugar}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-medium">
                      Proceso: {item.proceso}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug">
                    {item.peligroDescripcion}
                  </h3>

                  <p className="text-xs text-slate-400">
                    <strong className="text-slate-300">Actividad:</strong> {item.actividades} ·{' '}
                    <strong className="text-slate-300">Tarea:</strong> {item.tareas} (
                    {item.rutinario === 'SÍ' ? 'Rutinaria' : 'No rutinaria'})
                  </p>
                </div>

                {/* Score Pill */}
                <div className="flex items-center gap-3 shrink-0 sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Evaluación GTC 45</span>
                    <span className="font-mono text-xs font-bold text-slate-300">
                      NP = {item.nivelProbabilidad} · NC = {item.nivelConsecuencia}
                    </span>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-rose-600 text-white font-black text-xs shadow-md shadow-rose-950/60 text-center">
                    <div>Nivel {item.interpretacionNR}</div>
                    <div className="text-[9px] font-mono opacity-90 font-normal">NR = {item.nivelRiesgo}</div>
                  </div>
                </div>
              </div>

              {/* CRITICAL DIAGNOSIS & LEGAL REASONING */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                    <AlertOctagon className="h-4 w-4 shrink-0" />
                    <span>Diagnóstico de Riesgo y Consecuencia Severa</span>
                  </div>
                  <p className="text-xs text-rose-200/90 leading-relaxed">
                    <strong>Impacto en la salud:</strong> {item.efectosPosibles}.
                  </p>
                  <p className="text-[11px] text-slate-300 italic border-t border-rose-900/40 pt-1.5">
                    <strong>Criterio NC = {item.nivelConsecuencia}:</strong> {ncData.definicionTecnica} ({ncData.criterioIncapacidad}).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <Lightbulb className="h-4 w-4 shrink-0" />
                    <span>Requisito Legal & Población Expuesta</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">Norma aplicable:</strong> {item.requisitoLegalEspecifico || 'Decreto 1072/2015 art. 2.2.4.6.15 y Resolución 2400/1979'}.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono border-t border-slate-900 pt-1.5">
                    <span>Trabajadores expuestos: <strong className="text-orange-400 font-bold">{item.numeroExpuestos} personas</strong></span>
                    <span>·</span>
                    <span>Requisito Legal: <strong className="text-white">{item.existenciaRequisitoLegal}</strong></span>
                  </div>
                </div>
              </div>

              {/* HIERARCHY OF CONTROLS (5 MANDATORY LEVELS OF GTC 45) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-orange-400" />
                  <span>Medidas de Intervención Recomendadas (Jerarquía de Controles GTC 45)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {/* 1. ELIMINACIÓN */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-black text-rose-400">1. Eliminación</span>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-rose-950 text-rose-300 font-bold">Nivel 1</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-2">Suprimir el peligro físicamente</p>
                      <div className="text-xs text-slate-200">
                        {item.medidaEliminacion && item.medidaEliminacion !== 'Sin información registrada' ? (
                          item.medidaEliminacion
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No viable técnicamente sin suprimir el proceso productivo básico.</span>
                        )}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-900 text-[9px] text-slate-400 font-mono">Eficacia Máxima</div>
                  </div>

                  {/* 2. SUSTITUCIÓN */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-black text-amber-400">2. Sustitución</span>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-amber-950 text-amber-300 font-bold">Nivel 2</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-2">Reemplazar por menor peligro</p>
                      <div className="text-xs text-slate-200">
                        {item.medidaSustitucion && item.medidaSustitucion !== 'Sin información registrada' ? (
                          item.medidaSustitucion
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Evaluar insumos o sistemas de menor energía/temperatura.</span>
                        )}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-900 text-[9px] text-slate-400 font-mono">Eficacia Muy Alta</div>
                  </div>

                  {/* 3. CONTROLES DE INGENIERÍA */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-black text-cyan-400">3. Controles Ingeniería</span>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold">Nivel 3</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-2">Aislar a las personas</p>
                      <div className="text-xs text-slate-200 font-medium">
                        {item.medidaControlesIngenieria && item.medidaControlesIngenieria !== 'Sin información registrada' ? (
                          item.medidaControlesIngenieria
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Instalar guardas físicas, termostatos y paros de emergencia.</span>
                        )}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-900 text-[9px] text-cyan-400 font-mono">Alta Prioridad Técnica</div>
                  </div>

                  {/* 4. CONTROLES ADMINISTRATIVOS */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-black text-blue-400">4. Administrativos</span>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-blue-950 text-blue-300 font-bold">Nivel 4</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-2">POES, PTAR y capacitación</p>
                      <div className="text-xs text-slate-200">
                        {item.medidaControlesAdministrativos && item.medidaControlesAdministrativos !== 'Sin información registrada' ? (
                          item.medidaControlesAdministrativos
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Establecer permiso de trabajo, rotación y señalización visual.</span>
                        )}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-900 text-[9px] text-slate-400 font-mono">Eficacia Operacional</div>
                  </div>

                  {/* 5. EQUIPOS Y EPP */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-black text-emerald-400">5. EPP Certificado</span>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">Nivel 5</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-2">Protección individual</p>
                      <div className="text-xs text-slate-200">
                        {item.medidaEquiposEPP && item.medidaEquiposEPP !== 'Sin información registrada' ? (
                          item.medidaEquiposEPP
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Dotación certificada conforme a norma técnica nacional.</span>
                        )}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-900 text-[9px] text-emerald-400 font-mono">Barrera Final</div>
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <span>
                    Plazo sugerido de intervención: <strong className="text-white">Inmediato (24 a 48 horas)</strong> para controles de ingeniería y bloqueo.
                  </span>
                </div>

                {onSelectRisk && (
                  <button
                    onClick={() => onSelectRisk(item.id, item.zonaLugar)}
                    className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 self-end sm:self-auto"
                  >
                    <span>Ver ficha técnica completa en 6 secciones</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
