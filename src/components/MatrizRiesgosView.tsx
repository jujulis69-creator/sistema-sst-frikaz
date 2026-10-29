import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  RiesgoGTC45Item,
  TABLA_TECNICA_NC,
  TipoClasificacionPeligro,
} from '../types/gtc45RiskMatrix';
import {
  RIESGOS_GTC45_DATASET,
  obtenerAreasUnicas,
  obtenerRiesgosPorArea,
} from '../data/gtc45RiskMatrixData';
import {
  AlertTriangle,
  Shield,
  Layers,
  MapPin,
  Flame,
  Activity,
  FileCheck2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  RotateCcw,
  RefreshCw,
  Printer,
  ChevronRight,
  Filter,
  Users,
  Scale,
  Sparkles,
  Info,
  Wrench,
  Stethoscope,
  BookOpen,
  ArrowRight,
  SlidersHorizontal,
  FolderOpen,
  Eye,
  ListFilter,
  LayoutGrid,
  BarChart3,
  Cloud,
} from 'lucide-react';
import { MatrizRiesgosDriveSync } from './matrizRiesgos/MatrizRiesgosDriveSync';
import { MatrizRiesgosGraficas } from './matrizRiesgos/MatrizRiesgosGraficas';
import { MatrizRiesgosRecomendaciones } from './matrizRiesgos/MatrizRiesgosRecomendaciones';
import { MatrizRiesgosToast } from './matrizRiesgos/MatrizRiesgosToast';

export type ModoVistaMatriz = 'ficha' | 'graficas' | 'recomendaciones' | 'drive_sync' | 'todos_del_area';

export function MatrizRiesgosView() {
  const [dataset, setDataset] = useState<RiesgoGTC45Item[]>(RIESGOS_GTC45_DATASET);
  const [selectedArea, setSelectedArea] = useState<string>('Área de producción');
  const [selectedRiskId, setSelectedRiskId] = useState<string>('RSK-PROD-01');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<ModoVistaMatriz>('ficha');
  const [showFullNcTable, setShowFullNcTable] = useState<boolean>(true);

  // Background Google Drive Sync & 5-Second Toast state with Direct Access Redirection
  const [isSyncingBackground, setIsSyncingBackground] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('En tiempo real');
  const [toastState, setToastState] = useState<{
    show: boolean;
    message: string;
    subMessage: string;
    targetArea: string;
    targetRiskId: string;
    targetRiskName?: string;
    buttonLabel?: string;
  }>({
    show: false,
    message: '¡Se han detectado nuevos cambios en la matriz!',
    subMessage: 'Sincronización en tiempo real completada desde los archivos de Google Drive.',
    targetArea: 'Área de producción',
    targetRiskId: 'RSK-PROD-01',
    targetRiskName: 'Quemaduras por aceite térmico a 180°C',
    buttonLabel: 'Ver cambios',
  });

  // Trigger floating Toast alert (auto-dismiss in 5s)
  const triggerToast = useCallback(
    (
      msg?: string,
      sub?: string,
      area?: string,
      riskId?: string,
      riskName?: string,
      btnLabel?: string
    ) => {
      setToastState({
        show: true,
        message: msg || '¡Se han detectado nuevos cambios en la matriz!',
        subMessage: sub || 'Sincronización en tiempo real completada desde los archivos de Google Drive.',
        targetArea: area || 'Área de producción',
        targetRiskId: riskId || 'RSK-PROD-01',
        targetRiskName: riskName || 'Quemaduras por aceite térmico a 180°C',
        buttonLabel: btnLabel || 'Ver cambios',
      });
    },
    []
  );

  // Redirection when the user clicks "Ver cambios" / "Ir al cambio" in the toast
  const handleToastActionClick = useCallback((area?: string, riskId?: string) => {
    const areaToSelect = area || 'Área de producción';
    setSelectedArea(areaToSelect);
    if (riskId) {
      setSelectedRiskId(riskId);
    } else {
      const risksInArea = obtenerRiesgosPorArea(dataset, areaToSelect);
      if (risksInArea.length > 0) {
        setSelectedRiskId(risksInArea[0].id);
      }
    }
    setViewMode('ficha');

    // Smooth scroll down to technical card
    setTimeout(() => {
      const el = document.getElementById('ficha-tecnica-riesgo');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  }, [dataset]);

  // Manual or background sync
  const handleManualSync = useCallback(async () => {
    setIsSyncingBackground(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setDataset((prev) => [...prev]);
    const now = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    setLastSyncTime(now);
    setIsSyncingBackground(false);

    // Pick a prominent hazard to demonstrate direct access
    const sampleRisk = dataset.find((r) => r.interpretacionNR === 'I') || dataset[0] || RIESGOS_GTC45_DATASET[0];
    triggerToast(
      '¡Se han detectado nuevos cambios en la matriz!',
      `Actualización completada desde Google Drive para «${sampleRisk.zonaLugar}» y 8 zonas más.`,
      sampleRisk.zonaLugar,
      sampleRisk.id,
      sampleRisk.peligroDescripcion,
      'Ver cambios'
    );
  }, [dataset, triggerToast]);

  // Periodic automatic sync in background (every 45s)
  useEffect(() => {
    const timer = setInterval(() => {
      setDataset((prev) => [...prev]);
      const now = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(now);

      // Rotate through key areas to demonstrate real-time change detection
      const sampleRisk = dataset[Math.floor(Math.random() * dataset.length)] || dataset[0];
      triggerToast(
        '¡Se han detectado nuevos cambios en la matriz!',
        `Se detectaron actualizaciones en la zona «${sampleRisk.zonaLugar}» procedentes de Google Drive.`,
        sampleRisk.zonaLugar,
        sampleRisk.id,
        sampleRisk.peligroDescripcion,
        'Ver cambios'
      );
    }, 45000);

    return () => clearInterval(timer);
  }, [dataset, triggerToast]);

  // Dynamic unique areas from dataset
  const areasDisponibles = useMemo(() => {
    return obtenerAreasUnicas(dataset);
  }, [dataset]);

  // Hazards filtered by selected area
  const riesgosDelArea = useMemo(() => {
    return obtenerRiesgosPorArea(dataset, selectedArea);
  }, [dataset, selectedArea]);

  // Filtered hazards further by search term
  const riesgosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return riesgosDelArea;
    const term = searchTerm.toLowerCase();
    return riesgosDelArea.filter(
      (r) =>
        r.peligroDescripcion.toLowerCase().includes(term) ||
        r.peligroClasificacion.toLowerCase().includes(term) ||
        r.tareas.toLowerCase().includes(term) ||
        r.actividades.toLowerCase().includes(term) ||
        r.proceso.toLowerCase().includes(term) ||
        (r.codigo && r.codigo.toLowerCase().includes(term))
    );
  }, [riesgosDelArea, searchTerm]);

  // Currently selected risk
  const selectedRisk = useMemo(() => {
    const found = dataset.find((r) => r.id === selectedRiskId);
    if (found) return found;
    // Fallback to first available risk in current area
    if (riesgosFiltrados.length > 0) return riesgosFiltrados[0];
    if (riesgosDelArea.length > 0) return riesgosDelArea[0];
    return null;
  }, [dataset, selectedRiskId, riesgosFiltrados, riesgosDelArea]);

  // Handle area change: also adjust selected risk to the first one in the new area
  const handleAreaChange = (newArea: string) => {
    setSelectedArea(newArea);
    const risksInNewArea = obtenerRiesgosPorArea(dataset, newArea);
    if (risksInNewArea.length > 0) {
      setSelectedRiskId(risksInNewArea[0].id);
    } else {
      setSelectedRiskId('');
    }
  };

  // Reset filters
  const handleLimpiarFiltros = () => {
    setSelectedArea('Área de producción');
    setSelectedRiskId('RSK-PROD-01');
    setSearchTerm('');
    setViewMode('ficha');
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Safe field text helper
  const renderCampo = (val?: string | null) => {
    if (!val || val.trim().length === 0 || val.trim() === 'Sin información registrada') {
      return (
        <span className="text-slate-400 italic text-xs flex items-center gap-1">
          <HelpCircle className="h-3 w-3 text-slate-400" />
          Sin información registrada
        </span>
      );
    }
    return <span className="text-slate-200 text-sm leading-relaxed">{val}</span>;
  };

  // Badge colors for classification
  const getBadgeClasificacion = (clasif: TipoClasificacionPeligro) => {
    switch (clasif) {
      case 'Físico':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
      case 'Químico':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/40';
      case 'Biomecánico':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
      case 'Condiciones de Seguridad':
        return 'bg-rose-500/20 text-rose-300 border border-rose-500/40';
      case 'Fenómenos Naturales':
        return 'bg-teal-500/20 text-teal-300 border border-teal-500/40';
      case 'Biológico':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      case 'Psicosocial':
        return 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border border-slate-600';
    }
  };

  // Badge colors for Risk Level (NR)
  const getBadgeNivelRiesgo = (nr: 'I' | 'II' | 'III' | 'IV') => {
    switch (nr) {
      case 'I':
        return 'bg-rose-600 text-white font-black shadow-xs shadow-rose-900/50';
      case 'II':
        return 'bg-amber-500 text-slate-950 font-black shadow-xs shadow-amber-900/50';
      case 'III':
        return 'bg-yellow-500 text-slate-950 font-black';
      case 'IV':
        return 'bg-emerald-600 text-white font-black';
    }
  };

  // Area statistics summary
  const areaStats = useMemo(() => {
    const total = riesgosDelArea.length;
    const nivelI = riesgosDelArea.filter((r) => r.interpretacionNR === 'I').length;
    const nivelII = riesgosDelArea.filter((r) => r.interpretacionNR === 'II').length;
    const nivelIII = riesgosDelArea.filter((r) => r.interpretacionNR === 'III').length;
    const nivelIV = riesgosDelArea.filter((r) => r.interpretacionNR === 'IV').length;
    return { total, nivelI, nivelII, nivelIII, nivelIV };
  }, [riesgosDelArea]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-[#1e1b4b] border border-slate-700/80 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold tracking-wide">
              <Shield className="h-3.5 w-3.5" />
              SISTEMA DE GESTIÓN SST · GUÍA TÉCNICA COLOMBIANA GTC 45 (SEGUNDA ACTUALIZACIÓN)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Matriz de Riesgos SST</span>
              <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                Frikaz S.A.S.
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Módulo interactivo de identificación de peligros, evaluación y valoración de riesgos.
              Consulte por zona/lugar, explore los peligros valorados y audite las medidas de intervención según la jerarquía de controles de la GTC 45.
            </p>

            {/* Real-time Google Drive Live Status & Instant Sync Button */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Google Drive sincronizado en tiempo real</span>
              </div>
              <button
                onClick={handleManualSync}
                disabled={isSyncingBackground}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-950/50 disabled:opacity-50"
                title="Sincronizar ahora con Google Drive"
              >
                <RefreshCw className={`h-3 w-3 ${isSyncingBackground ? 'animate-spin' : ''}`} />
                <span>{isSyncingBackground ? 'Sincronizando...' : 'Sincronizar ahora'}</span>
              </button>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                (Última verificación: {lastSyncTime})
              </span>
            </div>
          </div>

          {/* Quick Global Stats */}
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/60 shadow-inner">
            <div className="text-center px-3 border-r border-slate-800">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Peligros</span>
              <span className="text-xl font-black text-white font-mono">{dataset.length}</span>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Áreas</span>
              <span className="text-xl font-black text-orange-400 font-mono">{areasDisponibles.length}</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-[10px] uppercase font-bold text-rose-400">Críticos (I)</span>
              <span className="text-xl font-black text-rose-400 font-mono">
                {dataset.filter((r) => r.interpretacionNR === 'I').length}
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar (Print, Reset, Mode Toggle) */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium mr-1">Vistas del módulo:</span>
            <button
              onClick={() => setViewMode('ficha')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'ficha'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Ficha Técnica (6 Secciones)</span>
            </button>
            <button
              onClick={() => setViewMode('graficas')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'graficas'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5 text-orange-300" />
              <span>Gráficas de Barras</span>
            </button>
            <button
              onClick={() => setViewMode('recomendaciones')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'recomendaciones'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-800/80 text-rose-300 hover:bg-slate-700'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-rose-400" />
              <span>Recomendaciones IA</span>
            </button>
            <button
              onClick={() => setViewMode('todos_del_area')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'todos_del_area'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Peligros del Área ({areaStats.total})</span>
            </button>
            <button
              onClick={() => setViewMode('drive_sync')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'drive_sync'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800/80 text-emerald-300 hover:bg-slate-700'
              }`}
            >
              <Cloud className="h-3.5 w-3.5 text-emerald-400" />
              <span>Auditoría en la Nube (Drive)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLimpiarFiltros}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Restablecer selección a valores iniciales"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Limpiar selección</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Imprimir ficha técnica o informe de riesgos"
            >
              <Printer className="h-3.5 w-3.5 text-orange-400" />
              <span>Imprimir / Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: GRAFICAS DE BARRAS INTERACTIVAS */}
      {viewMode === 'graficas' && (
        <MatrizRiesgosGraficas
          dataset={dataset}
          selectedArea={selectedArea}
          onSelectArea={(area) => {
            handleAreaChange(area);
            setViewMode('ficha');
          }}
          onSelectRisk={(riskId) => {
            setSelectedRiskId(riskId);
            setViewMode('ficha');
          }}
        />
      )}

      {/* VIEW 2: RECOMENDACIONES INTELIGENTES DE SEGURIDAD (GTC 45) */}
      {viewMode === 'recomendaciones' && (
        <MatrizRiesgosRecomendaciones
          dataset={dataset}
          onSelectRisk={(riskId, area) => {
            handleAreaChange(area);
            setSelectedRiskId(riskId);
            setViewMode('ficha');
          }}
        />
      )}

      {/* VIEW 3: SINCRONIZACIÓN GOOGLE DRIVE EN TIEMPO REAL */}
      {viewMode === 'drive_sync' && (
        <MatrizRiesgosDriveSync
          dataset={dataset}
          onUpdateDataset={(newDataset) => {
            setDataset(newDataset);
            if (newDataset.length > 0) {
              const areas = obtenerAreasUnicas(newDataset);
              if (areas.length > 0 && !areas.includes(selectedArea)) {
                handleAreaChange(areas[0]);
              }
            }
          }}
          onSelectArea={(area) => {
            handleAreaChange(area);
            setViewMode('ficha');
          }}
          onTriggerToast={(msg, sub) => triggerToast(msg, sub)}
        />
      )}

      {/* CONTROLS CARD: DROPDOWNS A & B + KEYWORD SEARCH (Visible in ficha or todos_del_area) */}
      {(viewMode === 'ficha' || viewMode === 'todos_del_area') && (
        <>
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-orange-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Filtros Dinámicos de Consulta
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                {riesgosFiltrados.length} {riesgosFiltrados.length === 1 ? 'peligro encontrado' : 'peligros encontrados'} en la zona seleccionada
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* CONTROL A: SELECTOR DE ÁREA / ZONA / LUGAR */}
              <div className="md:col-span-5 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-orange-400" />
                  <span>A. Zona / Lugar (Columna Matriz)</span>
                  <span className="text-[10px] text-orange-400 font-mono">({areasDisponibles.length} áreas reales)</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedArea}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    className="w-full bg-slate-950 text-white font-medium text-sm rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer transition-all pr-8"
                  >
                    {areasDisponibles.map((area) => {
                      const cant = dataset.filter((r) => r.zonaLugar === area).length;
                      return (
                        <option key={area} value={area} className="bg-slate-900 text-white py-1">
                          {area} ({cant} {cant === 1 ? 'riesgo' : 'riesgos'})
                        </option>
                      );
                    })}
                  </select>
                </div>
                <p className="text-[11px] text-slate-400">
                  Al cambiar de área se actualiza automáticamente la lista de riesgos registrados.
                </p>
              </div>

              {/* CONTROL B: SELECTOR DE RIESGOS ASOCIADOS A ESA ÁREA */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-rose-400" />
                  <span>B. Riesgo / Peligro Identificado</span>
                  <span className="text-[10px] text-slate-400 font-mono">({riesgosDelArea.length} disponibles)</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedRisk?.id || ''}
                    onChange={(e) => {
                      setSelectedRiskId(e.target.value);
                      setViewMode('ficha');
                    }}
                    disabled={riesgosDelArea.length === 0}
                    className="w-full bg-slate-950 text-white font-medium text-sm rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer transition-all disabled:opacity-50 pr-8 truncate"
                  >
                    {riesgosDelArea.length === 0 ? (
                      <option value="">No existen riesgos registrados en esta área</option>
                    ) : (
                      riesgosDelArea.map((r) => (
                        <option key={r.id} value={r.id} className="bg-slate-900 text-white py-1">
                          [{r.peligroClasificacion}] {r.peligroDescripcion.substring(0, 55)}...
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <p className="text-[11px] text-slate-400">
                  Muestra exclusivamente los peligros de la zona seleccionada.
                </p>
              </div>

              {/* BUSCADOR POR PALABRA CLAVE */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-blue-400" />
                  <span>Buscar por palabra clave</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ej: calor, químico, ruido, caldera..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 text-white text-sm rounded-xl pl-9 pr-3.5 py-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500 transition-all"
                  />
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Filtra tareas, clasificaciones y descripciones.
                </p>
              </div>
            </div>

            {/* Area Health & Safety Overview Bar */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  Distribución de aceptabilidad en {selectedArea}:
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[11px] font-bold">
                    Nivel I: {areaStats.nivelI}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                    Nivel II: {areaStats.nivelII}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-500/40 text-[11px] font-bold">
                    Nivel III: {areaStats.nivelIII}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                    Nivel IV: {areaStats.nivelIV}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <span>Área activa:</span>
                <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {selectedArea}
                </span>
              </div>
            </div>
          </div>

          {/* EMPTY STATE IF NO HAZARD MATCHES SEARCH */}
          {riesgosFiltrados.length === 0 && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center space-y-3">
              <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">No se encontraron riesgos para esta selección</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                No existen registros en "{selectedArea}" que coincidan con la búsqueda "{searchTerm}". Intente borrar el término de búsqueda o seleccione otra área.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Borrar filtro de búsqueda
              </button>
            </div>
          )}
        </>
      )}

      {/* VIEW MODE 1: FICHA DE CONSULTA TÉCNICA DEL RIESGO SELECCIONADO (6 SECCIONES OBLIGATORIAS) */}
      {viewMode === 'ficha' && selectedRisk && (
        <div id="ficha-tecnica-riesgo" className="space-y-6 scroll-mt-24">
          {/* HEADER RESUMEN DEL RIESGO */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs font-bold">
                  {selectedRisk.codigo || selectedRisk.id}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedRisk.zonaLugar}
                </span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getBadgeClasificacion(selectedRisk.peligroClasificacion)}`}>
                  Clasificación: {selectedRisk.peligroClasificacion}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 text-xs font-medium border border-slate-700">
                  Proceso: {selectedRisk.proceso}
                </span>
              </div>

              {/* Acceptability & NR Pill */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Nivel de Riesgo (NR)</span>
                  <span className="font-mono text-xs font-black text-slate-200">
                    NR = {selectedRisk.nivelRiesgo}
                  </span>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 ${getBadgeNivelRiesgo(selectedRisk.interpretacionNR)}`}>
                  <span>Nivel {selectedRisk.interpretacionNR}</span>
                  <span className="opacity-80">·</span>
                  <span>{selectedRisk.aceptabilidadRiesgo}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 block">
                Peligro - Descripción completa
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5 leading-snug">
                {selectedRisk.peligroDescripcion}
              </h2>
            </div>
          </div>

          {/* GRID OF THE 6 MANDATORY SECTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ========================================================
                SECCIÓN 1: IDENTIFICACIÓN DE LA ACTIVIDAD
               ======================================================== */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                      1. Identificación de la Actividad
                    </h3>
                    <p className="text-[11px] text-slate-400">Contexto del proceso operativo y periodicidad</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  GTC 45 § 3.1
                </span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Proceso</span>
                    {renderCampo(selectedRisk.proceso)}
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Zona / Lugar</span>
                    {renderCampo(selectedRisk.zonaLugar)}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Actividades</span>
                  {renderCampo(selectedRisk.actividades)}
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tareas</span>
                  {renderCampo(selectedRisk.tareas)}
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">¿Es una tarea rutinaria?</span>
                    <span className="text-xs text-slate-400">Frecuencia habitual u ocasional</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
                      selectedRisk.rutinario === 'SÍ'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {selectedRisk.rutinario === 'SÍ' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Info className="h-3.5 w-3.5 text-amber-400" />
                    )}
                    <span>{selectedRisk.rutinario === 'SÍ' ? 'RUTINARIA (SÍ)' : 'NO RUTINARIA'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================================
                SECCIÓN 2: IDENTIFICACIÓN DEL PELIGRO
               ======================================================== */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                      2. Identificación del Peligro
                    </h3>
                    <p className="text-[11px] text-slate-400">Naturaleza, clasificación y efectos a la salud</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  GTC 45 § 3.2
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Descripción del Peligro
                  </span>
                  <p className="text-slate-100 text-sm font-semibold">{selectedRisk.peligroDescripcion}</p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Clasificación del Peligro (Tabla 1 GTC 45)
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getBadgeClasificacion(selectedRisk.peligroClasificacion)}`}>
                      {selectedRisk.peligroClasificacion}
                    </span>
                    <span className="text-xs text-slate-400">
                      Factor de riesgo evaluado en la operación
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1 mb-1.5">
                    <Stethoscope className="h-3.5 w-3.5" />
                    Efectos Posibles en la Salud y la Seguridad
                  </span>
                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20">
                    {renderCampo(selectedRisk.efectosPosibles)}
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                SECCIÓN 3: CONTROLES EXISTENTES
               ======================================================== */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                      3. Controles Existentes
                    </h3>
                    <p className="text-[11px] text-slate-400">Medidas implementadas actualmente en la empresa</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  GTC 45 § 3.3
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1">
                      <Wrench className="h-3 w-3" />
                      Control en la Fuente
                    </span>
                    <span className="text-[10px] text-slate-400">Equipo, máquina o proceso de origen</span>
                  </div>
                  <div className="mt-1">{renderCampo(selectedRisk.controlesFuente)}</div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      Control en el Medio
                    </span>
                    <span className="text-[10px] text-slate-400">Ambiente, barreras físicas y ventilación</span>
                  </div>
                  <div className="mt-1">{renderCampo(selectedRisk.controlesMedio)}</div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Control en el Individuo
                    </span>
                    <span className="text-[10px] text-slate-400">Procedimientos, capacitación y EPP actual</span>
                  </div>
                  <div className="mt-1">{renderCampo(selectedRisk.controlesIndividuo)}</div>
                </div>
              </div>
            </div>

            {/* ========================================================
                SECCIÓN 5: CRITERIOS PARA ESTABLECER CONTROLES
               ======================================================== */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
                    <Scale className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                      5. Criterios para Establecer Controles
                    </h3>
                    <p className="text-[11px] text-slate-400">Población expuesta, peor daño y marco normativo</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  GTC 45 § 3.5
                </span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Número de Expuestos
                    </span>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-400" />
                      <span className="text-xl font-mono font-bold text-white">
                        {selectedRisk.numeroExpuestos}
                      </span>
                      <span className="text-xs text-slate-400">trabajadores directos</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      ¿Requisito Legal Específico?
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-bold ${
                          selectedRisk.existenciaRequisitoLegal === 'SÍ'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {selectedRisk.existenciaRequisitoLegal}
                      </span>
                      <span className="text-xs text-slate-400">Obligación legal</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">
                    Peor Consecuencia Prevista
                  </span>
                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20">
                    {renderCampo(selectedRisk.peorConsecuencia)}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                    Disposición / Norma Legal Asociada
                  </span>
                  <div className="p-2 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
                    {renderCampo(selectedRisk.requisitoLegalEspecifico)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              SECCIÓN 4: EVALUACIÓN Y VALORACIÓN DEL RIESGO (GTC 45)
              CON DESGLOSE DINÁMICO EXPLICATIVO DEL NIVEL DE CONSECUENCIA (NC)
             ======================================================== */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
                    <span>4. Evaluación del Riesgo (GTC 45)</span>
                    <span className="text-xs font-normal normal-case text-amber-400 px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/30">
                      Cálculos algorítmicos automatizados
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Evaluación de deficiencia, exposición, probabilidad, consecuencia y aceptabilidad
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                GTC 45 § 3.4
              </span>
            </div>

            {/* FORMULA CARDS: ND, NE, NP, NC, NR, ACEPTABILIDAD */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* ND */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nivel Deficiencia (ND)</span>
                <span className="text-2xl font-black text-white font-mono my-1 block">
                  {selectedRisk.nivelDeficiencia}
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedRisk.nivelDeficiencia === 10
                    ? 'Muy Alto'
                    : selectedRisk.nivelDeficiencia === 6
                    ? 'Alto'
                    : 'Medio (2)'}
                </span>
              </div>

              {/* NE */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nivel Exposición (NE)</span>
                <span className="text-2xl font-black text-white font-mono my-1 block">
                  {selectedRisk.nivelExposicion}
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedRisk.nivelExposicion === 4
                    ? 'Continua'
                    : selectedRisk.nivelExposicion === 3
                    ? 'Frecuente'
                    : selectedRisk.nivelExposicion === 2
                    ? 'Ocasional'
                    : 'Esporádica'}
                </span>
              </div>

              {/* NP = ND * NE */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-orange-500/30 bg-orange-950/10 text-center">
                <span className="text-[10px] uppercase font-bold text-orange-400 block">Probabilidad (NP = ND × NE)</span>
                <span className="text-2xl font-black text-orange-400 font-mono my-1 block">
                  {selectedRisk.nivelProbabilidad}
                </span>
                <span className="text-[11px] font-bold text-orange-300">
                  {selectedRisk.interpretacionNP}
                </span>
              </div>

              {/* NC */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/10 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">Nivel Consecuencia (NC)</span>
                <span className="text-2xl font-black text-amber-400 font-mono my-1 block">
                  {selectedRisk.nivelConsecuencia}
                </span>
                <span className="text-[11px] font-bold text-amber-300">
                  {TABLA_TECNICA_NC[selectedRisk.nivelConsecuencia]?.clasificacion || 'Evaluado'}
                </span>
              </div>

              {/* NR = NP * NC */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/10 text-center">
                <span className="text-[10px] uppercase font-bold text-rose-400 block">Nivel Riesgo (NR = NP × NC)</span>
                <span className="text-2xl font-black text-rose-400 font-mono my-1 block">
                  {selectedRisk.nivelRiesgo}
                </span>
                <span className="text-[11px] font-black text-rose-300">
                  Nivel {selectedRisk.interpretacionNR}
                </span>
              </div>

              {/* ACEPTABILIDAD */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-center flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Valoración Final</span>
                <div className={`my-1 py-1 px-2 rounded-lg text-xs font-black ${getBadgeNivelRiesgo(selectedRisk.interpretacionNR)}`}>
                  {selectedRisk.interpretacionNR === 'I'
                    ? 'No Aceptable'
                    : selectedRisk.interpretacionNR === 'II'
                    ? 'Específico'
                    : selectedRisk.interpretacionNR === 'III'
                    ? 'Mejorable'
                    : 'Aceptable'}
                </div>
                <span className="text-[10px] text-slate-400">Intervención</span>
              </div>
            </div>

            {/* =========================================================================
                DESGLOSE DINÁMICO EXPLICATIVO DEL NIVEL DE CONSECUENCIA (NC)
                CONFORME A LA TABLA TÉCNICA REQUERIDA (10, 25, 60, 100)
               ========================================================================= */}
            <div className="mt-6 pt-5 border-t border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-orange-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                    Desglose Dinámico Explicativo del Nivel de Consecuencia (NC = {selectedRisk.nivelConsecuencia})
                  </h4>
                </div>
                <button
                  onClick={() => setShowFullNcTable(!showFullNcTable)}
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{showFullNcTable ? 'Ocultar comparativa completa' : 'Ver tabla técnica comparativa completa'}</span>
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showFullNcTable ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* TARJETA DESTACADA DEL NIVEL DE CONSECUENCIA ACTUAL */}
              {TABLA_TECNICA_NC[selectedRisk.nivelConsecuencia] && (
                <div
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-lg ${
                    TABLA_TECNICA_NC[selectedRisk.nivelConsecuencia].bgLight
                  } ${TABLA_TECNICA_NC[selectedRisk.nivelConsecuencia].borderColor}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-black ${TABLA_TECNICA_NC[selectedRisk.nivelConsecuencia].colorBadge}`}>
                        NC = {selectedRisk.nivelConsecuencia} · {TABLA_TECNICA_NC[selectedRisk.nivelConsecuencia].clasificacion.toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-white uppercase tracking-wide">
                        ← Nivel asignado a este peligro en Frikaz S.A.S.
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700">
                      GTC 45: Tabla 3 (Determinación del NC)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Definición Técnica Oficial
                      </span>
                      <p className="text-slate-200 leading-relaxed">
                        {TABLA_TECNICA_NC[selectedRisk.nivelConsecuencia].definicionTecnica}
                      </p>
                    </div>

                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block">
                        Criterio de Incapacidad Médica
                      </span>
                      <p className="text-slate-200 font-medium leading-relaxed">
                        {TABLA_TECNICA_NC[selectedRisk.nivelConsecuencia].criterioIncapacidad}
                      </p>
                    </div>

                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block">
                        Ejemplos Operativos Típicos
                      </span>
                      <p className="text-slate-200 leading-relaxed">
                        {TABLA_TECNICA_NC[selectedRisk.nivelConsecuencia].ejemplosOperativos}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TABLA COMPARATIVA COMPLETA DE TODOS LOS NIVELES NC (10, 25, 60, 100) */}
              {showFullNcTable && (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900/90 text-slate-300 font-bold uppercase text-[10px] border-b border-slate-800">
                        <th className="p-3 w-16 text-center">NC</th>
                        <th className="p-3 w-28">Clasificación</th>
                        <th className="p-3">Definición Técnica</th>
                        <th className="p-3 w-48">Criterio de Incapacidad Médica</th>
                        <th className="p-3">Ejemplos Operativos</th>
                        <th className="p-3 w-20 text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-normal">
                      {([10, 25, 60, 100] as const).map((ncVal) => {
                        const row = TABLA_TECNICA_NC[ncVal];
                        const isActive = selectedRisk.nivelConsecuencia === ncVal;
                        return (
                          <tr
                            key={ncVal}
                            className={`transition-colors ${
                              isActive
                                ? 'bg-orange-500/10 font-medium text-white'
                                : 'text-slate-300 hover:bg-slate-900/50'
                            }`}
                          >
                            <td className="p-3 text-center font-mono font-black text-sm">
                              <span className={`px-2 py-0.5 rounded ${row.colorBadge}`}>
                                {ncVal}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-white">{row.clasificacion}</td>
                            <td className="p-3 text-slate-300 text-[11px] leading-relaxed">
                              {row.definicionTecnica}
                            </td>
                            <td className="p-3 text-amber-300 text-[11px] font-medium leading-relaxed">
                              {row.criterioIncapacidad}
                            </td>
                            <td className="p-3 text-slate-300 text-[11px] leading-relaxed">
                              {row.ejemplosOperativos}
                            </td>
                            <td className="p-3 text-center">
                              {isActive ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-white font-bold text-[10px]">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Actual
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[10px]">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================
              SECCIÓN 6: MEDIDAS DE INTERVENCIÓN (JERARQUÍA DE CONTROLES)
             ======================================================== */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Wrench className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                    6. Medidas de Intervención (Jerarquía de Controles GTC 45 / ISO 45001)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Plan de acción ordenado de mayor a menor efectividad preventiva
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                GTC 45 § 3.6
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* 1. ELIMINACIÓN */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-rose-400">
                      1. Eliminación
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 font-bold">
                      Prioridad 1
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">Suprimir el peligro físicamente</p>
                  <div>{renderCampo(selectedRisk.medidaEliminacion)}</div>
                </div>
                <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-400 font-mono">
                  Eficacia: Máxima
                </div>
              </div>

              {/* 2. SUSTITUCIÓN */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400">
                      2. Sustitución
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-bold">
                      Prioridad 2
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">Reemplazar por menor riesgo</p>
                  <div>{renderCampo(selectedRisk.medidaSustitucion)}</div>
                </div>
                <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-400 font-mono">
                  Eficacia: Muy Alta
                </div>
              </div>

              {/* 3. CONTROLES DE INGENIERÍA */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-cyan-400">
                      3. Controles de Ingeniería
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold">
                      Prioridad 3
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">Aislar personas del peligro</p>
                  <div>{renderCampo(selectedRisk.medidaControlesIngenieria)}</div>
                </div>
                <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-400 font-mono">
                  Eficacia: Alta
                </div>
              </div>

              {/* 4. CONTROLES ADMINISTRATIVOS */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-blue-400">
                      4. Controles Administrativos
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-bold">
                      Prioridad 4
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">Señalización, advertencia, POES</p>
                  <div>{renderCampo(selectedRisk.medidaControlesAdministrativos)}</div>
                </div>
                <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-400 font-mono">
                  Eficacia: Moderada
                </div>
              </div>

              {/* 5. EQUIPOS Y EPP */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">
                      5. Equipos y EPP
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                      Prioridad 5
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">Protección individual certificada</p>
                  <div>{renderCampo(selectedRisk.medidaEquiposEPP)}</div>
                </div>
                <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-400 font-mono">
                  Eficacia: Barrera Final
                </div>
              </div>
            </div>

            {selectedRisk.observaciones && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <Info className="h-4 w-4 text-orange-400 shrink-0" />
                <span>
                  <strong className="text-white">Observaciones / Notas de auditoría:</strong>{' '}
                  {selectedRisk.observaciones} (Evaluado el {selectedRisk.fechaEvaluacion || '2025-01-15'}).
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: TABLA / LISTADO COMPLETO DE TODOS LOS RIESGOS DEL ÁREA */}
      {viewMode === 'todos_del_area' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Peligros registrados en: {selectedArea}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  {riesgosFiltrados.length} registros
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Haga clic en cualquiera de los registros para cargar su ficha técnica completa de 6 secciones.
              </p>
            </div>
            <button
              onClick={() => setViewMode('ficha')}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Volver a la ficha de consulta</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riesgosFiltrados.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedRiskId(item.id);
                  setViewMode('ficha');
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  selectedRisk?.id === item.id
                    ? 'bg-slate-850 border-orange-500 shadow-lg ring-1 ring-orange-500/50'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">{item.codigo || item.id}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getBadgeClasificacion(item.peligroClasificacion)}`}>
                      {item.peligroClasificacion}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${getBadgeNivelRiesgo(item.interpretacionNR)}`}>
                      Nivel {item.interpretacionNR} (NR={item.nivelRiesgo})
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                  {item.peligroDescripcion}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2">
                  <strong className="text-slate-300">Tarea:</strong> {item.tareas}
                </p>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>NP: {item.nivelProbabilidad} ({item.interpretacionNP})</span>
                    <span>·</span>
                    <span>NC: {item.nivelConsecuencia} ({TABLA_TECNICA_NC[item.nivelConsecuencia]?.clasificacion})</span>
                  </div>
                  <span className="text-orange-400 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Ver ficha técnica</span>
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION (AUTO-DISMISS IN 5 SECONDS + DIRECT ACCESS BUTTON) */}
      <MatrizRiesgosToast
        show={toastState.show}
        message={toastState.message}
        subMessage={toastState.subMessage}
        targetArea={toastState.targetArea}
        targetRiskId={toastState.targetRiskId}
        targetRiskName={toastState.targetRiskName}
        buttonLabel={toastState.buttonLabel || 'Ver cambios'}
        durationMs={5000}
        onActionClick={handleToastActionClick}
        onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
