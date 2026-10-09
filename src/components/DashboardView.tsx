import React from 'react';
import {
  Norm,
  Obligacion,
  PhvaRegistro,
  Evidencia,
  AccionCorrectiva,
  IndicadoresCumplimiento,
  EmpresaFrikazConfig,
} from '../types';
import {
  ShieldCheck,
  Leaf,
  AlertTriangle,
  Clock,
  FileCheck,
  AlertCircle,
  TrendingUp,
  FolderLock,
  ArrowRight,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface DashboardViewProps {
  indicadores: IndicadoresCumplimiento;
  empresa: EmpresaFrikazConfig;
  norms: Norm[];
  obligaciones: Obligacion[];
  phvaList: PhvaRegistro[];
  evidencias: Evidencia[];
  acciones: AccionCorrectiva[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenNewNormModal: () => void;
  onOpenNewObligacionModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  indicadores,
  empresa,
  norms,
  obligaciones,
  phvaList,
  evidencias,
  acciones,
  onNavigateTab,
  onOpenNewNormModal,
  onOpenNewObligacionModal,
}) => {
  // SVG circular gauge helper
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (indicadores.porcentajeCumplimientoGeneral / 100) * circumference;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Corporate Identity & Facility Context */}
      <div className="rounded-xl border border-emerald-900/20 bg-linear-to-r from-emerald-950 via-emerald-900 to-slate-900 p-6 text-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-800/80 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-200">
                Sede Fabril Frikaz S.A.S.
              </span>
              <span className="text-xs text-slate-300">NIT: {empresa.nit}</span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-300">{empresa.barrio}, Bosa (Bogotá D.C.)</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Sistema Automatizado de Gestión Normativa SST y Ambiental
            </h2>
            <p className="text-sm text-slate-200 max-w-3xl leading-relaxed">
              Planta de producción de snacks fritos (papas, plátanos y chicharrones) con{' '}
              <strong className="text-emerald-300 tabular-nums">{empresa.numeroTrabajadores} trabajadores</strong>.
              Cumplimiento verificado bajo Decreto 1072/2015, Res. 0312/2019, Res. 316/2018 (ACU) y normatividad distrital SDA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenNewNormModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-600 transition-colors"
            >
              + Nueva Norma
            </button>
            <button
              onClick={onOpenNewObligacionModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors border border-white/20"
            >
              + Nueva Obligación
            </button>
          </div>
        </div>
      </div>

      {/* Main Big Gauges: Consolidated Compliance */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* KPI 15: General Compliance */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Cumplimiento General
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums font-mono">
                {indicadores.porcentajeCumplimientoGeneral}%
              </span>
              <span className="text-xs font-medium text-slate-500">
                ({indicadores.obligacionesCumplidasVerificadas} de {indicadores.obligacionesAplicables} aplicables)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Excluye {indicadores.obligacionesNoAplica} no aplicables con justificación
            </p>
          </div>
          <div className="relative h-20 w-20 shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-emerald-700 transition-all duration-500 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-800" />
            </div>
          </div>
        </div>

        {/* KPI 13: SST Compliance */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Cumplimiento SST
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums font-mono">
                {indicadores.porcentajeCumplimientoSST}%
              </span>
              <span className="text-xs text-slate-500">
                Decreto 1072 & Res. 0312
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-emerald-700 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, indicadores.porcentajeCumplimientoSST))}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('sst')}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-emerald-800"
            title="Ir a módulo SST"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* KPI 14: Environmental Compliance */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Leaf className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Cumplimiento Ambiental
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums font-mono">
                {indicadores.porcentajeCumplimientoAmbiental}%
              </span>
              <span className="text-xs text-slate-500">
                ACU, SDA Bogotá, Residuos
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, indicadores.porcentajeCumplimientoAmbiental))}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('ambiental')}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-emerald-700"
            title="Ir a módulo Ambiental"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Grid of the 12 Operational Indicators Required by Section 4 */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Indicadores Clave de Gestión Normativa (Cálculo en Tiempo Real)
          </h3>
          <span className="text-xs text-slate-500">
            Sincronizado con la base de datos local
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {/* KPI 1 & 2: Normas Registradas & Vigentes */}
          <div
            onClick={() => onNavigateTab('matriz')}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-emerald-600 hover:shadow-xs"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">1. Total Normas</span>
              <Layers className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums font-mono">
              {indicadores.totalNormas}
            </div>
            <div className="mt-1 text-[11px] text-slate-600">
              <span className="font-semibold text-emerald-700">{indicadores.normasVigentesVerificadas}</span> vigentes verificadas
            </div>
          </div>

          {/* KPI 3: Normas Pendientes de Validación */}
          <div
            onClick={() => onNavigateTab('matriz')}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-amber-500 hover:shadow-xs"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">3. Por Validar</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-700 tabular-nums font-mono">
              {indicadores.normasPendientesValidacion}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              En revisión SUIN/SDA
            </div>
          </div>

          {/* KPI 4 & 5: Obligaciones Cumplidas */}
          <div
            onClick={() => onNavigateTab('obligaciones')}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-emerald-600 hover:shadow-xs"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">5. Cumplidas 100%</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-800 tabular-nums font-mono">
              {indicadores.obligacionesCumplidasVerificadas}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Con evidencia verificada
            </div>
          </div>

          {/* KPI 6: Obligaciones Parciales */}
          <div
            onClick={() => onNavigateTab('obligaciones')}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-xs"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">6. Parciales</span>
              <FileCheck className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-blue-700 tabular-nums font-mono">
              {indicadores.obligacionesParciales}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              En proceso de cierre
            </div>
          </div>

          {/* KPI 7: Obligaciones Incumplidas */}
          <div
            onClick={() => onNavigateTab('obligaciones')}
            className="cursor-pointer rounded-lg border border-red-200 bg-red-50/50 p-4 transition-all hover:border-red-500 hover:shadow-xs"
          >
            <div className="flex items-center justify-between text-red-700">
              <span className="text-xs font-medium">7. Incumplidas</span>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-red-700 tabular-nums font-mono">
              {indicadores.obligacionesIncumplidas}
            </div>
            <div className="mt-1 text-[11px] text-red-600">
              Requieren acción correctiva
            </div>
          </div>

          {/* KPI 8: Obligaciones Pendientes */}
          <div
            onClick={() => onNavigateTab('obligaciones')}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-slate-400 hover:shadow-xs"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">8. Pendientes</span>
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-700 tabular-nums font-mono">
              {indicadores.obligacionesPendientesEjecucion + indicadores.obligacionesPendientesVerificacion}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Por ejecutar / verificar
            </div>
          </div>

          {/* KPI 9: Evidencias Faltantes */}
          <div
            onClick={() => onNavigateTab('evidencias')}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-amber-500 hover:shadow-xs"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">9. Evi. Faltantes</span>
              <FolderLock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-700 tabular-nums font-mono">
              {indicadores.evidenciasFaltantes}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Obligaciones sin soporte
            </div>
          </div>

          {/* KPI 10: Próximas a Vencer */}
          <div
            onClick={() => onNavigateTab('alertas')}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-amber-500 hover:shadow-xs"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">10. Por Vencer</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-700 tabular-nums font-mono">
              {indicadores.actividadesProximasVencer}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Dentro de los 15 días
            </div>
          </div>

          {/* KPI 11: Actividades Vencidas */}
          <div
            onClick={() => onNavigateTab('alertas')}
            className="cursor-pointer rounded-lg border border-red-200 bg-red-50/50 p-4 transition-all hover:border-red-500 hover:shadow-xs"
          >
            <div className="flex items-center justify-between text-red-700">
              <span className="text-xs font-medium">11. Vencidas</span>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-red-700 tabular-nums font-mono">
              {indicadores.actividadesVencidas}
            </div>
            <div className="mt-1 text-[11px] text-red-600">
              Fecha límite expirada
            </div>
          </div>

          {/* KPI 12: Acciones Correctivas Abiertas */}
          <div
            onClick={() => onNavigateTab('acciones')}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-red-500 hover:shadow-xs"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">12. Acciones Abiertas</span>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums font-mono">
              {indicadores.accionesCorrectivasAbiertas}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              En ejecución / sin cierre
            </div>
          </div>

          {/* Additional: Obligaciones Aplicables Totales */}
          <div
            onClick={() => onNavigateTab('obligaciones')}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-emerald-600 hover:shadow-xs"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">4. Ob. Aplicables</span>
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums font-mono">
              {indicadores.obligacionesAplicables}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              De {indicadores.totalObligaciones} totales
            </div>
          </div>

          {/* Total Documentos de Evidencia */}
          <div
            onClick={() => onNavigateTab('evidencias')}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-emerald-600 hover:shadow-xs"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Evidencias Cargadas</span>
              <FolderLock className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums font-mono">
              {evidencias.length}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Certificados & actas
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Charts Section & PHVA Pipeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* PHVA Pipeline Progress */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Fases del Ciclo PHVA de Frikaz S.A.S.
              </h3>
              <p className="text-xs text-slate-500">
                Progreso por etapas de mejora continua
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('phva')}
              className="text-xs font-semibold text-emerald-800 hover:underline inline-flex items-center gap-1"
            >
              Ver ciclo completo <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-4 space-y-3.5">
            {/* P - Planear */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">
                  P — PLANEAR (Políticas, Objetivos, Recursos)
                </span>
                <span className="font-mono tabular-nums text-slate-500 font-medium">
                  {indicadores.fasesPhvaCompletadas.planear} de {phvaList.length} actividades
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{
                    width: `${phvaList.length > 0 ? (indicadores.fasesPhvaCompletadas.planear / phvaList.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* H - Hacer */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">
                  H — HACER (Ejecución, Capacitación, EPP, Controles)
                </span>
                <span className="font-mono tabular-nums text-slate-500 font-medium">
                  {indicadores.fasesPhvaCompletadas.hacer} de {phvaList.length} actividades
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all"
                  style={{
                    width: `${phvaList.length > 0 ? (indicadores.fasesPhvaCompletadas.hacer / phvaList.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* V - Verificar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">
                  V — VERIFICAR (Inspecciones, Auditorías, Hallazgos)
                </span>
                <span className="font-mono tabular-nums text-slate-500 font-medium">
                  {indicadores.fasesPhvaCompletadas.verificar} de {phvaList.length} actividades
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{
                    width: `${phvaList.length > 0 ? (indicadores.fasesPhvaCompletadas.verificar / phvaList.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* A - Actuar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">
                  A — ACTUAR (Acciones Correctivas y Cierre Eficaz)
                </span>
                <span className="font-mono tabular-nums text-slate-500 font-medium">
                  {indicadores.fasesPhvaCompletadas.actuar} de {phvaList.length} actividades
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-800 rounded-full transition-all"
                  style={{
                    width: `${phvaList.length > 0 ? (indicadores.fasesPhvaCompletadas.actuar / phvaList.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Priority Focus for Frikaz S.A.S. */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Focos Críticos Operativos de Frikaz S.A.S.
              </h3>
              <p className="text-xs text-slate-500">
                Puntos de atención derivados de las características reales de la planta
              </p>
            </div>
            <Flame className="h-4 w-4 text-amber-600" />
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3">
              <Flame className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-amber-950 font-semibold block">
                  Línea de Freidoras e Inmersión Térmica (&gt;160°C)
                </strong>
                <span className="text-amber-900">
                  Riesgo de quemaduras graves y amagos de fuego. Exige inspección periódica de extintores Clase K, termostatos y uso estricto de guantes térmicos de caña alta.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
              <Leaf className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-emerald-950 font-semibold block">
                  Gestión de Aceite de Cocina Usado (ACU) — Res. 316/2018
                </strong>
                <span className="text-emerald-900">
                  La Secretaría Distrital de Ambiente (SDA) exige entrega exclusiva a gestores autorizados y bitácora de entrega. Prohibido vertimiento a la red de Bosa.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/60 p-3">
              <ShieldCheck className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-blue-950 font-semibold block">
                  Estándares Mínimos SG-SST (10 Trabajadores) — Res. 0312/2019
                </strong>
                <span className="text-blue-900">
                  Requiere mantener vigentes los 7 estándares básicos y las evaluaciones médicas periódicas con énfasis en manipulación sanitaria de alimentos.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
