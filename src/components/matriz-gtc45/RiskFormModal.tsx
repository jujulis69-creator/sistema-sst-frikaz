import React, { useState, useEffect, useMemo } from 'react';
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
    rutinario: 'SÍ',
    peligroDescripcion: '',
    peligroClasificacion: 'Físico',
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

  // Sync when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        id: `RSK-CUSTOM-${Date.now().toString().slice(-4)}`,
        codigo: `GTC45-${Math.floor(100 + Math.random() * 900)}`,
        proceso: 'Operativo',
        zonaLugar: existingAreas[0] || 'Área de producción',
        actividades: '',
        tareas: '',
        cargo: 'Operario',
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

  // Live Calculations according to GTC 45
  const nd = (formData.nivelDeficiencia as 2 | 6 | 10) || 2;
  const ne = (formData.nivelExposicion as 1 | 2 | 3 | 4) || 1;
  const np = nd * ne;
  const interpretacionNP = calcularInterpretacionNP(np);

  const nc = (formData.nivelConsecuencia as 10 | 25 | 60 | 100) || 10;
  const nr = np * nc;
  const { interpretacion: interpretacionNR, aceptabilidad: aceptabilidadRiesgo } =
    calcularInterpretacionNR(nr);

  const criterioNC = TABLA_TECNICA_NC[nc];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizar = (val?: string) =>
      val && val.trim().length > 0 ? val.trim() : 'Sin información registrada';

    const itemToSave: RiesgoGTC45Item = {
      id: formData.id || `RSK-${Date.now()}`,
      codigo: formData.codigo || `GTC45-${Math.floor(100 + Math.random() * 900)}`,
      proceso: normalizar(formData.proceso),
      zonaLugar: normalizar(formData.zonaLugar),
      actividades: normalizar(formData.actividades),
      tareas: normalizar(formData.tareas),
      cargo: formData.cargo?.trim() || undefined,
      cargosExpuestos: formData.cargosExpuestos?.trim() || formData.cargo?.trim() || undefined,
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {initialData ? 'Editar Peligro GTC 45' : 'Nuevo Peligro / Registro GTC 45'}
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono">
                  {formData.codigo || 'GTC45'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Guía Técnica Colombiana GTC 45 (Segunda Actualización) · 6 Secciones Oficiales
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

        {/* Section Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-950/70 border-b border-slate-800 overflow-x-auto text-xs font-medium">
          {[
            { num: 1, label: '1. Actividad' },
            { num: 2, label: '2. Peligro' },
            { num: 3, label: '3. Controles' },
            { num: 4, label: '4. Evaluación GTC 45' },
            { num: 5, label: '5. Criterios' },
            { num: 6, label: '6. Intervención' },
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
          {/* TAB 1: IDENTIFICACIÓN DE LA ACTIVIDAD */}
          {activeTab === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-l-4 border-emerald-500 pl-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Sección 1: Identificación de la Actividad y Tareas
                </h3>
                <p className="text-xs text-slate-400">
                  Ubicación física, contexto operativo y frecuencia de ejecución.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Zona / Lugar de Trabajo *
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
                    Proceso *
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
                    Cargo / Puesto Asociado
                  </label>
                  <input
                    type="text"
                    value={formData.cargo || ''}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    placeholder="Ej. Operario de freidora, Empacador, Almacenista..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ¿Actividad Rutinaria? *
                  </label>
                  <select
                    value={formData.rutinario || 'SÍ'}
                    onChange={(e) =>
                      setFormData({ ...formData, rutinario: e.target.value as 'SÍ' | 'NO' })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="SÍ">SÍ (Habitual en las operaciones diarias)</option>
                    <option value="NO">NO (Esporádica, mantenimiento o imprevisto)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Actividades *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.actividades || ''}
                    onChange={(e) => setFormData({ ...formData, actividades: e.target.value })}
                    placeholder="Describa la actividad general realizada en la zona..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tareas Específicas *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.tareas || ''}
                    onChange={(e) => setFormData({ ...formData, tareas: e.target.value })}
                    placeholder="Describa los pasos y tareas técnicas que componen la actividad..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IDENTIFICACIÓN DEL PELIGRO */}
          {activeTab === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-l-4 border-blue-500 pl-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Sección 2: Identificación del Peligro y Efectos
                </h3>
                <p className="text-xs text-slate-400">
                  Definición del factor de riesgo y consecuencias posibles sobre la salud.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Clasificación del Peligro (GTC 45) *
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
                    <option value="Físico">Físico (Ruido, calor, vibración, iluminación...)</option>
                    <option value="Químico">Químico (Gases, vapores, polvos orgánicos/inorgánicos...)</option>
                    <option value="Biológico">Biológico (Virus, bacterias, hongos, parásitos, picaduras...)</option>
                    <option value="Biomecánico">Biomecánico (Posturas forzadas, sobreesfuerzo, levantamiento...)</option>
                    <option value="Psicosocial">Psicosocial (Carga mental, jornada laboral, estrés...)</option>
                    <option value="Condiciones de Seguridad">Condiciones de Seguridad (Mecánico, eléctrico, locativo, alturas...)</option>
                    <option value="Fenómenos Naturales">Fenómenos Naturales (Sismo, terremoto, inundación, vendaval...)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Descripción del Peligro *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.peligroDescripcion || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, peligroDescripcion: e.target.value })
                    }
                    placeholder="Ej. Atrapamiento por partes móviles de máquina empaquetadora, exposición a temperaturas de 180°C..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Efectos Posibles en la Salud *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.efectosPosibles || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, efectosPosibles: e.target.value })
                    }
                    placeholder="Ej. Quemaduras de 2.° y 3.° grado, heridas lacerantes, amputación, hipoacusia, lumbalgia..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTROLES EXISTENTES */}
          {activeTab === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-l-4 border-emerald-500 pl-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Sección 3: Controles Existentes
                </h3>
                <p className="text-xs text-slate-400">
                  Medidas actualmente implementadas en la fuente, el medio de propagación y el trabajador.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Control en la Fuente
                  </label>
                  <input
                    type="text"
                    value={formData.controlesFuente || ''}
                    onChange={(e) => setFormData({ ...formData, controlesFuente: e.target.value })}
                    placeholder="Ej. Mantenimiento preventivo, sensores de parada automática, aislamiento térmico (o 'Sin información registrada')"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Control en el Medio
                  </label>
                  <input
                    type="text"
                    value={formData.controlesMedio || ''}
                    onChange={(e) => setFormData({ ...formData, controlesMedio: e.target.value })}
                    placeholder="Ej. Campanas de extracción de calor, barandas perimetrales, ventilación forzada..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Control en el Individuo
                  </label>
                  <input
                    type="text"
                    value={formData.controlesIndividuo || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, controlesIndividuo: e.target.value })
                    }
                    placeholder="Ej. Uso de EPP específicos, capacitación técnica, pausas activas, protocolos POES..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EVALUACIÓN DEL RIESGO (GTC 45) */}
          {activeTab === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-l-4 border-indigo-500 pl-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Sección 4: Evaluación y Valoración del Riesgo (Fórmulas GTC 45)
                </h3>
                <p className="text-xs text-slate-400">
                  Cálculo automático de NP (ND × NE) y NR (NP × NC) según tablas estándar GTC 45.
                </p>
              </div>

              {/* Live Evaluation Dashboard */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">NP (ND × NE)</span>
                  <span className="text-xl font-black text-white font-mono">{np}</span>
                  <span className="block text-[11px] font-semibold text-emerald-400 mt-0.5">
                    {interpretacionNP}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">NC (Consecuencia)</span>
                  <span className="text-xl font-black text-white font-mono">{nc}</span>
                  <span className="block text-[11px] font-semibold text-amber-400 mt-0.5">
                    {criterioNC.clasificacion}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">NR = NP × NC</span>
                  <span className="text-xl font-black text-white font-mono">{nr}</span>
                  <span className="block text-[11px] font-semibold text-orange-400 mt-0.5">
                    Nivel {interpretacionNR}
                  </span>
                </div>

                <div className={`p-2.5 rounded-lg border flex flex-col justify-center ${getBadgeNRColor(interpretacionNR)}`}>
                  <span className="text-[10px] uppercase font-bold tracking-wide opacity-90">Aceptabilidad</span>
                  <span className="text-xs font-black leading-tight mt-0.5">
                    {aceptabilidadRiesgo}
                  </span>
                </div>
              </div>

              {/* Selectors for ND, NE, NC */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nivel de Deficiencia (ND) *
                  </label>
                  <select
                    value={formData.nivelDeficiencia || 6}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nivelDeficiencia: Number(e.target.value) as 2 | 6 | 10,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value={10}>10 - Muy Alto (Peligros graves sin control)</option>
                    <option value={6}>6 - Alto (Peligros significativos / controles parciales)</option>
                    <option value={2}>2 - Medio (Peligros poco significativos)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nivel de Exposición (NE) *
                  </label>
                  <select
                    value={formData.nivelExposicion || 3}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nivelExposicion: Number(e.target.value) as 1 | 2 | 3 | 4,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value={4}>4 - Continua (Sin interrupción toda la jornada)</option>
                    <option value={3}>3 - Frecuente (Varias veces durante la jornada)</option>
                    <option value={2}>2 - Ocasional (Alguna vez por corto tiempo)</option>
                    <option value={1}>1 - Esporádica (De manera eventual)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nivel de Consecuencia (NC) *
                  </label>
                  <select
                    value={formData.nivelConsecuencia || 25}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nivelConsecuencia: Number(e.target.value) as 10 | 25 | 60 | 100,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value={10}>10 - Leve (Primeros auxilios / 1 a 3 días)</option>
                    <option value={25}>25 - Grave (Incapacidad temporal 4 a 30 días)</option>
                    <option value={60}>60 - Muy Grave (Incapacidad &gt;30 días / Invalidez parcial)</option>
                    <option value={100}>100 - Mortal / Catastrófico (Invalidez permanente / Muerte)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Technical Explanation Card for Selected NC */}
              <div className={`p-4 rounded-xl border ${criterioNC.bgLight}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${criterioNC.colorBadge}`}>
                    NC = {criterioNC.nc} · {criterioNC.clasificacion}
                  </span>
                  <span className="text-xs font-semibold">Criterio Técnico GTC 45</span>
                </div>
                <p className="text-xs leading-relaxed mb-2">
                  <strong>Definición:</strong> {criterioNC.definicionTecnica}
                </p>
                <p className="text-xs leading-relaxed mb-1">
                  <strong>Incapacidad:</strong> {criterioNC.criterioIncapacidad}
                </p>
                <p className="text-[11px] opacity-80 italic">
                  <strong>Ejemplos:</strong> {criterioNC.ejemplosOperativos}
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: CRITERIOS PARA ESTABLECER CONTROLES */}
          {activeTab === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-l-4 border-slate-500 pl-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Sección 5: Criterios para Establecer Controles
                </h3>
                <p className="text-xs text-slate-400">
                  Alcance humano, severidad máxima y fundamento legal en Colombia.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    N° de Trabajadores Expuestos *
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
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ¿Existe Requisito Legal Específico? *
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
                    <option value="SÍ">SÍ</option>
                    <option value="NO">NO</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Peor Consecuencia Posible *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.peorConsecuencia || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, peorConsecuencia: e.target.value })
                    }
                    placeholder="Ej. Muerte por atrapamiento, quemaduras graves en miembros superiores, amputación..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Norma o Requisito Legal Específico Asociado
                  </label>
                  <input
                    type="text"
                    value={formData.requisitoLegalEspecifico || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, requisitoLegalEspecifico: e.target.value })
                    }
                    placeholder="Ej. Resolución 2400 de 1979 (Arts. 63-69), Decreto 1072 de 2015, Res. 4272 de 2021..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MEDIDAS DE INTERVENCIÓN (JERARQUÍA GTC 45) */}
          {activeTab === 6 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-l-4 border-teal-500 pl-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Sección 6: Medidas de Intervención (Jerarquía de Controles)
                </h3>
                <p className="text-xs text-slate-400">
                  Plan de acción formulado siguiendo el orden de efectividad técnica.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>1. Eliminación</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Mayor efectividad (Eliminar el peligro físico)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.medidaEliminacion || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, medidaEliminacion: e.target.value })
                    }
                    placeholder="Ej. No viable técnicamente / Modificación del proceso para suprimir el peligro..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>2. Sustitución</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Reemplazar por materiales o métodos menos peligrosos
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.medidaSustitucion || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, medidaSustitucion: e.target.value })
                    }
                    placeholder="Ej. Reemplazar sustancias tóxicas por productos biodegradables, sustituir herramienta manual..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>3. Controles de Ingeniería</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Aislamiento, resguardos, sensores y extractores
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.medidaControlesIngenieria || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, medidaControlesIngenieria: e.target.value })
                    }
                    placeholder="Ej. Instalación de guardas transparentes de policarbonato, botón de parada de emergencia, extractor..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>4. Controles Administrativos y Señalización</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Procedimientos seguros, rotación y capacitación
                    </span>
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
                    placeholder="Ej. POES de operación segura, rotación de personal cada 2 horas, pausas activas, señalización de advertencia..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>5. Equipos y Elementos de Protección Personal (EPP)</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Barrera física sobre el trabajador
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.medidaEquiposEPP || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, medidaEquiposEPP: e.target.value })
                    }
                    placeholder="Ej. Careta facial con policarbonato de alta resistencia ANSI Z87.1, guantes de nitrilo térmico 45 cm..."
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
                <span>Guardar Registro GTC 45</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
