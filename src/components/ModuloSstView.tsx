import React, { useState } from 'react';
import { PeligroSST, EmpresaFrikazConfig, Norm, Obligacion } from '../types';
import {
  ShieldCheck,
  Flame,
  Scissors,
  Footprints,
  FileCheck2,
  AlertTriangle,
  Plus,
  Edit2,
  X,
  Save,
  CheckCircle2,
} from 'lucide-react';

interface ModuloSstViewProps {
  peligros: PeligroSST[];
  empresa: EmpresaFrikazConfig;
  norms: Norm[];
  obligaciones: Obligacion[];
  onSavePeligro: (peligro: PeligroSST) => void;
  onNavigateToObligaciones: () => void;
}

export const ModuloSstView: React.FC<ModuloSstViewProps> = ({
  peligros,
  empresa,
  norms,
  obligaciones,
  onSavePeligro,
  onNavigateToObligaciones,
}) => {
  const [editingPeligro, setEditingPeligro] = useState<PeligroSST | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (pel: PeligroSST) => {
    setEditingPeligro(pel);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingPeligro({
      id: `pel-${Date.now()}`,
      categoriaPeligro: 'Físico (Temperaturas extremas / Calor de freidoras)',
      procesoRelacionado: 'Fritura y cocción de snacks',
      peligroEspecifico: '',
      efectoPosibleSalud: '',
      normaRelacionadaRef: 'Res. 2400/1979 y Res. 0312/2019',
      controlesExistentes: '',
      eppRequerido: '',
      capacitacionRequerida: '',
      responsable: 'Líder SST / Operadores',
      estadoControl: 'Controlado con EPP',
    });
    setModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPeligro) return;
    onSavePeligro(editingPeligro);
    setModalOpen(false);
  };

  // 7 Minimum Standards status check under Res. 0312/2019
  const sieteEstandares = [
    {
      num: '1',
      nombre: 'Asignación de persona responsable del SG-SST (Curso 50h)',
      estado: 'Cumplido',
      obligacionCodigo: 'OBL-SST-001',
    },
    {
      num: '2',
      nombre: 'Afiliación a los Sistemas de Seguridad Social en Salud, Pensión y ARL',
      estado: 'Cumplido',
      obligacionCodigo: 'OBL-SST-002',
    },
    {
      num: '3',
      nombre: 'Capacitación en SST (Prevención de quemaduras, corte y extintores K)',
      estado: 'Parcial',
      obligacionCodigo: 'OBL-SST-003',
    },
    {
      num: '4',
      nombre: 'Plan Anual de Trabajo en SST firmado por el empleador',
      estado: 'Cumplido',
      obligacionCodigo: 'OBL-SST-001',
    },
    {
      num: '5',
      nombre: 'Evaluaciones Médicas Ocupacionales con aptitud para alimentos',
      estado: 'No cumple (Vencido)',
      obligacionCodigo: 'OBL-SST-004',
    },
    {
      num: '6',
      nombre: 'Identificación de Peligros, Evaluación y Valoración de Riesgos (GTC 45)',
      estado: 'Cumplido',
      obligacionCodigo: 'OBL-SST-005',
    },
    {
      num: '7',
      nombre: 'Medidas de Prevención y Control frente a Peligros Identificados',
      estado: 'Cumplido',
      obligacionCodigo: 'OBL-SST-005',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-emerald-900/20 bg-linear-to-r from-emerald-950 via-emerald-900 to-slate-900 p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-700 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-100">
                Seguridad y Salud en el Trabajo · Frikaz S.A.S.
              </span>
              <span className="text-xs text-slate-300">
                10 Trabajadores · Riesgo Laboral: {empresa.claseRiesgoSST}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              Gestión Integral de Peligros, Riesgos y Estándares Mínimos
            </h2>
            <p className="text-sm text-slate-200 max-w-2xl mt-1 leading-relaxed">
              Monitoreo continuo de los 7 Estándares Mínimos obligatorios (Res. 0312/2019) y control de
              los riesgos críticos de la planta de snacks: quemaduras térmicas por aceite a &gt;160°C,
              cortes con rebanadoras y caídas en pisos engrasados.
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-600 transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>+ Registrar Peligro GTC 45</span>
          </button>
        </div>
      </div>

      {/* 7 Estándares Mínimos Checklist Section (Res. 0312/2019) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Auditoría de los 7 Estándares Mínimos (Resolución 0312 de 2019)
            </h3>
            <p className="text-xs text-slate-500">
              Marco legal exigible para empresas de 10 o menos trabajadores en Clase de Riesgo I, II o III
            </p>
          </div>
          <button
            onClick={onNavigateToObligaciones}
            className="text-xs font-semibold text-emerald-800 hover:underline"
          >
            Ver obligaciones legales asociadas
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sieteEstandares.map((est) => {
            const isOk = est.estado === 'Cumplido';
            const isWarning = est.estado === 'Parcial';
            const isFail = est.estado.includes('No cumple');

            return (
              <div
                key={est.num}
                className={`rounded-lg border p-3 flex items-start gap-2.5 ${
                  isOk
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : isWarning
                    ? 'border-blue-200 bg-blue-50/50'
                    : 'border-red-200 bg-red-50/50'
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isOk
                      ? 'bg-emerald-700 text-white'
                      : isWarning
                      ? 'bg-blue-700 text-white'
                      : 'bg-red-700 text-white'
                  }`}
                >
                  {est.num}
                </span>

                <div className="text-xs flex-1">
                  <span className="font-semibold text-slate-900 block leading-tight">
                    {est.nombre}
                  </span>
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-500">{est.obligacionCodigo}</span>
                    <span
                      className={`font-semibold ${
                        isOk ? 'text-emerald-800' : isWarning ? 'text-blue-800' : 'text-red-700'
                      }`}
                    >
                      {est.estado}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hazards and Risks Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Matriz de Identificación de Peligros y Valoración de Riesgos (GTC 45)
          </h3>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {peligros.length} Peligros Evaluados en Línea de Fritos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-4 py-3">Clasificación Peligro</th>
                <th className="px-4 py-3">Proceso Operativo</th>
                <th className="px-4 py-3">Peligro Específico</th>
                <th className="px-4 py-3">Efecto Posible en Salud</th>
                <th className="px-4 py-3">Controles Existentes & EPP</th>
                <th className="px-4 py-3">Norma Relacionada</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {peligros.map((pel) => (
                <tr key={pel.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                    {pel.categoriaPeligro}
                  </td>
                  <td className="px-4 py-3 max-w-xs">{pel.procesoRelacionado}</td>
                  <td className="px-4 py-3 max-w-xs text-slate-700 font-medium">
                    {pel.peligroEspecifico}
                  </td>
                  <td className="px-4 py-3 max-w-xs text-red-800">{pel.efectoPosibleSalud}</td>
                  <td className="px-4 py-3 max-w-sm text-slate-600">
                    <p className="font-semibold text-slate-800">{pel.controlesExistentes}</p>
                    <p className="text-[11px] text-emerald-800 mt-0.5">EPP: {pel.eppRequerido}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                    {pel.normaRelacionadaRef}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(pel)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="Editar peligro"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding/editing Danger */}
      {modalOpen && editingPeligro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 rounded-t-xl">
              <h3 className="text-base font-bold text-slate-900">
                Gestionar Peligro Ocupacional (GTC 45)
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Clasificación del Peligro *
                  </label>
                  <select
                    value={editingPeligro.categoriaPeligro}
                    onChange={(e) =>
                      setEditingPeligro({ ...editingPeligro, categoriaPeligro: e.target.value as any })
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                  >
                    <option value="Físico (Temperaturas extremas / Calor de freidoras)">
                      Físico (Calor de freidoras &gt;160°C)
                    </option>
                    <option value="Mecánico (Cortes por rebanadoras y cuchillas rotativas)">
                      Mecánico (Cortes por cuchillas de corte)
                    </option>
                    <option value="Locativo (Pisos resbalosos por salpicadura de grasa)">
                      Locativo (Pisos resbalosos con grasa)
                    </option>
                    <option value="Tecnológico (Incendio por aceite caliente >160°C o gas)">
                      Tecnológico (Incendio / Fuga de gas)
                    </option>
                    <option value="Biomecánico (Bipedestación y manipulación manual de bultos)">
                      Biomecánico (Cargas de 50 kg / Bipedestación)
                    </option>
                    <option value="Biológico (Manipulación de materias primas agrícolas)">
                      Biológico (Manipulación de alimentos)
                    </option>
                    <option value="Químico (Gases de combustión y detergentes de desengrase)">
                      Químico (Detergentes y vapores)
                    </option>
                    <option value="Psicosocial (Ritmo de producción en línea)">
                      Psicosocial (Ritmo de trabajo)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Proceso Relacionado
                  </label>
                  <input
                    type="text"
                    value={editingPeligro.procesoRelacionado}
                    onChange={(e) =>
                      setEditingPeligro({ ...editingPeligro, procesoRelacionado: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Peligro Específico
                </label>
                <textarea
                  rows={2}
                  value={editingPeligro.peligroEspecifico}
                  onChange={(e) =>
                    setEditingPeligro({ ...editingPeligro, peligroEspecifico: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Efecto Posible en la Salud del Trabajador
                </label>
                <textarea
                  rows={2}
                  value={editingPeligro.efectoPosibleSalud}
                  onChange={(e) =>
                    setEditingPeligro({ ...editingPeligro, efectoPosibleSalud: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Controles Existentes
                  </label>
                  <input
                    type="text"
                    value={editingPeligro.controlesExistentes}
                    onChange={(e) =>
                      setEditingPeligro({ ...editingPeligro, controlesExistentes: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    EPP Específico Requerido
                  </label>
                  <input
                    type="text"
                    value={editingPeligro.eppRequerido}
                    onChange={(e) =>
                      setEditingPeligro({ ...editingPeligro, eppRequerido: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100 border border-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 font-semibold text-white shadow-xs hover:bg-emerald-900"
                >
                  <Save className="h-4 w-4" />
                  <span>Guardar Peligro GTC 45</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
