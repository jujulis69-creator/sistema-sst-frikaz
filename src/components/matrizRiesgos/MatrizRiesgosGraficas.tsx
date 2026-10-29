import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Layers,
  MapPin,
  AlertTriangle,
  Flame,
  Users,
  Activity,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { RiesgoGTC45Item, TABLA_TECNICA_NC } from '../../types/gtc45RiskMatrix';
import { obtenerAreasUnicas } from '../../data/gtc45RiskMatrixData';

interface MatrizRiesgosGraficasProps {
  dataset: RiesgoGTC45Item[];
  selectedArea: string;
  onSelectArea: (area: string) => void;
  onSelectRisk?: (riskId: string) => void;
}

export function MatrizRiesgosGraficas({
  dataset,
  selectedArea,
  onSelectArea,
  onSelectRisk,
}: MatrizRiesgosGraficasProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'critical_only'>('all');
  const [activeChartTab, setActiveChartTab] = useState<'nivel_riesgo' | 'severidad_nc' | 'concentracion'>('nivel_riesgo');

  const areas = useMemo(() => {
    return obtenerAreasUnicas(dataset);
  }, [dataset]);

  // Aggregate statistics per area
  const areaAnalytics = useMemo(() => {
    return areas.map((area) => {
      const risks = dataset.filter((r) => r.zonaLugar === area);
      const total = risks.length;
      const nivelI = risks.filter((r) => r.interpretacionNR === 'I').length;
      const nivelII = risks.filter((r) => r.interpretacionNR === 'II').length;
      const nivelIII = risks.filter((r) => r.interpretacionNR === 'III').length;
      const nivelIV = risks.filter((r) => r.interpretacionNR === 'IV').length;

      // Maximum consequence level (NC)
      const maxNC = risks.reduce((max, r) => Math.max(max, r.nivelConsecuencia), 0);
      const avgNR = Math.round(risks.reduce((acc, r) => acc + r.nivelRiesgo, 0) / (total || 1));

      // Exposed people
      const totalExpuestos = risks.reduce(
        (acc, r) => acc + (r.numeroExpuestos || 0),
        0
      );

      // Highest risk item
      const highestRisk = [...risks].sort((a, b) => b.nivelRiesgo - a.nivelRiesgo)[0];

      return {
        area,
        total,
        nivelI,
        nivelII,
        nivelIII,
        nivelIV,
        maxNC,
        avgNR,
        totalExpuestos,
        highestRisk,
        hasCritical: nivelI > 0 || maxNC >= 60,
      };
    });
  }, [dataset, areas]);

  // Filtered areas based on active toggle
  const displayedAnalytics = useMemo(() => {
    if (filterMode === 'critical_only') {
      return areaAnalytics.filter((a) => a.hasCritical);
    }
    return areaAnalytics;
  }, [areaAnalytics, filterMode]);

  // Maximum value for scaling bars
  const maxTotalRisks = useMemo(() => {
    return Math.max(...areaAnalytics.map((a) => a.total), 1);
  }, [areaAnalytics]);

  const maxTotalExpuestos = useMemo(() => {
    return Math.max(...areaAnalytics.map((a) => a.totalExpuestos), 1);
  }, [areaAnalytics]);

  // Global KPIs
  const globalKpis = useMemo(() => {
    const totalCriticos = dataset.filter((r) => r.interpretacionNR === 'I').length;
    const areasCriticasCount = areaAnalytics.filter((a) => a.nivelI > 0).length;
    const maxConsecuenciaGlobal = Math.max(...dataset.map((r) => r.nivelConsecuencia), 0);
    const areaMayorRiesgo = [...areaAnalytics].sort((a, b) => b.nivelI - a.nivelI || b.avgNR - a.avgNR)[0];

    return {
      totalCriticos,
      areasCriticasCount,
      maxConsecuenciaGlobal,
      areaMayorRiesgo: areaMayorRiesgo ? areaMayorRiesgo.area : 'N/A',
    };
  }, [dataset, areaAnalytics]);

  return (
    <div className="space-y-6">
      {/* HEADER & GLOBAL ANALYTICS SUMMARY */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-2xl border border-slate-700/80 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold tracking-wide">
              <BarChart3 className="h-3.5 w-3.5" />
              ANALÍTICA DINÁMICA DE RIESGOS · GTC 45
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Gráficas Estadísticas por Áreas de Trabajo</span>
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Visualice la correlación directa entre las zonas operativas de la empresa, los niveles de aceptabilidad (I a IV),
              la severidad máxima de consecuencia ($NC$) y la concentración de población expuesta.
            </p>
          </div>

          {/* KPI Quick Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Peligros Críticos</span>
              <span className="text-xl font-black text-rose-400 font-mono">{globalKpis.totalCriticos}</span>
              <span className="block text-[9px] text-rose-300 font-semibold">Nivel I No Aceptable</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Zonas con Nivel I</span>
              <span className="text-xl font-black text-orange-400 font-mono">{globalKpis.areasCriticasCount} / {areas.length}</span>
              <span className="block text-[9px] text-slate-400">Focos críticos</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Máx. Consecuencia</span>
              <span className="text-xl font-black text-rose-500 font-mono">NC = {globalKpis.maxConsecuenciaGlobal}</span>
              <span className="block text-[9px] text-rose-300 font-semibold">Mortal / Catastrófico</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Zona Prioritaria</span>
              <span className="text-xs font-black text-amber-300 truncate block mt-1">
                {globalKpis.areaMayorRiesgo.replace('Área de ', '')}
              </span>
              <span className="block text-[9px] text-slate-400">Mayor criticidad</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Charts */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveChartTab('nivel_riesgo')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeChartTab === 'nivel_riesgo'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>1. Nivel de Riesgo por Área (I, II, III, IV)</span>
            </button>
            <button
              onClick={() => setActiveChartTab('severidad_nc')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeChartTab === 'severidad_nc'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-950/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Flame className="h-4 w-4" />
              <span>2. Severidad de Consecuencia (NC)</span>
            </button>
            <button
              onClick={() => setActiveChartTab('concentracion')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeChartTab === 'concentracion'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>3. Concentración & Trabajadores Expuestos</span>
            </button>
          </div>

          {/* Quick Filter Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Filtro:</span>
            <button
              onClick={() => setFilterMode(filterMode === 'all' ? 'critical_only' : 'all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterMode === 'critical_only'
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
              <span>{filterMode === 'critical_only' ? 'Mostrando solo Zonas Críticas' : 'Todas las Zonas'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CHART 1: NIVEL DE RIESGO POR ÁREA */}
      {activeChartTab === 'nivel_riesgo' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Distribución del Nivel de Riesgo (NR) por Zona Operativa</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {displayedAnalytics.length} zonas
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Haga clic en la barra o botón de cualquier área para seleccionarla y consultar su ficha de intervención técnica.
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-rose-600 shrink-0" />
                <span>Nivel I (No Aceptable)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-amber-500 shrink-0" />
                <span>Nivel II (Específico)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-yellow-400 shrink-0" />
                <span>Nivel III (Mejorable)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-emerald-500 shrink-0" />
                <span>Nivel IV (Aceptable)</span>
              </span>
            </div>
          </div>

          {/* Horizontal Stacked Bar Charts */}
          <div className="space-y-4">
            {displayedAnalytics.map((item) => {
              const isSelected = selectedArea === item.area;
              const pctI = (item.nivelI / item.total) * 100;
              const pctII = (item.nivelII / item.total) * 100;
              const pctIII = (item.nivelIII / item.total) * 100;
              const pctIV = (item.nivelIV / item.total) * 100;

              return (
                <div
                  key={item.area}
                  onClick={() => onSelectArea(item.area)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-slate-850 border-orange-500/80 shadow-lg ring-1 ring-orange-500/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className={`h-4 w-4 ${isSelected ? 'text-orange-400' : 'text-slate-400'}`} />
                      <span className="text-sm font-bold text-white">{item.area}</span>
                      {item.nivelI > 0 && (
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-black">
                          {item.nivelI} Crítico(s)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                      <span>Total: <strong className="text-white">{item.total}</strong></span>
                      <span>·</span>
                      <span>I: <strong className="text-rose-400">{item.nivelI}</strong></span>
                      <span>II: <strong className="text-amber-400">{item.nivelII}</strong></span>
                      <span>III: <strong className="text-yellow-400">{item.nivelIII}</strong></span>
                      <span>IV: <strong className="text-emerald-400">{item.nivelIV}</strong></span>
                      <span className="text-orange-400 font-bold ml-2">Seleccionar →</span>
                    </div>
                  </div>

                  {/* Multi-Segment Stacked Bar */}
                  <div className="w-full h-5 bg-slate-900 rounded-lg overflow-hidden flex border border-slate-800 shadow-inner">
                    {item.nivelI > 0 && (
                      <div
                        style={{ width: `${pctI}%` }}
                        className="bg-rose-600 h-full flex items-center justify-center text-[10px] font-black text-white px-1 transition-all duration-500 hover:brightness-110"
                        title={`Nivel I: ${item.nivelI} (${pctI.toFixed(0)}%)`}
                      >
                        {item.nivelI}
                      </div>
                    )}
                    {item.nivelII > 0 && (
                      <div
                        style={{ width: `${pctII}%` }}
                        className="bg-amber-500 h-full flex items-center justify-center text-[10px] font-black text-slate-950 px-1 transition-all duration-500 hover:brightness-110"
                        title={`Nivel II: ${item.nivelII} (${pctII.toFixed(0)}%)`}
                      >
                        {item.nivelII}
                      </div>
                    )}
                    {item.nivelIII > 0 && (
                      <div
                        style={{ width: `${pctIII}%` }}
                        className="bg-yellow-400 h-full flex items-center justify-center text-[10px] font-black text-slate-950 px-1 transition-all duration-500 hover:brightness-110"
                        title={`Nivel III: ${item.nivelIII} (${pctIII.toFixed(0)}%)`}
                      >
                        {item.nivelIII}
                      </div>
                    )}
                    {item.nivelIV > 0 && (
                      <div
                        style={{ width: `${pctIV}%` }}
                        className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-black text-white px-1 transition-all duration-500 hover:brightness-110"
                        title={`Nivel IV: ${item.nivelIV} (${pctIV.toFixed(0)}%)`}
                      >
                        {item.nivelIV}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CHART 2: SEVERIDAD MÁXIMA DE CONSECUENCIA (NC) POR ZONA */}
      {activeChartTab === 'severidad_nc' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Severidad Máxima de Consecuencia ($NC$) por Zona de Trabajo</span>
              </h3>
              <p className="text-xs text-slate-400">
                Evaluación técnica de gravedad según la tabla de la GTC 45 (10 Leve, 25 Grave, 60 Muy Grave, 100 Mortal/Catastrófico).
              </p>
            </div>

            {/* Scale badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">
                NC 10 (Leve)
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/30">
                NC 25 (Grave)
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-500/30">
                NC 60 (Muy Grave)
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-500/30">
                NC 100 (Mortal)
              </span>
            </div>
          </div>

          {/* Bar Chart for NC */}
          <div className="space-y-4">
            {displayedAnalytics.map((item) => {
              const ncData = TABLA_TECNICA_NC[item.maxNC as keyof typeof TABLA_TECNICA_NC] || TABLA_TECNICA_NC[10];
              const isSelected = selectedArea === item.area;

              let barColor = 'bg-emerald-500';
              if (item.maxNC === 100) barColor = 'bg-rose-600';
              else if (item.maxNC === 60) barColor = 'bg-purple-600';
              else if (item.maxNC === 25) barColor = 'bg-amber-500';

              return (
                <div
                  key={item.area}
                  onClick={() => onSelectArea(item.area)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-slate-850 border-orange-500/80 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Flame className={`h-4 w-4 ${item.maxNC >= 60 ? 'text-rose-400' : 'text-slate-400'}`} />
                      <span className="text-sm font-bold text-white">{item.area}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-slate-400">Máx NC:</span>
                      <span className={`px-2.5 py-0.5 rounded font-black font-mono text-xs ${
                        item.maxNC === 100 ? 'bg-rose-600 text-white' :
                        item.maxNC === 60 ? 'bg-purple-600 text-white' :
                        item.maxNC === 25 ? 'bg-amber-500 text-slate-950' :
                        'bg-emerald-500 text-slate-950'
                      }`}>
                        NC = {item.maxNC} ({ncData.clasificacion})
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar showing 0 to 100 */}
                  <div className="space-y-1">
                    <div className="w-full h-4 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-inner flex">
                      <div
                        style={{ width: `${item.maxNC}%` }}
                        className={`${barColor} h-full transition-all duration-500 rounded-lg`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-0.5">
                      <span>0 (Mín)</span>
                      <span>25 (Grave)</span>
                      <span>60 (Muy Grave)</span>
                      <span>100 (Mortal / Catastrófico)</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic">
                    {ncData.criterioIncapacidad} · {ncData.definicionTecnica.substring(0, 110)}...
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CHART 3: CONCENTRACIÓN DE PELIGROS & POBLACIÓN EXPUESTA */}
      {activeChartTab === 'concentracion' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Concentración de Peligros vs Población Total Expuesta</span>
              </h3>
              <p className="text-xs text-slate-400">
                Relaciona la cantidad de peligros registrados frente a las personas expuestas simultáneamente en cada zona.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-blue-500 shrink-0" />
                <span>Población Expuesta</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded bg-orange-500 shrink-0" />
                <span>Total de Peligros Evaluados</span>
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {displayedAnalytics.map((item) => {
              const isSelected = selectedArea === item.area;
              const pctExp = (item.totalExpuestos / maxTotalExpuestos) * 100;
              const pctRisks = (item.total / maxTotalRisks) * 100;

              return (
                <div
                  key={item.area}
                  onClick={() => onSelectArea(item.area)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-slate-850 border-orange-500/80 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      {item.area}
                    </span>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-blue-300">
                        Expuestos: <strong className="text-white">{item.totalExpuestos} personas</strong>
                      </span>
                      <span>·</span>
                      <span className="text-orange-300">
                        Peligros: <strong className="text-white">{item.total}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Dual Comparison Bars */}
                  <div className="space-y-1.5">
                    {/* Exposed Workers Bar */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Población en riesgo</span>
                        <span className="font-mono text-blue-400">{item.totalExpuestos} trabajadores</span>
                      </div>
                      <div className="w-full h-3 bg-slate-900 rounded-md overflow-hidden border border-slate-800">
                        <div
                          style={{ width: `${Math.max(pctExp, 5)}%` }}
                          className="bg-blue-500 h-full rounded-md transition-all duration-500"
                        />
                      </div>
                    </div>

                    {/* Hazards Count Bar */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Peligros evaluados</span>
                        <span className="font-mono text-orange-400">{item.total} peligros</span>
                      </div>
                      <div className="w-full h-3 bg-slate-900 rounded-md overflow-hidden border border-slate-800">
                        <div
                          style={{ width: `${Math.max(pctRisks, 8)}%` }}
                          className="bg-orange-500 h-full rounded-md transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
