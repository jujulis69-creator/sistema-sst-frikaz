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
  const [isEditingEmpresa, setIsEditingEmpresa] = useState(false);
  const [empresa, setEmpresa] = useState(() => {
    const saved = localStorage.getItem('frikaz_empresa_perfil_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      razonSocial: 'Frikaz S.A.S.',
      nit: '901.654.892-3',
      direccion: 'Calle 69A Sur # 80J - 14, Piamonte, Bosa',
      trabajadores: 10,
      claseRiesgo: 'Clase II / III',
      autoridadAmbiental: 'Secretaría Distrital de Ambiente (SDA)',
      maquinaria:
        'Freidoras industriales por inmersión continua con termostato digital (>160°C).\nRebanadora/cortadora rotativa de papas y plátanos con cuchillas mecánicas.\nPeladora abrasiva mecánica con suministro continuo de agua.\nMarmita en acero inoxidable para escaldado de chicharrón.\nSelladora continua de banda térmica con fechador para bolsas BOPP.\nCampana extractora de humos y ducto vertical sobre cubierta.\nTrampa física de retención de grasas en red de desagüe.',
      residuos:
        'Aceite de Cocina Usado (ACU): 180 a 250 L/mes (Res. 316/2018).\nOrgánicos verdes: Cáscaras de papa y plátano (aprovechables).\nReciclables blancos: Cartón corrugado y recortes de bolsas BOPP.\nVertimientos no domésticos: Aguas con grasa retenidas en trampa.',
    };
  });

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

  const handleSaveEmpresa = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('frikaz_empresa_perfil_v2', JSON.stringify(empresa));
    setIsEditingEmpresa(false);
    alert('¡Datos de Frikaz S.A.S. guardados exitosamente!');
  };

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
              <Building2 className="h-4 w-4" />
              <span>Ficha Frikaz S.A.S.</span>
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
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-white hover:bg-slate-800"
            >
              Ficha Frikaz S.A.S.
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

        {/* VIEW 3: FICHA EMPRESARIAL FRIKAZ S.A.S. (EDITABLE) */}
        {activeTab === 'ficha_empresa' && (
          <div className="space-y-6 max-w-4xl">
            <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <img
                  src="/frikaz_logo.jpg"
                  alt="Logo Frikaz"
                  className="h-20 w-auto max-w-[140px] object-contain rounded-xl border border-orange-200/50 bg-white p-1 shadow-md shrink-0"
                />
                <div>
                  <span className="rounded-md bg-[#fed7aa] px-2.5 py-0.5 text-xs font-black uppercase text-[#0f172a]">
                    Perfil Oficial Editable
                  </span>
                  <h2 className="text-2xl font-black mt-1 text-white">
                    {empresa.razonSocial} — Snacks Fritos
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    {empresa.direccion} · {empresa.trabajadores} Trabajadores directos
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingEmpresa(!isEditingEmpresa)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#f97316] text-white text-xs font-bold hover:bg-[#ea580c] transition-colors shadow-xs shrink-0"
              >
                <Edit3 className="h-4 w-4" />
                <span>{isEditingEmpresa ? 'Ver Resumen' : 'Editar Información'}</span>
              </button>
            </div>

            {isEditingEmpresa ? (
              <form onSubmit={handleSaveEmpresa} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-sm text-[#0f172a]">
                    Editar Datos Generales de Frikaz S.A.S.
                  </h3>
                  <span className="text-slate-500">
                    Cambie los valores y presione Guardar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Razón Social:</label>
                    <input
                      type="text"
                      value={empresa.razonSocial}
                      onChange={(e) => setEmpresa({ ...empresa, razonSocial: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">NIT:</label>
                    <input
                      type="text"
                      value={empresa.nit}
                      onChange={(e) => setEmpresa({ ...empresa, nit: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Ubicación de Planta:</label>
                    <input
                      type="text"
                      value={empresa.direccion}
                      onChange={(e) => setEmpresa({ ...empresa, direccion: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Número de Trabajadores:</label>
                    <input
                      type="number"
                      value={empresa.trabajadores}
                      onChange={(e) => setEmpresa({ ...empresa, trabajadores: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Clase de Riesgo ARL:</label>
                    <input
                      type="text"
                      value={empresa.claseRiesgo}
                      onChange={(e) => setEmpresa({ ...empresa, claseRiesgo: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Autoridad Ambiental:</label>
                    <input
                      type="text"
                      value={empresa.autoridadAmbiental}
                      onChange={(e) => setEmpresa({ ...empresa, autoridadAmbiental: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Maquinaria Utilizada (una por línea):
                    </label>
                    <textarea
                      rows={5}
                      value={empresa.maquinaria}
                      onChange={(e) => setEmpresa({ ...empresa, maquinaria: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Residuos Principales Generados (una por línea):
                    </label>
                    <textarea
                      rows={5}
                      value={empresa.residuos}
                      onChange={(e) => setEmpresa({ ...empresa, residuos: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsEditingEmpresa(false)}
                    className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0f172a] text-white text-xs font-bold hover:bg-slate-800"
                  >
                    <Save className="h-4 w-4 text-[#fed7aa]" />
                    <span>Guardar Perfil Empresarial</span>
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs">
                  <h3 className="font-bold text-sm text-[#0f172a] border-b border-slate-100 pb-2">
                    1. Información General y Ubicación
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 font-medium block">Razón Social:</span>
                      <strong className="text-slate-900 text-sm">{empresa.razonSocial}</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 font-medium block">NIT:</span>
                      <strong className="text-slate-900 text-sm">{empresa.nit}</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 font-medium block">Ubicación de Planta:</span>
                      <strong className="text-slate-900">{empresa.direccion}</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 font-medium block">Número de Trabajadores:</span>
                      <strong className="text-slate-900 font-mono text-sm">{empresa.trabajadores} Trabajadores</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 font-medium block">Clase de Riesgo ARL:</span>
                      <strong className="text-[#991b1b] text-sm">{empresa.claseRiesgo}</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 font-medium block">Autoridad Ambiental:</span>
                      <strong className="text-emerald-800">{empresa.autoridadAmbiental}</strong>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs">
                  <h3 className="font-bold text-sm text-[#0f172a] border-b border-slate-100 pb-2">
                    2. Maquinaria y Procesos Productivos de la Planta
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-800">Maquinaria Utilizada:</h4>
                      <div className="space-y-1 text-slate-600 whitespace-pre-line">
                        {empresa.maquinaria}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-800">Residuos Principales Generados:</h4>
                      <div className="space-y-1 text-slate-600 whitespace-pre-line">
                        {empresa.residuos}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
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
