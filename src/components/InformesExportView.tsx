import React, { useState } from 'react';
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
  FileDown,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FolderLock,
  Layers,
  Shield,
  Leaf,
  Calendar,
} from 'lucide-react';
import {
  exportMatrizNormativaCsv,
  exportObligacionesCsv,
  exportEvidenciasFaltantesCsv,
  exportPhvaCsv,
  exportAccionesCorrectivasCsv,
  exportIndicadoresCsv,
} from '../services/exportService';

interface InformesExportViewProps {
  norms: Norm[];
  obligaciones: Obligacion[];
  phvaList: PhvaRegistro[];
  evidencias: Evidencia[];
  acciones: AccionCorrectiva[];
  indicadores: IndicadoresCumplimiento;
  empresa: EmpresaFrikazConfig;
}

export const InformesExportView: React.FC<InformesExportViewProps> = ({
  norms,
  obligaciones,
  phvaList,
  evidencias,
  acciones,
  indicadores,
  empresa,
}) => {
  const [showExecutiveReport, setShowExecutiveReport] = useState(false);
  const fechaGeneracion = new Date().toLocaleString('es-CO');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Generación de Informes y Exportación de Datos
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Descargue los registros normativos en formato CSV compatible con Microsoft Excel (con codificación UTF-8
              para preservar acentos y caracteres jurídicos) o imprima el Informe Ejecutivo Oficial para auditorías del
              Ministerio del Trabajo y la Secretaría Distrital de Ambiente de Bogotá.
            </p>
          </div>

          <button
            onClick={() => setShowExecutiveReport(!showExecutiveReport)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-900 transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <Printer className="h-4 w-4" />
            <span>
              {showExecutiveReport ? 'Ocultar Informe Imprimible' : 'Ver Informe Ejecutivo Imprimible'}
            </span>
          </button>
        </div>
      </div>

      {/* Grid of 8 Downloadable Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        {/* 1. Matriz Normativa Completa */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 mb-2">
              <Layers className="h-5 w-5" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Matriz Normativa</h4>
            </div>
            <p className="text-xs text-slate-600">
              Todas las leyes, decretos y resoluciones registradas con su análisis de importancia y aplicabilidad para Frikaz.
            </p>
          </div>
          <button
            onClick={() => exportMatrizNormativaCsv(norms)}
            className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-lg border border-slate-300 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileDown className="h-4 w-4 text-emerald-700" />
            <span>Descargar CSV</span>
          </button>
        </div>

        {/* 2. Normas de SST */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 mb-2">
              <Shield className="h-5 w-5" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Normas SST</h4>
            </div>
            <p className="text-xs text-slate-600">
              Disposiciones exclusivas de Seguridad y Salud en el Trabajo (Decreto 1072, Res. 0312, Res. 2400, etc.).
            </p>
          </div>
          <button
            onClick={() => exportMatrizNormativaCsv(norms, 'SST')}
            className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-lg border border-slate-300 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileDown className="h-4 w-4 text-emerald-700" />
            <span>Descargar CSV</span>
          </button>
        </div>

        {/* 3. Normas Ambientales */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 mb-2">
              <Leaf className="h-5 w-5" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Normas Ambientales</h4>
            </div>
            <p className="text-xs text-slate-600">
              Regulación de ACU (Res. 316), código de colores (Res. 2184), vertimientos (Res. 0631) y resoluciones SDA Bogotá.
            </p>
          </div>
          <button
            onClick={() => exportMatrizNormativaCsv(norms, 'Ambiental')}
            className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-lg border border-slate-300 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileDown className="h-4 w-4 text-emerald-700" />
            <span>Descargar CSV</span>
          </button>
        </div>

        {/* 4. Obligaciones Incumplidas */}
        <div className="rounded-xl border border-red-200 bg-red-50/40 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Obligaciones Incumplidas</h4>
            </div>
            <p className="text-xs text-slate-600">
              Filtro estricto de obligaciones en estado "No cumple" que requieren plan de acción correctiva urgente.
            </p>
          </div>
          <button
            onClick={() => exportObligacionesCsv(obligaciones, norms, true)}
            className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-lg border border-red-300 bg-white py-2 text-xs font-semibold text-red-800 hover:bg-red-50 transition-colors"
          >
            <FileDown className="h-4 w-4 text-red-700" />
            <span>Descargar CSV</span>
          </button>
        </div>

        {/* 5. Evidencias Faltantes */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-700 mb-2">
              <FolderLock className="h-5 w-5" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Evidencias Faltantes</h4>
            </div>
            <p className="text-xs text-slate-600">
              Listado de obligaciones aplicables que aún no cuentan con soporte documental suficiente o verificado.
            </p>
          </div>
          <button
            onClick={() => exportEvidenciasFaltantesCsv(obligaciones, evidencias, norms)}
            className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-lg border border-slate-300 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileDown className="h-4 w-4 text-amber-600" />
            <span>Descargar CSV</span>
          </button>
        </div>

        {/* 6. Seguimiento PHVA */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <RefreshCw className="h-5 w-5" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Seguimiento PHVA</h4>
            </div>
            <p className="text-xs text-slate-600">
              Detalle fase por fase (Planear, Hacer, Verificar, Actuar) con objetivos, hallazgos y estado de eficacia.
            </p>
          </div>
          <button
            onClick={() => exportPhvaCsv(phvaList, obligaciones, norms)}
            className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-lg border border-slate-300 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileDown className="h-4 w-4 text-blue-700" />
            <span>Descargar CSV</span>
          </button>
        </div>

        {/* 7. Acciones Correctivas */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-800 mb-2">
              <FileSpreadsheet className="h-5 w-5 text-slate-700" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Acciones Correctivas</h4>
            </div>
            <p className="text-xs text-slate-600">
              Registro con causa raíz, responsables, evidencia de ejecución y resultado de eficacia de cierre.
            </p>
          </div>
          <button
            onClick={() => exportAccionesCorrectivasCsv(acciones, obligaciones)}
            className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-lg border border-slate-300 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileDown className="h-4 w-4 text-slate-700" />
            <span>Descargar CSV</span>
          </button>
        </div>

        {/* 8. Tablero de Indicadores */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 mb-2">
              <CheckCircle2 className="h-5 w-5" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Indicadores (KPIs)</h4>
            </div>
            <p className="text-xs text-slate-600">
              Consolidado cuantitativo oficial con los 15 indicadores calculados a la fecha actual.
            </p>
          </div>
          <button
            onClick={() => exportIndicadoresCsv(indicadores, empresa)}
            className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-lg border border-slate-300 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileDown className="h-4 w-4 text-emerald-700" />
            <span>Descargar CSV</span>
          </button>
        </div>
      </div>

      {/* Printable / PDF-ready Official Executive Report */}
      {showExecutiveReport && (
        <div className="rounded-xl border border-slate-300 bg-white p-8 shadow-md text-slate-800 text-xs space-y-6">
          {/* Print Action Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
            <span className="text-xs font-semibold text-slate-500">
              Vista previa del Informe Ejecutivo Oficial para imprimir o guardar como PDF:
            </span>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir / Guardar en PDF</span>
            </button>
          </div>

          {/* Official Colombian Format Header */}
          <div className="border border-slate-300 p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-800 text-white font-bold text-lg">
                  FK
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 uppercase">
                    {empresa.nombre}
                  </h3>
                  <p className="text-slate-600 text-[11px]">
                    NIT: {empresa.nit} · {empresa.direccion}, {empresa.barrio}, Bosa (Bogotá D.C.)
                  </p>
                </div>
              </div>

              <div className="text-right text-[11px] font-mono text-slate-600">
                <p><strong>CÓDIGO:</strong> INF-NOR-2026-01</p>
                <p><strong>VERSIÓN:</strong> 1.0</p>
                <p><strong>FECHA:</strong> {fechaGeneracion}</p>
              </div>
            </div>

            <div className="mt-3 text-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                INFORME EJECUTIVO DE CUMPLIMIENTO NORMATIVO EN SEGURIDAD Y SALUD EN EL TRABAJO Y GESTIÓN AMBIENTAL
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Evaluación técnica de cumplimiento aplicable a la planta de producción de snacks fritos (10 trabajadores)
              </p>
            </div>
          </div>

          {/* Company Profile Context */}
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="font-semibold text-slate-500 block">Personal Total:</span>
              <span className="font-bold text-slate-900">{empresa.numeroTrabajadores} Trabajadores</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500 block">Clase de Riesgo ARL:</span>
              <span className="font-bold text-emerald-800">{empresa.claseRiesgoSST}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500 block">Actividad Económica:</span>
              <span className="text-slate-800 truncate block">{empresa.ciiuPrincipal}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500 block">Autoridad Ambiental:</span>
              <span className="text-slate-800">SDA Bogotá / EAAB</span>
            </div>
          </div>

          {/* Consolidated Indicators Table */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
              1. Balance Cuantitativo de Cumplimiento Legal (15 Indicadores Oficiales)
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-[11px] text-slate-700">
                <thead className="bg-slate-100 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Indicador de Cumplimiento</th>
                    <th className="px-3 py-2 font-mono text-center">Valor Obtenido</th>
                    <th className="px-3 py-2">Estado / Observación Técnica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-3 py-1.5 font-medium">Porcentaje General de Cumplimiento</td>
                    <td className="px-3 py-1.5 font-mono text-center font-bold text-emerald-800">
                      {indicadores.porcentajeCumplimientoGeneral}%
                    </td>
                    <td className="px-3 py-1.5 text-slate-600">Calculado sobre obligaciones aplicables</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-1.5 font-medium">Cumplimiento en SST (Dec. 1072 & Res. 0312)</td>
                    <td className="px-3 py-1.5 font-mono text-center font-bold text-emerald-800">
                      {indicadores.porcentajeCumplimientoSST}%
                    </td>
                    <td className="px-3 py-1.5 text-slate-600">Estándares mínimos para microempresa</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-1.5 font-medium">Cumplimiento Ambiental (Res. 316 ACU & Vertimientos)</td>
                    <td className="px-3 py-1.5 font-mono text-center font-bold text-emerald-800">
                      {indicadores.porcentajeCumplimientoAmbiental}%
                    </td>
                    <td className="px-3 py-1.5 text-slate-600">Gestión de aceite usado y residuos</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-1.5">Total de Normas Registradas / Vigentes Verificadas</td>
                    <td className="px-3 py-1.5 font-mono text-center">
                      {indicadores.totalNormas} / {indicadores.normasVigentesVerificadas}
                    </td>
                    <td className="px-3 py-1.5 text-slate-600">{indicadores.normasPendientesValidacion} por validar</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-1.5">Obligaciones Aplicables / Cumplidas y Verificadas</td>
                    <td className="px-3 py-1.5 font-mono text-center">
                      {indicadores.obligacionesAplicables} / {indicadores.obligacionesCumplidasVerificadas}
                    </td>
                    <td className="px-3 py-1.5 text-slate-600">Soportadas con evidencias legales</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-1.5 text-red-700 font-semibold">Obligaciones Incumplidas</td>
                    <td className="px-3 py-1.5 font-mono text-center font-bold text-red-700">
                      {indicadores.obligacionesIncumplidas}
                    </td>
                    <td className="px-3 py-1.5 text-red-700">Acción correctiva en curso</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-1.5">Evidencias Faltantes o Insuficientes</td>
                    <td className="px-3 py-1.5 font-mono text-center">
                      {indicadores.evidenciasFaltantes}
                    </td>
                    <td className="px-3 py-1.5 text-slate-600">Requiere recopilación documental</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-1.5">Actividades Próximas a Vencer (&le; 15 días) / Vencidas</td>
                    <td className="px-3 py-1.5 font-mono text-center">
                      {indicadores.actividadesProximasVencer} / {indicadores.actividadesVencidas}
                    </td>
                    <td className="px-3 py-1.5 text-slate-600">Seguimiento en cronograma</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-1.5">Acciones Correctivas Abiertas</td>
                    <td className="px-3 py-1.5 font-mono text-center">
                      {indicadores.accionesCorrectivasAbiertas}
                    </td>
                    <td className="px-3 py-1.5 text-slate-600">En proceso de cierre y verificación</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Signatures Block */}
          <div className="pt-8 border-t border-slate-300">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-8 text-center">
              Aprobación y Firmas de Responsabilidad Legal
            </h4>

            <div className="grid grid-cols-3 gap-8 text-center text-[11px]">
              <div className="border-t border-slate-400 pt-2">
                <p className="font-bold text-slate-900">REPRESENTANTE LEGAL</p>
                <p className="text-slate-600">{empresa.nombre}</p>
                <p className="text-slate-500">C.C. Directiva Gerencial</p>
              </div>

              <div className="border-t border-slate-400 pt-2">
                <p className="font-bold text-slate-900">RESPONSABLE SG-SST</p>
                <p className="text-slate-600">Líder SST Certificado (50h)</p>
                <p className="text-slate-500">Licencia en SST MinTrabajo</p>
              </div>

              <div className="border-t border-slate-400 pt-2">
                <p className="font-bold text-slate-900">COORDINADOR AMBIENTAL</p>
                <p className="text-slate-600">Gestión Ambiental y ACU</p>
                <p className="text-slate-500">Sede Bosa Piamonte</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
