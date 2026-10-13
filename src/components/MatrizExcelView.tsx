import React, { useState } from 'react';
import { NormaPhvaItem } from '../types/phvaEvidence';
import { generateFrikazExcelWorkbook } from '../services/excelMatrixService';
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ShieldCheck,
  Leaf,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Info,
  Sparkles,
  ArrowRight,
  FileCheck,
} from 'lucide-react';

interface MatrizExcelViewProps {
  items: NormaPhvaItem[];
  onSelectNorma?: (norma: NormaPhvaItem) => void;
}

type ExcelSheetTab = 'inicio' | 'phva_unificada' | 'gestion_sst' | 'gestion_ambiental' | 'plan_accion' | 'listas';

export const MatrizExcelView: React.FC<MatrizExcelViewProps> = ({ items, onSelectNorma }) => {
  const [activeSheet, setActiveSheet] = useState<ExcelSheetTab>('inicio');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState<'TODAS' | 'SST' | 'AMBIENTAL'>('TODAS');
  const [filterEstado, setFilterEstado] = useState<'TODOS' | 'CUMPLE' | 'PARCIAL' | 'NO_CUMPLE' | 'PENDIENTE'>('TODOS');

  // Cálculos dinámicos
  const totalNormas = items.length;
  const cumplidas = items.filter((i) => i.estado === 'CUMPLE').length;
  const parciales = items.filter((i) => i.estado === 'PARCIAL').length;
  const noCumplidas = items.filter((i) => i.estado === 'NO_CUMPLE').length;
  const pendientes = items.filter((i) => i.estado === 'PENDIENTE').length;
  const evaluadas = cumplidas + parciales + noCumplidas;
  const porcentajeCumplimiento = evaluadas > 0 ? Math.round(((cumplidas + parciales * 0.5) / evaluadas) * 100) : 0;

  const sstItems = items.filter((i) => i.area === 'SST' || i.area === 'INTEGRAL');
  const ambItems = items.filter((i) => i.area === 'AMBIENTAL' || i.area === 'INTEGRAL');
  const sstCumplidas = sstItems.filter((i) => i.estado === 'CUMPLE').length;
  const ambCumplidas = ambItems.filter((i) => i.estado === 'CUMPLE').length;

  const handleDownloadExcel = async () => {
    try {
      setIsExporting(true);
      const blob = await generateFrikazExcelWorkbook(items);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Matriz_Legal_Automatizada_Frikaz_SAS_PHVA_2026_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4500);
    } catch (err) {
      console.error('Error generando archivo Excel:', err);
      alert('Ocurrió un error al generar el archivo Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  // Filtrado de la hoja unificada
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      item.normaOficial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tituloSituacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.articulos.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea =
      filterArea === 'TODAS' ||
      item.area === filterArea ||
      (filterArea === 'SST' && item.area === 'INTEGRAL') ||
      (filterArea === 'AMBIENTAL' && item.area === 'INTEGRAL');

    const matchesEstado = filterEstado === 'TODOS' || item.estado === filterEstado;

    return matchesSearch && matchesArea && matchesEstado;
  });

  return (
    <div className="space-y-6">
      {/* BANNER PRINCIPAL DEL MÓDULO MATRIZ EXCEL */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] p-6 text-white shadow-xl border-2 border-emerald-500/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black uppercase tracking-wider">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Módulo Oficial .xlsx
              </span>
              <span className="rounded-md bg-orange-500/20 px-2.5 py-0.5 text-xs font-bold text-orange-300 border border-orange-400/30">
                100% Sin Macros VBA (Fórmulas Nativas)
              </span>
              <span className="rounded-md bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300 border border-slate-700">
                6 Hojas Estructuradas · {items.length} Obligaciones Reales
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Matriz Excel Automatizada — Frikaz S.A.S.
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Herramienta integral de cumplimiento con fórmulas automáticas de Excel (<code className="text-emerald-300 font-mono text-xs">COUNTIF</code>, <code className="text-emerald-300 font-mono text-xs">SUM</code>, <code className="text-emerald-300 font-mono text-xs">IF</code>), tablas estructuradas, listas desplegables y navegación por hipervínculos internos. Totalmente compatible con Microsoft Excel, LibreOffice Calc y Google Sheets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadExcel}
              disabled={isExporting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-900/40 hover:shadow-xl transition-all cursor-pointer border border-emerald-400/40 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generando Libro Excel...</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  <span>Descargar Matriz Excel (.xlsx)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {exportSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              ¡Archivo Excel descargado con éxito! Contiene las 6 hojas con fórmulas dinámicas, listas desplegables e hipervínculos internos listos para abrir en tu computadora.
            </span>
          </div>
        )}
      </div>

      {/* PESTAÑAS DE HOJAS DE EXCEL (SIMULADOR DE HOJAS) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 px-4 pt-3 border-b border-slate-800 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            <button
              onClick={() => setActiveSheet('inicio')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeSheet === 'inicio'
                  ? 'bg-white text-[#0f172a] shadow-md border-t-2 border-orange-500'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="h-4 w-4 text-orange-500" />
              <span>Hoja 1. Inicio (Dashboard)</span>
            </button>

            <button
              onClick={() => setActiveSheet('phva_unificada')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeSheet === 'phva_unificada'
                  ? 'bg-white text-[#0f172a] shadow-md border-t-2 border-orange-500'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="h-4 w-4 text-blue-500" />
              <span>Hoja 2. Matriz PHVA Unificada</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-bold">
                {items.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSheet('gestion_sst')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeSheet === 'gestion_sst'
                  ? 'bg-white text-[#0f172a] shadow-md border-t-2 border-orange-500'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Hoja 3. Gestión SST</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {sstItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSheet('gestion_ambiental')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeSheet === 'gestion_ambiental'
                  ? 'bg-white text-[#0f172a] shadow-md border-t-2 border-orange-500'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Leaf className="h-4 w-4 text-teal-500" />
              <span>Hoja 4. Gestión Ambiental</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800 font-bold">
                {ambItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSheet('plan_accion')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeSheet === 'plan_accion'
                  ? 'bg-white text-[#0f172a] shadow-md border-t-2 border-orange-500'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileCheck className="h-4 w-4 text-purple-500" />
              <span>Hoja 5. Plan de Acción</span>
            </button>

            <button
              onClick={() => setActiveSheet('listas')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeSheet === 'listas'
                  ? 'bg-white text-[#0f172a] shadow-md border-t-2 border-orange-500'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Info className="h-4 w-4 text-slate-400" />
              <span>Hoja 6. Listas & Desplegables</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Vista Previa Fiel al Libro Excel .xlsx</span>
          </div>
        </div>

        {/* CONTENIDO SEGÚN LA HOJA SELECCIONADA */}
        <div className="p-6">
          {/* HOJA 1: INICIO */}
          {activeSheet === 'inicio' && (
            <div className="space-y-6">
              {/* Encabezado Hoja Inicio */}
              <div className="bg-[#0f172a] rounded-xl p-5 text-white shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center font-black text-white text-xl shadow-md">
                    FZ
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">
                      FRIKAZ S.A.S. — SISTEMA DE GESTIÓN INTEGRAL SST Y AMBIENTAL
                    </h2>
                    <p className="text-xs text-orange-200 font-medium">
                      Tablero de Control y Matriz Legal Automatizada con Fórmulas Nativas de Excel
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300">NIT: 901.654.892-3</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-300">Bosa Piamonte, Bogotá</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-bold text-orange-300">10 Trabajadores</span>
                </div>
              </div>

              {/* Botones de navegación interna (Simulación de hipervínculos) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
                  Botones de Navegación Rápida de Excel (Sin Macros — Mediante Hipervínculos Internos)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => setActiveSheet('phva_unificada')}
                    className="p-3 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-left transition-all border-l-4 border-orange-500 shadow-sm cursor-pointer group"
                  >
                    <span className="text-[11px] text-orange-300 font-bold block">Hoja 2</span>
                    <span className="text-xs font-black block group-hover:text-orange-200">
                      Matriz PHVA Unificada ➔
                    </span>
                    <span className="text-[10px] text-slate-400">74 obligaciones en 21 columnas</span>
                  </button>

                  <button
                    onClick={() => setActiveSheet('gestion_sst')}
                    className="p-3 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-left transition-all border-l-4 border-emerald-500 shadow-sm cursor-pointer group"
                  >
                    <span className="text-[11px] text-emerald-300 font-bold block">Hoja 3</span>
                    <span className="text-xs font-black block group-hover:text-emerald-200">
                      Gestión SST ➔
                    </span>
                    <span className="text-[10px] text-slate-400">Seguridad y Salud en el Trabajo</span>
                  </button>

                  <button
                    onClick={() => setActiveSheet('gestion_ambiental')}
                    className="p-3 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-left transition-all border-l-4 border-teal-500 shadow-sm cursor-pointer group"
                  >
                    <span className="text-[11px] text-teal-300 font-bold block">Hoja 4</span>
                    <span className="text-xs font-black block group-hover:text-teal-200">
                      Gestión Ambiental ➔
                    </span>
                    <span className="text-[10px] text-slate-400">Aceites ACU, residuos y vertimientos</span>
                  </button>

                  <button
                    onClick={() => setActiveSheet('plan_accion')}
                    className="p-3 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-left transition-all border-l-4 border-purple-500 shadow-sm cursor-pointer group"
                  >
                    <span className="text-[11px] text-purple-300 font-bold block">Hoja 5</span>
                    <span className="text-xs font-black block group-hover:text-purple-200">
                      Plan de Acción ➔
                    </span>
                    <span className="text-[10px] text-slate-400">Causas, mejoras y verificación</span>
                  </button>
                </div>
              </div>

              {/* Panel de Indicadores de Fórmulas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-wide flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-orange-500" />
                    Panel de Indicadores Automatizados (Cálculo con Fórmulas Dinámicas)
                  </h3>
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    =COUNTIF('Matriz PHVA Unificada'!R3:R80, "Cumple")
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Normas</span>
                    <span className="text-2xl font-black text-[#0f172a] font-mono">{totalNormas}</span>
                    <span className="text-[9px] text-slate-400 block font-mono mt-0.5">=COUNTA()</span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Cumple</span>
                    <span className="text-2xl font-black text-emerald-700 font-mono">{cumplidas}</span>
                    <span className="text-[9px] text-emerald-600 block font-mono mt-0.5">=COUNTIF("Cumple")</span>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">Parcial</span>
                    <span className="text-2xl font-black text-amber-700 font-mono">{parciales}</span>
                    <span className="text-[9px] text-amber-600 block font-mono mt-0.5">=COUNTIF("Parcial")</span>
                  </div>

                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
                    <span className="text-[10px] font-bold text-rose-800 uppercase block">No Cumple</span>
                    <span className="text-2xl font-black text-rose-700 font-mono">{noCumplidas}</span>
                    <span className="text-[9px] text-rose-600 block font-mono mt-0.5">=COUNTIF("No cumple")</span>
                  </div>

                  <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-600 uppercase block">Pendientes</span>
                    <span className="text-2xl font-black text-slate-700 font-mono">{pendientes}</span>
                    <span className="text-[9px] text-slate-500 block font-mono mt-0.5">=COUNTIF("Pendiente")</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">No Aplica</span>
                    <span className="text-2xl font-black text-slate-700 font-mono">0</span>
                    <span className="text-[9px] text-slate-400 block font-mono mt-0.5">Excluido denom.</span>
                  </div>

                  <div className="bg-linear-to-b from-orange-500 to-orange-600 rounded-xl p-3 text-center text-white shadow-md">
                    <span className="text-[10px] font-black uppercase tracking-wider block text-orange-100">
                      % Cumplimiento
                    </span>
                    <span className="text-2xl font-black font-mono">{porcentajeCumplimiento}%</span>
                    <span className="text-[9px] text-orange-200 block font-mono mt-0.5">=FÓRMULA NATIVA</span>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
                    <span className="text-[10px] font-bold text-orange-800 uppercase block">Acciones</span>
                    <span className="text-2xl font-black text-orange-900 font-mono">1</span>
                    <span className="text-[9px] text-orange-600 block font-mono mt-0.5">1 En proceso</span>
                  </div>
                </div>
              </div>

              {/* Comparativa SST vs Ambiental */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#0f172a] uppercase">Gestión SST (MinTrabajo)</h4>
                        <p className="text-[11px] text-slate-500">{sstItems.length} obligaciones registradas</p>
                      </div>
                    </div>
                    <span className="text-sm font-black font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {Math.round((sstCumplidas / Math.max(1, sstItems.length)) * 100)}%
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Cumplidas:</span>
                      <span className="font-bold font-mono text-emerald-600">{sstCumplidas}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Normas Clave:</span>
                      <span className="font-medium text-slate-800">Dec. 1072/15, Res. 0312/19, Res. 2400/79</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Riesgos Prioritarios:</span>
                      <span className="font-medium text-slate-800">Fritura &gt;160°C, corte mecánico, vapor</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Leaf className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#0f172a] uppercase">Gestión Ambiental (SDA / MinAmbiente)</h4>
                        <p className="text-[11px] text-slate-500">{ambItems.length} obligaciones registradas</p>
                      </div>
                    </div>
                    <span className="text-sm font-black font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {Math.round((ambCumplidas / Math.max(1, ambItems.length)) * 100)}%
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Cumplidas:</span>
                      <span className="font-bold font-mono text-emerald-600">{ambCumplidas}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Normas Clave:</span>
                      <span className="font-medium text-slate-800">Res. 316/18 (ACU), Dec. 1076/15, Res. 2184/19</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Aspectos Prioritarios:</span>
                      <span className="font-medium text-slate-800">Aceite usado de fritura, trampa de grasas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HOJA 2: MATRIZ PHVA UNIFICADA */}
          {activeSheet === 'phva_unificada' && (
            <div className="space-y-4">
              {/* Barra de Filtros y Búsqueda */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="relative w-full md:w-80">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar norma, artículo o palabra..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <select
                    value={filterArea}
                    onChange={(e) => setFilterArea(e.target.value as any)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-hidden"
                  >
                    <option value="TODAS">Todas las Áreas</option>
                    <option value="SST">Solo SST</option>
                    <option value="AMBIENTAL">Solo Ambiental</option>
                  </select>

                  <select
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value as any)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-hidden"
                  >
                    <option value="TODOS">Todos los Estados</option>
                    <option value="CUMPLE">Cumple (Verde)</option>
                    <option value="PARCIAL">Cumple Parcial (Amarillo)</option>
                    <option value="NO_CUMPLE">No Cumple (Rojo)</option>
                    <option value="PENDIENTE">Pendiente (Gris)</option>
                  </select>

                  <span className="text-xs text-slate-500 font-bold ml-2">
                    {filteredItems.length} de {items.length} filas
                  </span>
                </div>
              </div>

              {/* Vista previa en formato de cuadrícula de Excel */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-[550px] shadow-inner">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-[#0f172a] text-white z-20 shadow-md">
                    <tr>
                      <th className="p-2.5 border-r border-slate-700 w-12 text-center font-mono">Fila</th>
                      <th className="p-2.5 border-r border-slate-700 min-w-[110px] font-bold">Código</th>
                      <th className="p-2.5 border-r border-slate-700 min-w-[90px] font-bold text-center">Área</th>
                      <th className="p-2.5 border-r border-slate-700 min-w-[180px] font-bold">Norma Oficial</th>
                      <th className="p-2.5 border-r border-slate-700 min-w-[130px] font-bold">Artículo</th>
                      <th className="p-2.5 border-r border-slate-700 min-w-[220px] font-bold">Obligación</th>
                      <th className="p-2.5 border-r border-slate-700 min-w-[180px] font-bold bg-[#1e293b]">PLANEAR</th>
                      <th className="p-2.5 border-r border-slate-700 min-w-[180px] font-bold bg-[#1e293b]">HACER</th>
                      <th className="p-2.5 border-r border-slate-700 min-w-[180px] font-bold bg-[#1e293b]">VERIFICAR</th>
                      <th className="p-2.5 border-r border-slate-700 min-w-[180px] font-bold bg-[#1e293b]">ACTUAR</th>
                      <th className="p-2.5 border-r border-slate-700 min-w-[140px] font-bold text-center bg-orange-600">Estado</th>
                      <th className="p-2.5 border-r border-slate-700 min-w-[90px] font-bold text-center">% Avance</th>
                      <th className="p-2.5 min-w-[140px] font-bold">Responsable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredItems.map((item, index) => {
                      const codigo = `OBL-${item.area === 'SST' ? 'SST' : item.area === 'AMBIENTAL' ? 'AMB' : 'INT'}-${String(index + 1).padStart(3, '0')}`;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => onSelectNorma && onSelectNorma(item)}
                          className="hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                          <td className="p-2 border-r border-slate-200 text-center font-mono text-slate-400 text-[11px] bg-slate-50">
                            {index + 3}
                          </td>
                          <td className="p-2 border-r border-slate-200 font-mono font-bold text-slate-700 whitespace-nowrap">
                            {codigo}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                item.area === 'SST'
                                  ? 'bg-blue-100 text-blue-800'
                                  : item.area === 'AMBIENTAL'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {item.area}
                            </span>
                          </td>
                          <td className="p-2 border-r border-slate-200 font-bold text-slate-800">
                            {item.normaOficial}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-slate-600 text-[11px]">
                            {item.articulos}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-slate-600 line-clamp-2 max-w-xs">
                            {item.descripcion}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-[11px] text-slate-600 bg-slate-50/50">
                            Planificar cumplimiento en sede Bosa.
                          </td>
                          <td className="p-2 border-r border-slate-200 text-[11px] text-slate-600 bg-slate-50/50">
                            {item.tituloSituacion}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-[11px] text-slate-600 bg-slate-50/50">
                            Inspección y cotejo documental.
                          </td>
                          <td className="p-2 border-r border-slate-200 text-[11px] text-slate-600 bg-slate-50/50">
                            Actualizar matriz GTC 45 y control.
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-xs font-black ${
                                item.estado === 'CUMPLE'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : item.estado === 'PARCIAL'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : item.estado === 'NO_CUMPLE'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-slate-100 text-slate-700 border border-slate-300'
                              }`}
                            >
                              {item.estado === 'CUMPLE'
                                ? 'Cumple'
                                : item.estado === 'PARCIAL'
                                ? 'Parcial'
                                : item.estado === 'NO_CUMPLE'
                                ? 'No Cumple'
                                : 'Pendiente'}
                            </span>
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center font-mono font-bold text-slate-700">
                            {item.estado === 'CUMPLE' ? '100%' : item.estado === 'PARCIAL' ? '60%' : '0%'}
                          </td>
                          <td className="p-2 text-slate-600 text-[11px] truncate max-w-[140px]">
                            {item.responsable}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HOJA 3: GESTIÓN SST */}
          {activeSheet === 'gestion_sst' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-blue-900 uppercase">
                    Hoja 3: Gestión SST — Frikaz S.A.S.
                  </h3>
                  <p className="text-xs text-blue-700">
                    Obligaciones en seguridad industrial, salud en el trabajo, ARL, comités y control de riesgos de planta
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg text-xs">
                  {sstItems.length} Normas SST
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-[500px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0f172a] text-white sticky top-0">
                    <tr>
                      <th className="p-2.5 w-16 text-center">ID</th>
                      <th className="p-2.5 min-w-[200px]">Norma SST</th>
                      <th className="p-2.5 min-w-[100px] text-center">Fase</th>
                      <th className="p-2.5 min-w-[240px]">Obligación SST</th>
                      <th className="p-2.5 min-w-[140px]">Responsable</th>
                      <th className="p-2.5 min-w-[200px]">Evidencia Exigida</th>
                      <th className="p-2.5 min-w-[110px] text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {sstItems.map((it, idx) => (
                      <tr key={it.id} className="hover:bg-slate-50">
                        <td className="p-2 text-center font-mono text-slate-500">SST-{String(idx + 1).padStart(3, '0')}</td>
                        <td className="p-2 font-bold text-slate-800">{it.normaOficial}</td>
                        <td className="p-2 text-center">
                          <span className="px-2 py-0.5 rounded-sm bg-slate-100 font-bold text-slate-700 text-[10px]">
                            {it.fase}
                          </span>
                        </td>
                        <td className="p-2 text-slate-600">{it.descripcion}</td>
                        <td className="p-2 text-slate-700 font-medium">{it.responsable}</td>
                        <td className="p-2 text-slate-500 text-[11px]">{it.evidenciaCumplimiento}</td>
                        <td className="p-2 text-center">
                          <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {it.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HOJA 4: GESTIÓN AMBIENTAL */}
          {activeSheet === 'gestion_ambiental' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-emerald-900 uppercase">
                    Hoja 4: Gestión Ambiental — Frikaz S.A.S.
                  </h3>
                  <p className="text-xs text-emerald-700">
                    Control de Aceite de Cocina Usado (ACU Res. 316), residuos sólidos, vertimientos y emisiones de fritura
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs">
                  {ambItems.length} Normas Ambientales
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-[500px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#065f46] text-white sticky top-0">
                    <tr>
                      <th className="p-2.5 w-16 text-center">ID</th>
                      <th className="p-2.5 min-w-[200px]">Norma Ambiental</th>
                      <th className="p-2.5 min-w-[100px] text-center">Fase</th>
                      <th className="p-2.5 min-w-[240px]">Aspecto / Obligación</th>
                      <th className="p-2.5 min-w-[140px]">Responsable</th>
                      <th className="p-2.5 min-w-[200px]">Evidencia Ambiental</th>
                      <th className="p-2.5 min-w-[110px] text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {ambItems.map((it, idx) => (
                      <tr key={it.id} className="hover:bg-slate-50">
                        <td className="p-2 text-center font-mono text-slate-500">AMB-{String(idx + 1).padStart(3, '0')}</td>
                        <td className="p-2 font-bold text-slate-800">{it.normaOficial}</td>
                        <td className="p-2 text-center">
                          <span className="px-2 py-0.5 rounded-sm bg-slate-100 font-bold text-slate-700 text-[10px]">
                            {it.fase}
                          </span>
                        </td>
                        <td className="p-2 text-slate-600">{it.descripcion}</td>
                        <td className="p-2 text-slate-700 font-medium">{it.responsable}</td>
                        <td className="p-2 text-slate-500 text-[11px]">{it.evidenciaCumplimiento}</td>
                        <td className="p-2 text-center">
                          <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {it.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HOJA 5: PLAN DE ACCIÓN */}
          {activeSheet === 'plan_accion' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-purple-900 uppercase">
                    Hoja 5: Plan de Acción y Mejora Continua
                  </h3>
                  <p className="text-xs text-purple-700">
                    Registro de hallazgos, causas raíz, acciones correctivas, fechas límite y verificación de eficacia
                  </p>
                </div>
                <span className="px-3 py-1 bg-purple-600 text-white font-bold rounded-lg text-xs">
                  Cierre de Ciclo PHVA
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0f172a] text-white">
                    <tr>
                      <th className="p-2.5">ID Acción</th>
                      <th className="p-2.5">Código Norma</th>
                      <th className="p-2.5">Hallazgo / Desviación</th>
                      <th className="p-2.5">Causa Raíz</th>
                      <th className="p-2.5">Acción Correctiva</th>
                      <th className="p-2.5">Responsable</th>
                      <th className="p-2.5">Fecha Límite</th>
                      <th className="p-2.5 text-center">Estado</th>
                      <th className="p-2.5">Verificación de Eficacia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 font-mono font-bold text-slate-700">ACT-2026-001</td>
                      <td className="p-2 font-mono text-slate-500">OBL-SST-003</td>
                      <td className="p-2 text-slate-800">Actualización curso de 20 horas SG-SST.</td>
                      <td className="p-2 text-slate-600">Vencimiento del ciclo bianual legal.</td>
                      <td className="p-2 text-slate-700 font-medium">Inscripción en plataforma virtual ARL.</td>
                      <td className="p-2 text-slate-600">Líder SG-SST</td>
                      <td className="p-2 font-mono text-slate-600">2026-11-30</td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800 font-bold text-[10px]">
                          En proceso
                        </span>
                      </td>
                      <td className="p-2 text-slate-600 text-[11px]">En seguimiento ARL</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 font-mono font-bold text-slate-700">ACT-2026-002</td>
                      <td className="p-2 font-mono text-slate-500">OBL-AMB-008</td>
                      <td className="p-2 text-slate-800">Cierre de bitácora entrega Aceite ACU.</td>
                      <td className="p-2 text-slate-600">Demora en certificación de gestor.</td>
                      <td className="p-2 text-slate-700 font-medium">Solicitar manifiesto oficial sellado.</td>
                      <td className="p-2 text-slate-600">Coordinador Ambiental</td>
                      <td className="p-2 font-mono text-slate-600">2026-10-30</td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 rounded-sm bg-rose-100 text-rose-800 font-bold text-[10px]">
                          Abierta
                        </span>
                      </td>
                      <td className="p-2 text-slate-600 text-[11px]">Pendiente de cierre</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 font-mono font-bold text-slate-700">ACT-2026-003</td>
                      <td className="p-2 font-mono text-slate-500">OBL-SST-006</td>
                      <td className="p-2 text-slate-800">Mantenimiento y recarga extintores Solkaflam.</td>
                      <td className="p-2 text-slate-600">Inspección semestral de planta.</td>
                      <td className="p-2 text-slate-700 font-medium">Prueba de presión y tarjeta de vigencia.</td>
                      <td className="p-2 text-slate-600">Jefe de Planta</td>
                      <td className="p-2 font-mono text-slate-600">2026-08-20</td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Cerrada
                        </span>
                      </td>
                      <td className="p-2 text-emerald-700 font-bold text-[11px]">Eficaz (100% operativo)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HOJA 6: LISTAS & DESPLEGABLES */}
          {activeSheet === 'listas' && (
            <div className="space-y-4">
              <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">
                    Hoja 6: Tablas Maestras para Validación de Datos (Listas Desplegables)
                  </h3>
                  <p className="text-xs text-slate-600">
                    Valores predeterminados en Excel que previenen errores tipográficos al registrar nuevas obligaciones
                  </p>
                </div>
                <span className="px-3 py-1 bg-slate-700 text-white font-bold rounded-lg text-xs">
                  Data Validation Rules
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                  <h4 className="text-xs font-black text-slate-800 uppercase mb-2">1. Estados de Cumplimiento</h4>
                  <ul className="text-xs space-y-1 text-slate-600">
                    <li className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Cumple
                    </li>
                    <li className="flex items-center gap-1.5 font-bold text-amber-700">
                      <span className="h-2 w-2 rounded-full bg-amber-500" /> Cumple parcialmente
                    </li>
                    <li className="flex items-center gap-1.5 font-bold text-rose-700">
                      <span className="h-2 w-2 rounded-full bg-rose-500" /> No cumple
                    </li>
                    <li className="flex items-center gap-1.5 font-bold text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-slate-400" /> Pendiente de evaluación
                    </li>
                    <li className="flex items-center gap-1.5 font-medium text-slate-500">
                      <span className="h-2 w-2 rounded-full bg-blue-400" /> No aplica justificado
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                  <h4 className="text-xs font-black text-slate-800 uppercase mb-2">2. Fases del Ciclo PHVA</h4>
                  <ul className="text-xs space-y-1 text-slate-600">
                    <li className="font-bold text-blue-700">· Planear (P)</li>
                    <li className="font-bold text-emerald-700">· Hacer (H)</li>
                    <li className="font-bold text-amber-700">· Verificar (V)</li>
                    <li className="font-bold text-purple-700">· Actuar (A)</li>
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                  <h4 className="text-xs font-black text-slate-800 uppercase mb-2">3. Tipos de Evidencia</h4>
                  <ul className="text-xs space-y-1 text-slate-600">
                    <li>· Procedimiento Documentado</li>
                    <li>· Registro o Formato Firmado</li>
                    <li>· Certificado ARL / SDA</li>
                    <li>· Factura / Manifiesto de Gestor</li>
                    <li>· Acta de Reunión o Inspección</li>
                    <li>· Matriz de Peligros / Aspectos</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
