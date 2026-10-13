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
} from 'lucide-react';

type TabView = 'phva_slides' | 'matriz_tabla' | 'matriz_excel' | 'ficha_empresa';

export default function App() {
  const [items, setItems] = useState<NormaPhvaItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabView>('phva_slides');
  const [presentationConfig, setPresentationConfig] = useState<ConfiguracionPresentacion>(() => getPresentationConfig());
  const [isGlobalPresEditorOpen, setIsGlobalPresEditorOpen] = useState(false);
  const [presEditorInitialTab, setPresEditorInitialTab] = useState<'banner' | 'fases' | 'modulos' | 'guia'>('banner');
  const [selectedNorma, setSelectedNorma] = useState<NormaPhvaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialEdit, setModalInitialEdit] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTermMatriz, setSearchTermMatriz] = useState('');
  const [areaFilterMatriz, setAreaFilterMatriz] = useState<'TODAS' | 'SST' | 'AMBIENTAL'>('TODAS');

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
  const handleAddNewNorma = useCallback((fase?: any) => {
    const newNorm: NormaPhvaItem = {
      id: `norma-${Date.now()}`,
      fase: fase || 'PLANEAR',
      subtema: 'NUEVA OBLIGACIÓN',
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
      jurisdiccionAlcance: 'Nacional / Distrital Bogotá D.C.',
      evidenciaCumplimiento: 'Documento, formato o certificado probatorio exigido...',
      estado: 'PARCIAL',
      responsable: 'Responsable SG-SST / Gerente',
      fechaVerificacion: new Date().toISOString().split('T')[0],
      observaciones: 'Nueva norma ingresada para edición.',
    };
    const updated = updatePhvaNormFull(newNorm);
    setItems(updated);
    setSelectedNorma(newNorm);
    setModalInitialEdit(true);
    setIsModalOpen(true);
  }, []);

  // Handle status update (Automatización)
  const handleUpdateStatus = useCallback((id: string, newStatus: EstadoCumplimiento) => {
    const updated = updatePhvaNormStatus(id, newStatus);
    setItems(updated);
    if (selectedNorma && selectedNorma.id === id) {
      setSelectedNorma({
        ...selectedNorma,
        estado: newStatus,
        fechaVerificacion: new Date().toISOString().split('T')[0],
      });
    }
  }, [selectedNorma]);

  const handleUpdatePresentationConfig = useCallback((updated: ConfiguracionPresentacion) => {
    savePresentationConfig(updated);
    setPresentationConfig(updated);
  }, []);

  const handleResetPresentationConfig = useCallback(() => {
    const reset = resetPresentationConfig();
    setPresentationConfig(reset);
  }, []);

  const handleOpenNorma = (norma: NormaPhvaItem, editMode: boolean = false) => {
    setSelectedNorma(norma);
    setModalInitialEdit(editMode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNorma(null);
    setModalInitialEdit(false);
  };

  const handleReset = () => {
    if (window.confirm('¿Desea restablecer todos los datos del ciclo PHVA a los valores iniciales oficiales?')) {
      const reset = resetPhvaNormsToDefault();
      setItems(reset);
      alert('Datos restablecidos correctamente.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-[#0f172a] relative">
      {/* TOP HEADER: Paleta Azul Oscuro (#0f172a) con bordes Naranja Claro (#f97316) */}
      <header className="sticky top-0 z-40 bg-[#0f172a] text-white border-b-2 border-[#f97316] shadow-md print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Corporate Title (EDITABLE) */}
          <div className="flex items-center gap-3">
            <img
              src="/frikaz_logo.jpg"
              alt="Logo Frikaz S.A.S."
              className="h-12 w-auto max-w-[120px] object-contain rounded-lg border border-orange-200/50 bg-white p-0.5 shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  {presentationConfig.appHeader?.empresa || 'FRIKAZ S.A.S.'}
                </span>
                <span className="rounded-md bg-[#fed7aa] px-2 py-0.5 text-[10px] font-black uppercase text-[#0f172a]">
                  {presentationConfig.appHeader?.badge || 'Bosa · 10 Trab.'}
                </span>
              </div>
              <p className="text-xs text-orange-200 font-medium leading-none mt-0.5">
                {presentationConfig.appHeader?.subtitulo ||
                  'Herramienta Automatizada SST y Ambiental (PHVA)'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('phva_slides')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'phva_slides'
                  ? 'bg-[#f97316] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Ciclo PHVA</span>
            </button>

            <button
              onClick={() => setActiveTab('matriz_tabla')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'matriz_tabla'
                  ? 'bg-[#f97316] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TableProperties className="h-4 w-4" />
              <span>Matriz Normativa Completa</span>
            </button>

            {/* BOTÓN MATRIZ EXCEL AUTOMATIZADA */}
            <button
              onClick={() => setActiveTab('matriz_excel')}
              className={`px-3 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                activeTab === 'matriz_excel'
                  ? 'bg-emerald-600 text-white border border-emerald-400 shadow-md'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-950/80 border border-emerald-500/40'
              }`}
              title="Abrir módulo oficial: Matriz Excel Automatizada (.xlsx con fórmulas y 6 hojas)"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>Matriz Excel Automatizada</span>
            </button>

            <button
              onClick={() => setActiveTab('ficha_empresa')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'ficha_empresa'
                  ? 'bg-[#f97316] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Configuración Dinámica de la Empresa</span>
            </button>
          </nav>

          {/* Cumplimiento General Counter */}
          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-800">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Cumplimiento General
              </span>
              <span className="text-base font-black font-mono text-[#fed7aa] tabular-nums leading-none">
                {indicadores.generalPorcentaje}%
              </span>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#0f172a] px-4 py-3 space-y-1">
            <button
              onClick={() => {
                setActiveTab('phva_slides');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-white hover:bg-slate-800"
            >
              Ciclo PHVA
            </button>
            <button
              onClick={() => {
                setActiveTab('matriz_tabla');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-white hover:bg-slate-800"
            >
              Matriz Normativa Completa
            </button>
            <button
              onClick={() => {
                setActiveTab('matriz_excel');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-emerald-300 hover:bg-slate-800 flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Matriz Excel Automatizada (.xlsx)</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('ficha_empresa');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-white hover:bg-slate-800 flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Configuración Dinámica de la Empresa</span>
            </button>
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* VIEW 1: PHVA SLIDE VIEWER (CON EDICIÓN COMPLETA) */}
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

        {/* VIEW 2: FULL TABULAR NORMATIVE MATRIX CON EDICIÓN COMPLETA */}
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
                        <tr
                          key={it.id}
                          className="hover:bg-[#fff7ed] transition-colors group"
                        >
                          <td className="px-4 py-3 font-bold text-[#0f172a]">
                            {it.fase}
                          </td>
                          <td
                            onClick={() => handleOpenNorma(it)}
                            className="px-4 py-3 max-w-xs font-semibold text-slate-900 group-hover:text-[#0f172a] cursor-pointer hover:underline"
                          >
                            {it.tituloSituacion}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-800 font-medium">
                            {it.normaOficial}
                          </td>
                          <td className="px-4 py-3 text-slate-500 font-mono">
                            {it.articulos}
                          </td>
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
                                title="Editar todos los campos de esta norma (Descripción, Importancia, Aplicabilidad, etc.)"
                              >
                                <Edit3 className="h-3 w-3" />
                                <span>Editar</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`¿Eliminar la norma "${it.tituloSituacion}" de la matriz?`)) {
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

        {/* VIEW 3: CONFIGURACIÓN DINÁMICA DE LA EMPRESA (MOTOR DE REGLAS INTERACTIVO) */}
        {activeTab === 'ficha_empresa' && (
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
        )}

        {/* VIEW 4: MATRIZ EXCEL AUTOMATIZADA (.XLSX CON FÓRMULAS, 6 HOJAS Y DESCARGA REAL) */}
        {activeTab === 'matriz_excel' && (
          <MatrizExcelView
            items={items}
            onSelectNorma={(norma) => handleOpenNorma(norma, false)}
          />
        )}
      </main>

      {/* MODAL WITH THE 6 MANDATORY CIRCLES FROM SLIDE 5 (CON EDICIÓN COMPLETA) */}
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
    </div>
  );
}
