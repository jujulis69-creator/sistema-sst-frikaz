import React, { useState } from 'react';
import { EmpresaFrikazConfig } from '../types';
import {
  Building2,
  Save,
  CheckCircle2,
  Flame,
  Shield,
  Leaf,
  Layers,
  MapPin,
  Users,
  Settings,
} from 'lucide-react';

interface FichaEmpresaViewProps {
  empresa: EmpresaFrikazConfig;
  onSaveEmpresa: (config: EmpresaFrikazConfig) => void;
}

export const FichaEmpresaView: React.FC<FichaEmpresaViewProps> = ({
  empresa,
  onSaveEmpresa,
}) => {
  const [formData, setFormData] = useState<EmpresaFrikazConfig>({ ...empresa });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEmpresa(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="rounded-xl border border-emerald-900/20 bg-linear-to-r from-emerald-950 via-emerald-900 to-slate-900 p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="rounded-md bg-emerald-700 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-100">
              Ficha Técnica Empresarial
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              {formData.nombre} — Bosa, Piamonte (Bogotá D.C.)
            </h2>
            <p className="text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
              Configuración de los parámetros productivos, clase de riesgo laboral ante la ARL,
              maquinaria instalada y condiciones ambientales reales de la planta de snacks fritos.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-lg border border-white/20">
            <Users className="h-5 w-5 text-emerald-300" />
            <div>
              <span className="text-[11px] text-slate-300 block">Personal Total:</span>
              <span className="font-bold text-sm text-white font-mono tabular-nums">
                {formData.numeroTrabajadores} Trabajadores
              </span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic General Details */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-800" />
            Identificación Legal y Ubicación Geográfica
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Razón Social</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIT</label>
              <input
                type="text"
                value={formData.nit}
                onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Número de Trabajadores</label>
              <input
                type="number"
                value={formData.numeroTrabajadores}
                onChange={(e) =>
                  setFormData({ ...formData, numeroTrabajadores: parseInt(e.target.value, 10) || 10 })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dirección de Planta</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Barrio y Localidad</label>
              <input
                type="text"
                value={`${formData.barrio}, ${formData.localidad}`}
                onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ciudad / Autoridad Ambiental</label>
              <input
                type="text"
                value="Bogotá D.C. (SDA Bogotá)"
                disabled
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Economic Activity & ARL Risk Classification */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-800" />
            Actividad Económica y Clasificación de Riesgo Laboral (ARL)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Actividad Económica Principal
              </label>
              <input
                type="text"
                value={formData.actividadEconomicaGeneral}
                onChange={(e) => setFormData({ ...formData, actividadEconomicaGeneral: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Código CIIU Principal
              </label>
              <input
                type="text"
                value={formData.ciiuPrincipal}
                onChange={(e) => setFormData({ ...formData, ciiuPrincipal: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ARL Contratada
              </label>
              <input
                type="text"
                value={formData.arl}
                onChange={(e) => setFormData({ ...formData, arl: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Clase de Riesgo Laboral SST
              </label>
              <input
                type="text"
                value={formData.claseRiesgoSST}
                onChange={(e) => setFormData({ ...formData, claseRiesgoSST: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              Justificación Técnica de la Clase de Riesgo y Estándares Mínimos
            </label>
            <textarea
              rows={2}
              value={formData.justificacionClaseRiesgo}
              onChange={(e) => setFormData({ ...formData, justificacionClaseRiesgo: e.target.value })}
              className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-600 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Machinery, Processes, Insumos, Residuos */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <Settings className="h-4 w-4 text-emerald-800" />
            Inventario Operativo de Maquinaria e Insumos
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Maquinaria y Equipos Utilizados (Uno por línea)
              </label>
              <textarea
                rows={4}
                value={formData.maquinariaUtilizada.join('\n')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maquinariaUtilizada: e.target.value.split('\n').filter((l) => l.trim() !== ''),
                  })
                }
                className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-600 focus:outline-hidden font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Procesos Productivos de la Planta (Uno por línea)
              </label>
              <textarea
                rows={4}
                value={formData.procesosProductivos.join('\n')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    procesosProductivos: e.target.value.split('\n').filter((l) => l.trim() !== ''),
                  })
                }
                className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-600 focus:outline-hidden font-mono text-[11px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Insumos Principales (Uno por línea)
                </label>
                <textarea
                  rows={4}
                  value={formData.insumosPrincipales.join('\n')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      insumosPrincipales: e.target.value.split('\n').filter((l) => l.trim() !== ''),
                    })
                  }
                  className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-600 focus:outline-hidden font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Residuos Generados en Planta (Uno por línea)
                </label>
                <textarea
                  rows={4}
                  value={formData.residuosGenerados.join('\n')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      residuosGenerados: e.target.value.split('\n').filter((l) => l.trim() !== ''),
                    })
                  }
                  className="w-full rounded-md border border-slate-300 p-2 focus:border-emerald-600 focus:outline-hidden font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Información de Frikaz S.A.S. guardada exitosamente.
              </span>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-900 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Guardar Ficha Técnica</span>
          </button>
        </div>
      </form>
    </div>
  );
};
