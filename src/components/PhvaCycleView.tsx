import React, { useState, useEffect } from 'react';
import {
  PhvaRegistro,
  Obligacion,
  Norm,
  FasePlanear,
  FaseHacer,
  FaseVerificar,
  FaseActuar,
  ResultadoVerificacion,
} from '../types';
import {
  CheckCircle2,
  Clock,
  Save,
  AlertCircle,
  FileCheck,
  TrendingUp,
  RefreshCw,
  Plus,
  Shield,
  Leaf,
} from 'lucide-react';

interface PhvaCycleViewProps {
  phvaList: PhvaRegistro[];
  obligaciones: Obligacion[];
  norms: Norm[];
  onSavePhvaRegistro: (registro: PhvaRegistro) => void;
  selectedObligacionId?: string | null;
}

export const PhvaCycleView: React.FC<PhvaCycleViewProps> = ({
  phvaList,
  obligaciones,
  norms,
  onSavePhvaRegistro,
  selectedObligacionId,
}) => {
  const [activePhvaId, setActivePhvaId] = useState<string>('');
  const [activeStage, setActiveStage] = useState<'planear' | 'hacer' | 'verificar' | 'actuar'>('planear');
  const [currentEdit, setCurrentEdit] = useState<PhvaRegistro | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const normMap = new Map<string, Norm>();
  norms.forEach((n) => normMap.set(n.id, n));

  const obligMap = new Map<string, Obligacion>();
  obligaciones.forEach((o) => obligMap.set(o.id, o));

  // Initialize or handle preselection
  useEffect(() => {
    if (selectedObligacionId) {
      const match = phvaList.find((p) => p.obligacionId === selectedObligacionId);
      if (match) {
        setActivePhvaId(match.id);
        setCurrentEdit({ ...match });
        return;
      }
    }

    if (phvaList.length > 0) {
      if (!activePhvaId || !phvaList.some((p) => p.id === activePhvaId)) {
        setActivePhvaId(phvaList[0].id);
        setCurrentEdit({ ...phvaList[0] });
      } else {
        const found = phvaList.find((p) => p.id === activePhvaId);
        if (found) setCurrentEdit({ ...found });
      }
    }
  }, [phvaList, selectedObligacionId]);

  const handleSelectPhva = (id: string) => {
    setActivePhvaId(id);
    const target = phvaList.find((p) => p.id === id);
    if (target) {
      setCurrentEdit({ ...target });
      setSaveMessage(null);
    }
  };

  const handleCreateNewPhvaForObligacion = () => {
    // Find obligations that don't have a PHVA entry yet
    const existingObligIds = new Set(phvaList.map((p) => p.obligacionId));
    const unmappedObligs = obligaciones.filter((o) => !existingObligIds.has(o.id));

    const targetOblig = unmappedObligs[0] || obligaciones[0];
    if (!targetOblig) {
      alert('Debe crear al menos una obligación en el sistema.');
      return;
    }

    const norm = normMap.get(targetOblig.normaId);

    const newRegistro: PhvaRegistro = {
      id: `phva-${Date.now()}`,
      obligacionId: targetOblig.id,
      normaId: targetOblig.normaId,
      tituloActividad: `Ciclo PHVA para: ${targetOblig.actividadNecesaria.slice(0, 60)}...`,
      planear: {
        descripcion: `Planificación para cumplimiento de ${targetOblig.codigo} (${targetOblig.articuloNumeral}).`,
        objetivo: `Asegurar el cumplimiento legal de ${targetOblig.descripcionObligacion.slice(0, 80)}.`,
        requisitoLegal: `${norm?.tipoDisposicion || ''} ${norm?.numero || ''} - ${targetOblig.articuloNumeral}`,
        actividadesPlanificacion: `Definir cronograma, responsables y recursos operativos para: ${targetOblig.actividadNecesaria}.`,
        recursos: targetOblig.recursosNecesarios || 'Horas operativas y dotación básica.',
        responsable: targetOblig.responsable,
        fechaProgramada: targetOblig.fechaLimite || new Date().toISOString().split('T')[0],
        indicadorEsperado: targetOblig.indicadorCumplimiento || '100% de cumplimiento.',
        completado: true,
      },
      hacer: {
        descripcion: `Ejecución de actividades operativas en planta para ${targetOblig.codigo}.`,
        actividadesEjecutadas: targetOblig.actividadNecesaria,
        procedimientosAplicados: 'Instructivo estándar de planta Frikaz S.A.S.',
        recursosUtilizados: targetOblig.recursosNecesarios,
        responsable: targetOblig.responsable,
        fechaEjecucion: new Date().toISOString().split('T')[0],
        evidenciasObtenidas: targetOblig.evidenciaRequerida,
        completado: false,
      },
      verificar: {
        descripcion: 'Verificación documental y en sitio del cumplimiento.',
        criteriosEvaluacion: 'Suficiencia y validez legal de la evidencia aportada.',
        metodoVerificacion: 'Inspección física y revisión documental de soportes.',
        revisionEvidencias: 'Pendiente de contraste con el requisito legal.',
        resultado: 'Pendiente',
        hallazgos: '',
        fechaRevision: new Date().toISOString().split('T')[0],
        responsableVerificacion: 'Líder SST / Auditor Interno',
        completado: false,
      },
      actuar: {
        descripcion: 'Implementación de acciones correctivas o de mejora continua.',
        incumplimientoIdentificado: '',
        accionCorrectivaMejora: 'Continuar con el mantenimiento del control operacional.',
        responsable: targetOblig.responsable,
        fechaLimite: targetOblig.fechaLimite,
        estadoAccion: 'No requerida',
        evidenciaEjecucion: '',
        verificacionEficacia: 'Pendiente',
        fechaCierre: '',
        completado: false,
      },
      fechaActualizacion: new Date().toISOString().split('T')[0],
    };

    onSavePhvaRegistro(newRegistro);
    setActivePhvaId(newRegistro.id);
    setCurrentEdit(newRegistro);
    setSaveMessage('Nuevo ciclo PHVA iniciado.');
  };

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEdit) return;

    const updated: PhvaRegistro = {
      ...currentEdit,
      fechaActualizacion: new Date().toISOString().split('T')[0],
    };

    onSavePhvaRegistro(updated);
    setSaveMessage('Registro PHVA guardado correctamente en la base de datos.');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const currentOblig = currentEdit ? obligMap.get(currentEdit.obligacionId) : null;
  const currentNorm = currentEdit ? normMap.get(currentEdit.normaId) : null;

  return (
    <div className="space-y-4">
      {/* Top Banner and Activity Selector */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Seleccione la Obligación / Actividad para Gestionar el Ciclo PHVA
            </label>
            <div className="flex items-center gap-2">
              <select
                value={activePhvaId}
                onChange={(e) => handleSelectPhva(e.target.value)}
                className="w-full md:w-96 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-hidden bg-white"
              >
                {phvaList.map((p) => {
                  const ob = obligMap.get(p.obligacionId);
                  return (
                    <option key={p.id} value={p.id}>
                      {ob?.codigo || 'OBL'} — {p.tituloActividad}
                    </option>
                  );
                })}
              </select>
              <button
                type="button"
                onClick={handleCreateNewPhvaForObligacion}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Nuevo Ciclo PHVA</span>
              </button>
            </div>
          </div>

          {currentEdit && (
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Progreso PHVA:</span>
                <span className="font-mono text-xs font-bold text-slate-900">
                  {[
                    currentEdit.planear.completado,
                    currentEdit.hacer.completado,
                    currentEdit.verificar.completado,
                    currentEdit.actuar.completado,
                  ].filter(Boolean).length}{' '}
                  de 4 Fases
                </span>
              </div>
              <div className="flex gap-1">
                <span
                  className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    currentEdit.planear.completado ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  P
                </span>
                <span
                  className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    currentEdit.hacer.completado ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  H
                </span>
                <span
                  className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    currentEdit.verificar.completado ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  V
                </span>
                <span
                  className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    currentEdit.actuar.completado ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  A
                </span>
              </div>
            </div>
          )}
        </div>

        {currentOblig && currentNorm && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            <span>
              <strong className="text-slate-800">Norma:</strong> {currentNorm.tipoDisposicion}{' '}
              {currentNorm.numero} de {currentNorm.anio} ({currentNorm.area})
            </span>
            <span>·</span>
            <span>
              <strong className="text-slate-800">Artículo:</strong> {currentOblig.articuloNumeral}
            </span>
            <span>·</span>
            <span>
              <strong className="text-slate-800">Responsable:</strong> {currentOblig.responsable}
            </span>
          </div>
        )}
      </div>

      {currentEdit ? (
        <form onSubmit={handleSaveCurrent} className="space-y-4">
          {/* Phase Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* P */}
            <button
              type="button"
              onClick={() => setActiveStage('planear')}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                activeStage === 'planear'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-blue-700">
                  Fase P
                </span>
                <span className="text-sm font-bold">PLANEAR</span>
              </div>
              <input
                type="checkbox"
                checked={currentEdit.planear.completado}
                onChange={(e) => {
                  e.stopPropagation();
                  setCurrentEdit({
                    ...currentEdit,
                    planear: { ...currentEdit.planear, completado: e.target.checked },
                  });
                }}
                className="h-4 w-4 rounded-sm text-blue-600 focus:ring-blue-500"
                title="Marcar fase Planear como completada"
              />
            </button>

            {/* H */}
            <button
              type="button"
              onClick={() => setActiveStage('hacer')}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                activeStage === 'hacer'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-700">
                  Fase H
                </span>
                <span className="text-sm font-bold">HACER</span>
              </div>
              <input
                type="checkbox"
                checked={currentEdit.hacer.completado}
                onChange={(e) => {
                  e.stopPropagation();
                  setCurrentEdit({
                    ...currentEdit,
                    hacer: { ...currentEdit.hacer, completado: e.target.checked },
                  });
                }}
                className="h-4 w-4 rounded-sm text-emerald-600 focus:ring-emerald-500"
                title="Marcar fase Hacer como completada"
              />
            </button>

            {/* V */}
            <button
              type="button"
              onClick={() => setActiveStage('verificar')}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                activeStage === 'verificar'
                  ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-700">
                  Fase V
                </span>
                <span className="text-sm font-bold">VERIFICAR</span>
              </div>
              <input
                type="checkbox"
                checked={currentEdit.verificar.completado}
                onChange={(e) => {
                  e.stopPropagation();
                  setCurrentEdit({
                    ...currentEdit,
                    verificar: { ...currentEdit.verificar, completado: e.target.checked },
                  });
                }}
                className="h-4 w-4 rounded-sm text-amber-500 focus:ring-amber-500"
                title="Marcar fase Verificar como completada"
              />
            </button>

            {/* A */}
            <button
              type="button"
              onClick={() => setActiveStage('actuar')}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                activeStage === 'actuar'
                  ? 'border-emerald-800 bg-emerald-50 text-emerald-950 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-800">
                  Fase A
                </span>
                <span className="text-sm font-bold">ACTUAR</span>
              </div>
              <input
                type="checkbox"
                checked={currentEdit.actuar.completado}
                onChange={(e) => {
                  e.stopPropagation();
                  setCurrentEdit({
                    ...currentEdit,
                    actuar: { ...currentEdit.actuar, completado: e.target.checked },
                  });
                }}
                className="h-4 w-4 rounded-sm text-emerald-800 focus:ring-emerald-700"
                title="Marcar fase Actuar como completada"
              />
            </button>
          </div>

          {/* Tab Content Cards */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs text-xs space-y-4">
            {activeStage === 'planear' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-bold text-blue-900">
                    P — PLANEAR: Definición de Objetivos, Requisitos y Programación
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Establecer las metas y actividades preventivas para dar cumplimiento legal.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Objetivo de la Fase Planear
                    </label>
                    <textarea
                      rows={2}
                      value={currentEdit.planear.objetivo}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          planear: { ...currentEdit.planear, objetivo: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 p-2 focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Requisito Legal Relacionado
                    </label>
                    <textarea
                      rows={2}
                      value={currentEdit.planear.requisitoLegal}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          planear: { ...currentEdit.planear, requisitoLegal: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 p-2 focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Actividades de Planificación
                  </label>
                  <textarea
                    rows={2}
                    value={currentEdit.planear.actividadesPlanificacion}
                    onChange={(e) =>
                      setCurrentEdit({
                        ...currentEdit,
                        planear: { ...currentEdit.planear, actividadesPlanificacion: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-slate-300 p-2 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Responsable de Planear
                    </label>
                    <input
                      type="text"
                      value={currentEdit.planear.responsable}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          planear: { ...currentEdit.planear, responsable: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Fecha Programada
                    </label>
                    <input
                      type="date"
                      value={currentEdit.planear.fechaProgramada}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          planear: { ...currentEdit.planear, fechaProgramada: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Indicador Esperado
                    </label>
                    <input
                      type="text"
                      value={currentEdit.planear.indicadorEsperado}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          planear: { ...currentEdit.planear, indicadorEsperado: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeStage === 'hacer' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-bold text-emerald-900">
                    H — HACER: Ejecución, Procedimientos Operativos y Evidencias
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Implementación de las medidas en la planta de fritos y recopilación de evidencias.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Actividades Ejecutadas en Planta
                  </label>
                  <textarea
                    rows={2}
                    value={currentEdit.hacer.actividadesEjecutadas}
                    onChange={(e) =>
                      setCurrentEdit({
                        ...currentEdit,
                        hacer: { ...currentEdit.hacer, actividadesEjecutadas: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Procedimientos Aplicados
                    </label>
                    <input
                      type="text"
                      value={currentEdit.hacer.procedimientosAplicados}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          hacer: { ...currentEdit.hacer, procedimientosAplicados: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Recursos Utilizados
                    </label>
                    <input
                      type="text"
                      value={currentEdit.hacer.recursosUtilizados}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          hacer: { ...currentEdit.hacer, recursosUtilizados: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Responsable de Ejecución
                    </label>
                    <input
                      type="text"
                      value={currentEdit.hacer.responsable}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          hacer: { ...currentEdit.hacer, responsable: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Fecha de Ejecución Real
                    </label>
                    <input
                      type="date"
                      value={currentEdit.hacer.fechaEjecucion}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          hacer: { ...currentEdit.hacer, fechaEjecucion: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Evidencias Obtenidas
                  </label>
                  <input
                    type="text"
                    value={currentEdit.hacer.evidenciasObtenidas}
                    onChange={(e) =>
                      setCurrentEdit({
                        ...currentEdit,
                        hacer: { ...currentEdit.hacer, evidenciasObtenidas: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                    placeholder="Certificados, listas de asistencia firmadas, bitácora..."
                  />
                </div>
              </div>
            )}

            {activeStage === 'verificar' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-bold text-amber-900">
                    V — VERIFICAR: Evaluación, Auditoría y Dictamen de Conformidad
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Inspección metódica para asegurar que la evidencia es legalmente suficiente.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Método de Verificación
                    </label>
                    <input
                      type="text"
                      value={currentEdit.verificar.metodoVerificacion}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          verificar: { ...currentEdit.verificar, metodoVerificacion: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-amber-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Resultado de Verificación *
                    </label>
                    <select
                      value={currentEdit.verificar.resultado}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          verificar: {
                            ...currentEdit.verificar,
                            resultado: e.target.value as ResultadoVerificacion,
                          },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-amber-600 focus:outline-hidden"
                    >
                      <option value="Conforme">Conforme (Cumplimiento verificado)</option>
                      <option value="No Conforme">No Conforme (Requiere Acción Correctiva)</option>
                      <option value="Conforme con observaciones">Conforme con observaciones</option>
                      <option value="Pendiente">Pendiente de auditoría</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hallazgos de la Verificación
                  </label>
                  <textarea
                    rows={2}
                    value={currentEdit.verificar.hallazgos}
                    onChange={(e) =>
                      setCurrentEdit({
                        ...currentEdit,
                        verificar: { ...currentEdit.verificar, hallazgos: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-slate-300 p-2 focus:border-amber-600 focus:outline-hidden"
                    placeholder="Describa si se detectó alguna no conformidad o cumplimiento cabal..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Responsable de Verificación
                    </label>
                    <input
                      type="text"
                      value={currentEdit.verificar.responsableVerificacion}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          verificar: { ...currentEdit.verificar, responsableVerificacion: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-amber-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Fecha de Revisión
                    </label>
                    <input
                      type="date"
                      value={currentEdit.verificar.fechaRevision}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          verificar: { ...currentEdit.verificar, fechaRevision: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-amber-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeStage === 'actuar' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-bold text-emerald-950">
                    A — ACTUAR: Planes de Mejora y Cierre Eficaz de Brechas
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Definición de acciones para cerrar hallazgos o mejorar el desempeño normativo.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Incumplimiento o Brecha Identificada
                  </label>
                  <input
                    type="text"
                    value={currentEdit.actuar.incumplimientoIdentificado}
                    onChange={(e) =>
                      setCurrentEdit({
                        ...currentEdit,
                        actuar: { ...currentEdit.actuar, incumplimientoIdentificado: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-800 focus:outline-hidden"
                    placeholder="Describa la desviación legal encontrada si aplica..."
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Acción Correctiva o de Mejora Propuesta
                  </label>
                  <textarea
                    rows={2}
                    value={currentEdit.actuar.accionCorrectivaMejora}
                    onChange={(e) =>
                      setCurrentEdit({
                        ...currentEdit,
                        actuar: { ...currentEdit.actuar, accionCorrectivaMejora: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-800 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Estado de la Acción
                    </label>
                    <select
                      value={currentEdit.actuar.estadoAccion}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          actuar: { ...currentEdit.actuar, estadoAccion: e.target.value as any },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-800 focus:outline-hidden"
                    >
                      <option value="No requerida">No requerida (Conforme)</option>
                      <option value="Abierta">Abierta</option>
                      <option value="En ejecución">En ejecución</option>
                      <option value="Verificada y cerrada">Verificada y cerrada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Verificación de Eficacia
                    </label>
                    <input
                      type="text"
                      value={currentEdit.actuar.verificacionEficacia}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          actuar: { ...currentEdit.actuar, verificacionEficacia: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-800 focus:outline-hidden"
                      placeholder="Resultado del seguimiento..."
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Fecha de Cierre Formal
                    </label>
                    <input
                      type="date"
                      value={currentEdit.actuar.fechaCierre}
                      onChange={(e) =>
                        setCurrentEdit({
                          ...currentEdit,
                          actuar: { ...currentEdit.actuar, fechaCierre: e.target.value },
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-800 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="text-xs">
                {saveMessage && (
                  <span className="font-semibold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    {saveMessage}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 font-semibold text-white shadow-xs hover:bg-emerald-900 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Guardar Ciclo PHVA</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          No hay registros PHVA disponibles. Haga clic en "+ Nuevo Ciclo PHVA" para comenzar.
        </div>
      )}
    </div>
  );
};
