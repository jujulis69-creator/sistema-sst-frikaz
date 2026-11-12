// ============================================================================
// COMPONENTE: PANEL DE ADMINISTRACIÓN Y AUDITORÍA «MISIÓN FRIKAZ»
// Supervisión SG-SST, Métricas, Trazabilidad e Integración Google Sheets
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  TrabajadorFrikaz,
  PoliticaMisionFrikaz,
  MetricasAdminMisionFrikaz,
  IntentoEvaluacion,
} from '../../types/misionFrikaz';
import {
  getStoredTrabajadores,
  getStoredPoliticasMision,
  saveStoredPoliticasMision,
  getMetricasAdminMision,
  getPasaporteDigital,
} from '../../services/misionFrikazService';
import { GameAvatar } from './GameAvatar';
import {
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Share2,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  FileSpreadsheet,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  ChevronRight,
  X,
} from 'lucide-react';

interface MisionFrikazAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onVerPasaporteTrabajador: (trabajadorId: string) => void;
}

export const MisionFrikazAdminPanel: React.FC<MisionFrikazAdminPanelProps> = ({
  isOpen,
  onClose,
  onVerPasaporteTrabajador,
}) => {
  const [metricas, setMetricas] = useState<MetricasAdminMisionFrikaz>(() => getMetricasAdminMision());
  const [trabajadores, setTrabajadores] = useState<TrabajadorFrikaz[]>(() => getStoredTrabajadores());
  const [politicas, setPoliticas] = useState<PoliticaMisionFrikaz[]>(() => getStoredPoliticasMision());
  const [pestanaActiva, setPestanaActiva] = useState<'kpis' | 'colaboradores' | 'historial' | 'sheets' | 'politicas'>('kpis');
  const [sheetsUrl, setSheetsUrl] = useState('');
  const [sincronizando, setSincronizando] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ tipo: 'ok' | 'err'; texto: string } | null>(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');

  // Refrescar métricas periódicamente
  const recargarDatos = () => {
    setMetricas(getMetricasAdminMision());
    setTrabajadores(getStoredTrabajadores());
    setPoliticas(getStoredPoliticasMision());
  };

  useEffect(() => {
    if (isOpen) {
      recargarDatos();
      // Consultar estado de sheets en backend
      fetch('/api/mision-frikaz/status')
        .then((res) => res.json())
        .then((data) => {
          if (data.googleSheetsUrlConfigurada) {
            setSheetsUrl(data.googleSheetsUrlConfigurada);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle de obligatoriedad de política
  const handleToggleObligatoria = (polId: string) => {
    const updated = politicas.map((p) => (p.id === polId ? { ...p, esObligatoria: !p.esObligatoria } : p));
    setPoliticas(updated);
    saveStoredPoliticasMision(updated);
    recargarDatos();
  };

  // Sincronizar con Google Sheets
  const handleSincronizarSheets = async () => {
    setSincronizando(true);
    setSyncStatusMsg(null);
    try {
      const res = await fetch('/api/mision-frikaz/sync-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: sheetsUrl }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncStatusMsg({ tipo: 'ok', texto: data.message });
      } else {
        setSyncStatusMsg({ tipo: 'err', texto: data.error || 'Fallo en la sincronización.' });
      }
    } catch (err: any) {
      setSyncStatusMsg({ tipo: 'err', texto: err.message || 'Error de conexión con el backend.' });
    } finally {
      setSincronizando(false);
    }
  };

  // Exportar historial a CSV
  const handleExportarCSV = () => {
    const intentos = metricas.ultimosIntentos;
    if (intentos.length === 0) {
      alert('No hay intentos de evaluación registrados aún para exportar.');
      return;
    }

    const headers = ['ID', 'Fecha', 'Trabajador', 'Cedula', 'Cargo', 'Codigo Politica', 'Politica', 'Puntaje', 'Estado', 'Intento', 'Duracion (seg)'];
    const rows = intentos.map((i) => [
      i.id,
      i.fechaFin,
      `"${i.trabajadorNombre}"`,
      i.trabajadorCedula,
      `"${i.trabajadorCargo}"`,
      i.politicaCodigo,
      `"${i.politicaTitulo}"`,
      `${i.puntaje}%`,
      i.aprobado ? 'SUPERADA' : 'NO_SUPERADA',
      i.numeroIntento,
      i.duracionSegundos,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Evidencias_Mision_Frikaz_SGSST_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtrar trabajadores
  const trabajadoresFiltrados = trabajadores.filter((t) =>
    t.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
    t.cargoNombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
    t.cedula.includes(filtroBusqueda)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto flex flex-col max-h-[90vh]">
        
        {/* Cabecera del Panel */}
        <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 px-6 py-5 border-b border-purple-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/20">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest uppercase text-purple-400">FRIKAZ S.A.S.</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  PANEL DE CONTROL SST
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Supervisión de Misión Frikaz y Acreditación
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={recargarDatos}
              title="Refrescar métricas"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación del Panel */}
        <div className="bg-slate-950 px-6 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'kpis', label: 'Indicadores Globales', icon: BarChart3 },
            { id: 'colaboradores', label: 'Colaboradores y Pasaportes', icon: Users },
            { id: 'historial', label: 'Historial de Intentos', icon: Clock },
            { id: 'sheets', label: 'Google Sheets / Drive', icon: FileSpreadsheet },
            { id: 'politicas', label: 'Políticas Obligatorias', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const esActiva = pestanaActiva === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setPestanaActiva(tab.id as any)}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
                  esActiva
                    ? 'border-purple-400 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contenido según pestaña */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* ================================================================ */}
          {/* 1. INDICADORES GLOBALES                                         */}
          {/* ================================================================ */}
          {pestanaActiva === 'kpis' && (
            <div className="space-y-6">
              
              {/* Tarjetas KPI */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Total Colaboradores</span>
                  <span className="text-2xl font-black text-white mt-1 block">
                    {metricas.totalTrabajadores}
                  </span>
                  <span className="text-[10px] text-slate-500">Planta Bosa + Logística</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30">
                  <span className="text-xs text-emerald-400 block font-medium">Embajadores Frikaz (100%)</span>
                  <span className="text-2xl font-black text-emerald-300 mt-1 block">
                    {metricas.totalCompletados100}
                  </span>
                  <span className="text-[10px] text-emerald-500/80">Acceso libre concedido</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30">
                  <span className="text-xs text-amber-400 block font-medium">En Acreditación</span>
                  <span className="text-2xl font-black text-amber-300 mt-1 block">
                    {metricas.totalEnProceso}
                  </span>
                  <span className="text-[10px] text-amber-500/80">Políticas pendientes</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-purple-500/30">
                  <span className="text-xs text-purple-400 block font-medium">Efectividad Global</span>
                  <span className="text-2xl font-black text-purple-300 mt-1 block">
                    {metricas.tasaAprobacionGlobal}%
                  </span>
                  <span className="text-[10px] text-purple-400/80">Tasa de aprobación (≥80%)</span>
                </div>
              </div>

              {/* Promedios por política */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Puntaje Promedio por Política Evaluada:
                </h3>
                <div className="space-y-3">
                  {politicas.map((pol) => {
                    const prom = metricas.promedioIntentosPorPolitica[pol.id] || 0;
                    return (
                      <div key={pol.id}>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-semibold text-slate-200">{pol.codigoCalidad} · {pol.titulo}</span>
                          <span className="font-bold text-amber-400">{prom}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              prom >= 80 ? 'bg-emerald-500' : prom >= 50 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${prom}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Preguntas más falladas (para capacitación SST) */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Preguntas con Mayor Tasa de Error (Oportunidades de Capacitación):
                </h3>
                {metricas.preguntasMasFalladas.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    Aún no hay suficientes datos de evaluaciones para calcular preguntas críticas.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {metricas.preguntasMasFalladas.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex-1">
                          <span className="text-[10px] text-amber-400 font-mono block mb-1">
                            {item.politicaId} · PREGUNTA {item.preguntaId}
                          </span>
                          <p className="text-slate-200 font-medium">{item.enunciado}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="text-sm font-black text-red-400">{item.tasaFallo}%</span>
                          <span className="text-[10px] text-slate-500 block">Tasa de fallo</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* 2. COLABORADORES Y PASAPORTES                                   */}
          {/* ================================================================ */}
          {pestanaActiva === 'colaboradores' && (
            <div className="space-y-4">
              
              {/* Buscador */}
              <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar colaborador por nombre, cargo o cédula..."
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none flex-1"
                />
              </div>

              {/* Tabla de colaboradores */}
              <div className="space-y-3">
                {trabajadoresFiltrados.map((trab) => {
                  const pasaporte = getPasaporteDigital(trab.id);

                  return (
                    <div
                      key={trab.id}
                      className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <GameAvatar
                          cargoNombre={trab.cargoNombre}
                          avatarUrl={trab.avatarUrl}
                          nombre={trab.nombre}
                          size="md"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white truncate">{trab.nombre}</h4>
                            {trab.esAdmin && (
                              <span className="text-[10px] px-2 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                SST Admin
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-amber-400 font-semibold truncate">{trab.cargoNombre}</p>
                          <p className="text-[10px] text-slate-500">ID: <span className="font-mono text-amber-300/80">{trab.id}</span> · C.C. {trab.cedula} · {trab.area}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-300 block">
                            {pasaporte.totalSuperadas} de {pasaporte.totalObligatorias} superadas
                          </span>
                          <span
                            className={`text-[11px] font-bold ${
                              pasaporte.esEmbajadorFrikaz ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {pasaporte.esEmbajadorFrikaz ? 'Embajador Frikaz' : `${pasaporte.porcentajeAvance}% Avance`}
                          </span>
                        </div>

                        <button
                          onClick={() => onVerPasaporteTrabajador(trab.id)}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Ver Pasaporte</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* 3. HISTORIAL DE INTENTOS Y AUDITORÍA                             */}
          {/* ================================================================ */}
          {pestanaActiva === 'historial' && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Total evaluaciones registradas: <strong className="text-white">{metricas.ultimosIntentos.length}</strong>
                </span>

                <button
                  onClick={handleExportarCSV}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Evidencias (CSV / Excel)</span>
                </button>
              </div>

              {metricas.ultimosIntentos.length === 0 ? (
                <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center">
                  <p className="text-xs text-slate-400">Aún no se han completado intentos de evaluación.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {metricas.ultimosIntentos.map((intento) => (
                    <div
                      key={intento.id}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white">{intento.trabajadorNombre}</span>
                          <span className="text-[10px] text-slate-500">({intento.trabajadorCargo})</span>
                        </div>
                        <p className="text-slate-400">
                          {intento.politicaCodigo} · {intento.politicaTitulo}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {new Date(intento.fechaFin).toLocaleString('es-CO')} · Duración: {intento.duracionSegundos}s · Intento #{intento.numeroIntento}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full font-black text-xs ${
                            intento.aprobado
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-red-500/20 text-red-400 border border-red-500/40'
                          }`}
                        >
                          {intento.aprobado ? 'SUPERADA' : 'NO SUPERADA'} ({intento.puntaje}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ================================================================ */}
          {/* 4. GOOGLE SHEETS / DRIVE INTEGRATION                            */}
          {/* ================================================================ */}
          {pestanaActiva === 'sheets' && (
            <div className="space-y-6">
              
              <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <FileSpreadsheet className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Sincronización con Google Sheets y Google Apps Script</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Conecta la plataforma con una hoja de cálculo corporativa de Google Sheets para registrar en tiempo real cada evaluación superada por los trabajadores de Frikaz S.A.S. para auditorías de la ARL y el Ministerio del Trabajo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  URL del Webhook de Google Apps Script (doPost):
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    value={sheetsUrl}
                    onChange={(e) => setSheetsUrl(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    disabled={sincronizando}
                    onClick={handleSincronizarSheets}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    {sincronizando ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sincronizando...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Sincronizar Ahora</span>
                      </>
                    )}
                  </button>
                </div>

                {syncStatusMsg && (
                  <div
                    className={`p-3 rounded-xl border text-xs ${
                      syncStatusMsg.tipo === 'ok'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                    }`}
                  >
                    {syncStatusMsg.texto}
                  </div>
                )}

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                  <strong className="text-slate-300 block mb-1">Estructura de Columnas Registradas en Sheets:</strong>
                  <p>1. Timestamp / Fecha y Hora Oficial</p>
                  <p>2. Nombre del Trabajador y Cédula</p>
                  <p>3. Cargo y Área Operativa</p>
                  <p>4. Código y Título de la Política</p>
                  <p>5. Calificación Obtenida (%) y Estado (SUPERADA / NO SUPERADA)</p>
                  <p>6. Número de Intento y Tiempo de Respuesta</p>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* 5. GESTIÓN DE POLÍTICAS OBLIGATORIAS                            */}
          {/* ================================================================ */}
          {pestanaActiva === 'politicas' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Define cuáles políticas son de acreditación <strong>OBLIGATORIA</strong> para los trabajadores antes de ingresar a la plataforma principal:
              </p>

              <div className="space-y-3">
                {politicas.map((pol) => (
                  <div
                    key={pol.id}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          {pol.codigoCalidad}
                        </span>
                        <span className="text-xs text-slate-400">Versión {pol.version}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white">{pol.titulo}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{pol.subtitulo}</p>
                    </div>

                    <button
                      onClick={() => handleToggleObligatoria(pol.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                        pol.esObligatoria
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {pol.esObligatoria ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-amber-400" />
                          <span>Obligatoria</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5" />
                          <span>Opcional</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Pie del Panel */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>FRIKAZ S.A.S. · Coordinación SG-SST</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            Cerrar Panel
          </button>
        </div>

      </div>
    </div>
  );
};
