import React, { useState, useEffect } from 'react';
import {
  RiesgoGTC45Item,
  TipoClasificacionPeligro,
  TABLA_TECNICA_NC,
} from '../../types/gtc45RiskMatrix';
import {
  calcularInterpretacionNP,
  calcularInterpretacionNR,
} from '../../data/gtc45RiskMatrixData';
import {
  X,
  Save,
  AlertTriangle,
  Layers,
  Shield,
  Activity,
  Calculator,
  Info,
  CheckCircle2,
  Briefcase,
  Wrench,
  Users,
  Scale,
} from 'lucide-react';

interface RiskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (risk: RiesgoGTC45Item) => void;
  initialData?: RiesgoGTC45Item | null;
  existingAreas: string[];
}

export function RiskFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingAreas,
}: RiskFormModalProps) {
  // Form State
  const [formData, setFormData] = useState<Partial<RiesgoGTC45Item>>({
    proceso: '',
    zonaLugar: existingAreas[0] || 'Área de producción',
    actividades: '',
    tareas: '',
    cargo: '',
    cargosExpuestos: '',
    rutinario: 'SÍ',
    peligroDescripcion: '',
    peligroClasificacion: 'Condiciones de Seguridad',
    efectosPosibles: '',
    controlesFuente: '',
    controlesMedio: '',
    controlesIndividuo: '',
    nivelDeficiencia: 6,
    nivelExposicion: 3,
    nivelConsecuencia: 25,
    numeroExpuestos: 1,
    peorConsecuencia: '',
    existenciaRequisitoLegal: 'SÍ',
    requisitoLegalEspecifico: '',
    medidaEliminacion: '',
    medidaSustitucion: '',
    medidaControlesIngenieria: '',
    medidaControlesAdministrativos: '',
    medidaEquiposEPP: '',
    observaciones: '',
  });

  const [activeTab, setActiveTab] = useState<number>(1);

  // Sync when initialData changes - Loads all existing values for easy editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        cargo: initialData.cargo || initialData.cargosExpuestos || '',
        cargosExpuestos: initialData.cargosExpuestos || initialData.cargo || '',
      });
    } else {
      setFormData({
        id: `RSK-CUSTOM-${Date.now().toString().slice(-4)}`,
        codigo: `GTC45-${Math.floor(100 + Math.random() * 900)}`,
        proceso: 'Operativo',
        zonaLugar: existingAreas[0] || 'Área de producción',
        actividades: '',
        tareas: '',
        cargo: 'Operario',
        cargosExpuestos: 'Operario',
        rutinario: 'SÍ',
        peligroDescripcion: '',
        peligroClasificacion: 'Condiciones de Seguridad',
        efectosPosibles: '',
        controlesFuente: '',
        controlesMedio: '',
        controlesIndividuo: '',
        nivelDeficiencia: 6,
        nivelExposicion: 3,
        nivelConsecuencia: 25,
        numeroExpuestos: 2,
        peorConsecuencia: '',
        existenciaRequisitoLegal: 'SÍ',
        requisitoLegalEspecifico: 'Resolución 2400 de 1979 / Decreto 1072 de 2015',
        medidaEliminacion: '',
        medidaSustitucion: '',
        medidaControlesIngenieria: '',
        medidaControlesAdministrativos: '',
        medidaEquiposEPP: '',
        observaciones: '',
      });
    }
    setActiveTab(1);
  }, [initialData, existingAreas, isOpen]);

  // Live Calculations according to GTC 45 (Real-time recalculation upon manual edits)
  const ndRaw = Number(formData.nivelDeficiencia);
  const nd = isNaN(ndRaw) ? 0 : ndRaw;

  const neRaw = Number(formData.nivelExposicion);
  const ne = isNaN(neRaw) ? 1 : neRaw;

  const np = nd * ne;
  const interpretacionNP = calcularInterpretacionNP(np);

  const ncRaw = Number(formData.nivelConsecuencia);
  const nc = isNaN(ncRaw) ? 10 : ncRaw;

  const nr = np * nc;
  const { interpretacion: interpretacionNR, aceptabilidad: aceptabilidadRiesgo } =
    calcularInterpretacionNR(nr);

  const criterioNC =
    TABLA_TECNICA_NC[nc as 10 | 25 | 60 | 100] || {
      nc,
      clasificacion: nc >= 60 ? 'Muy Grave / Crítico' : nc >= 25 ? 'Grave' : 'Leve',
      colorBadge: 'bg-slate-700 text-white',
      bgLight: 'bg-slate-900 border-slate-700 text-slate-200',
      borderColor: 'border-slate-600',
      definicionTecnica: 'Nivel de consecuencia ingresado manualmente.',
      criterioIncapacidad: 'Según criterio médico ocupacional.',
      ejemplosOperativos: 'Evaluación manual aprobada por SST.',
    };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizar = (val?: string) =>
      val && val.trim().length > 0 ? val.trim() : 'Sin información registrada';

    const cargoLimpio = formData.cargo?.trim() || formData.cargosExpuestos?.trim() || 'Operario';

    const itemToSave: RiesgoGTC45Item = {
      id: formData.id || `RSK-${Date.now()}`,
      codigo: formData.codigo || `GTC45-${Math.floor(100 + Math.random() * 900)}`,
      proceso: normalizar(formData.proceso),
      zonaLugar: normalizar(formData.zonaLugar),
      actividades: normalizar(formData.actividades),
      tareas: normalizar(formData.tareas),
      cargo: cargoLimpio,
      cargosExpuestos: formData.cargosExpuestos?.trim() || cargoLimpio,
      rutinario: formData.rutinario || 'SÍ',
      peligroDescripcion: normalizar(formData.peligroDescripcion),
      peligroClasificacion: formData.peligroClasificacion || 'Condiciones de Seguridad',
      efectosPosibles: normalizar(formData.efectosPosibles),
      controlesFuente: normalizar(formData.controlesFuente),
      controlesMedio: normalizar(formData.controlesMedio),
      controlesIndividuo: normalizar(formData.controlesIndividuo),
      nivelDeficiencia: nd,
      nivelExposicion: ne,
      nivelProbabilidad: np,
      interpretacionNP,
      nivelConsecuencia: nc,
      nivelRiesgo: nr,
      interpretacionNR,
      aceptabilidadRiesgo,
      numeroExpuestos: Number(formData.numeroExpuestos) || 1,
      peorConsecuencia: normalizar(formData.peorConsecuencia),
      existenciaRequisitoLegal: formData.existenciaRequisitoLegal || 'SÍ',
      requisitoLegalEspecifico: formData.requisitoLegalEspecifico?.trim() || undefined,
      medidaEliminacion: normalizar(formData.medidaEliminacion),
      medidaSustitucion: normalizar(formData.medidaSustitucion),
      medidaControlesIngenieria: normalizar(formData.medidaControlesIngenieria),
      medidaControlesAdministrativos: normalizar(formData.medidaControlesAdministrativos),
      medidaEquiposEPP: normalizar(formData.medidaEquiposEPP),
      observaciones: formData.observaciones?.trim() || undefined,
      fechaEvaluacion: new Date().toISOString().split('T')[0],
    };

    onSave(itemToSave);
  };

  const getBadgeNRColor = (intNR: string) => {
    switch (intNR) {
      case 'I':
        return 'bg-rose-600 text-white border-rose-400';
      case 'II':
        return 'bg-amber-500 text-slate-950 font-bold border-amber-300';
      case 'III':
        return 'bg-yellow-500 text-slate-950 font-bold border-yellow-300';
      default:
        return 'bg-emerald-600 text-white border-emerald-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header con lenguaje claro */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {initialData ? 'Editar Valores del Riesgo' : 'Registrar Nuevo Riesgo'}
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono">
                  {formData.codigo || 'GTC45'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Identificación de peligros y evaluación de riesgos · Metodología GTC 45 explicada de forma sencilla
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section Tabs con nombres claros y amigables */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-950/70 border-b border-slate-800 overflow-x-auto text-xs font-medium">
          {[
            { num: 1, label: '1. Actividad y Puesto' },
            { num: 2, label: '2. Peligro y Daños' },
            { num: 3, label: '3. Medidas Actuales' },
            { num: 4, label: '4. Evaluación del Riesgo' },
            { num: 5, label: '5. Personas y Criterios' },
            { num: 6, label: '6. Acciones a Tomar' },
          ].map((tab) => (
            <button
              key={tab.num}
              type="button"
              onClick={() => setActiveTab(tab.num)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.num
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: IDENTIFICACIÓN DE LA ACTIVIDAD Y PUESTO */}
          {activeTab === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-l-4 border-emerald-500 pl-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Sección 1: Actividad y Puestos de Trabajo
                </h3>
                <p className="text-xs text-slate-400">
                  ¿Dónde se hace la labor, quién la realiza y qué tareas incluye?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Lugar o Zona de Trabajo *
                  </label>
                  <input
                    type="text"
                    required
                    list="areas-list"
                    value={formData.zonaLugar || ''}
                    onChange={(e) => setFormData({ ...formData, zonaLugar: e.target.value })}
                    placeholder="Ej. Área de producción, Almacén de materia prima..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <datalist id="areas-list">
                    {existingAreas.map((a) => (
                      <option key={a} value={a} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Proceso de la Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.proceso || ''}
                    onChange={(e) => setFormData({ ...formData, proceso: e.target.value })}
                    placeholder="Ej. Operativo / Manufactura, Logística, Mantenimiento..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Puesto de Trabajo (Cargo) Principal *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cargo || ''}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    placeholder="Ej. Operario de Fritura y Cocción, Empacador..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Todos los Cargos Expuestos a este Peligro
                  </label>
                  <input
                    type="text"
                    value={formData.cargosExpuestos || ''}
                    onChange={(e) => setFormData({ ...formData, cargosExpuestos: e.target.value })}
                    placeholder="Ej. Operario de Fritura, Auxiliar de Planta, Empacador..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Puedes separar varios cargos por coma si aplica a más de uno.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ¿Es una actividad rutinaria (habitual)? *
                  </label>
                  <select
                    value={formData.rutinario || 'SÍ'}
                    onChange={(e) =>
                      setFormData({ ...formData, rutinario: e.target.value as 'SÍ' | 'NO' })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="SÍ">SÍ — Se realiza todos los días o de forma habitual</option>
                    <option value="NO">NO — Es esporádica, ocasional o de mantenimiento imprevisto</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Actividad General *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.actividades || ''}
                    onChange={(e) => setFormData({ ...formData, actividades: e.target.value })}
                    placeholder="Describa brevemente qué se hace en esa área..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tareas Específicas Realizadas *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.tareas || ''}
                    onChange={(e) => setFormData({ ...formData, tareas: e.target.value })}
                    placeholder="Describa los pasos y acciones concretas del trabajador..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IDENTIFICACIÓN DEL PELIGRO Y DAÑOS */}
          {activeTab === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-l-4 border-blue-500 pl-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Sección 2: Identificación del Peligro y Daños Posibles
                </h3>
                <p className="text-xs text-slate-400">
                  ¿Qué situación o condición puede causar daño y qué consecuencias traería para la salud?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tipo de Peligro (Clasificación GTC 45) *
                  </label>
                  <select
                    value={formData.peligroClasificacion || 'Condiciones de Seguridad'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        peligroClasificacion: e.target.value as TipoClasificacionPeligro,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Físico">Físico (ruido, calor de freidoras, vibraciones, iluminación)</option>
                    <option value="Químico">Químico (gases, vapores, polvos, sustancias de limpieza)</option>
                    <option value="Biológico">Biológico (bacterias, hongos, plagas, roedores, virus)</option>
                    <option value="Biomecánico">Biomecánico (posturas incómodas, levantar peso, movimientos repetitivos)</option>
                    <option value="Psicosocial">Psicosocial (estrés laboral, atención a clientes difíciles, sobrecarga)</option>
                    <option value="Condiciones de Seguridad">Condiciones de Seguridad (máquinas sin resguardo, electricidad, caídas, golpes)</option>
                    <option value="Fenómenos Naturales">Fenómenos Naturales (sismos, terremotos, inundaciones, vendavales)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Descripción del Peligro (¿Qué situación de riesgo existe?) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.peligroDescripcion || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, peligroDescripcion: e.target.value })
                    }
                    placeholder="Ej. Exposición a aceite caliente a 180 °C en freidoras, atrapamiento por piezas móviles sin guarda..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Efectos Posibles en la Salud (¿Qué daño o lesión puede causar?) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.efectosPosibles || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, efectosPosibles: e.target.value })
                    }
                    placeholder="Ej. Quemaduras térmicas de 2.° y 3.° grado en brazos y cara, dolores de espalda, heridas, asfixia..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEDIDAS DE PREVENCIÓN EXISTENTES */}
          {activeTab === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-l-4 border-emerald-500 pl-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Sección 3: Medidas de Prevención que ya Existen (Controles Actuales)
                </h3>
                <p className="text-xs text-slate-400">
                  ¿Qué protecciones tiene la empresa hoy en día en la máquina, en el espacio y en el trabajador?
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Medidas en la Fuente (en la máquina o equipo de origen)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Termostatos, paradas de emergencia, mantenimiento</span>
                  </label>
                  <input
                    type="text"
                    value={formData.controlesFuente || ''}
                    onChange={(e) => setFormData({ ...formData, controlesFuente: e.target.value })}
                    placeholder="Ej. Termostato con corte automático, sensores de sobrecalentamiento (o 'Sin información registrada')"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Medidas en el Medio (en el ambiente o espacio de trabajo)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Extractores de aire, barandas, ventilación, pisos</span>
                  </label>
                  <input
                    type="text"
                    value={formData.controlesMedio || ''}
                    onChange={(e) => setFormData({ ...formData, controlesMedio: e.target.value })}
                    placeholder="Ej. Campana extractora de calor y humos hacia el exterior, pasillos demarcados..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Medidas en la Persona (en el trabajador)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Capacitación, pausas activas, EPP actuales</span>
                  </label>
                  <input
                    type="text"
                    value={formData.controlesIndividuo || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, controlesIndividuo: e.target.value })
                    }
                    placeholder="Ej. Guantes térmicos, careta de protección, curso de manipulación segura de freidoras..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EVALUACIÓN DEL RIESGO (EDICIÓN MANUAL Y CÁLCULOS GTC 45) */}
          {activeTab === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-l-4 border-indigo-500 pl-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Sección 4: Evaluación del Riesgo (Fórmulas Oficiales GTC 45)
                </h3>
                <p className="text-xs text-slate-400">
                  Ingresa o modifica manualmente los valores de evaluación. El sistema recalcula la probabilidad y el riesgo automáticamente.
                </p>
              </div>

              {/* PANEL DE CÁLCULO AUTOMÁTICO (DIFERENCIADO VISUALMENTE) */}
              <div className="p-4 bg-slate-950/90 rounded-xl border border-indigo-500/40 space-y-2 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Calculator className="h-4 w-4 text-indigo-400" />
                    Cálculo Automático GTC 45 (Se actualiza con los valores ingresados)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Fórmulas fijas</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Posibilidad (NP = ND × NE)
                    </span>
                    <span className="text-2xl font-black text-white font-mono">{np}</span>
                    <span className="block text-xs font-semibold text-emerald-400 mt-0.5">
                      {interpretacionNP}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Gravedad (NC)
                    </span>
                    <span className="text-2xl font-black text-white font-mono">{nc}</span>
                    <span className="block text-xs font-semibold text-amber-400 mt-0.5">
                      {criterioNC.clasificacion}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Nivel de Riesgo (NR = NP × NC)
                    </span>
                    <span className="text-2xl font-black text-white font-mono">{nr}</span>
                    <span className="block text-xs font-semibold text-orange-400 mt-0.5">
                      Nivel {interpretacionNR}
                    </span>
                  </div>

                  <div
                    className={`p-2.5 rounded-lg border flex flex-col justify-center ${getBadgeNRColor(
                      interpretacionNR
                    )}`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wide opacity-90">
                      ¿Es Aceptable?
                    </span>
                    <span className="text-xs font-black leading-tight mt-0.5">
                      {aceptabilidadRiesgo}
                    </span>
                  </div>
                </div>
              </div>

              {/* CAMPOS MANUALES DE EVALUACIÓN (TOTALMENTE EDITABLES) */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700/80 space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block">
                  Valores de Entrada Editables (Selecciona o escribe el valor numérico)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* ND */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-200">
                      Nivel de deficiencia (ND - qué tan grave es la deficiencia) *
                    </label>
                    <select
                      value={formData.nivelDeficiencia ?? 6}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nivelDeficiencia: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value={10}>10 — Muy Alto (Peligro grave sin medidas de prevención)</option>
                      <option value={6}>6 — Alto (Peligro significativo con medidas parciales)</option>
                      <option value={2}>2 — Medio (Peligro menor con medidas mejorables)</option>
                      <option value={0}>0 — Sin deficiencia detectada (Medidas preventivas eficaces)</option>
                    </select>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-slate-400">Ingreso manual:</span>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={formData.nivelDeficiencia ?? 6}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nivelDeficiencia: Number(e.target.value),
                          })
                        }
                        className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-white text-center font-mono focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* NE */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-200">
                      Nivel de exposición (NE - cuánto tiempo o con qué frecuencia) *
                    </label>
                    <select
                      value={formData.nivelExposicion ?? 3}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nivelExposicion: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value={4}>4 — Continua (Durante toda la jornada de trabajo)</option>
                      <option value={3}>3 — Frecuente (Varias veces al día por tiempos cortos)</option>
                      <option value={2}>2 — Ocasional (Alguna vez en la jornada por poco tiempo)</option>
                      <option value={1}>1 — Esporádica (De manera eventual o imprevista)</option>
                    </select>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-slate-400">Ingreso manual:</span>
                      <input
                        type="number"
                        min={1}
                        max={4}
                        value={formData.nivelExposicion ?? 3}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nivelExposicion: Number(e.target.value),
                          })
                        }
                        className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-white text-center font-mono focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* NC */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-200">
                      Gravedad de las consecuencias (NC - Nivel de consecuencia) *
                    </label>
                    <select
                      value={formData.nivelConsecuencia ?? 25}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nivelConsecuencia: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value={100}>100 — Mortal o Catastrófico (Invalidez total o muerte)</option>
                      <option value={60}>60 — Muy Grave (Incapacidad &gt;30 días o invalidez parcial)</option>
                      <option value={25}>25 — Grave (Incapacidad temporal de 4 a 30 días)</option>
                      <option value={10}>10 — Leve (Primeros auxilios o incapacidad de 1 a 3 días)</option>
                    </select>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-slate-400">Ingreso manual:</span>
                      <input
                        type="number"
                        min={10}
                        max={100}
                        value={formData.nivelConsecuencia ?? 25}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nivelConsecuencia: Number(e.target.value),
                          })
                        }
                        className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-white text-center font-mono focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Technical Explanation Card for Selected NC */}
              <div className={`p-4 rounded-xl border ${criterioNC.bgLight}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${criterioNC.colorBadge}`}>
                    NC = {criterioNC.nc} · {criterioNC.clasificacion}
                  </span>
                  <span className="text-xs font-semibold">Explicación sencilla de la consecuencia</span>
                </div>
                <p className="text-xs leading-relaxed mb-2">
                  <strong>¿Qué significa?:</strong> {criterioNC.definicionTecnica}
                </p>
                <p className="text-xs leading-relaxed mb-1">
                  <strong>Tiempo de incapacidad estimado:</strong> {criterioNC.criterioIncapacidad}
                </p>
                <p className="text-[11px] opacity-80 italic">
                  <strong>Ejemplos en la vida real:</strong> {criterioNC.ejemplosOperativos}
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: CRITERIOS PARA DEFINIR CONTROLES */}
          {activeTab === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-l-4 border-slate-500 pl-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Sección 5: Personas Expuestas y Criterios de Control
                </h3>
                <p className="text-xs text-slate-400">
                  ¿Cuántas personas están en riesgo, qué es lo peor que podría pasar y qué norma aplica?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Número de personas expuestas al peligro *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.numeroExpuestos ?? 1}
                    onChange={(e) =>
                      setFormData({ ...formData, numeroExpuestos: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Cantidad de trabajadores que desempeñan esta labor
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ¿Existe una norma o requisito legal obligatorio? *
                  </label>
                  <select
                    value={formData.existenciaRequisitoLegal || 'SÍ'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        existenciaRequisitoLegal: e.target.value as 'SÍ' | 'NO',
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="SÍ">SÍ — Existe norma obligatoria en Colombia</option>
                    <option value="NO">NO — Es una medida recomendada sin norma específica</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Consecuencia más grave que podría ocurrir (Peor consecuencia) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.peorConsecuencia || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, peorConsecuencia: e.target.value })
                    }
                    placeholder="Ej. Quemaduras de 2.° y 3.° grado en rostro con hospitalización prolongada, muerte por electrocución..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Norma o Requisito Legal Específico Aplicable
                  </label>
                  <input
                    type="text"
                    value={formData.requisitoLegalEspecifico || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, requisitoLegalEspecifico: e.target.value })
                    }
                    placeholder="Ej. Resolución 2400 de 1979 (Arts. 63-69), Decreto 1072 de 2015, Resolución 773 de 2021..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ACCIONES PARA PREVENIR O REDUCIR EL RIESGO (JERARQUÍA DE INTERVENCIÓN) */}
          {activeTab === 6 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-l-4 border-teal-500 pl-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Sección 6: Acciones para Prevenir o Reducir el Riesgo (Jerarquía de Controles)
                </h3>
                <p className="text-xs text-slate-400">
                  Plan de acción ordenado de la medida más efectiva (eliminar el peligro) a la protección del trabajador (EPP).
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>1. Eliminación (suprimir el peligro por completo)</span>
                    <span className="text-[10px] text-rose-400 font-bold">Máxima efectividad</span>
                  </label>
                  <input
                    type="text"
                    value={formData.medidaEliminacion || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, medidaEliminacion: e.target.value })
                    }
                    placeholder="Ej. Suprimir el proceso peligroso o 'Sin información registrada' si no es técnicamente viable..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>2. Sustitución (cambiar por algo menos peligroso)</span>
                    <span className="text-[10px] text-amber-400 font-bold">Muy alta efectividad</span>
                  </label>
                  <input
                    type="text"
                    value={formData.medidaSustitucion || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, medidaSustitucion: e.target.value })
                    }
                    placeholder="Ej. Reemplazar sustancias corrosivas por desengrasantes biodegradables neutros..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>3. Controles de ingeniería (protecciones físicas, aislamientos y resguardos)</span>
                    <span className="text-[10px] text-cyan-400 font-bold">Alta efectividad</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.medidaControlesIngenieria || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, medidaControlesIngenieria: e.target.value })
                    }
                    placeholder="Ej. Instalar barreras transparentes antichispas, paradas de emergencia tipo hongo, alarmas acústicas..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>4. Reglas, procedimientos y señalización (controles administrativos)</span>
                    <span className="text-[10px] text-blue-400 font-bold">Medida de organización</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.medidaControlesAdministrativos || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        medidaControlesAdministrativos: e.target.value,
                      })
                    }
                    placeholder="Ej. Procedimiento seguro de freído POES, rotación cada 2 horas, pausas activas, avisos de advertencia..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>5. Elementos de protección personal (EPP - barrera física individual)</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Barrera personal</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.medidaEquiposEPP || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, medidaEquiposEPP: e.target.value })
                    }
                    placeholder="Ej. Careta facial con policarbonato ANSI Z87.1, guantes de nitrilo térmico de 45 cm, peto impermeable..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Navigation & Save */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeTab > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab - 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium cursor-pointer"
                >
                  Anterior
                </button>
              )}
              {activeTab < 6 && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab + 1)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/40 text-xs font-medium cursor-pointer"
                >
                  Siguiente Sección
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
