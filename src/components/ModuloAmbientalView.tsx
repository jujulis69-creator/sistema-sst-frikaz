import React, { useState } from 'react';
import { AspectoAmbiental, Norm, Obligacion } from '../types';
import {
  Leaf,
  Droplet,
  Trash2,
  Wind,
  Package,
  Zap,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Edit2,
  X,
  Save,
} from 'lucide-react';

interface ModuloAmbientalViewProps {
  aspectos: AspectoAmbiental[];
  norms: Norm[];
  obligaciones: Obligacion[];
  onSaveAspecto: (aspecto: AspectoAmbiental) => void;
  onNavigateToNormativa: () => void;
}

export const ModuloAmbientalView: React.FC<ModuloAmbientalViewProps> = ({
  aspectos,
  norms,
  obligaciones,
  onSaveAspecto,
  onNavigateToNormativa,
}) => {
  const [editingAspecto, setEditingAspecto] = useState<AspectoAmbiental | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (asp: AspectoAmbiental) => {
    setEditingAspecto(asp);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingAspecto({
      id: `asp-${Date.now()}`,
      categoria: 'Aceite de Cocina Usado (ACU)',
      actividadProductiva: '',
      impactoPotencial: '',
      normaAplicableRef: '',
      obligacionLegalRef: '',
      medidaControl: '',
      registroAutoridad: '',
      responsable: 'Coordinador Ambiental',
      evidenciaAsociada: '',
      estadoCumplimiento: 'Cumpliendo 100%',
      accionMejora: '',
    });
    setModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAspecto) return;
    onSaveAspecto(editingAspecto);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner specific to Frikaz S.A.S. Environmental Context */}
      <div className="rounded-xl border border-emerald-900/20 bg-linear-to-r from-emerald-950 via-emerald-900 to-slate-900 p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-700 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-100">
                Gestión Ambiental Frikaz S.A.S.
              </span>
              <span className="text-xs text-slate-300">Secretaría Distrital de Ambiente (SDA) · Bogotá D.C.</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              Matriz de Aspectos e Impactos Ambientales de Planta
            </h2>
            <p className="text-sm text-slate-200 max-w-2xl mt-1 leading-relaxed">
              Enfoque prioritario en los residuos críticos de la fritura de snacks: Aceite de Cocina Usado (ACU),
              residuos orgánicos de tubérculos (cáscaras de papa y plátano), grasas en aguas de lavado y consumo de agua.
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-600 transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>+ Registrar Aspecto Ambiental</span>
          </button>
        </div>
      </div>

      {/* Grid of Key Environmental Streams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ACU */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800">
            <Droplet className="h-5 w-5 text-emerald-700" />
            <span className="font-bold text-xs uppercase tracking-wider">Aceite Usado (ACU)</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-900">Res. 316/2018 MADS</p>
            <p>Generación aprox: 180 - 250 L/mes.</p>
            <p className="text-emerald-700 font-medium">Entrega exclusiva a gestor SDA con manifiesto.</p>
          </div>
        </div>

        {/* Residuos Sólidos */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800">
            <Trash2 className="h-5 w-5 text-emerald-700" />
            <span className="font-bold text-xs uppercase tracking-wider">Código de Colores</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-900">Res. 2184/2019 MADS</p>
            <p>Verde: Cáscaras de tubérculos.</p>
            <p>Blanco: Plásticos limpios y cartón.</p>
            <p>Negro: Residuos ordinarios de aseo.</p>
          </div>
        </div>

        {/* Vertimientos & Trampa de Grasa */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800">
            <Shield className="h-5 w-5 text-emerald-700" />
            <span className="font-bold text-xs uppercase tracking-wider">Vertimientos & Grasa</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-900">Res. 0631/2015 & Res. SDA 3957</p>
            <p>Trampa física con mantenimiento quincenal.</p>
            <p className="text-amber-800 font-medium">Requiere bitácora firmada de descolmatación.</p>
          </div>
        </div>

        {/* Empaques BOPP */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800">
            <Package className="h-5 w-5 text-emerald-700" />
            <span className="font-bold text-xs uppercase tracking-wider">Empaques Plásticos</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-900">Res. 1407/2018 & Ley 2232</p>
            <p>Películas flexibles bilaminadas BOPP.</p>
            <p>En evaluación de umbral de posconsumo.</p>
          </div>
        </div>
      </div>

      {/* Aspects Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Registro de Aspectos, Impactos y Controles Operacionales Ambientales
          </h3>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {aspectos.length} Aspectos Evaluados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-4 py-3">Aspecto Ambiental</th>
                <th className="px-4 py-3">Actividad Productiva</th>
                <th className="px-4 py-3">Impacto Potencial</th>
                <th className="px-4 py-3">Medida de Control Implementada</th>
                <th className="px-4 py-3">Norma Aplicable</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {aspectos.map((asp) => (
                <tr key={asp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                    {asp.categoria}
                  </td>
                  <td className="px-4 py-3 max-w-xs">{asp.actividadProductiva}</td>
                  <td className="px-4 py-3 max-w-xs text-slate-600">{asp.impactoPotencial}</td>
                  <td className="px-4 py-3 max-w-xs text-slate-800 font-medium">
                    {asp.medidaControl}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                    {asp.normaAplicableRef}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="rounded-sm bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                      {asp.estadoCumplimiento}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(asp)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="Editar aspecto"
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

      {/* Modal for adding/editing Aspecto */}
      {modalOpen && editingAspecto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 rounded-t-xl">
              <h3 className="text-base font-bold text-slate-900">
                Gestionar Aspecto e Impacto Ambiental
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
                    Categoría del Aspecto *
                  </label>
                  <select
                    value={editingAspecto.categoria}
                    onChange={(e) =>
                      setEditingAspecto({ ...editingAspecto, categoria: e.target.value as any })
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                  >
                    <option value="Aceite de Cocina Usado (ACU)">Aceite de Cocina Usado (ACU)</option>
                    <option value="Residuos Sólidos Ordinarios y Aprovechables">
                      Residuos Sólidos (Cáscaras y Plásticos)
                    </option>
                    <option value="Aguas Residuales No Domésticas (Vertimientos)">
                      Aguas Residuales y Grasas (Vertimientos)
                    </option>
                    <option value="Empaques y Plásticos Bilaminados">Empaques Plásticos</option>
                    <option value="Consumo de Agua">Consumo de Agua</option>
                    <option value="Consumo de Energía y Gas">Consumo de Gas y Energía</option>
                    <option value="Emisiones Atmosféricas y Vahos de Fritura">
                      Vahos y Olores de Fritura
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Actividad Productiva
                  </label>
                  <input
                    type="text"
                    value={editingAspecto.actividadProductiva}
                    onChange={(e) =>
                      setEditingAspecto({ ...editingAspecto, actividadProductiva: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Impacto Potencial al Medio Ambiente
                </label>
                <textarea
                  rows={2}
                  value={editingAspecto.impactoPotencial}
                  onChange={(e) =>
                    setEditingAspecto({ ...editingAspecto, impactoPotencial: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Medida de Control Operacional Implementada
                </label>
                <textarea
                  rows={2}
                  value={editingAspecto.medidaControl}
                  onChange={(e) =>
                    setEditingAspecto({ ...editingAspecto, medidaControl: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Norma Aplicable
                  </label>
                  <input
                    type="text"
                    value={editingAspecto.normaAplicableRef}
                    onChange={(e) =>
                      setEditingAspecto({ ...editingAspecto, normaAplicableRef: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estado de Cumplimiento
                  </label>
                  <input
                    type="text"
                    value={editingAspecto.estadoCumplimiento}
                    onChange={(e) =>
                      setEditingAspecto({ ...editingAspecto, estadoCumplimiento: e.target.value })
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
                  <span>Guardar Aspecto</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
