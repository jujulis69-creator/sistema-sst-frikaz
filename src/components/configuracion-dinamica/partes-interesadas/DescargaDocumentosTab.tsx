// ============================================================================
// PESTAÑA 6: DESCARGA DE DOCUMENTOS - FRIKAZ S.A.S.
// Centro de exportación en PDF y Excel individual por cargo
// ============================================================================

import React, { useState } from 'react';
import {
  ItemChecklistNecesidad,
  CargoChecklistInterno,
  ParteInteresada,
} from '../../../types/partesInteresadas';
import {
  exportarChecklistExcel,
  exportarMatrizExcel,
} from '../../../services/partesInteresadasService';
import { ModalImpresionPdfChecklist } from './ModalImpresionPdfChecklist';
import {
  Download,
  FileSpreadsheet,
  Printer,
  Crown,
  Users,
  Truck,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Layers,
} from 'lucide-react';

interface DescargaDocumentosTabProps {
  items: ItemChecklistNecesidad[];
  partes: ParteInteresada[];
}

export const DescargaDocumentosTab: React.FC<DescargaDocumentosTabProps> = ({
  items,
  partes,
}) => {
  const [cargoSeleccionadoPdf, setCargoSeleccionadoPdf] = useState<CargoChecklistInterno | null>(null);
  const [exportandoExcel, setExportandoExcel] = useState<string | null>(null);

  const cargos: {
    id: CargoChecklistInterno;
    nombre: string;
    subtitulo: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'gerente',
      nombre: 'Checklist de Necesidades — Gerente',
      subtitulo: '7 Necesidades de Alta Dirección, asignación de recursos y seguimiento normativo',
      icon: <Crown className="h-5 w-5 text-purple-600" />,
      color: 'border-purple-200 bg-purple-50/20',
    },
    {
      id: 'operarios',
      nombre: 'Checklist de Necesidades — Operarios',
      subtitulo: '9 Necesidades de planta, maquinaria, EPP térmicos, BPM y prevención de quemaduras',
      icon: <Users className="h-5 w-5 text-indigo-600" />,
      color: 'border-indigo-200 bg-indigo-50/20',
    },
    {
      id: 'conductor',
      nombre: 'Checklist de Necesidades — Conductor',
      subtitulo: '8 Necesidades de vehículo, seguridad vial, carga ergonómica y tiempos de ruta',
      icon: <Truck className="h-5 w-5 text-sky-600" />,
      color: 'border-sky-200 bg-sky-50/20',
    },
  ];

  const handleDescargarExcel = async (cargo: CargoChecklistInterno) => {
    try {
      setExportandoExcel(cargo);
      await exportarChecklistExcel(cargo, items);
    } finally {
      setExportandoExcel(null);
    }
  };

  const handleDescargarMatrizExcel = async () => {
    try {
      setExportandoExcel('matriz');
      await exportarMatrizExcel(partes);
    } finally {
      setExportandoExcel(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de Centro de Descarga */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-slate-900 p-6 rounded-2xl text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-orange-200 font-extrabold text-xs uppercase tracking-wider block">
              Centro de Documentación Oficial SG-SST
            </span>
            <h2 className="text-2xl font-black text-white">
              Descarga de Checklists y Matriz Institucional
            </h2>
            <p className="text-xs text-orange-100 max-w-2xl leading-relaxed">
              Generación de documentos individuales e institucionales en formatos oficiales editables (Excel .xlsx con estilos de cabecera y estado) y listos para firma (PDF / Impresión formal con membrete de Frikaz S.A.S.).
            </p>
          </div>

          <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-xs text-white shrink-0">
            <span className="block font-bold">Frikaz S.A.S.</span>
            <span className="text-[10px] text-orange-200 font-mono">NIT: 901.458.723-1</span>
          </div>
        </div>
      </div>

      {/* Grid de Descarga Individual de Checklists por Cargo */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
            1. Descarga Individual por Cargo (Checklists Internos)
          </h3>
          <span className="text-xs text-slate-500">
            Cada archivo se descarga individualmente con sus métricas y firmas correspondientes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cargos.map((cargo) => {
            const itemsCargo = items.filter((it) => it.cargo === cargo.id);
            const cumplidas = itemsCargo.filter((it) => it.estado === 'Cumplido').length;
            const pct = itemsCargo.length > 0 ? Math.round((cumplidas / itemsCargo.length) * 100) : 0;

            return (
              <div
                key={cargo.id}
                className={`p-5 rounded-2xl border ${cargo.color} bg-white shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        {cargo.icon}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                          {cargo.nombre}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-500 block">
                          {itemsCargo.length} Necesidades · {pct}% Cumplido
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cargo.subtitulo}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-mono text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Cumplidas:</span>
                      <strong className="text-emerald-700">{cumplidas}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>En proceso:</span>
                      <strong className="text-amber-700">
                        {itemsCargo.filter((it) => it.estado === 'En proceso').length}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Pendientes:</span>
                      <strong className="text-rose-700">
                        {itemsCargo.filter((it) => it.estado === 'Pendiente').length}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleDescargarExcel(cargo.id)}
                    disabled={exportandoExcel === cargo.id}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>
                      {exportandoExcel === cargo.id ? 'Generando Excel...' : 'Descargar en Excel (.xlsx)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCargoSeleccionadoPdf(cargo.id)}
                    className="w-full py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Descargar en PDF / Imprimir</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Descarga de la Matriz General de Partes Interesadas */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-900 text-white">
              <Building2 className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                2. Matriz General de Identificación y Gestión de Partes Interesadas
              </h3>
              <p className="text-xs text-slate-500">
                Documento integral con las 9 partes interesadas (3 internas y 6 externas), peligros, afectaciones y controles.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDescargarMatrizExcel}
            disabled={exportandoExcel === 'matriz'}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>
              {exportandoExcel === 'matriz' ? 'Generando Matriz...' : 'Descargar Matriz en Excel'}
            </span>
          </button>
        </div>
      </div>

      {/* Modal PDF activo cuando el usuario hace clic en "Descargar en PDF / Imprimir" */}
      {cargoSeleccionadoPdf && (
        <ModalImpresionPdfChecklist
          cargo={cargoSeleccionadoPdf}
          items={items}
          isOpen={!!cargoSeleccionadoPdf}
          onClose={() => setCargoSeleccionadoPdf(null)}
        />
      )}
    </div>
  );
};
