import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  NormaPhvaItem,
  EstadoCumplimiento,
  IndicadoresAutomaticos,
} from './types/phvaEvidence';
import {
  ConfiguracionPresentacion,
  CONFIG_PRESENTACION_DEFAULT,
} from './types/presentationConfig';
import {
  getPhvaNorms,
  savePhvaNorms,
  updatePhvaNormStatus,
  updatePhvaNormFull,
  deletePhvaNorm,
  resetPhvaNormsToDefault,
  calcularIndicadoresPhva,
} from './services/phvaService';
import {
  getPresentationConfig,
  savePresentationConfig,
  resetPresentationConfig,
} from './services/presentationService';
import { PhvaSlideViewer } from './components/PhvaSlideViewer';
import { NormaCirculosModal } from './components/NormaCirculosModal';
import { PresentacionEditorModal } from './components/PresentacionEditorModal';
import { MatrizExcelView } from './components/MatrizExcelView';
import { ConfiguracionDinamicaEmpresaView } from './components/ConfiguracionDinamicaEmpresaView';
import { MatrizRiesgosView } from './components/MatrizRiesgosView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GoogleWorkspaceAuthButton } from './components/GoogleWorkspaceAuthButton';
import {
  ShieldCheck,
  Leaf,
  Building2,
  TableProperties,
  Award,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  Plus,
  Trash2,
  Edit3,
  Save,
  Search,
  Sparkles,
  FileSpreadsheet,
  SlidersHorizontal,
  ShieldAlert,
  Flame,
  Users,
  KeyRound,
  Lock,
} from 'lucide-react';
import {
  TrabajadorFrikaz,
  PoliticaMisionFrikaz,
  PasaporteDigital,
} from './types/misionFrikaz';
import {
  getStoredSesionActiva,
  setStoredSesionActiva,
  getStoredPoliticasMision,
  getPasaporteDigital,
  tienePoliticasPendientes,
  getStoredTrabajadores,
} from './services/misionFrikazService';
import { MisionFrikazEscapeRoom } from './components/misionFrikaz/MisionFrikazEscapeRoom';
import { PasaporteDigitalModal } from './components/misionFrikaz/PasaporteDigitalModal';
import { MisionFrikazGatekeeper } from './components/misionFrikaz/MisionFrikazGatekeeper';
import { MisionFrikazAdminPanel } from './components/misionFrikaz/MisionFrikazAdminPanel';
import { WorkerSelectorModal } from './components/misionFrikaz/WorkerSelectorModal';

type TabView = 'phva_slides' | 'matriz_tabla' | 'matriz_excel' | 'ficha_empresa' | 'matriz_riesgos';

export default function App() {
  const [items, setItems] = useState<NormaPhvaItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabView>('matriz_riesgos');
  const [presentationConfig, setPresentationConfig] = useState<ConfiguracionPresentacion>(() =>
    getPresentationConfig()
  );
  const [isGlobalPresEditorOpen, setIsGlobalPresEditorOpen] = useState(false);
  const [presEditorInitialTab, setPresEditorInitialTab] = useState<'banner' | 'fases' | 'modulos' | 'guia'>('banner');
  const [selectedNorma, setSelectedNorma] = useState<NormaPhvaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialEdit, setModalInitialEdit] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTermMatriz, setSearchTermMatriz] = useState('');
  const [areaFilterMatriz, setAreaFilterMatriz] = useState<'TODAS' | 'SST' | 'AMBIENTAL'>('TODAS');

  // Misión Frikaz — Estados de Sesión, Pasaporte y Gamificación SG-SST
  const [currentWorker, setCurrentWorker] = useState<TrabajadorFrikaz>(() => getStoredSesionActiva());
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [activeMissionPolicyId, setActiveMissionPolicyId] = useState<string | null>(null);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isWorkerSelectorOpen, setIsWorkerSelectorOpen] = useState(false);
  const [politicasMision, setPoliticasMision] = useState<PoliticaMisionFrikaz[]>(() =>
    getStoredPoliticasMision()
  );

  // Recalcular pasaporte dinámicamente
  const pasaporte = useMemo(() => {
    return getPasaporteDigital(currentWorker.id);
  }, [currentWorker.id, activeMissionPolicyId, isPassportModalOpen, isAdminPanelOpen]);

  // Verificar si el colaborador tiene políticas obligatorias pendientes (Gatekeeper)
  const isGatekeeperActive = useMemo(() => {
    if (isAdminMode) return false;
    return tienePoliticasPendientes(currentWorker.id);
  }, [isAdminMode, currentWorker.id, pasaporte]);

  // Cambiar colaborador activo
  const handleSelectWorker = useCallback((worker: TrabajadorFrikaz) => {
    setCurrentWorker(worker);
    setStoredSesionActiva(worker);
    setIsAdminMode(false);
    setActiveMissionPolicyId(null);
  }, []);

  // Iniciar Misión Frikaz para una política específica
  const handleStartMission = useCallback((politicaId: string) => {
    setActiveMissionPolicyId(politicaId);
  }, []);

  // Load from local storage on mount
  useEffect(() => {
    const loaded = getPhvaNorms();
    setItems(loaded);
  }, []);

  // Compute automated KPIs in real time
  const indicadores: IndicadoresAutomaticos = useMemo(() => {
    return calcularIndicadoresPhva(items);
  }, [items]);

  // Save full norm edit
  const handleSaveNorma = useCallback(
    (updatedItem: NormaPhvaItem) => {
      const updated = updatePhvaNormFull(updatedItem);
      setItems(updated);
      if (selectedNorma && selectedNorma.id === updatedItem.id) {
        setSelectedNorma(updatedItem);
      }
    },
    [selectedNorma]
  );

  // Delete norm
  const handleDeleteNorma = useCallback(
    (id: string) => {
      const updated = deletePhvaNorm(id);
      setItems(updated);
      if (selectedNorma && selectedNorma.id === id) {
        setSelectedNorma(null);
        setIsModalOpen(false);
      }
    },
    [selectedNorma]
  );

  // Add brand new norm
  const handleAddNewNorma = useCallback(
    (fase?: any) => {
      const newNorm: NormaPhvaItem = {
        id: `norma-${Date.now()}`,
        fase: fase || 'PLANEAR',
        subtema: 'DIAGNÓSTICO',
        tituloSituacion: 'Nueva Obligación Legal / Situación Regulada',
        normaOficial: 'Resolución / Decreto Nuevo',
        entidadEmisora: 'Ministerio del Trabajo / SDA Bogotá',
        articulos: 'Artículos aplicables',
        area: 'SST',
        descripcion: 'Describa qué regula esta disposición legal colombiana...',
        importancia:
          'Explique por qué es crucial para Frikaz S.A.S. (10 trabajadores, freidoras industriales)...',
        aplicabilidad: 'Indique qué debe hacer la pyme concretamente...',
        vigente: true,
        textoVigencia: 'Vigente en la normativa colombiana (SUIN-Juriscol).',
        jurisdiccionAlcance: 'Nacional y Distrital (Bogotá D.C.).',
        evidenciaCumplimiento: 'Acta, registro o procedimiento documentado.',
        estado: 'NO_CUMPLE',
        responsable: 'Responsable SG-SST',
        fechaVerificacion: new Date().toISOString().split('T')[0],
        observaciones: 'Obligación ingresada para seguimiento normativo.',
      };
      const updated = [newNorm, ...items];
      savePhvaNorms(updated);
      setItems(updated);
      setSelectedNorma(newNorm);
      setModalInitialEdit(true);
      setIsModalOpen(true);
    },
    [items]
  );

  // Change individual norm status
  const handleUpdateStatus = useCallback(
    (id: string, nuevoEstado: EstadoCumplimiento) => {
      const updated = updatePhvaNormStatus(id, nuevoEstado);
      setItems(updated);
      if (selectedNorma && selectedNorma.id === id) {
        setSelectedNorma((prev) => (prev ? { ...prev, estado: nuevoEstado } : null));
      }
    },
    [selectedNorma]
  );

  // Reset to default seed
  const handleReset = useCallback(() => {
    if (
      window.confirm(
        '¿Desea restaurar las 21 normas obligatorias iniciales de Frikaz S.A.S.? Esta acción devolverá los textos y evidencias a los valores predeterminados.'
      )
    ) {
      const defaultItems = resetPhvaNormsToDefault();
      setItems(defaultItems);
      setSelectedNorma(null);
      setIsModalOpen(false);
    }
  }, []);

  // Open modal in read-only or edit mode
  const handleOpenNorma = useCallback((norma: NormaPhvaItem, editMode: boolean = false) => {
    setSelectedNorma(norma);
    setModalInitialEdit(editMode);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNorma(null);
    setModalInitialEdit(false);
  }, []);

  // Update presentation config
  const handleUpdatePresentationConfig = useCallback(
    (newConfig: ConfiguracionPresentacion) => {
      savePresentationConfig(newConfig);
      setPresentationConfig(newConfig);
    },
    []
  );

  const handleResetPresentationConfig = useCallback(() => {
    const def = resetPresentationConfig();
    setPresentationConfig(def);
  }, []);

  // 1. Si hay una misión de Escape Room activa, renderizar la experiencia interactiva de 4 etapas
  if (activeMissionPolicyId) {
    const selectedMissionPolitica =
      politicasMision.find((p) => p.id === activeMissionPolicyId) || politicasMision[0];

    return (
      <>
        <MisionFrikazEscapeRoom
          politica={selectedMissionPolitica}
          trabajador={currentWorker}
          todasLasPoliticas={politicasMision}
          onCompletarMision={() => {
            // El pasaporte se actualiza automáticamente con el estado reactivo
          }}
          onVolverOSeleccionarOtra={(nextPolId) => {
            if (nextPolId) {
              setActiveMissionPolicyId(nextPolId);
            } else {
              setActiveMissionPolicyId(null);
            }
          }}
          onCerrar={() => setActiveMissionPolicyId(null)}
        />

        <PasaporteDigitalModal
          isOpen={isPassportModalOpen}
          onClose={() => setIsPassportModalOpen(false)}
          pasaporte={pasaporte}
          politicas={politicasMision}
          onSeleccionarMision={(polId) => {
            setIsPassportModalOpen(false);
            setActiveMissionPolicyId(polId);
          }}
        />

        <WorkerSelectorModal
          isOpen={isWorkerSelectorOpen}
          onClose={() => setIsWorkerSelectorOpen(false)}
          trabajadorActual={currentWorker}
          onSeleccionarTrabajador={handleSelectWorker}
        />
      </>
    );
  }

  // 2. Si el gatekeeper está activo (trabajador con políticas obligatorias pendientes sin modo admin)
  if (isGatekeeperActive) {
    return (
      <>
        <MisionFrikazGatekeeper
          trabajador={currentWorker}
          pasaporte={pasaporte}
          politicas={politicasMision}
          onIniciarMision={(polId) => setActiveMissionPolicyId(polId)}
          onAbrirPasaporte={() => setIsPassportModalOpen(true)}
          onCambiarTrabajador={() => setIsWorkerSelectorOpen(true)}
          onEntrarComoAdmin={() => setIsAdminMode(true)}
        />

        <PasaporteDigitalModal
          isOpen={isPassportModalOpen}
          onClose={() => setIsPassportModalOpen(false)}
          pasaporte={pasaporte}
          politicas={politicasMision}
          onSeleccionarMision={(polId) => {
            setIsPassportModalOpen(false);
            setActiveMissionPolicyId(polId);
          }}
        />

        <WorkerSelectorModal
          isOpen={isWorkerSelectorOpen}
          onClose={() => setIsWorkerSelectorOpen(false)}
          trabajadorActual={currentWorker}
          onSeleccionarTrabajador={handleSelectWorker}
        />

        <MisionFrikazAdminPanel
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
          onVerPasaporteTrabajador={(tId) => {
            const w = getStoredTrabajadores().find((t: TrabajadorFrikaz) => t.id === tId);
            if (w) {
              setCurrentWorker(w);
              setIsPassportModalOpen(true);
            }
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col">
      {/* BARRA SUPERIOR DE SESIÓN Y MISIÓN FRIKAZ */}
      <div className="bg-slate-950 text-slate-300 border-b border-slate-800 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWorkerSelectorOpen(true)}
              className="flex items-center gap-2 hover:text-white transition-colors group"
              title="Cambiar de colaborador o modo de sesión"
            >
              <img
                src={currentWorker.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt={currentWorker.nombre}
                className="w-5 h-5 rounded-full object-cover border border-amber-500/50"
              />
              <span className="font-semibold text-white group-hover:text-amber-400">
                {currentWorker.nombre}
              </span>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {currentWorker.cargoNombre}
              </span>
              <span className="text-slate-500 text-[10px] underline">Cambiar</span>
            </button>

            {isAdminMode && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                MODO SUPERVISOR ACTIVO
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Botón de Lanzamiento de Misión Frikaz */}
            <button
              onClick={() => {
                const primeraObligatoria = politicasMision.find(p => p.esObligatoria) || politicasMision[0];
                setActiveMissionPolicyId(primeraObligatoria.id);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>Misión Frikaz</span>
            </button>

            {/* Botón de Pasaporte Digital */}
            <button
              onClick={() => setIsPassportModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Pasaporte ({pasaporte.porcentajeAvance}%)</span>
            </button>

            {/* Botón de Panel Admin SST */}
            <button
              onClick={() => setIsAdminPanelOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-200 border border-purple-500/40 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Panel Admin SST</span>
            </button>
          </div>
        </div>
      </div>

      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-30 bg-[#0f172a] text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo y Nombre de la Empresa */}
            <div className="flex items-center gap-3">
              <img
                src="/frikaz_logo.jpg"
                alt="Frikaz S.A.S. Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover border border-orange-500/30 bg-white p-0.5 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                    Frikaz S.A.S.
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f97316] text-white">
                    Pyme Fritos
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Gestión Normativa SST y Ambiental • Bosa, Bogotá D.C.
                </p>
              </div>
            </div>

            {/* Navegación por pestañas (Desktop) */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
              <button
                onClick={() => setActiveTab('phva_slides')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'phva_slides'
                    ? 'bg-[#f97316] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Ciclo PHVA</span>
              </button>

              <button
                onClick={() => setActiveTab('matriz_tabla')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'matriz_tabla'
                    ? 'bg-[#f97316] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <TableProperties className="h-3.5 w-3.5" />
                <span>Matriz Completa</span>
              </button>

              <button
                onClick={() => setActiveTab('matriz_excel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'matriz_excel'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-300" />
                <span>Matriz Excel</span>
              </button>

              <button
                onClick={() => setActiveTab('ficha_empresa')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'ficha_empresa'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-purple-300" />
                <span>Configuración Dinámica</span>
              </button>

              <button
                onClick={() => setActiveTab('matriz_riesgos')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'matriz_riesgos'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5 text-rose-300" />
                <span>Matriz de Riesgos</span>
              </button>
            </nav>

            {/* Acciones y KPIs Rápidos */}
            <div className="flex items-center gap-2.5">
              <GoogleWorkspaceAuthButton compact={true} />

              <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
                <span className="text-slate-400">Cumplimiento:</span>
                <span
                  className={`font-black ${
                    indicadores.generalPorcentaje >= 70
                      ? 'text-emerald-400'
                      : indicadores.generalPorcentaje >= 40
                      ? 'text-orange-400'
                      : 'text-red-400'
                  }`}
                >
                  {indicadores.generalPorcentaje}%
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-medium">
                  {indicadores.totalNormas} normas
                </span>
              </div>

              {/* Botón de Menú Móvil */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú Móvil Desplegable */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0f172a] border-t border-slate-800 px-4 pt-2 pb-4 space-y-1">
            <button
              onClick={() => {
                setActiveTab('phva_slides');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${
                activeTab === 'phva_slides' ? 'bg-[#f97316] text-white' : 'text-slate-300'
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Ciclo PHVA</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('matriz_tabla');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${
                activeTab === 'matriz_tabla' ? 'bg-[#f97316] text-white' : 'text-slate-300'
              }`}
            >
              <TableProperties className="h-4 w-4" />
              <span>Matriz Completa</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('matriz_excel');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${
                activeTab === 'matriz_excel' ? 'bg-emerald-600 text-white' : 'text-slate-300'
              }`}
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-300" />
              <span>Matriz Excel</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('ficha_empresa');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${
                activeTab === 'ficha_empresa' ? 'bg-purple-600 text-white' : 'text-slate-300'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4 text-purple-300" />
              <span>Configuración Dinámica</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('matriz_riesgos');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${
                activeTab === 'matriz_riesgos' ? 'bg-rose-600 text-white' : 'text-slate-300'
              }`}
            >
              <ShieldAlert className="h-4 w-4 text-rose-300" />
              <span>Matriz de Riesgos</span>
            </button>
          </div>
        )}
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* VIEW 1: PHVA SLIDE VIEWER */}
        {activeTab === 'phva_slides' && (
          <PhvaSlideViewer
            items={items}
            indicadores={indicadores}
            presentationConfig={presentationConfig}
            onUpdatePresentationConfig={handleUpdatePresentationConfig}
            onResetPresentationConfig={handleResetPresentationConfig}
            onSelectNorma={(norma) => handleOpenNorma(norma, false)}
            onEditNorma={(norma) => handleOpenNorma(norma, true)}
            onUpdateStatus={handleUpdateStatus}
            onReset={handleReset}
            onAddNewNorma={handleAddNewNorma}
            onOpenMatrizExcel={() => setActiveTab('matriz_excel')}
          />
        )}

        {/* VIEW 2: MATRIZ TABULAR NORMATIVA COMPLETA */}
        {activeTab === 'matriz_tabla' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#0f172a]">
                    {presentationConfig.matrizTabla?.titulo ||
                      'Matriz Normativa Completa de Requisitos Legales'}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {presentationConfig.matrizTabla?.descripcion ||
                    `Total de ${items.length} disposiciones legales colombianas vigentes aplicables a Frikaz S.A.S.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleAddNewNorma('PLANEAR')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#f97316] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#ea580c] transition-colors shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ Agregar Norma</span>
                </button>
              </div>
            </div>

            {/* Filtros de la Tabla */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTermMatriz}
                  onChange={(e) => setSearchTermMatriz(e.target.value)}
                  placeholder="Buscar norma, artículo o situación..."
                  className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-1.5 text-xs focus:border-[#0f172a] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="font-bold text-slate-600">Área:</span>
                <select
                  value={areaFilterMatriz}
                  onChange={(e) => setAreaFilterMatriz(e.target.value as any)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs bg-white"
                >
                  <option value="TODAS">Todas</option>
                  <option value="SST">Solo SST</option>
                  <option value="AMBIENTAL">Solo Ambiental</option>
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="border-b-2 border-[#0f172a] bg-[#0f172a] text-white text-[11px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Fase PHVA</th>
                      <th className="px-4 py-3">Situación Regulada</th>
                      <th className="px-4 py-3">Disposición Oficial</th>
                      <th className="px-4 py-3">Artículos</th>
                      <th className="px-4 py-3">Área</th>
                      <th className="px-4 py-3">Vigencia</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3 text-right">Acciones de Edición</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items
                      .filter((it) => {
                        const matchSearch =
                          it.tituloSituacion.toLowerCase().includes(searchTermMatriz.toLowerCase()) ||
                          it.normaOficial.toLowerCase().includes(searchTermMatriz.toLowerCase()) ||
                          it.articulos.toLowerCase().includes(searchTermMatriz.toLowerCase());
                        const matchArea =
                          areaFilterMatriz === 'TODAS' ||
                          it.area === areaFilterMatriz ||
                          it.area === 'INTEGRAL';
                        return matchSearch && matchArea;
                      })
                      .map((it) => (
                        <tr key={it.id} className="hover:bg-[#fff7ed] transition-colors group">
                          <td className="px-4 py-3 font-bold text-[#0f172a]">{it.fase}</td>
                          <td
                            onClick={() => handleOpenNorma(it)}
                            className="px-4 py-3 max-w-xs font-semibold text-slate-900 group-hover:text-[#0f172a] cursor-pointer hover:underline"
                          >
                            {it.tituloSituacion}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-800 font-medium">
                            {it.normaOficial}
                          </td>
                          <td className="px-4 py-3 text-slate-500 font-mono">{it.articulos}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-sm font-bold text-[10px] ${
                                it.area === 'SST'
                                  ? 'bg-blue-100 text-[#1e3a8a]'
                                  : it.area === 'AMBIENTAL'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {it.area}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#991b1b]">
                              <CheckCircle2 className="h-3 w-3" />
                              Vigente
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {it.estado === 'CUMPLE' ? (
                              <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-emerald-100 text-emerald-800">
                                Cumple
                              </span>
                            ) : it.estado === 'PARCIAL' ? (
                              <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-orange-100 text-orange-800">
                                Parcial
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-sm font-bold text-[10px] bg-red-100 text-red-800">
                                No Cumple
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenNorma(it, true)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f97316] text-white hover:bg-[#ea580c] font-bold text-xs shadow-xs transition-colors"
                                title="Editar norma"
                              >
                                <Edit3 className="h-3 w-3" />
                                <span>Editar</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `¿Eliminar la norma "${it.tituloSituacion}" de la matriz?`
                                    )
                                  ) {
                                    handleDeleteNorma(it.id);
                                  }
                                }}
                                className="p-1 rounded-md text-slate-400 hover:text-[#991b1b] hover:bg-red-50"
                                title="Eliminar norma"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: CONFIGURACIÓN DINÁMICA DE LA EMPRESA */}
        {activeTab === 'ficha_empresa' && (
          <ErrorBoundary fallbackTitle="Configuración Dinámica — Frikaz S.A.S.">
            <ConfiguracionDinamicaEmpresaView
              normas={items}
              indicadores={indicadores}
              onActualizarNormas={(nuevasNormas) => {
                setItems(nuevasNormas);
                savePhvaNorms(nuevasNormas);
              }}
              onOpenNormaModal={(norma) => handleOpenNorma(norma, false)}
              onOpenMatrizExcel={() => setActiveTab('matriz_excel')}
            />
          </ErrorBoundary>
        )}

        {/* VIEW 4: MATRIZ EXCEL AUTOMATIZADA */}
        {activeTab === 'matriz_excel' && (
          <MatrizExcelView
            items={items}
            onSelectNorma={(norma) => handleOpenNorma(norma, false)}
          />
        )}

        {/* VIEW 5: MATRIZ DE RIESGOS SST (GTC 45 - IDENTIFICACIÓN, EVALUACIÓN Y MEDIDAS) */}
        {activeTab === 'matriz_riesgos' && <MatrizRiesgosView />}
      </main>

      {/* MODAL WITH THE 6 MANDATORY CIRCLES */}
      <NormaCirculosModal
        item={selectedNorma}
        isOpen={isModalOpen}
        initialEditMode={modalInitialEdit}
        onClose={handleCloseModal}
        onUpdateStatus={handleUpdateStatus}
        onSaveNorma={handleSaveNorma}
        onDeleteNorma={handleDeleteNorma}
      />

      {/* MODAL DE EDICIÓN DE TODA LA PRESENTACIÓN Y ENCABEZADOS */}
      <PresentacionEditorModal
        isOpen={isGlobalPresEditorOpen}
        config={presentationConfig}
        initialTab={presEditorInitialTab}
        onClose={() => setIsGlobalPresEditorOpen(false)}
        onSave={handleUpdatePresentationConfig}
        onReset={handleResetPresentationConfig}
      />

      {/* MODALES DE «MISIÓN FRIKAZ» (PASAPORTE, SELECTOR Y PANEL ADMIN) */}
      <PasaporteDigitalModal
        isOpen={isPassportModalOpen}
        onClose={() => setIsPassportModalOpen(false)}
        pasaporte={pasaporte}
        politicas={politicasMision}
        onSeleccionarMision={(polId) => {
          setIsPassportModalOpen(false);
          setActiveMissionPolicyId(polId);
        }}
      />

      <WorkerSelectorModal
        isOpen={isWorkerSelectorOpen}
        onClose={() => setIsWorkerSelectorOpen(false)}
        trabajadorActual={currentWorker}
        onSeleccionarTrabajador={handleSelectWorker}
      />

      <MisionFrikazAdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onVerPasaporteTrabajador={(tId) => {
          const w = getStoredTrabajadores().find((t: TrabajadorFrikaz) => t.id === tId);
          if (w) {
            setCurrentWorker(w);
            setIsPassportModalOpen(true);
          }
        }}
      />
    </div>
  );
}
