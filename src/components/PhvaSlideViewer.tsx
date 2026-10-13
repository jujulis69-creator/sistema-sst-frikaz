import React, { useState, useMemo } from 'react';
import {
  NormaPhvaItem,
  FasePhva,
  EstadoCumplimiento,
  IndicadoresAutomaticos,
} from '../types/phvaEvidence';
import {
  ConfiguracionPresentacion,
  CONFIG_PRESENTACION_DEFAULT,
} from '../types/presentationConfig';
import { PresentacionEditorModal } from './PresentacionEditorModal';
import {
  ShieldCheck,
  Leaf,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  RefreshCw,
  Eye,
  Activity,
  Award,
  Sparkles,
  Plus,
  Edit3,
  SlidersHorizontal,
  FileSpreadsheet,
} from 'lucide-react';

interface PhvaSlideViewerProps {
  items: NormaPhvaItem[];
  indicadores: IndicadoresAutomaticos;
  presentationConfig?: ConfiguracionPresentacion;
  onUpdatePresentationConfig?: (config: ConfiguracionPresentacion) => void;
  onResetPresentationConfig?: () => void;
  onSelectNorma: (item: NormaPhvaItem) => void;
  onEditNorma?: (item: NormaPhvaItem) => void;
  onUpdateStatus: (id: string, newStatus: EstadoCumplimiento) => void;
  onReset: () => void;
  onAddNewNorma?: (fase?: FasePhva) => void;
  onOpenMatrizExcel?: () => void;
}

export const PhvaSlideViewer: React.FC<PhvaSlideViewerProps> = ({
  items,
  indicadores,
  presentationConfig = CONFIG_PRESENTACION_DEFAULT,
  onUpdatePresentationConfig,
  onResetPresentationConfig,
  onSelectNorma,
  onEditNorma,
  onUpdateStatus,
  onReset,
  onAddNewNorma,
  onOpenMatrizExcel,
}) => {
  const [activeFase, setActiveFase] = useState<FasePhva>('PLANEAR');
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState<'TODAS' | 'SST' | 'AMBIENTAL'>('TODAS');
  const [isPresEditorOpen, setIsPresEditorOpen] = useState(false);
  const [presEditorTab, setPresEditorTab] = useState<'banner' | 'fases' | 'modulos' | 'guia'>('banner');

  // Groups items for current phase
  const faseItems = useMemo(() => {
    return items.filter((i) => {
      const matchFase = i.fase === activeFase;
      const matchSearch =
        i.tituloSituacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.normaOficial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.subtema.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchArea =
        areaFilter === 'TODAS' || i.area === areaFilter || i.area === 'INTEGRAL';

      return matchFase && matchSearch && matchArea;
    });
  }, [items, activeFase, searchTerm, areaFilter]);

  const getStatusButton = (item: NormaPhvaItem) => {
    switch (item.estado) {
      case 'CUMPLE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="h-3 w-3" />
            Cumple
          </span>
        );
      case 'PARCIAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#ffedd5] text-[#ea580c] border border-[#fed7aa]">
            <Clock className="h-3 w-3" />
            Parcial
          </span>
        );
      case 'NO_CUMPLE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-[#991b1b] border border-red-300">
            <AlertTriangle className="h-3 w-3" />
            No Cumple
          </span>
        );
    }
  };

  const currentFaseResumen = indicadores.porFase[activeFase];

  return (
    <div className="space-y-6">
      {/* HEADER BANNER: Paleta Corporativa con Imagen de Fondo Creativa Frikaz */}
      <div
        className="rounded-2xl border border-slate-700 bg-[#0f172a] p-6 text-white shadow-xl relative overflow-hidden bg-cover bg-center transition-all"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.88) 50%, rgba(15, 23, 42, 0.82) 100%), url('/frikaz_corporate_bg.jpg')`,
        }}
      >
        {/* Decorative corner stripe */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-linear-to-bl from-[#f97316]/35 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src="/frikaz_logo.jpg"
              alt="Logo Frikaz S.A.S."
              className="h-20 w-auto max-w-[140px] object-contain rounded-xl border-2 border-orange-200/50 bg-white p-1 shadow-md shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[#fed7aa] px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-[#0f172a]">
                  {presentationConfig.banner.etiqueta}
                </span>
                <span className="text-xs font-bold text-orange-200 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-[#fed7aa]" />
                  {presentationConfig.banner.subetiqueta}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-300 font-medium">
                  {presentationConfig.banner.empresaInfo}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPresEditorTab('banner');
                    setIsPresEditorOpen(true);
                  }}
                  className="p-1 rounded-md text-orange-200/70 hover:text-white hover:bg-white/10 transition-colors"
                  title="Editar etiquetas y contexto del banner"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight drop-shadow-xs">
                  {presentationConfig.banner.titulo}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setPresEditorTab('banner');
                    setIsPresEditorOpen(true);
                  }}
                  className="p-1.5 rounded-lg bg-white/10 text-orange-200 hover:text-white hover:bg-white/20 transition-colors shrink-0"
                  title="Editar título principal y descripción"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-start gap-2">
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  {presentationConfig.banner.descripcion}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPresEditorTab('banner');
                    setIsPresEditorOpen(true);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-orange-200 shrink-0"
                  title="Editar descripción del banner"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
              </div>

              {/* Watermark badge inside banner */}
              <div className="pt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] font-bold text-orange-100">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>MARCA DE AGUA CORPORATIVA: SG-SST OFICIAL</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Botón de Edición de Presentación */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 print:hidden">
            <button
              type="button"
              onClick={() => {
                setPresEditorTab('banner');
                setIsPresEditorOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-[#ea580c] to-[#f97316] px-3.5 py-2 text-xs font-black text-white hover:brightness-110 transition-all shadow-md border border-orange-300/30 cursor-pointer"
              title="Editar todos los encabezados, descripciones, fases y módulos de la presentación"
            >
              <Edit3 className="h-4 w-4" />
              <span>Editar Toda la Presentación</span>
            </button>

            {onOpenMatrizExcel && (
              <button
                type="button"
                onClick={onOpenMatrizExcel}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 px-3 py-2 text-xs font-black text-white transition-all shadow-md cursor-pointer"
                title="Abrir módulo oficial: Matriz Excel Automatizada (.xlsx con fórmulas)"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Matriz Excel (.xlsx)</span>
              </button>
            )}

            {onAddNewNorma && (
              <button
                type="button"
                onClick={() => onAddNewNorma(activeFase)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f172a]/90 border border-orange-300/40 px-3.5 py-2 text-xs font-bold text-[#fed7aa] hover:bg-slate-800 transition-colors shadow-sm"
                title="Agregar una nueva norma o situación para editar sus 6 círculos"
              >
                <Plus className="h-4 w-4" />
                <span>+ Agregar Norma</span>
              </button>
            )}
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/20 transition-colors border border-white/10"
              title="Restablecer datos a valores oficiales"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* AUTOMATED METRICS BAR */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          {/* 1. Cumplimiento General */}
          <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Cumplimiento General
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-white font-mono tabular-nums">
                {indicadores.generalPorcentaje}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-[#f97316] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${indicadores.generalPorcentaje}%` }}
              />
            </div>
          </div>

          {/* 2. Cumplimiento SST */}
          <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Cumplimiento SST
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-[#fed7aa] font-mono tabular-nums">
                {indicadores.sstPorcentaje}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${indicadores.sstPorcentaje}%` }}
              />
            </div>
          </div>

          {/* 3. Cumplimiento Ambiental */}
          <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Cumplimiento Ambiental
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-emerald-300 font-mono tabular-nums">
                {indicadores.ambientalPorcentaje}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${indicadores.ambientalPorcentaje}%` }}
              />
            </div>
          </div>

          {/* 4. Normas Vigentes */}
          <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Normas Vigentes
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-white font-mono tabular-nums">
                {indicadores.totalVigentes}
              </span>
              <span className="text-[11px] text-slate-400">/ {indicadores.totalNormas}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
              100% Verificadas
            </span>
          </div>

          {/* 5. Cumplimiento Fase Actual */}
          <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-300 block">
              Fase {activeFase}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-white font-mono tabular-nums">
                {currentFaseResumen.porcentaje}%
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              {currentFaseResumen.cumplidas} de {currentFaseResumen.total} cumplidas
            </span>
          </div>

          {/* 6. Alertas / Brechas */}
          <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">
              Acciones / Brechas
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-[#991b1b] font-mono tabular-nums">
                {indicadores.alertasPendientes}
              </span>
              <span className="text-[10px] text-red-300">pendientes</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Requieren atención
            </span>
          </div>
        </div>
      </div>

      {/* PHASE SELECTOR TABS MATCHING SLIDES 2, 3, 1, 4 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {(['PLANEAR', 'HACER', 'VERIFICAR', 'ACTUAR'] as FasePhva[]).map((fase) => {
          const isActive = activeFase === fase;
          const stats = indicadores.porFase[fase];

          return (
            <button
              key={fase}
              onClick={() => setActiveFase(fase)}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'border-[#0f172a] bg-[#0f172a] text-white shadow-lg'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#f97316]" />
              )}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-black uppercase tracking-wider ${
                    isActive ? 'text-[#fed7aa]' : 'text-[#f97316]'
                  }`}
                >
                  FASE {fase === 'PLANEAR' ? 'P' : fase === 'HACER' ? 'H' : fase === 'VERIFICAR' ? 'V' : 'A'}
                </span>
                <span
                  className={`text-xs font-mono font-bold ${
                    isActive ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  {stats.porcentaje}%
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight mt-1">
                {fase}
              </h3>
              <p
                className={`text-[11px] mt-1 ${
                  isActive ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {stats.cumplidas}/{stats.total} situaciones conformes
              </p>
            </button>
          );
        })}
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs print:hidden">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Buscar en ${activeFase} (norma, tema, artículo)...`}
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs focus:border-[#0f172a] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-600">Filtrar por Área:</span>
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value as any)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-[#0f172a] focus:outline-hidden bg-white"
          >
            <option value="TODAS">Todas (SST y Ambiental)</option>
            <option value="SST">Solo Seguridad y Salud (SST)</option>
            <option value="AMBIENTAL">Solo Ambiental</option>
          </select>
        </div>
      </div>

      {/* VISUAL DIAGRAM OF THE ACTIVE PHASE MATCHING THE USER SLIDES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-[#0f172a] tracking-tight">
                {presentationConfig.fases[activeFase].tituloFase}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setPresEditorTab('fases');
                  setIsPresEditorOpen(true);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-[#f97316] hover:bg-orange-50 transition-colors"
                title="Editar título y subtítulo de esta fase"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {presentationConfig.fases[activeFase].subtituloFase}
            </p>
          </div>
          <span className="text-xs font-bold text-[#f97316] hidden md:inline shrink-0">
            Frikaz S.A.S. (10 trabajadores)
          </span>
        </div>

        {/* Container with subtle corporate watermark stamp */}
        <div className="relative">
          {/* Subtle Watermark Stamp */}
          <div className="absolute right-4 bottom-4 pointer-events-none select-none opacity-[0.05] hidden lg:flex items-center gap-3 z-0">
            <ShieldCheck className="h-32 w-32 text-[#0f172a]" />
            <div>
              <div className="text-xl font-black uppercase text-[#0f172a]">FRIKAZ S.A.S.</div>
              <div className="text-xs font-bold text-[#0f172a]">FASE {activeFase} · SG-SST OFICIAL</div>
              <div className="text-[10px] font-mono text-[#0f172a]">SUIN-JURISCOL · DEC 1072/2015</div>
            </div>
          </div>

          {/* 4 Quadrants/Columns representing the 4 slide sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {presentationConfig.fases[activeFase].modulos.map((sub, idx) => {
            const subItems = faseItems.filter((i) => i.subtema === sub.subtema);

            return (
              <div
                key={sub.subtema}
                className="rounded-xl border border-slate-200 bg-white shadow-xs p-4 flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <span className="text-[10px] font-black uppercase text-[#f97316] tracking-wider">
                      MÓDULO {idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {subItems.length} norma(s)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPresEditorTab('modulos');
                          setIsPresEditorOpen(true);
                        }}
                        className="text-slate-400 hover:text-[#f97316] p-0.5 rounded hover:bg-orange-50 transition-colors"
                        title="Editar título o descripción de este módulo"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[#0f172a] leading-snug">
                    {sub.titulo}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {sub.desc}
                  </p>

                  {/* List of situations in this subtopic */}
                  <div className="mt-4 space-y-2.5">
                    {subItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-slate-200 p-3 bg-slate-50/70 hover:bg-[#fff7ed] hover:border-[#f97316] transition-all group shadow-xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            onClick={() => onSelectNorma(item)}
                            className="font-bold text-xs text-slate-900 group-hover:text-[#0f172a] leading-tight line-clamp-2 cursor-pointer hover:underline"
                          >
                            {item.tituloSituacion}
                          </span>
                          <span className="shrink-0">{getStatusButton(item)}</span>
                        </div>

                        <div className="text-[11px] text-slate-600 font-medium">
                          {item.normaOficial}
                        </div>

                        {/* Quick Interactive Automation Toggle */}
                        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-1 text-[10px]">
                          <span className="text-slate-400 font-medium">Auto-cambio:</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateStatus(item.id, 'CUMPLE');
                              }}
                              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                                item.estado === 'CUMPLE'
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-emerald-50'
                              }`}
                              title="Marcar Cumple (100%)"
                            >
                              ✓ Cumple
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateStatus(item.id, 'PARCIAL');
                              }}
                              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                                item.estado === 'PARCIAL'
                                  ? 'bg-[#f97316] text-white'
                                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-orange-50'
                              }`}
                              title="Marcar Parcial (50%)"
                            >
                              ~ Parcial
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateStatus(item.id, 'NO_CUMPLE');
                              }}
                              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                                item.estado === 'NO_CUMPLE'
                                  ? 'bg-[#991b1b] text-white'
                                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-red-50'
                              }`}
                              title="Marcar No Cumple (0%)"
                            >
                              ✕ No
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                          <span className="font-mono text-[9px] truncate max-w-[85px]" title={item.articulos}>{item.articulos}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onEditNorma) {
                                  onEditNorma(item);
                                } else {
                                  onSelectNorma(item);
                                }
                              }}
                              className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-[#fff7ed] hover:bg-[#ffedd5] text-[#ea580c] border border-orange-200 font-bold text-[10px] cursor-pointer transition-colors shadow-2xs"
                              title="Editar todos los campos de esta norma (Descripción, Importancia, Aplicabilidad, etc.)"
                            >
                              <Edit3 className="h-2.5 w-2.5" />
                              <span>Editar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectNorma(item)}
                              className="text-slate-600 hover:text-[#0f172a] font-bold hover:underline flex items-center gap-0.5 cursor-pointer text-[10px]"
                              title="Ver los 6 círculos obligatorios de la evidencia"
                            >
                              <span>Ver</span> <Eye className="h-2.5 w-2.5 ml-0.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Vigencia confirmada</span>
                  <span className="text-emerald-700 font-bold">SUIN-Juriscol</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

      {/* TEACHER SLIDE 5 PROMPT REMINDER INLINE */}
      <div className="rounded-xl border border-orange-200 bg-[#fff7ed] p-5 shadow-xs text-slate-800 text-xs">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-[#f97316] text-white p-2 shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-orange-950">
                {presentationConfig.guiaDocente.titulo}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setPresEditorTab('guia');
                  setIsPresEditorOpen(true);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 hover:text-orange-950 bg-orange-100/70 hover:bg-orange-200/70 px-2 py-0.5 rounded transition-colors"
                title="Editar texto de la guía pedagógica"
              >
                <Edit3 className="h-3 w-3" />
                <span>Editar Guía</span>
              </button>
            </div>
            <p className="text-orange-900 leading-relaxed whitespace-pre-line">
              {presentationConfig.guiaDocente.descripcion}
            </p>
          </div>
        </div>
      </div>

      {/* MODAL DE EDICIÓN DE TODA LA PRESENTACIÓN */}
      <PresentacionEditorModal
        isOpen={isPresEditorOpen}
        config={presentationConfig}
        initialTab={presEditorTab}
        activeFaseDefault={activeFase}
        onClose={() => setIsPresEditorOpen(false)}
        onSave={(updated) => {
          if (onUpdatePresentationConfig) {
            onUpdatePresentationConfig(updated);
          }
        }}
        onReset={() => {
          if (onResetPresentationConfig) {
            onResetPresentationConfig();
          }
        }}
      />
    </div>
  );
};
