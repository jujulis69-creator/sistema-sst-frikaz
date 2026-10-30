import React, { useState, useMemo } from 'react';
import {
  RiesgoGTC45Item,
  TABLA_TECNICA_NC,
  TipoClasificacionPeligro,
  InterpretacionNR,
} from '../types/gtc45RiskMatrix';
import {
  RIESGOS_GTC45_DATASET,
  obtenerAreasUnicas,
  obtenerCargosUnicos,
  obtenerProcesosUnicos,
  obtenerRiesgosPorCargo,
} from '../data/gtc45RiskMatrixData';
import {
  loadStoredRisks,
  saveStoredRisks,
  resetToInitialRisks,
  exportarMatrizGTC45AExcel,
} from '../services/riskMatrixStorage';
import { RiskFormModal } from './matriz-gtc45/RiskFormModal';
import { RiskDeleteConfirmModal } from './matriz-gtc45/RiskDeleteConfirmModal';
import { RiskAssistantModal } from './matriz-gtc45/RiskAssistantModal';
import {
  AlertTriangle,
  Shield,
  Layers,
  MapPin,
  Flame,
  Activity,
  CheckCircle2,
  HelpCircle,
  Search,
  RotateCcw,
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
  Eye,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  Edit,
  Trash2,
  FileSpreadsheet,
  Bot,
  RefreshCw,
  BarChart2,
  Briefcase,
  FolderTree,
} from 'lucide-react';

export type ModoVistaMatriz = 'ficha' | 'por_cargos' | 'tabla' | 'tarjetas' | 'indicadores';

export function MatrizRiesgosView() {
  // Primary State initialized from persistent storage
  const [dataset, setDataset] = useState<RiesgoGTC45Item[]>(() => loadStoredRisks());

  // Filter States
  const [selectedCargo, setSelectedCargo] = useState<string>('Todos los cargos');
  const [selectedArea, setSelectedArea] = useState<string>('Todas las áreas');
  const [selectedProceso, setSelectedProceso] = useState<string>('Todos los procesos');
  const [selectedClasificacion, setSelectedClasificacion] = useState<string>('Todas');
  const [selectedNivelRiesgo, setSelectedNivelRiesgo] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRiskId, setSelectedRiskId] = useState<string>('RSK-PROD-01');

  // View Modes & Modals
  const [viewMode, setViewMode] = useState<ModoVistaMatriz>('ficha');
  const [showFullNcTable, setShowFullNcTable] = useState<boolean>(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingRisk, setEditingRisk] = useState<RiesgoGTC45Item | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deletingRisk, setDeletingRisk] = useState<RiesgoGTC45Item | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isExportingExcel, setIsExportingExcel] = useState<boolean>(false);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Sync dataset to persistent storage whenever modified
  const updateDatasetAndPersist = (newDataset: RiesgoGTC45Item[]) => {
    setDataset(newDataset);
    saveStoredRisks(newDataset);
  };

  // Notification helper
  const triggerNotification = (msg: string) => {
    setSaveNotification(msg);
    setTimeout(() => {
      setSaveNotification(null);
    }, 3500);
  };

  // Dynamic Lists for Selectors
  const areasDisponibles = useMemo(() => obtenerAreasUnicas(dataset), [dataset]);
  const cargosDisponibles = useMemo(() => obtenerCargosUnicos(dataset), [dataset]);
  const procesosDisponibles = useMemo(() => obtenerProcesosUnicos(dataset), [dataset]);

  // Combined Filtering: Cargo + Area + Process + Classification + Risk Level + Search Keyword
  const riesgosFiltrados = useMemo(() => {
    return dataset.filter((r) => {
      // 1. Cargo Filter
      if (selectedCargo !== 'Todos los cargos') {
        const target = selectedCargo.toLowerCase().trim();
        const c1 = (r.cargo || '').toLowerCase();
        const c2 = (r.cargosExpuestos || '').toLowerCase();
        if (!c1.includes(target) && !c2.includes(target)) {
          return false;
        }
      }
      // 2. Area Filter
      if (selectedArea !== 'Todas las áreas' && r.zonaLugar !== selectedArea) {
        return false;
      }
      // 3. Process Filter
      if (selectedProceso !== 'Todos los procesos' && r.proceso !== selectedProceso) {
        return false;
      }
      // 4. Classification Filter
      if (selectedClasificacion !== 'Todas' && r.peligroClasificacion !== selectedClasificacion) {
        return false;
      }
      // 5. Risk Level Filter
      if (selectedNivelRiesgo !== 'Todos' && r.interpretacionNR !== selectedNivelRiesgo) {
        return false;
      }
      // 6. Search Keyword (Riesgo, Tarea, Efecto, Código, Proceso)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matches =
          r.peligroDescripcion.toLowerCase().includes(term) ||
          r.peligroClasificacion.toLowerCase().includes(term) ||
          r.efectosPosibles.toLowerCase().includes(term) ||
          r.tareas.toLowerCase().includes(term) ||
          r.actividades.toLowerCase().includes(term) ||
          r.proceso.toLowerCase().includes(term) ||
          r.zonaLugar.toLowerCase().includes(term) ||
          (r.cargo && r.cargo.toLowerCase().includes(term)) ||
          (r.cargosExpuestos && r.cargosExpuestos.toLowerCase().includes(term)) ||
          (r.codigo && r.codigo.toLowerCase().includes(term));
        if (!matches) return false;
      }
      return true;
    });
  }, [
    dataset,
    selectedCargo,
    selectedArea,
    selectedProceso,
    selectedClasificacion,
    selectedNivelRiesgo,
    searchTerm,
  ]);

  // Currently Selected Risk for Detailed Technical Sheet
  const selectedRisk = useMemo(() => {
    const found = dataset.find((r) => r.id === selectedRiskId);
    if (found && riesgosFiltrados.some((rf) => rf.id === found.id)) return found;
    if (riesgosFiltrados.length > 0) return riesgosFiltrados[0];
    if (dataset.length > 0) return dataset[0];
    return null;
  }, [dataset, selectedRiskId, riesgosFiltrados]);

  // Reset all filters
  const handleLimpiarFiltros = () => {
    setSelectedCargo('Todos los cargos');
    setSelectedArea('Todas las áreas');
    setSelectedProceso('Todos los procesos');
    setSelectedClasificacion('Todas');
    setSelectedNivelRiesgo('Todos');
    setSearchTerm('');
    if (dataset.length > 0) setSelectedRiskId(dataset[0].id);
  };

  // Reset to initial canonical base dataset
  const handleResetToCanonical = () => {
    if (
      window.confirm(
        '¿Desea restablecer la matriz de riesgos GTC 45 a los datos originales de referencia de Frikaz S.A.S.?'
      )
    ) {
      const base = resetToInitialRisks();
      setDataset(base);
      handleLimpiarFiltros();
      setSelectedRiskId(base[0]?.id || '');
      triggerNotification('Matriz restablecida a los valores originales de la GTC 45');
    }
  };

  // CRUD: Save (Create or Update)
  const handleSaveRisk = (savedRisk: RiesgoGTC45Item) => {
    const exists = dataset.some((r) => r.id === savedRisk.id);
    let updated: RiesgoGTC45Item[];
    if (exists) {
      updated = dataset.map((r) => (r.id === savedRisk.id ? savedRisk : r));
      triggerNotification(`Peligro ${savedRisk.codigo || savedRisk.id} actualizado con éxito`);
    } else {
      updated = [savedRisk, ...dataset];
      triggerNotification(`Nuevo peligro ${savedRisk.codigo || savedRisk.id} creado con éxito`);
    }
    updateDatasetAndPersist(updated);
    setSelectedRiskId(savedRisk.id);
    setIsFormModalOpen(false);
    setEditingRisk(null);
  };

  // CRUD: Delete
  const handleConfirmDelete = () => {
    if (!deletingRisk) return;
    const updated = dataset.filter((r) => r.id !== deletingRisk.id);
    updateDatasetAndPersist(updated);
    triggerNotification(`Peligro ${deletingRisk.codigo || deletingRisk.id} eliminado`);
    setIsDeleteModalOpen(false);
    setDeletingRisk(null);
    if (selectedRiskId === deletingRisk.id && updated.length > 0) {
      setSelectedRiskId(updated[0].id);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (risk: RiesgoGTC45Item) => {
    setEditingRisk(risk);
    setIsFormModalOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingRisk(null);
    setIsFormModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (risk: RiesgoGTC45Item) => {
    setDeletingRisk(risk);
    setIsDeleteModalOpen(true);
  };

  // Excel Export
  const handleExportExcel = async () => {
    try {
      setIsExportingExcel(true);
      const title =
        selectedCargo !== 'Todos los cargos'
          ? `Cargo: ${selectedCargo}`
          : selectedArea !== 'Todas las áreas'
          ? `Área: ${selectedArea}`
          : 'Matriz Completa Frikaz S.A.S.';
      await exportarMatrizGTC45AExcel(riesgosFiltrados, title);
      triggerNotification('Archivo Excel (.xlsx) generado y descargado correctamente');
    } catch (err) {
      console.error('Error exportando Excel:', err);
      alert('Ocurrió un error al generar el archivo Excel.');
    } finally {
      setIsExportingExcel(false);
    }
  };

  // Print technical sheet / report
  const handlePrint = () => {
    window.print();
  };

  // Safe Field Renderer
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

  // Badge Colors for Classification
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

  // Badge Colors for Risk Level (NR)
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

  // Statistics & Indicators Calculation (Requirement 6)
  const estadisticas = useMemo(() => {
    const total = dataset.length;
    const nivelI = dataset.filter((r) => r.interpretacionNR === 'I').length;
    const nivelII = dataset.filter((r) => r.interpretacionNR === 'II').length;
    const nivelIII = dataset.filter((r) => r.interpretacionNR === 'III').length;
    const nivelIV = dataset.filter((r) => r.interpretacionNR === 'IV').length;

    // By Cargo
    const porCargoMap = new Map<
      string,
      { total: number; nivelI: number; nivelII: number; nivelIII: number; nivelIV: number; areas: Set<string> }
    >();
    cargosDisponibles.forEach((cargo) => {
      const risks = obtenerRiesgosPorCargo(dataset, cargo);
      porCargoMap.set(cargo, {
        total: risks.length,
        nivelI: risks.filter((r) => r.interpretacionNR === 'I').length,
        nivelII: risks.filter((r) => r.interpretacionNR === 'II').length,
        nivelIII: risks.filter((r) => r.interpretacionNR === 'III').length,
        nivelIV: risks.filter((r) => r.interpretacionNR === 'IV').length,
        areas: new Set(risks.map((r) => r.zonaLugar)),
      });
    });

    const listaCargosOrdenados = Array.from(porCargoMap.entries())
      .map(([cargo, data]) => ({ cargo, ...data, areas: Array.from(data.areas) }))
      .sort((a, b) => b.total - a.total || b.nivelI - a.nivelI);

    // By Area
    const porAreaMap = new Map<
      string,
      { total: number; nivelI: number; nivelII: number; nivelIII: number; nivelIV: number }
    >();
    areasDisponibles.forEach((area) => {
      const risks = dataset.filter((r) => r.zonaLugar === area);
      porAreaMap.set(area, {
        total: risks.length,
        nivelI: risks.filter((r) => r.interpretacionNR === 'I').length,
        nivelII: risks.filter((r) => r.interpretacionNR === 'II').length,
        nivelIII: risks.filter((r) => r.interpretacionNR === 'III').length,
        nivelIV: risks.filter((r) => r.interpretacionNR === 'IV').length,
      });
    });
    const listaAreasOrdenadas = Array.from(porAreaMap.entries())
      .map(([area, data]) => ({ area, ...data }))
      .sort((a, b) => b.total - a.total || b.nivelI - a.nivelI);

    // By Classification
    const clasificacionesMap = new Map<TipoClasificacionPeligro, number>();
    dataset.forEach((r) => {
      clasificacionesMap.set(r.peligroClasificacion, (clasificacionesMap.get(r.peligroClasificacion) || 0) + 1);
    });
    const listaClasificaciones = Array.from(clasificacionesMap.entries())
      .map(([clasif, cantidad]) => ({ clasif, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    // Controls Implemented vs Pending
    const conControlFuente = dataset.filter(
      (r) => r.controlesFuente && r.controlesFuente !== 'Sin información registrada'
    ).length;
    const conControlMedio = dataset.filter(
      (r) => r.controlesMedio && r.controlesMedio !== 'Sin información registrada'
    ).length;
    const conControlIndividuo = dataset.filter(
      (r) => r.controlesIndividuo && r.controlesIndividuo !== 'Sin información registrada'
    ).length;

    // Interventions Formulated
    const conIngenieria = dataset.filter(
      (r) =>
        r.medidaControlesIngenieria &&
        r.medidaControlesIngenieria !== 'Sin información registrada' &&
        r.medidaControlesIngenieria.toLowerCase() !== 'no aplica'
    ).length;
    const conAdmin = dataset.filter(
      (r) =>
        r.medidaControlesAdministrativos &&
        r.medidaControlesAdministrativos !== 'Sin información registrada'
    ).length;
    const conEPP = dataset.filter(
      (r) => r.medidaEquiposEPP && r.medidaEquiposEPP !== 'Sin información registrada'
    ).length;

    return {
      total,
      nivelI,
      nivelII,
      nivelIII,
      nivelIV,
      listaCargosOrdenados,
      listaAreasOrdenadas,
      listaClasificaciones,
      conControlFuente,
      conControlMedio,
      conControlIndividuo,
      conIngenieria,
      conAdmin,
      conEPP,
    };
  }, [dataset, cargosDisponibles, areasDisponibles]);

  // Grouped by Cargo map for the 'por_cargos' view
  const riesgosAgrupadosPorCargo = useMemo(() => {
    return cargosDisponibles.map((cargo) => {
      const risks = obtenerRiesgosPorCargo(dataset, cargo);
      return {
        cargo,
        risks,
        total: risks.length,
        criticos: risks.filter((r) => r.interpretacionNR === 'I').length,
        medio: risks.filter((r) => r.interpretacionNR === 'II').length,
      };
    });
  }, [cargosDisponibles, dataset]);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* PERSISTENCE TOAST NOTIFICATION */}
      {saveNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-emerald-400 border border-emerald-500/50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{saveNotification}</span>
        </div>
      )}

      {/* HEADER BANNER - OFFICIAL NAME: MATRIZ DE RIESGOS */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0b172a] border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              SISTEMA SG-SST · GUÍA TÉCNICA COLOMBIANA GTC 45 (SEGUNDA ACTUALIZACIÓN)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>MATRIZ DE RIESGOS</span>
              <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-slate-800 text-emerald-300 border border-slate-700">
                Frikaz S.A.S.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Identificación de peligros, evaluación y valoración de riesgos laborales estructurada en sus 6 secciones oficiales.
              Consulte peligros agrupados por <strong className="text-white">Cargo</strong>, Zona o Proceso, examine fichas técnicas interactivas con desglose de consecuencia y gestione la jerarquía de controles.
            </p>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/80 shadow-inner">
              <div className="text-center px-3 border-r border-slate-800">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Total Peligros</span>
                <span className="text-xl font-black text-white font-mono">{estadisticas.total}</span>
              </div>
              <div className="text-center px-3 border-r border-slate-800">
                <span className="block text-[10px] uppercase font-bold text-emerald-400">Cargos</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {cargosDisponibles.length}
                </span>
              </div>
              <div className="text-center px-3">
                <span className="block text-[10px] uppercase font-bold text-rose-400">Críticos (I)</span>
                <span className="text-xl font-black text-rose-400 font-mono">
                  {estadisticas.nivelI}
                </span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>+ Nuevo Peligro GTC 45</span>
              </button>

              <button
                onClick={() => setIsAssistantOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                title="Abrir Asistente Consultor de la Matriz de Riesgos"
              >
                <Bot className="h-4 w-4 text-emerald-400" />
                <span>Asistente Consultor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar (View Modes, Export, Print, Reset) */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium mr-1">Modalidad de vista:</span>
            <button
              onClick={() => setViewMode('ficha')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'ficha'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Ficha Técnica (6 Secciones)</span>
            </button>
            <button
              onClick={() => setViewMode('por_cargos')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'por_cargos'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Agrupación por Cargos ({cargosDisponibles.length})</span>
            </button>
            <button
              onClick={() => setViewMode('tabla')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'tabla'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Tabla Matriz Completa</span>
            </button>
            <button
              onClick={() => setViewMode('tarjetas')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'tarjetas'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Tarjetas ({riesgosFiltrados.length})</span>
            </button>
            <button
              onClick={() => setViewMode('indicadores')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'indicadores'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" />
              <span>Indicadores GTC 45</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportExcel}
              disabled={isExportingExcel}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold disabled:opacity-50"
              title="Descargar matriz en Excel (.xlsx) con fórmulas, cargos y formatos GTC 45"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isExportingExcel ? 'Generando Excel...' : 'Exportar Excel (.xlsx)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Imprimir informe o ficha técnica en PDF"
            >
              <Printer className="h-3.5 w-3.5 text-slate-300" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={handleResetToCanonical}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              title="Restablecer datos originales de la matriz base de Frikaz S.A.S."
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Restablecer Base</span>
            </button>
          </div>
        </div>
      </div>

      {/* DYNAMIC COMBINED FILTERS PANEL (CARGO, AREA, PROCESO, CLASIFICACIÓN, NIVEL DE RIESGO, TEXTO) */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Búsqueda y Filtros Combinados (Por Cargo y por Riesgo)
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {riesgosFiltrados.length} de {dataset.length} peligros visibles
            </span>
            {(selectedCargo !== 'Todos los cargos' ||
              selectedArea !== 'Todas las áreas' ||
              selectedProceso !== 'Todos los procesos' ||
              selectedClasificacion !== 'Todas' ||
              selectedNivelRiesgo !== 'Todos' ||
              searchTerm) && (
              <button
                onClick={handleLimpiarFiltros}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-semibold"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Limpiar filtros</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* FILTER 1: CARGO / PUESTO DE TRABAJO (PROMINENT GTC 45 REQUIREMENT) */}
          <div className="space-y-1.5 sm:col-span-2 xl:col-span-2">
            <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Briefcase className="h-3.5 w-3.5" />
                <span>Filtrar por Cargo</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({cargosDisponibles.length} puestos)
              </span>
            </label>
            <select
              value={selectedCargo}
              onChange={(e) => setSelectedCargo(e.target.value)}
              className="w-full bg-slate-950 text-white font-medium text-xs rounded-xl px-3 py-2.5 border border-emerald-500/40 focus:outline-none focus:border-emerald-400 cursor-pointer shadow-inner"
            >
              <option value="Todos los cargos">Todos los cargos ({dataset.length} peligros)</option>
              {cargosDisponibles.map((cargo) => {
                const count = obtenerRiesgosPorCargo(dataset, cargo).length;
                return (
                  <option key={cargo} value={cargo}>
                    {cargo} ({count} {count === 1 ? 'peligro' : 'peligros'})
                  </option>
                );
              })}
            </select>
          </div>

          {/* FILTER 2: ÁREA / ZONA / LUGAR */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span>Zona / Lugar</span>
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full bg-slate-950 text-white font-medium text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="Todas las áreas">Todas las áreas ({areasDisponibles.length})</option>
              {areasDisponibles.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* FILTER 3: PROCESO */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FolderTree className="h-3.5 w-3.5 text-blue-400" />
              <span>Proceso</span>
            </label>
            <select
              value={selectedProceso}
              onChange={(e) => setSelectedProceso(e.target.value)}
              className="w-full bg-slate-950 text-white font-medium text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="Todos los procesos">Todos los procesos</option>
              {procesosDisponibles.map((proc) => (
                <option key={proc} value={proc}>
                  {proc}
                </option>
              ))}
            </select>
          </div>

          {/* FILTER 4: CLASIFICACIÓN DEL PELIGRO */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              <span>Clasificación</span>
            </label>
            <select
              value={selectedClasificacion}
              onChange={(e) => setSelectedClasificacion(e.target.value)}
              className="w-full bg-slate-950 text-white font-medium text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="Todas">Todas las clasificaciones</option>
              <option value="Físico">Físico</option>
              <option value="Químico">Químico</option>
              <option value="Biológico">Biológico</option>
              <option value="Biomecánico">Biomecánico</option>
              <option value="Psicosocial">Psicosocial</option>
              <option value="Condiciones de Seguridad">Condiciones de Seguridad</option>
              <option value="Fenómenos Naturales">Fenómenos Naturales</option>
            </select>
          </div>

          {/* FILTER 5: NIVEL DE RIESGO (NR) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-rose-400" />
              <span>Nivel Riesgo (NR)</span>
            </label>
            <select
              value={selectedNivelRiesgo}
              onChange={(e) => setSelectedNivelRiesgo(e.target.value)}
              className="w-full bg-slate-950 text-white font-medium text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="Todos">Todos los niveles</option>
              <option value="I">Nivel I · No Aceptable ({estadisticas.nivelI})</option>
              <option value="II">Nivel II · Específico ({estadisticas.nivelII})</option>
              <option value="III">Nivel III · Mejorable ({estadisticas.nivelIII})</option>
              <option value="IV">Nivel IV · Aceptable ({estadisticas.nivelIV})</option>
            </select>
          </div>
        </div>

        {/* BÚSQUEDA POR RIESGO (TEXTO LIBRE) */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por riesgo (nombre, descripción, efectos posibles, clasificación, tareas o código)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 text-white text-xs rounded-xl pl-9 pr-8 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
            />
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Cargo chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] py-0.5 shrink-0">
            <span className="text-slate-400 text-[10px] font-bold uppercase shrink-0">Cargos clave:</span>
            {['Operario de Fritura y Cocción', 'Técnico de Mantenimiento Electromecánico', 'Auxiliar de Bodega y Logística', 'Auxiliar de Servicios Generales y Aseo'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCargo(c)}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-[10px] font-medium border ${
                  selectedCargo === c
                    ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {c.split(' ')[0]} {c.split(' ')[1] || ''}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Hazard Selector for Ficha Mode */}
        {viewMode === 'ficha' && (
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 shrink-0">Peligro Seleccionado:</span>
              <select
                value={selectedRisk?.id || ''}
                onChange={(e) => setSelectedRiskId(e.target.value)}
                className="w-full sm:max-w-2xl bg-slate-950 text-white text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer truncate"
              >
                {riesgosFiltrados.map((r) => (
                  <option key={r.id} value={r.id}>
                    [{r.codigo || r.id}] {r.cargo ? `(${r.cargo})` : ''} - {r.peligroDescripcion.substring(0, 75)}...
                  </option>
                ))}
              </select>
            </div>

            {selectedRisk && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(selectedRisk)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
                >
                  <Edit className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleOpenDelete(selectedRisk)}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold flex items-center gap-1.5 border border-rose-500/40 cursor-pointer transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                  <span>Eliminar</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* EMPTY STATE */}
      {riesgosFiltrados.length === 0 && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center space-y-3">
          <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No se encontraron riesgos para estos filtros</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No existen registros con los criterios seleccionados. Restablezca los filtros o agregue un nuevo registro.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleLimpiarFiltros}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Borrar Filtros
            </button>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              + Crear Peligro
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 1: FICHA TÉCNICA DETALLADA (6 SECCIONES OBLIGATORIAS GTC 45)
         ========================================================================= */}
      {viewMode === 'ficha' && selectedRisk && (
        <div id="ficha-tecnica-riesgo" className="space-y-6">
          {/* HEADER RESUMEN DEL RIESGO */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs font-bold">
                  {selectedRisk.codigo || selectedRisk.id}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedRisk.zonaLugar}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold ${getBadgeClasificacion(
                    selectedRisk.peligroClasificacion
                  )}`}
                >
                  {selectedRisk.peligroClasificacion}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                  Proceso: {selectedRisk.proceso}
                </span>
                {(selectedRisk.cargo || selectedRisk.cargosExpuestos) && (
                  <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-200 text-xs font-semibold border border-emerald-500/40 flex items-center gap-1">
                    <Briefcase className="h-3 w-3 text-emerald-400" />
                    Cargo: {selectedRisk.cargo || selectedRisk.cargosExpuestos}
                  </span>
                )}
              </div>

              {/* Acceptability & NR Pill */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Nivel de Riesgo (NR)
                  </span>
                  <span className="font-mono text-xs font-black text-slate-200">
                    NR = {selectedRisk.nivelRiesgo}
                  </span>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 ${getBadgeNivelRiesgo(
                    selectedRisk.interpretacionNR
                  )}`}
                >
                  <span>Nivel {selectedRisk.interpretacionNR}</span>
                  <span className="opacity-80">·</span>
                  <span>{selectedRisk.aceptabilidadRiesgo}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                Peligro - Descripción completa
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5 leading-snug">
                {selectedRisk.peligroDescripcion}
              </h2>
            </div>
          </div>

          {/* GRID OF THE 6 MANDATORY SECTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SECCIÓN 1: IDENTIFICACIÓN DE LA ACTIVIDAD Y CARGOS */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                      1. Identificación de la Actividad
                    </h3>
                    <p className="text-[11px] text-slate-400">Contexto del proceso operativo, cargos y tareas</p>
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

                {/* Cargo o cargos expuestos */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1 flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    Cargo o Cargos Expuestos
                  </span>
                  <p className="text-white text-sm font-bold">
                    {selectedRisk.cargosExpuestos || selectedRisk.cargo || 'Sin información registrada'}
                  </p>
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
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      ¿Es una actividad rutinaria?
                    </span>
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

            {/* SECCIÓN 2: IDENTIFICACIÓN DEL PELIGRO */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
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
                    Clasificación del Peligro (GTC 45)
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold ${getBadgeClasificacion(
                        selectedRisk.peligroClasificacion
                      )}`}
                    >
                      {selectedRisk.peligroClasificacion}
                    </span>
                    <span className="text-xs text-slate-400">Factor de riesgo evaluado</span>
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

            {/* SECCIÓN 3: CONTROLES EXISTENTES */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
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

            {/* SECCIÓN 5: CRITERIOS PARA ESTABLECER CONTROLES */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-md space-y-4">
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
                      <Users className="h-4 w-4 text-emerald-400" />
                      <span className="text-xl font-mono font-bold text-white">
                        {selectedRisk.numeroExpuestos}
                      </span>
                      <span className="text-xs text-slate-400">trabajadores</span>
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

          {/* SECCIÓN 4: EVALUACIÓN Y VALORACIÓN DEL RIESGO (GTC 45) */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
                    <span>4. Evaluación del Riesgo (GTC 45)</span>
                    <span className="text-xs font-normal normal-case text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/30">
                      Cálculos automáticos NP = ND × NE | NR = NP × NC
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Deficiencia, exposición, probabilidad, consecuencia, nivel de riesgo y aceptabilidad
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
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Nivel Deficiencia (ND)
                </span>
                <span className="text-2xl font-black text-white font-mono my-1 block">
                  {selectedRisk.nivelDeficiencia}
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedRisk.nivelDeficiencia === 10
                    ? 'Muy Alto (10)'
                    : selectedRisk.nivelDeficiencia === 6
                    ? 'Alto (6)'
                    : 'Medio (2)'}
                </span>
              </div>

              {/* NE */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Nivel Exposición (NE)
                </span>
                <span className="text-2xl font-black text-white font-mono my-1 block">
                  {selectedRisk.nivelExposicion}
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedRisk.nivelExposicion === 4
                    ? 'Continua (4)'
                    : selectedRisk.nivelExposicion === 3
                    ? 'Frecuente (3)'
                    : selectedRisk.nivelExposicion === 2
                    ? 'Ocasional (2)'
                    : 'Esporádica (1)'}
                </span>
              </div>

              {/* NP = ND * NE */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/10 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                  NP = ND × NE
                </span>
                <span className="text-2xl font-black text-emerald-400 font-mono my-1 block">
                  {selectedRisk.nivelProbabilidad}
                </span>
                <span className="text-[11px] font-bold text-emerald-300">
                  {selectedRisk.interpretacionNP}
                </span>
              </div>

              {/* NC */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/10 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">
                  Consecuencia (NC)
                </span>
                <span className="text-2xl font-black text-amber-400 font-mono my-1 block">
                  {selectedRisk.nivelConsecuencia}
                </span>
                <span className="text-[11px] font-bold text-amber-300">
                  {TABLA_TECNICA_NC[selectedRisk.nivelConsecuencia]?.clasificacion || 'Evaluado'}
                </span>
              </div>

              {/* NR = NP * NC */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/10 text-center">
                <span className="text-[10px] uppercase font-bold text-rose-400 block">
                  NR = NP × NC
                </span>
                <span className="text-2xl font-black text-rose-400 font-mono my-1 block">
                  {selectedRisk.nivelRiesgo}
                </span>
                <span className="text-[11px] font-black text-rose-300">
                  Nivel {selectedRisk.interpretacionNR}
                </span>
              </div>

              {/* ACEPTABILIDAD */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-center flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Valoración Final
                </span>
                <div
                  className={`my-1 py-1 px-2 rounded-lg text-xs font-black ${getBadgeNivelRiesgo(
                    selectedRisk.interpretacionNR
                  )}`}
                >
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

            {/* DESGLOSE DINÁMICO EXPLICATIVO DEL NIVEL DE CONSECUENCIA (NC) */}
            <div className="mt-6 pt-5 border-t border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                    Panel Explicativo Técnico del Nivel de Consecuencia (NC = {selectedRisk.nivelConsecuencia})
                  </h4>
                </div>
                <button
                  onClick={() => setShowFullNcTable(!showFullNcTable)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>
                    {showFullNcTable
                      ? 'Ocultar comparativa completa'
                      : 'Ver tabla técnica comparativa completa'}
                  </span>
                  <ChevronRight
                    className={`h-3.5 w-3.5 transition-transform ${
                      showFullNcTable ? 'rotate-90' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Tarjeta destacada del nivel de consecuencia actual */}
              {TABLA_TECNICA_NC[selectedRisk.nivelConsecuencia] && (
                <div
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-lg ${
                    TABLA_TECNICA_NC[selectedRisk.nivelConsecuencia].bgLight
                  } ${TABLA_TECNICA_NC[selectedRisk.nivelConsecuencia].borderColor}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-black ${
                          TABLA_TECNICA_NC[selectedRisk.nivelConsecuencia].colorBadge
                        }`}
                      >
                        NC = {selectedRisk.nivelConsecuencia} ·{' '}
                        {TABLA_TECNICA_NC[selectedRisk.nivelConsecuencia].clasificacion.toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-white uppercase tracking-wide">
                        ← Criterio técnico asignado a este peligro
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

              {/* Tabla comparativa de todos los valores NC (10, 25, 60, 100) */}
              {showFullNcTable && (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900/90 text-slate-300 font-bold uppercase text-[10px] border-b border-slate-800">
                        <th className="p-3 w-16 text-center">NC</th>
                        <th className="p-3 w-28">Clasificación</th>
                        <th className="p-3">Definición Técnica Oficial</th>
                        <th className="p-3 w-48">Criterio de Incapacidad</th>
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
                                ? 'bg-emerald-500/10 font-medium text-white'
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
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Actual
                                </span>
                              ) : (
                                <span className="text-slate-500 text-[10px]">—</span>
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

          {/* SECCIÓN 6: MEDIDAS DE INTERVENCIÓN (JERARQUÍA DE CONTROLES) */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
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
                <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
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
                <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
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
                <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
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
                <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
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
                <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
                  Eficacia: Barrera Final
                </div>
              </div>
            </div>

            {selectedRisk.observaciones && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <Info className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-white">Observaciones / Notas de auditoría:</strong>{' '}
                  {selectedRisk.observaciones}
                  {selectedRisk.fechaEvaluacion ? ` (Evaluado el ${selectedRisk.fechaEvaluacion}).` : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: AGRUPACIÓN DE RIESGOS POR CARGOS (FEATURE PRINCIPAL)
         ========================================================================= */}
      {viewMode === 'por_cargos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-400" />
                <span>Riesgos Laborales Agrupados por Cargo / Puesto</span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  {cargosDisponibles.length} cargos en Frikaz S.A.S.
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Consulte cada puesto de trabajo para visualizar sus peligros evaluados, controles y medidas de intervención.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {riesgosAgrupadosPorCargo.map((itemCargo) => (
              <div
                key={itemCargo.cargo}
                className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-lg transition-all"
              >
                {/* Cargo Header Bar */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        {itemCargo.cargo}
                        <span className="text-xs font-normal text-slate-400">
                          ({itemCargo.total} {itemCargo.total === 1 ? 'peligro asociado' : 'peligros asociados'})
                        </span>
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {itemCargo.criticos > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-bold">
                            {itemCargo.criticos} Crítico(s) Nivel I
                          </span>
                        )}
                        {itemCargo.medio > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
                            {itemCargo.medio} Nivel II
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCargo(itemCargo.cargo);
                        setViewMode('ficha');
                        if (itemCargo.risks.length > 0) {
                          setSelectedRiskId(itemCargo.risks[0].id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Ver Ficha Técnica</span>
                    </button>
                  </div>
                </div>

                {/* Cargo Hazards Grid */}
                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {itemCargo.risks.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelectedRiskId(r.id);
                        setViewMode('ficha');
                      }}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850/60 transition-all cursor-pointer space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] font-bold text-emerald-400">
                            {r.codigo || r.id}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-black ${getBadgeNivelRiesgo(
                              r.interpretacionNR
                            )}`}
                          >
                            Nivel {r.interpretacionNR} (NR={r.nivelRiesgo})
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span className={`px-1.5 py-0.2 rounded font-bold ${getBadgeClasificacion(r.peligroClasificacion)}`}>
                            {r.peligroClasificacion}
                          </span>
                          <span>·</span>
                          <span className="truncate">{r.zonaLugar}</span>
                        </div>

                        <h5 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                          {r.peligroDescripcion}
                        </h5>

                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          <strong className="text-slate-300">Tarea:</strong> {r.tareas}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span>
                          NP: <strong className="text-white">{r.nivelProbabilidad}</strong> | NC:{' '}
                          <strong className="text-white">{r.nivelConsecuencia}</strong>
                        </span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                          <span>Detalle</span>
                          <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 3: TABLA GENERAL GTC 45 (TODAS LAS COLUMNAS Y ACCIONES CRUD)
         ========================================================================= */}
      {viewMode === 'tabla' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TableIcon className="h-5 w-5 text-emerald-400" />
                <span>Tabla Matriz Completa GTC 45</span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  {riesgosFiltrados.length} registros
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Vista de tabla horizontal con todas las variables de la GTC 45, incluyendo cargos expuestos.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenCreate}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Nuevo Peligro</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl">
            <table className="w-full text-left text-xs border-collapse min-w-[1400px]">
              <thead>
                {/* Agrupación de Secciones */}
                <tr className="bg-slate-950 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800 text-center">
                  <th colSpan={5} className="p-2 border-r border-slate-800 bg-slate-900/60">
                    1. Identificación Actividad y Cargos
                  </th>
                  <th colSpan={2} className="p-2 border-r border-slate-800 bg-blue-950/30 text-blue-300">
                    2. Peligro
                  </th>
                  <th colSpan={3} className="p-2 border-r border-slate-800 bg-emerald-950/30 text-emerald-300">
                    3. Controles
                  </th>
                  <th colSpan={6} className="p-2 border-r border-slate-800 bg-indigo-950/30 text-indigo-300">
                    4. Evaluación GTC 45
                  </th>
                  <th colSpan={2} className="p-2 border-r border-slate-800 bg-teal-950/30 text-teal-300">
                    5. Criterios
                  </th>
                  <th className="p-2 text-center bg-slate-900/60">Acciones</th>
                </tr>

                {/* Column Headers */}
                <tr className="bg-slate-900 text-slate-200 font-bold text-[11px] border-b border-slate-800 whitespace-nowrap">
                  <th className="p-3 w-24">Código</th>
                  <th className="p-3 w-40">Cargo(s) Expuesto(s)</th>
                  <th className="p-3 w-36">Zona / Lugar</th>
                  <th className="p-3 w-32">Proceso</th>
                  <th className="p-3 w-16 text-center">Rutinario</th>
                  <th className="p-3 w-36">Clasificación</th>
                  <th className="p-3 min-w-[240px]">Descripción Peligro</th>
                  <th className="p-3 w-32">Fuente</th>
                  <th className="p-3 w-32">Medio</th>
                  <th className="p-3 w-36">Individuo</th>
                  <th className="p-3 w-12 text-center">ND</th>
                  <th className="p-3 w-12 text-center">NE</th>
                  <th className="p-3 w-16 text-center">NP</th>
                  <th className="p-3 w-12 text-center">NC</th>
                  <th className="p-3 w-16 text-center">NR</th>
                  <th className="p-3 w-36 text-center">Aceptabilidad</th>
                  <th className="p-3 w-16 text-center">Expuestos</th>
                  <th className="p-3 w-40">Peor Consecuencia</th>
                  <th className="p-3 w-28 text-center">Operaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-normal">
                {riesgosFiltrados.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-900/60 transition-colors ${
                      selectedRisk?.id === item.id ? 'bg-emerald-950/20' : ''
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      {item.codigo || item.id}
                    </td>
                    <td className="p-3 text-slate-200 font-semibold max-w-[160px] truncate" title={item.cargosExpuestos || item.cargo}>
                      {item.cargosExpuestos || item.cargo || 'Sin información registrada'}
                    </td>
                    <td className="p-3 text-slate-300 font-medium">{item.zonaLugar}</td>
                    <td className="p-3 text-slate-400">{item.proceso}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.rutinario === 'SÍ'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {item.rutinario}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${getBadgeClasificacion(
                          item.peligroClasificacion
                        )}`}
                      >
                        {item.peligroClasificacion}
                      </span>
                    </td>
                    <td className="p-3 text-slate-200 font-medium max-w-xs truncate" title={item.peligroDescripcion}>
                      {item.peligroDescripcion}
                    </td>
                    <td className="p-3 text-slate-400 truncate max-w-[140px]" title={item.controlesFuente}>
                      {item.controlesFuente || 'Sin información registrada'}
                    </td>
                    <td className="p-3 text-slate-400 truncate max-w-[140px]" title={item.controlesMedio}>
                      {item.controlesMedio || 'Sin información registrada'}
                    </td>
                    <td className="p-3 text-slate-400 truncate max-w-[140px]" title={item.controlesIndividuo}>
                      {item.controlesIndividuo || 'Sin información registrada'}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-200">{item.nivelDeficiencia}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-200">{item.nivelExposicion}</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-400">{item.nivelProbabilidad}</td>
                    <td className="p-3 text-center font-mono font-bold text-amber-400">{item.nivelConsecuencia}</td>
                    <td className="p-3 text-center font-mono font-black text-rose-400">{item.nivelRiesgo}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] inline-block ${getBadgeNivelRiesgo(
                          item.interpretacionNR
                        )}`}
                      >
                        Nivel {item.interpretacionNR}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-300">{item.numeroExpuestos}</td>
                    <td className="p-3 text-slate-400 truncate max-w-[160px]" title={item.peorConsecuencia}>
                      {item.peorConsecuencia}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedRiskId(item.id);
                            setViewMode('ficha');
                          }}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Ver Ficha Técnica"
                        >
                          <Eye className="h-3.5 w-3.5 text-emerald-400" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Editar Peligro"
                        >
                          <Edit className="h-3.5 w-3.5 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(item)}
                          className="p-1.5 rounded hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Eliminar Peligro"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 4: TARJETAS POR ZONA Y PUESTO
         ========================================================================= */}
      {viewMode === 'tarjetas' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-emerald-400" />
                <span>Cuadrícula de Peligros Valorados</span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  {riesgosFiltrados.length} registros
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Explore rápidamente los peligros con su respectivo cargo y nivel de aceptabilidad.
              </p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nuevo Peligro</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {riesgosFiltrados.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  selectedRisk?.id === item.id
                    ? 'bg-slate-900 border-emerald-500 shadow-lg ring-1 ring-emerald-500/50'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850/60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {item.codigo || item.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${getBadgeClasificacion(
                          item.peligroClasificacion
                        )}`}
                      >
                        {item.peligroClasificacion}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${getBadgeNivelRiesgo(
                          item.interpretacionNR
                        )}`}
                      >
                        Nivel {item.interpretacionNR} (NR={item.nivelRiesgo})
                      </span>
                    </div>
                  </div>

                  {/* Cargo Badge */}
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
                    <Briefcase className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{item.cargo || item.cargosExpuestos}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                    <span className="text-slate-300">{item.zonaLugar}</span>
                    <span className="text-slate-600">·</span>
                    <span className="truncate">{item.proceso}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                    {item.peligroDescripcion}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    <strong className="text-slate-300">Tarea:</strong> {item.tareas}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      NP: <strong className="text-white">{item.nivelProbabilidad}</strong> ({item.interpretacionNP})
                    </span>
                    <span>
                      NC: <strong className="text-white">{item.nivelConsecuencia}</strong> ({TABLA_TECNICA_NC[item.nivelConsecuencia]?.clasificacion})
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        setSelectedRiskId(item.id);
                        setViewMode('ficha');
                      }}
                      className="text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Ver Ficha Técnica</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(item)}
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 5: INDICADORES DENTRO DE LA MATRIZ (FEATURE 6)
         ========================================================================= */}
      {viewMode === 'indicadores' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-emerald-400" />
              <span>Indicadores y Estadísticas Reales de la Matriz GTC 45</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Métricas consolidadas a partir de los datos registrados, con desglose por cargo, nivel de criticidad, área y jerarquía de intervención.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Peligros</span>
              <span className="text-3xl font-black text-white font-mono my-1 block">{estadisticas.total}</span>
              <span className="text-[11px] text-emerald-400">100% evaluados</span>
            </div>
            <div className="bg-slate-900 border border-rose-500/30 bg-rose-950/10 p-4 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-rose-400 block">Críticos (Nivel I)</span>
              <span className="text-3xl font-black text-rose-400 font-mono my-1 block">{estadisticas.nivelI}</span>
              <span className="text-[11px] text-rose-300 font-bold">No Aceptables</span>
            </div>
            <div className="bg-slate-900 border border-amber-500/30 bg-amber-950/10 p-4 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Riesgo Alto (Nivel II)</span>
              <span className="text-3xl font-black text-amber-400 font-mono my-1 block">{estadisticas.nivelII}</span>
              <span className="text-[11px] text-amber-300">Control Específico</span>
            </div>
            <div className="bg-slate-900 border border-emerald-500/30 bg-emerald-950/10 p-4 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Aceptables (III y IV)</span>
              <span className="text-3xl font-black text-emerald-400 font-mono my-1 block">
                {estadisticas.nivelIII + estadisticas.nivelIV}
              </span>
              <span className="text-[11px] text-emerald-300">Mejorable / Aceptable</span>
            </div>
          </div>

          {/* TWO TABLES: TOP CARGOS & AREAS CON MAYOR EXPOSICIÓN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table: Cargos con Mayor Cantidad de Peligros */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                    Cargos con Mayor Cantidad de Peligros
                  </h4>
                </div>
                <span className="text-xs text-slate-400">{estadisticas.listaCargosOrdenados.length} cargos</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-300 text-[10px] font-bold uppercase border-b border-slate-800">
                      <th className="p-2.5">Puesto / Cargo</th>
                      <th className="p-2.5 text-center">Peligros</th>
                      <th className="p-2.5 text-center text-rose-400">Nivel I</th>
                      <th className="p-2.5 text-center text-amber-400">Nivel II</th>
                      <th className="p-2.5 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-normal">
                    {estadisticas.listaCargosOrdenados.map((item) => (
                      <tr key={item.cargo} className="hover:bg-slate-850/50 transition-colors">
                        <td className="p-2.5 font-bold text-white">{item.cargo}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-emerald-400">{item.total}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-rose-400">{item.nivelI}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-amber-400">{item.nivelII}</td>
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => {
                              setSelectedCargo(item.cargo);
                              setViewMode('por_cargos');
                            }}
                            className="text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold cursor-pointer"
                          >
                            Filtrar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table: Áreas con Mayor Exposición */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                    Áreas con Mayor Exposición de Peligros
                  </h4>
                </div>
                <span className="text-xs text-slate-400">{estadisticas.listaAreasOrdenadas.length} áreas</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-300 text-[10px] font-bold uppercase border-b border-slate-800">
                      <th className="p-2.5">Zona / Lugar</th>
                      <th className="p-2.5 text-center">Peligros</th>
                      <th className="p-2.5 text-center text-rose-400">Nivel I</th>
                      <th className="p-2.5 text-center text-amber-400">Nivel II</th>
                      <th className="p-2.5 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-normal">
                    {estadisticas.listaAreasOrdenadas.map((item) => (
                      <tr key={item.area} className="hover:bg-slate-850/50 transition-colors">
                        <td className="p-2.5 font-bold text-white">{item.area}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-emerald-400">{item.total}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-rose-400">{item.nivelI}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-amber-400">{item.nivelII}</td>
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => {
                              setSelectedArea(item.area);
                              setViewMode('tarjetas');
                            }}
                            className="text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold cursor-pointer"
                          >
                            Filtrar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* TWO TABLES: CLASIFICACIÓN & ESTADO DE CONTROLES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peligros Más Frecuentes por Clasificación */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Layers className="h-4 w-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                  Peligros Más Frecuentes (Por Clasificación)
                </h4>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-300 text-[10px] font-bold uppercase border-b border-slate-800">
                      <th className="p-2.5">Clasificación GTC 45</th>
                      <th className="p-2.5 text-center">Peligros</th>
                      <th className="p-2.5 text-center">Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-normal">
                    {estadisticas.listaClasificaciones.map((item) => (
                      <tr key={item.clasif} className="hover:bg-slate-850/50 transition-colors">
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getBadgeClasificacion(item.clasif)}`}>
                            {item.clasif}
                          </span>
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-white">{item.cantidad}</td>
                        <td className="p-2.5 text-center font-mono text-slate-300">
                          {((item.cantidad / estadisticas.total) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Estado de Controles y Medidas de Intervención */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Wrench className="h-4 w-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                  Controles Existentes y Medidas Formuladas
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase block">Control en Fuente</span>
                  <span className="text-lg font-black text-white font-mono mt-1 block">
                    {estadisticas.conControlFuente} / {estadisticas.total}
                  </span>
                  <span className="text-[10px] text-slate-400">Implementados en maquinaria</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block">Control en Medio</span>
                  <span className="text-lg font-black text-white font-mono mt-1 block">
                    {estadisticas.conControlMedio} / {estadisticas.total}
                  </span>
                  <span className="text-[10px] text-slate-400">Barreras y ventilación</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">Control en Individuo</span>
                  <span className="text-lg font-black text-white font-mono mt-1 block">
                    {estadisticas.conControlIndividuo} / {estadisticas.total}
                  </span>
                  <span className="text-[10px] text-slate-400">Capacitación y EPP actual</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-teal-400 font-bold uppercase block">Medidas de Ingeniería</span>
                  <span className="text-lg font-black text-white font-mono mt-1 block">
                    {estadisticas.conIngenieria} / {estadisticas.total}
                  </span>
                  <span className="text-[10px] text-slate-400">Intervenciones pendientes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT RECORD */}
      <RiskFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingRisk(null);
        }}
        onSave={handleSaveRisk}
        initialData={editingRisk}
        existingAreas={areasDisponibles}
      />

      {/* MODAL: DELETE CONFIRMATION */}
      <RiskDeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingRisk(null);
        }}
        onConfirm={handleConfirmDelete}
        riskItem={deletingRisk}
      />

      {/* MODAL: CONTEXTUAL SMART ASSISTANT */}
      <RiskAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        dataset={dataset}
        onSelectRisk={(id) => {
          setSelectedRiskId(id);
          setViewMode('ficha');
        }}
      />
    </div>
  );
}
