import React, { useState, useMemo } from 'react';
import {
  CaracterizacionEmpresaDinamica,
  ModalidadContrato,
  SectorEconomico,
  ClaseRiesgoLaboral,
  ModalidadTrabajo,
  ResumenEvaluacionImpacto,
  PropuestaCambioNorma,
  RegistroHistorialCambio,
} from '../types/dynamicConfig';
import { NormaPhvaItem, IndicadoresAutomaticos } from '../types/phvaEvidence';
import {
  CONFIGURACION_FRIKAZ_INICIAL,
  getCaracterizacionActual,
  saveCaracterizacion,
  evaluarImpactoCambio,
  aplicarPropuestasANormas,
  getHistorialCambios,
  registrarEnHistorial,
} from '../services/dynamicRulesEngine';
import {
  Building2,
  Users,
  Shield,
  Layers,
  Flame,
  CheckCircle2,
  AlertTriangle,
  History,
  FileCheck,
  Zap,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  FileSpreadsheet,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Info,
  Scale,
  Award,
  Factory,
  HelpCircle,
  Clock,
  Eye,
  Activity,
} from 'lucide-react';

interface ConfiguracionDinamicaEmpresaViewProps {
  normas: NormaPhvaItem[];
  indicadores: IndicadoresAutomaticos;
  onActualizarNormas: (normasActualizadas: NormaPhvaItem[]) => void;
  onOpenNormaModal: (norma: NormaPhvaItem) => void;
  onOpenMatrizExcel: () => void;
}

export const ConfiguracionDinamicaEmpresaView: React.FC<
  ConfiguracionDinamicaEmpresaViewProps
> = ({
  normas,
  indicadores,
  onActualizarNormas,
  onOpenNormaModal,
  onOpenMatrizExcel,
}) => {
  // Estado de la caracterización empresarial viva
  const [config, setConfig] = useState<CaracterizacionEmpresaDinamica>(() =>
    getCaracterizacionActual()
  );

  // Copia de respaldo anterior para calcular diferencias al instante
  const [configAnterior, setConfigAnterior] = useState<CaracterizacionEmpresaDinamica>(() =>
    getCaracterizacionActual()
  );

  // Evaluación de impacto activa
  const [evaluacionActual, setEvaluacionActual] = useState<ResumenEvaluacionImpacto | null>(() => {
    const actual = getCaracterizacionActual();
    return evaluarImpactoCambio(actual, actual, normas, 'Auditor SG-SST Frikaz');
  });

  // Modal de revisión de propuestas
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [activeRevisionTab, setActiveRevisionTab] = useState<
    'TODAS' | 'NUEVAS' | 'REVISION' | 'MODIFICADAS' | 'PENDIENTES' | 'ESTABLES'
  >('TODAS');

  // Historial de auditoría
  const [historial, setHistorial] = useState<RegistroHistorialCambio[]>(() =>
    getHistorialCambios()
  );
  const [showHistorialModal, setShowHistorialModal] = useState(false);

  // Feedback de éxito
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Propuestas en evaluación editable
  const [propuestasEditables, setPropuestasEditables] = useState<PropuestaCambioNorma[]>(
    () => evaluacionActual?.propuestas || []
  );

  // Sincronizar evaluación cuando cambia la configuración
  const ejecutarEvaluacionAutomatica = (
    nuevaConfig: CaracterizacionEmpresaDinamica,
    anteriorCfg: CaracterizacionEmpresaDinamica = config
  ) => {
    const impacto = evaluarImpactoCambio(
      anteriorCfg,
      nuevaConfig,
      normas,
      'Auditor SG-SST Frikaz'
    );
    setEvaluacionActual(impacto);
    setPropuestasEditables(impacto.propuestas);
    saveCaracterizacion(nuevaConfig);
  };

  // Handler para cambios de trabajadores
  const handleCambioTrabajadores = (nuevoValor: number) => {
    const clamp = Math.max(1, Math.min(500, nuevoValor));
    const ant = { ...config };
    const nueva = { ...config, numeroTrabajadores: clamp };
    setConfig(nueva);
    ejecutarEvaluacionAutomatica(nueva, ant);
  };

  // Handler para modalidades de contrato
  const handleToggleModalidadContrato = (modalidad: ModalidadContrato) => {
    const ant = { ...config };
    const existe = config.modalidadesContrato.includes(modalidad);
    const nuevasModalidades = existe
      ? config.modalidadesContrato.filter((m) => m !== modalidad)
      : [...config.modalidadesContrato, modalidad];

    // Mantener al menos 1 modalidad
    if (nuevasModalidades.length === 0) return;

    const nueva = { ...config, modalidadesContrato: nuevasModalidades };
    setConfig(nueva);
    ejecutarEvaluacionAutomatica(nueva, ant);
  };

  // Handler para sector económico
  const handleCambioSector = (sector: SectorEconomico) => {
    const ant = { ...config };
    let ciiu = config.ciiuPrincipal;
    let actividad = config.actividadEconomicaConcreta;

    if (sector === 'secundario') {
      ciiu = '1089 - Elaboración de otros productos alimenticios n.c.p. (Snacks fritos)';
      actividad =
        'Producción y comercialización de productos fritos tipo snack (papas, plátanos y chicharrones)';
    } else if (sector === 'terciario') {
      ciiu = '4630 - Comercio al por mayor de alimentos, bebidas y tabaco';
      actividad = 'Distribución logística comercial de paquetes y abarrotes';
    } else if (sector === 'primario') {
      ciiu = '0119 - Cultivo de otros cultivos no perennes (Tubérculos y plátano)';
      actividad = 'Producción agropecuaria y cosecha de tubérculos en campo';
    }

    const nueva = {
      ...config,
      sectorEconomico: sector,
      ciiuPrincipal: ciiu,
      actividadEconomicaConcreta: actividad,
    };
    setConfig(nueva);
    ejecutarEvaluacionAutomatica(nueva, ant);
  };

  // Handler para clase de riesgo
  const handleCambioRiesgo = (riesgo: ClaseRiesgoLaboral) => {
    const ant = { ...config };
    const nueva = { ...config, claseRiesgoSST: riesgo };
    setConfig(nueva);
    ejecutarEvaluacionAutomatica(nueva, ant);
  };

  // Handler para alternar procesos, maquinaria o sustancias
  const handleToggleChip = (
    campo: 'procesosProductivos' | 'maquinariaEquipos' | 'sustanciasQuimicas',
    item: string
  ) => {
    const ant = { ...config };
    const listaActual = [...config[campo]];
    const index = listaActual.indexOf(item);
    if (index >= 0) {
      listaActual.splice(index, 1);
    } else {
      listaActual.push(item);
    }
    const nueva = { ...config, [campo]: listaActual };
    setConfig(nueva);
    ejecutarEvaluacionAutomatica(nueva, ant);
  };

  // APROBAR O RECHAZAR UNA PROPUESTA ESPECÍFICA
  const handleAccionPropuesta = (
    propuestaId: string,
    accion: 'APROBAR' | 'RECHAZAR'
  ) => {
    setPropuestasEditables((prev) =>
      prev.map((p) => {
        if (p.id === propuestaId) {
          return {
            ...p,
            estadoPropuesta: accion === 'APROBAR' ? 'APROBADA' : 'RECHAZADA',
            decisionUsuario: {
              accion,
              fecha: new Date().toISOString(),
              responsable: 'Auditor SG-SST Frikaz',
              justificacion:
                accion === 'APROBAR'
                  ? 'Aprobado formalmente tras verificar evidencia técnica legal.'
                  : 'Rechazado por criterio técnico del auditor SG-SST.',
            },
          };
        }
        return p;
      })
    );
  };

  // APLICAR TODAS LAS PROPUESTAS APROBADAS A LAS 74 NORMAS Y REGISTRAR EN HISTORIAL
  const handleAplicarCambiosDefinitivos = () => {
    if (!evaluacionActual) return;

    const propuestasParaAplicar = propuestasEditables.filter(
      (p) => p.estadoPropuesta === 'APROBADA' || p.estadoPropuesta === 'PENDIENTE'
    );

    const { normasActualizadas, conteoActualizadas } = aplicarPropuestasANormas(
      normas,
      propuestasParaAplicar,
      config,
      'Auditor SG-SST Frikaz'
    );

    // Actualizar estado general en App
    onActualizarNormas(normasActualizadas);

    // Registrar en Historial Inmutable
    const aprobadas = propuestasParaAplicar.length;
    const rechazadas = propuestasEditables.filter(
      (p) => p.estadoPropuesta === 'RECHAZADA'
    ).length;

    const registro: RegistroHistorialCambio = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      usuario: 'Auditor SG-SST Frikaz',
      caracteristicaModificada: evaluacionActual.variableModificada,
      valorAnterior: JSON.stringify(evaluacionActual.valorAnterior).slice(0, 80),
      valorNuevo: JSON.stringify(evaluacionActual.valorNuevo).slice(0, 80),
      cantidadNormasReevaluadas: evaluacionActual.totalNormasEvaluadas,
      resumenResultado: evaluacionActual.resumenEjecutivo,
      propuestasGeneradas: evaluacionActual.propuestas.length,
      propuestasAprobadas: aprobadas,
      propuestasRechazadas: rechazadas,
      estadoFinal:
        aprobadas > 0 ? (rechazadas > 0 ? 'APLICADO_PARCIAL' : 'APLICADO_TOTAL') : 'RECHAZADO',
    };

    registrarEnHistorial(registro);
    setHistorial(getHistorialCambios());

    // Actualizar config anterior de referencia
    setConfigAnterior({ ...config });
    saveCaracterizacion(config);

    setMensajeExito(
      `¡Cambios aplicados con éxito! Se actualizaron ${conteoActualizadas} normas oficiales en el Ciclo PHVA y la Matriz Legal.`
    );
    setTimeout(() => setMensajeExito(null), 5000);
    setIsRevisionModalOpen(false);
  };

  // EJECUCIÓN DIRECTA DE LOS ESCENARIOS DE PRUEBA EXIGIDOS
  const handleEjecutarPruebaControlada = (escenario: number) => {
    const ant = { ...config };
    let nueva: CaracterizacionEmpresaDinamica = { ...config };

    if (escenario === 1) {
      // 1. Cambiar de 10 a 15 trabajadores
      nueva = {
        ...nueva,
        numeroTrabajadores: 15,
      };
    } else if (escenario === 2) {
      // 2. Cambiar de 15 a 8 trabajadores
      nueva = {
        ...nueva,
        numeroTrabajadores: 8,
      };
    } else if (escenario === 3) {
      // 3. Seleccionar varias modalidades de contrato
      nueva = {
        ...nueva,
        modalidadesContrato: ['indefinido', 'aprendizaje', 'servicios'],
      };
    } else if (escenario === 4) {
      // 4. Cambiar a 55 trabajadores (Escenario de 60 estándares completos)
      nueva = {
        ...nueva,
        numeroTrabajadores: 55,
        claseRiesgoSST: 'Clase III (Medio)',
      };
    } else if (escenario === 5) {
      // 5. Restablecer línea base inicial Frikaz S.A.S.
      nueva = { ...CONFIGURACION_FRIKAZ_INICIAL };
    }

    setConfig(nueva);
    ejecutarEvaluacionAutomatica(nueva, ant);
    setIsRevisionModalOpen(true);
  };

  // Filtrado de propuestas en el modal
  const propuestasFiltradas = useMemo(() => {
    if (activeRevisionTab === 'TODAS') return propuestasEditables;
    if (activeRevisionTab === 'NUEVAS')
      return propuestasEditables.filter((p) => p.categoriaAlerta === 'NORMA_NUEVA_APLICABLE');
    if (activeRevisionTab === 'REVISION')
      return propuestasEditables.filter((p) => p.categoriaAlerta === 'REVISION_APLICABILIDAD');
    if (activeRevisionTab === 'MODIFICADAS')
      return propuestasEditables.filter((p) => p.categoriaAlerta === 'OBLIGACION_MODIFICADA');
    if (activeRevisionTab === 'PENDIENTES')
      return propuestasEditables.filter((p) => p.categoriaAlerta === 'INFORMACION_PENDIENTE');
    if (activeRevisionTab === 'ESTABLES')
      return propuestasEditables.filter((p) => p.categoriaAlerta === 'SIN_CAMBIOS');
    return propuestasEditables;
  }, [propuestasEditables, activeRevisionTab]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ============================================================ */}
      {/* 1. HEADER FUTURISTA 3D: CONFIGURACIÓN DINÁMICA DE LA EMPRESA */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-linear-to-r from-[#0f172a] via-[#1e293b] to-[#0a192f] p-6 text-white shadow-2xl shadow-slate-950/50">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-orange-500/20 px-3 py-1 text-xs font-black tracking-wider uppercase text-orange-300 border border-orange-500/30">
                <SlidersHorizontal className="h-3.5 w-3.5 text-orange-400" />
                Módulo Oficial de Caracterización Dinámica
              </span>
              <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                Motor de Reglas Verificadas SST & Ambiente
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Configuración Dinámica de la Empresa</span>
              <span className="text-orange-400 text-lg font-mono">
                [FRIKAZ S.A.S.]
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Modifique los parámetros operativos, contractuales y productivos de la planta de snacks. Cada cambio dispara un análisis normativo inmediato con reglas legales colombianas verificables, actualizando en tiempo real el Ciclo PHVA, la Matriz de Requisitos Legales y los indicadores de cumplimiento.
            </p>
          </div>

          {/* Botones de acción superior */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsRevisionModalOpen(true)}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-orange-500 to-amber-600 text-white text-xs font-black hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg shadow-orange-500/30 cursor-pointer active:scale-95"
            >
              <Scale className="h-4 w-4" />
              <span>Ver Comparación Normativa</span>
              {evaluacionActual && evaluacionActual.totalNormasAfectadas > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white text-orange-600 font-extrabold text-[10px]">
                  {evaluacionActual.totalNormasAfectadas}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowHistorialModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
            >
              <History className="h-4 w-4 text-slate-400" />
              <span>Historial ({historial.length})</span>
            </button>

            <button
              onClick={onOpenMatrizExcel}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition-all cursor-pointer"
              title="Abrir la Matriz Excel Oficial"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>Matriz Excel</span>
            </button>
          </div>
        </div>

        {/* Banner de resumen dinámico instantáneo */}
        {evaluacionActual && (
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center gap-2 text-slate-200">
              <Zap className="h-4 w-4 text-orange-400 shrink-0 mt-0.5 sm:mt-0" />
              <span className="font-semibold text-slate-300">
                Último Análisis:
              </span>
              <span className="text-orange-200 font-medium">
                {evaluacionActual.resumenEjecutivo}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
              <span>Normas Afectadas: <strong className="text-orange-400">{evaluacionActual.totalNormasAfectadas}</strong></span>
              <span>Normas Estables: <strong className="text-emerald-400">{evaluacionActual.normasSinCambios.length}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Notificación de éxito flotante */}
      {mensajeExito && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/90 p-4 text-emerald-100 shadow-xl flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{mensajeExito}</span>
          </div>
          <button
            onClick={() => setMensajeExito(null)}
            className="text-emerald-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* BARRA DE PRUEBAS OBLIGATORIAS CONTROLADAS (SECCIÓN 10) */}
      {/* ============================================================ */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-orange-500" />
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Pruebas Rápidas Automatizadas de Escenarios Normativos:
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleEjecutarPruebaControlada(1)}
              className="px-2.5 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200 hover:bg-orange-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>1. 10 a 15 Trabajadores</span>
              <span className="text-[10px] bg-orange-200 px-1 rounded text-orange-900">
                (21 Estándares / COPASST)
              </span>
            </button>

            <button
              onClick={() => handleEjecutarPruebaControlada(2)}
              className="px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200 hover:bg-sky-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>2. 15 a 8 Trabajadores</span>
              <span className="text-[10px] bg-sky-200 px-1 rounded text-sky-900">
                (7 Estándares / Vigía)
              </span>
            </button>

            <button
              onClick={() => handleEjecutarPruebaControlada(3)}
              className="px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 hover:bg-purple-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>3. Varios Contratos</span>
              <span className="text-[10px] bg-purple-200 px-1 rounded text-purple-900">
                (Aprendices SENA + Servicios)
              </span>
            </button>

            <button
              onClick={() => handleEjecutarPruebaControlada(4)}
              className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>4. 55 Trabajadores</span>
              <span className="text-[10px] bg-rose-200 px-1 rounded text-rose-900">
                (60 Estándares / Clase III)
              </span>
            </button>

            <button
              onClick={() => handleEjecutarPruebaControlada(5)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="Restablecer Frikaz S.A.S. Inicial"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Restablecer Frikaz</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CUADÍCULA PRINCIPAL: TARJETAS INTERACTIVAS A, B, C, D */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ============================================================ */}
        {/* TARJETA B: CANTIDAD DE TRABAJADORES (COL 12 o 5) */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                B
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Cantidad de Trabajadores
                </h3>
                <p className="text-[11px] text-slate-500">
                  Umbrales legales de Estándares Mínimos, COPASST y Comités
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
              {config.numeroTrabajadores} vinculados
            </span>
          </div>

          {/* Control Numérico Interactivo [-] 10 Trabajadores [+] */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
            <span className="block text-xs font-semibold text-slate-700">
              Selector numérico de personal en planta:
            </span>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleCambioTrabajadores(config.numeroTrabajadores - 1)}
                className="h-11 w-12 rounded-xl bg-white border border-slate-300 text-slate-800 text-xl font-black hover:bg-slate-100 active:scale-95 transition-all shadow-xs flex items-center justify-center cursor-pointer"
                title="Disminuir trabajadores"
              >
                −
              </button>

              <div className="flex-1 flex items-center justify-center bg-white border border-slate-300 rounded-xl px-4 py-2 shadow-inner">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={config.numeroTrabajadores}
                  onChange={(e) =>
                    handleCambioTrabajadores(parseInt(e.target.value, 10) || 1)
                  }
                  className="w-16 text-center text-xl font-black text-slate-900 focus:outline-hidden font-mono"
                />
                <span className="text-xs font-bold text-slate-500 ml-1">
                  trabajadores
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCambioTrabajadores(config.numeroTrabajadores + 1)}
                className="h-11 w-12 rounded-xl bg-orange-500 text-white text-xl font-black hover:bg-orange-600 active:scale-95 transition-all shadow-md shadow-orange-500/20 flex items-center justify-center cursor-pointer"
                title="Aumentar trabajadores"
              >
                +
              </button>
            </div>

            {/* Presets Rápidos */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Atajos de prueba:</span>
              <div className="flex items-center gap-1.5 font-mono">
                <button
                  onClick={() => handleCambioTrabajadores(8)}
                  className={`px-2 py-0.5 rounded border ${config.numeroTrabajadores === 8 ? 'bg-orange-500 text-white border-orange-500 font-bold' : 'bg-white hover:bg-slate-100 border-slate-200'}`}
                >
                  8
                </button>
                <button
                  onClick={() => handleCambioTrabajadores(10)}
                  className={`px-2 py-0.5 rounded border ${config.numeroTrabajadores === 10 ? 'bg-orange-500 text-white border-orange-500 font-bold' : 'bg-white hover:bg-slate-100 border-slate-200'}`}
                >
                  10
                </button>
                <button
                  onClick={() => handleCambioTrabajadores(15)}
                  className={`px-2 py-0.5 rounded border ${config.numeroTrabajadores === 15 ? 'bg-orange-500 text-white border-orange-500 font-bold' : 'bg-white hover:bg-slate-100 border-slate-200'}`}
                >
                  15
                </button>
                <button
                  onClick={() => handleCambioTrabajadores(25)}
                  className={`px-2 py-0.5 rounded border ${config.numeroTrabajadores === 25 ? 'bg-orange-500 text-white border-orange-500 font-bold' : 'bg-white hover:bg-slate-100 border-slate-200'}`}
                >
                  25
                </button>
                <button
                  onClick={() => handleCambioTrabajadores(55)}
                  className={`px-2 py-0.5 rounded border ${config.numeroTrabajadores === 55 ? 'bg-orange-500 text-white border-orange-500 font-bold' : 'bg-white hover:bg-slate-100 border-slate-200'}`}
                >
                  55
                </button>
              </div>
            </div>
          </div>

          {/* Diagnóstico en vivo de Umbrales Legales */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-slate-500" />
              Efectos Normativos Derivados del Tamaño:
            </h4>

            {/* 1. Estándares Mínimos Res 0312/2019 */}
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-2">
              <Shield className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">
                  Estándares SG-SST (Res. 0312 de 2019):
                </span>
                <span className="text-slate-600 text-[11px]">
                  {config.numeroTrabajadores <= 10
                    ? '7 Estándares Mínimos (Microempresa Clase I, II o III).'
                    : config.numeroTrabajadores <= 50
                      ? '21 Estándares Mínimos (Pequeña empresa 11 a 50 trabajadores).'
                      : '60 Estándares Mínimos (Empresa grande >50 trabajadores o Alto Riesgo).'}
                </span>
              </div>
            </div>

            {/* 2. Participación: COPASST vs Vigía */}
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-2">
              <Users className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">
                  Participación y Consulta (Res. 2013/1986):
                </span>
                <span className="text-slate-600 text-[11px]">
                  {config.numeroTrabajadores < 10
                    ? 'Vigía de SST obligatorio designado directamente por el empleador.'
                    : 'COPASST Paritario obligatorio (mínimo 1 representante por el empleador y 1 por trabajadores).'}
                </span>
              </div>
            </div>

            {/* 3. Comité de Convivencia Laboral */}
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-2">
              <Award className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">
                  Comité de Convivencia (Res. 652/2012):
                </span>
                <span className="text-slate-600 text-[11px]">
                  {config.numeroTrabajadores <= 10
                    ? '2 Miembros (1 por empleador y 1 por trabajadores).'
                    : '4 Miembros (2 por empleador y 2 por trabajadores).'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TARJETA A: TIPO DE CONTRATO (COL 12 o 7) */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                A
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Tipo de Contrato y Vinculación
                </h3>
                <p className="text-[11px] text-slate-500">
                  Selección múltiple de modalidades reales en Frikaz S.A.S.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {config.modalidadesContrato.length} seleccionadas
            </span>
          </div>

          {/* Botones de Modalidades Contractuales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              {
                id: 'indefinido' as ModalidadContrato,
                label: 'A término indefinido',
                desc: 'Cobertura integral directa en ARL, EPS y Fondo de Pensiones.',
              },
              {
                id: 'fijo' as ModalidadContrato,
                label: 'A término fijo',
                desc: 'Control de prórrogas y exámenes ocupacionales periódicos.',
              },
              {
                id: 'obra_labor' as ModalidadContrato,
                label: 'Por obra o labor',
                desc: 'Afiliaciones previas al primer día de producción en planta.',
              },
              {
                id: 'aprendizaje' as ModalidadContrato,
                label: 'Contrato de aprendizaje (SENA)',
                desc: 'ARL obligatoria en etapa práctica. Prohibido menores en freidoras.',
              },
              {
                id: 'servicios' as ModalidadContrato,
                label: 'Prestación de servicios',
                desc: 'Verificación mensual PILA de ARL/Salud y permisos para áreas calientes.',
              },
              {
                id: 'temporal_mision' as ModalidadContrato,
                label: 'Trabajo temporal o en misión',
                desc: 'Empresa usuaria responsable de condiciones locativas y EPP.',
              },
              {
                id: 'teletrabajo' as ModalidadContrato,
                label: 'Teletrabajo / Trabajo remoto',
                desc: 'Autoevaluación de puesto en casa y reporte dirección ARL.',
              },
              {
                id: 'otra' as ModalidadContrato,
                label: 'Otras modalidades configurables',
                desc: 'Personal por días o convenios especiales.',
              },
            ].map((mod) => {
              const active = config.modalidadesContrato.includes(mod.id);
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => handleToggleModalidadContrato(mod.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    active
                      ? 'border-orange-500 bg-orange-50/60 shadow-xs ring-1 ring-orange-500/30'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xs ${active ? 'text-orange-950' : 'text-slate-800'}`}>
                      {mod.label}
                    </span>
                    <span
                      className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${
                        active
                          ? 'bg-orange-500 text-white'
                          : 'border border-slate-300 text-transparent'
                      }`}
                    >
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 leading-snug">
                    {mod.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panel Informativo de Obligaciones Contractuales */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
              <Info className="h-3.5 w-3.5 text-orange-500" />
              <span>Análisis de Relación Contractual y SST:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Las obligaciones fundamentales del SG-SST protegen a toda persona que preste servicios físicos en la planta (Art. 2.2.4.6.1 Dec 1072/2015). Modalidades como <strong>aprendizaje SENA</strong> activan la protección especial de menores de edad y <strong>prestación de servicios</strong> activa la validación obligatoria de planillas PILA antes del ingreso a la nave de fritura.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TARJETA C: SECTOR ECONÓMICO Y ACTIVIDAD (COL 12) */}
        {/* ============================================================ */}
        <div className="lg:col-span-12 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                C
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Sector Económico y Actividad Concreta
                </h3>
                <p className="text-[11px] text-slate-500">
                  Clasificación macroeconómica combinada con procesos industriales reales
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              {config.sectorEconomico.toUpperCase()} · CIIU {config.ciiuPrincipal.slice(0, 4)}
            </span>
          </div>

          {/* Selector de Sector Económico en Tarjetas 3D */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                id: 'primario' as SectorEconomico,
                label: 'Sector Primario',
                desc: 'Extracción de materias primas y cultivo agropecuario.',
                icon: Factory,
              },
              {
                id: 'secundario' as SectorEconomico,
                label: 'Sector Secundario (FRIKAZ)',
                desc: 'Transformación y manufactura industrial de snacks fritos.',
                icon: Flame,
              },
              {
                id: 'terciario' as SectorEconomico,
                label: 'Sector Terciario',
                desc: 'Comercio, logística de distribución y servicios.',
                icon: Building2,
              },
              {
                id: 'otro' as SectorEconomico,
                label: 'Otro Sector',
                desc: 'Clasificación especial o actividades mixtas.',
                icon: Layers,
              },
            ].map((sec) => {
              const selected = config.sectorEconomico === sec.id;
              const IconComp = sec.icon;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => handleCambioSector(sec.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    selected
                      ? 'border-orange-500 bg-linear-to-b from-orange-50 to-white shadow-md ring-2 ring-orange-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                        selected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <IconComp className="h-4 w-4" />
                    </div>
                    <span
                      className={`font-black text-xs ${
                        selected ? 'text-orange-950' : 'text-slate-800'
                      }`}
                    >
                      {sec.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {sec.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Formulario CIIU y Actividad Concreta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Código CIIU Principal (DANE):
              </label>
              <input
                type="text"
                value={config.ciiuPrincipal}
                onChange={(e) => {
                  const nueva = { ...config, ciiuPrincipal: e.target.value };
                  setConfig(nueva);
                  ejecutarEvaluacionAutomatica(nueva);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 font-mono text-xs focus:border-orange-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Determina las tarifas de cotización a la ARL y normativa ambiental aplicable.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Actividad Económica Específica:
              </label>
              <input
                type="text"
                value={config.actividadEconomicaConcreta}
                onChange={(e) => {
                  const nueva = {
                    ...config,
                    actividadEconomicaConcreta: e.target.value,
                  };
                  setConfig(nueva);
                  ejecutarEvaluacionAutomatica(nueva);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs focus:border-orange-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Frikaz S.A.S.: Producción y fritura artesanal/industrial de papas, plátanos y chicharrón.
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TARJETA D: OTRAS CARACTERÍSTICAS CONDICIONANTES (COL 12) */}
        {/* ============================================================ */}
        <div className="lg:col-span-12 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                D
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Otras Características Condicionantes de Aplicabilidad
                </h3>
                <p className="text-[11px] text-slate-500">
                  Clase de riesgo ARL, maquinaria, sustancias químicas y aspectos ambientales
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              Evaluación Multivariable
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {/* 1. CLASE DE RIESGO LABORAL */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <span className="block font-bold text-slate-900 text-xs">
                Clase de Riesgo Laboral (ARL):
              </span>
              <div className="space-y-1">
                {(
                  [
                    'Clase I (Mínimo)',
                    'Clase II (Bajo)',
                    'Clase III (Medio)',
                    'Clase IV (Alto)',
                    'Clase V (Máximo)',
                  ] as ClaseRiesgoLaboral[]
                ).map((riesgo) => (
                  <button
                    key={riesgo}
                    type="button"
                    onClick={() => handleCambioRiesgo(riesgo)}
                    className={`w-full py-1.5 px-3 rounded-lg text-left font-semibold text-[11px] transition-all flex items-center justify-between cursor-pointer ${
                      config.claseRiesgoSST === riesgo
                        ? 'bg-orange-500 text-white font-bold shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{riesgo}</span>
                    {config.claseRiesgoSST === riesgo && (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 block pt-1">
                Frikaz S.A.S. opera en Clase II/III por uso de calor &gt;160°C y cortadoras mecánicas.
              </span>
            </div>

            {/* 2. MAQUINARIA Y EQUIPOS */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <span className="block font-bold text-slate-900 text-xs">
                Equipos y Maquinaria en Planta:
              </span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {[
                  'Freidoras industriales dobles continuas (>160°C)',
                  'Rebanadora rotativa con cuchillas mecánicas',
                  'Peladora abrasiva mecánica con agua',
                  'Marmita en acero inoxidable para escaldado',
                  'Selladora continua de banda térmica con fechador',
                  'Campana extractora con trampa de grasas en ducto',
                  'Trampa física de retención de grasas en desagüe',
                ].map((maq) => {
                  const checked = config.maquinariaEquipos.includes(maq);
                  return (
                    <button
                      key={maq}
                      type="button"
                      onClick={() => handleToggleChip('maquinariaEquipos', maq)}
                      className={`w-full p-1.5 rounded-lg text-left text-[11px] transition-colors flex items-center justify-between cursor-pointer border ${
                        checked
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-300 font-semibold'
                          : 'bg-white text-slate-500 border-slate-200 line-through'
                      }`}
                    >
                      <span className="truncate pr-1">{maq}</span>
                      <span
                        className={`h-3.5 w-3.5 rounded flex items-center justify-center shrink-0 ${
                          checked ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                        }`}
                      >
                        {checked && <Check className="h-2.5 w-2.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. SUSTANCIAS QUÍMICAS */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <span className="block font-bold text-slate-900 text-xs">
                Sustancias Químicas y Combustibles:
              </span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {[
                  'Aceite vegetal comestible para fritura (>160°C)',
                  'Gas natural por tubería / GLP para quemadores',
                  'Detergente desengrasante alcalino industrial',
                  'Hipoclorito de sodio y desinfectantes para alimentos',
                  'Soda cáustica para limpieza profunda de campana',
                ].map((sust) => {
                  const checked = config.sustanciasQuimicas.includes(sust);
                  return (
                    <button
                      key={sust}
                      type="button"
                      onClick={() => handleToggleChip('sustanciasQuimicas', sust)}
                      className={`w-full p-1.5 rounded-lg text-left text-[11px] transition-colors flex items-center justify-between cursor-pointer border ${
                        checked
                          ? 'bg-amber-50 text-amber-950 border-amber-300 font-semibold'
                          : 'bg-white text-slate-500 border-slate-200 line-through'
                      }`}
                    >
                      <span className="truncate pr-1">{sust}</span>
                      <span
                        className={`h-3.5 w-3.5 rounded flex items-center justify-center shrink-0 ${
                          checked ? 'bg-amber-600 text-white' : 'border border-slate-300'
                        }`}
                      >
                        {checked && <Check className="h-2.5 w-2.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL / PANTALLA DE COMPARACIÓN NORMATIVA Y APROBACIÓN */}
      {/* ============================================================ */}
      {isRevisionModalOpen && evaluacionActual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col border border-slate-200">
            {/* Modal Header */}
            <div className="bg-[#0f172a] p-5 text-white flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <span className="rounded-md bg-orange-500/30 text-orange-300 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider border border-orange-500/40">
                  Pantalla Oficial de Comparación Normativa
                </span>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>Revisión de Impacto Legal y Solicitud de Aprobación</span>
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl">
                  {evaluacionActual.resumenEjecutivo}
                </p>
              </div>

              <button
                onClick={() => setIsRevisionModalOpen(false)}
                className="h-8 w-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Categorías / Tabs de Comparación */}
            <div className="bg-slate-100 border-b border-slate-200 px-5 pt-3 flex flex-wrap gap-2 text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveRevisionTab('TODAS')}
                className={`px-3 py-2 rounded-t-lg transition-all ${
                  activeRevisionTab === 'TODAS'
                    ? 'bg-white text-orange-600 border-t-2 border-orange-500 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todas las Propuestas ({propuestasEditables.length})
              </button>

              <button
                onClick={() => setActiveRevisionTab('MODIFICADAS')}
                className={`px-3 py-2 rounded-t-lg transition-all ${
                  activeRevisionTab === 'MODIFICADAS'
                    ? 'bg-white text-orange-600 border-t-2 border-orange-500 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Obligaciones Modificadas ({evaluacionActual.obligacionesModificadas.length})
              </button>

              <button
                onClick={() => setActiveRevisionTab('REVISION')}
                className={`px-3 py-2 rounded-t-lg transition-all ${
                  activeRevisionTab === 'REVISION'
                    ? 'bg-white text-orange-600 border-t-2 border-orange-500 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Revisar Aplicabilidad ({evaluacionActual.normasParaRevisar.length})
              </button>

              <button
                onClick={() => setActiveRevisionTab('PENDIENTES')}
                className={`px-3 py-2 rounded-t-lg transition-all ${
                  activeRevisionTab === 'PENDIENTES'
                    ? 'bg-white text-orange-600 border-t-2 border-orange-500 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Datos Faltantes ({evaluacionActual.datosPendientes.length})
              </button>

              <button
                onClick={() => setActiveRevisionTab('ESTABLES')}
                className={`px-3 py-2 rounded-t-lg transition-all ${
                  activeRevisionTab === 'ESTABLES'
                    ? 'bg-white text-emerald-600 border-t-2 border-emerald-500 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sin Cambios ({evaluacionActual.normasSinCambios.length})
              </button>
            </div>

            {/* Listado de Propuestas con Acciones de Aprobación */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {propuestasFiltradas.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No hay propuestas en esta categoría.
                </div>
              ) : (
                propuestasFiltradas.map((prop) => {
                  const esAprobada = prop.estadoPropuesta === 'APROBADA';
                  const esRechazada = prop.estadoPropuesta === 'RECHAZADA';

                  return (
                    <div
                      key={prop.id}
                      className={`p-4 rounded-xl border transition-all ${
                        esAprobada
                          ? 'border-emerald-300 bg-emerald-50/50'
                          : esRechazada
                            ? 'border-rose-300 bg-rose-50/50 opacity-75'
                            : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              prop.area === 'SST'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {prop.area} · {prop.fasePhva}
                          </span>
                          <h4 className="font-extrabold text-xs text-slate-900">
                            {prop.normaOficial}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-mono">
                            ({prop.articulos})
                          </span>
                        </div>

                        {/* Estado de Aprobación */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              esAprobada
                                ? 'bg-emerald-600 text-white'
                                : esRechazada
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {esAprobada
                              ? 'PROPUESTA APROBADA'
                              : esRechazada
                                ? 'PROPUESTA RECHAZADA'
                                : 'PENDIENTE DE DECISIÓN'}
                          </span>
                        </div>
                      </div>

                      {/* Motivo y Justificación Legal */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Evaluación Anterior / Condición Previa:
                          </span>
                          <p className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200">
                            {prop.valorAnteriorTexto}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                            Nueva Propuesta del Motor Legal:
                          </span>
                          <p className="text-slate-800 text-[11px] bg-orange-50/70 p-2 rounded-lg border border-orange-200 font-medium">
                            {prop.valorPropuestoTexto}
                          </p>
                        </div>
                      </div>

                      {/* Justificación y Botones */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="text-[11px] text-slate-500 max-w-xl">
                          <strong className="text-slate-700">Fundamento: </strong>
                          {prop.justificacionLegal}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleAccionPropuesta(prop.id, 'APROBAR')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              esAprobada
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800'
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Aprobar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAccionPropuesta(prop.id, 'RECHAZAR')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              esRechazada
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-800'
                            }`}
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Rechazar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer con Aprobación Definitiva */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-slate-500">
                Al aplicar, se actualizarán las obligaciones reales en el Ciclo PHVA y el Dashboard.
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cerrar sin Aplicar
                </button>

                <button
                  type="button"
                  onClick={handleAplicarCambiosDefinitivos}
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-md shadow-orange-600/30 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Aprobar y Aplicar a Matrices Oficiales</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL DE HISTORIAL DE AUDITORÍA Y TRAZABILIDAD (SECCIÓN 9) */}
      {/* ============================================================ */}
      {showHistorialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col border border-slate-200">
            <div className="bg-[#0f172a] p-5 text-white flex items-center justify-between shrink-0">
              <div className="space-y-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Trazabilidad e Inmutabilidad de Datos
                </span>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <History className="h-4 w-4 text-orange-500" />
                  <span>Historial Cronológico de Modificaciones y Decisiones</span>
                </h3>
              </div>

              <button
                onClick={() => setShowHistorialModal(false)}
                className="h-8 w-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {historial.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No se han registrado modificaciones todavía.
                </div>
              ) : (
                historial.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        <span className="font-mono text-[11px] text-slate-500">
                          {new Date(item.timestamp).toLocaleString('es-CO')}
                        </span>
                        <span className="font-bold text-slate-800">
                          · {item.usuario}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                        {item.estadoFinal}
                      </span>
                    </div>

                    <p className="text-slate-800 font-medium text-xs">
                      {item.resumenResultado}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                      <span>Variable: {item.caracteristicaModificada}</span>
                      <span>
                        Aprobadas: <strong className="text-emerald-600">{item.propuestasAprobadas}</strong> | Rechazadas: <strong className="text-rose-600">{item.propuestasRechazadas}</strong>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-slate-100 p-3 text-right shrink-0">
              <button
                onClick={() => setShowHistorialModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Cerrar Historial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
