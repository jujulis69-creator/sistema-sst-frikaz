import React, { useState } from 'react';
import {
  PoliticaSSTData,
  CompromisoPolitica,
  RegistroHistorialPolitica,
} from '../../types/organigramaSst';
import {
  getStoredPoliticaSST,
  saveStoredPoliticaSST,
  resetStoredPoliticaSST,
  exportarPoliticaWord,
} from '../../services/organigramaService';
import {
  ShieldCheck,
  FileText,
  FileDown,
  Printer,
  Edit3,
  Save,
  RotateCcw,
  History,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  UserCheck,
  Check,
  X,
  FileSpreadsheet,
  HelpCircle,
  ExternalLink,
  Inbox,
} from 'lucide-react';

interface PoliticaSstViewProps {
  onIrADocumentosDevueltos?: () => void;
}

export const PoliticaSstView: React.FC<PoliticaSstViewProps> = ({
  onIrADocumentosDevueltos,
}) => {
  const [politica, setPolitica] = useState<PoliticaSSTData>(() => getStoredPoliticaSST());
  const [isEditing, setIsEditing] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Formulario temporal de edición
  const [editTitulo, setEditTitulo] = useState(politica.titulo);
  const [editIntroduccion, setEditIntroduccion] = useState(politica.declaracionIntroductoria);
  const [editCompromisos, setEditCompromisos] = useState<CompromisoPolitica[]>(politica.compromisos);
  const [editComunicacion, setEditComunicacion] = useState(politica.comunicacionRevision);
  const [editNombreFirmante, setEditNombreFirmante] = useState(politica.nombreFirmante);
  const [editCargoFirmante, setEditCargoFirmante] = useState(politica.cargoFirmante);
  const [editEstado, setEditEstado] = useState<'Pendiente de aprobación' | 'Vigente'>(politica.estado);
  const [motivoCambio, setMotivoCambio] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fechaActual = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Iniciar modo edición
  const handleStartEdit = () => {
    setEditTitulo(politica.titulo);
    setEditIntroduccion(politica.declaracionIntroductoria);
    setEditCompromisos([...politica.compromisos]);
    setEditComunicacion(politica.comunicacionRevision);
    setEditNombreFirmante(politica.nombreFirmante);
    setEditCargoFirmante(politica.cargoFirmante);
    setEditEstado(politica.estado);
    setMotivoCambio('');
    setIsEditing(true);
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Guardar cambios con historial
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();

    const ahora = new Date();
    const fechaIso = ahora.toISOString().split('T')[0];
    const horaFormato = ahora.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const versionNum = (politica.historialCambios.length + 1).toFixed(1);
    const nuevaVersion = `Versión ${versionNum} (${ahora.getFullYear()})`;

    const nuevoRegistroHistorial: RegistroHistorialPolitica = {
      id: `hist-${Date.now()}`,
      fecha: fechaIso,
      hora: horaFormato,
      version: nuevaVersion,
      autor: 'Alta Dirección / Responsable SG-SST Frikaz',
      motivoCambio:
        motivoCambio.trim() || 'Actualización periódica del documento de Política de SST.',
      estado: editEstado,
      detallesModificacion: `Política guardada en estado ${editEstado}. Se actualizaron compromisos y declaraciones.`,
    };

    const updatedPolitica: PoliticaSSTData = {
      ...politica,
      titulo: editTitulo.trim(),
      declaracionIntroductoria: editIntroduccion.trim(),
      compromisos: editCompromisos,
      comunicacionRevision: editComunicacion.trim(),
      nombreFirmante: editNombreFirmante.trim(),
      cargoFirmante: editCargoFirmante.trim(),
      estado: editEstado,
      fechaUltimaActualizacion: fechaIso,
      fechaAprobacion: editEstado === 'Vigente' ? fechaIso : politica.fechaAprobacion,
      versionActual: nuevaVersion,
      historialCambios: [nuevoRegistroHistorial, ...politica.historialCambios],
    };

    setPolitica(updatedPolitica);
    saveStoredPoliticaSST(updatedPolitica);
    setIsEditing(false);
    triggerToast('¡Política del SG-SST actualizada y guardada con éxito!');
  };

  // Cambiar compromiso individual
  const handleEditCompromisoText = (id: number, texto: string) => {
    setEditCompromisos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, descripcion: texto } : c))
    );
  };

  // Descargar Word
  const handleDescargarWord = async () => {
    try {
      setIsDownloadingWord(true);
      await exportarPoliticaWord(politica);
      triggerToast('Documento Word (.DOCX) de la Política generado con éxito.');
    } catch (error) {
      console.error('Error generando Word de Política:', error);
      alert('Ocurrió un error al generar el archivo .DOCX.');
    } finally {
      setIsDownloadingWord(false);
    }
  };

  // Descargar PDF / Imprimir
  const handleDescargarPDF = () => {
    window.print();
  };

  // Restablecer política original
  const handleResetearOriginal = () => {
    if (
      window.confirm(
        '¿Desea restablecer la Política de SST al texto institucional canónico de Frikaz S.A.S.?'
      )
    ) {
      const reset = resetStoredPoliticaSST();
      setPolitica(reset);
      setIsEditing(false);
      triggerToast('Política de SST restablecida a los valores iniciales.');
    }
  };

  // Toggle rápido de estado de aprobación
  const handleToggleEstadoAprobacion = () => {
    const nuevoEstado =
      politica.estado === 'Vigente' ? 'Pendiente de aprobación' : 'Vigente';
    const ahora = new Date();
    const fechaIso = ahora.toISOString().split('T')[0];

    const nuevoRegistro: RegistroHistorialPolitica = {
      id: `hist-${Date.now()}`,
      fecha: fechaIso,
      hora: ahora.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      version: politica.versionActual,
      autor: 'Gerente General / Representante Legal Frikaz S.A.S.',
      motivoCambio: `Cambio de estado formal: ${nuevoEstado}`,
      estado: nuevoEstado,
      detallesModificacion:
        nuevoEstado === 'Vigente'
          ? 'Política formalmente aprobada por la Gerencia General para vigencia anual.'
          : 'Política devuelta a estado pendiente de revisión o aprobación.',
    };

    const updated: PoliticaSSTData = {
      ...politica,
      estado: nuevoEstado,
      fechaAprobacion: nuevoEstado === 'Vigente' ? fechaIso : undefined,
      fechaUltimaActualizacion: fechaIso,
      historialCambios: [nuevoRegistro, ...politica.historialCambios],
    };

    setPolitica(updated);
    saveStoredPoliticaSST(updated);
    triggerToast(
      nuevoEstado === 'Vigente'
        ? '¡Política aprobada formalmente y marcada como VIGENTE!'
        : 'Política marcada como PENDIENTE DE APROBACIÓN.'
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast de confirmación */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER DE POLÍTICA */}
      <div className="rounded-2xl border border-slate-700/80 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0a192f] p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-orange-500/20 px-3 py-1 text-xs font-black tracking-wider uppercase text-orange-300 border border-orange-500/30">
              <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
              Directriz Estratégica del SG-SST
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <span>Políticas del SG-SST</span>
              <span className="text-orange-400 font-mono text-base">[Frikaz S.A.S.]</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Consulte, edite, apruebe y descargue el documento oficial de la Política de Seguridad y Salud en el Trabajo, estructurada conforme al Decreto 1072 de 2015 con los compromisos prioritarios para la producción y comercialización de snacks.
            </p>
          </div>

          {/* BOTONES DE ACCIÓN PRINCIPALES */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Descargar en Word */}
            <button
              onClick={handleDescargarWord}
              disabled={isDownloadingWord}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold transition-all shadow-lg shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Descargar política completa editable en formato Microsoft Word (.DOCX)"
            >
              <FileDown className="h-4 w-4" />
              <span>{isDownloadingWord ? 'Generando...' : 'Descargar en Word'}</span>
            </button>

            {/* Descargar en PDF / Imprimir */}
            <button
              onClick={handleDescargarPDF}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
              title="Imprimir o guardar en PDF la política de SST"
            >
              <Printer className="h-4 w-4 text-slate-300" />
              <span>Descargar en PDF</span>
            </button>

            {/* Editar Política */}
            {!isEditing && (
              <button
                onClick={handleStartEdit}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40 flex items-center gap-1.5 cursor-pointer"
                title="Editar el contenido de la política"
              >
                <Edit3 className="h-4 w-4" />
                <span>Editar Política</span>
              </button>
            )}

            {/* Historial de Actualizaciones */}
            <button
              onClick={() => setShowHistoryModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
              title="Ver el historial de cambios registrados en la política"
            >
              <History className="h-4 w-4 text-purple-400" />
              <span>Historial ({politica.historialCambios.length})</span>
            </button>

            {/* Acceso a Devoluciones por Correo */}
            {onIrADocumentosDevueltos && (
              <button
                onClick={onIrADocumentosDevueltos}
                className="px-3.5 py-2 rounded-xl bg-orange-600/30 hover:bg-orange-600/50 text-orange-200 text-xs font-bold border border-orange-500/40 transition-all cursor-pointer flex items-center gap-1.5"
                title="Ver constancias de divulgación y aprobación devueltas por correo"
              >
                <Inbox className="h-4 w-4 text-orange-400" />
                <span>Devoluciones por Correo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ESTADO DE APROBACIÓN Y ACCIÓN RÁPIDA */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${
              politica.estado === 'Vigente'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {politica.estado === 'Vigente' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Clock className="h-5 w-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Estado de la Política:</span>
              <span
                className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                  politica.estado === 'Vigente'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {politica.estado}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                · {politica.versionActual}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {politica.estado === 'Vigente'
                ? `Aprobada el ${politica.fechaAprobacion || politica.fechaUltimaActualizacion} por Gerencia General.`
                : 'El documento está redactado y pendiente de firma / aprobación gerencial.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleEstadoAprobacion}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              politica.estado === 'Vigente'
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>
              {politica.estado === 'Vigente'
                ? 'Marcar como Pendiente'
                : 'Aprobar Política (Marcar como Vigente)'}
            </span>
          </button>

          <button
            onClick={handleResetearOriginal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Restablecer texto original canónico"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* DOCUMENTO DIGITAL DE LA POLÍTICA (VISTA O EDICIÓN) */}
      {!isEditing ? (
        /* VISTA DIGITAL PROFESIONAL (ESTILO DOCUMENTO OFICIAL) */
        <div
          id="documento-digital-politica"
          className="bg-white text-slate-900 rounded-3xl border border-slate-300 p-8 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden"
        >
          {/* Marca de agua sutil de Frikaz */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none text-9xl font-black tracking-widest text-slate-950">
            FRIKAZ
          </div>

          {/* Membrete Oficial */}
          <div className="border-b-2 border-slate-900/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src="/frikaz_logo.jpg"
                alt="Logo Frikaz S.A.S."
                className="h-16 w-16 rounded-xl object-cover border border-orange-500/40 p-1 shadow-sm"
              />
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  FRIKAZ S.A.S.
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  NIT: {politica.nit} · Bosa, Bogotá D.C.
                </p>
                <p className="text-[11px] text-slate-500">
                  Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST)
                </p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-300 sm:pl-6 text-xs text-slate-600 space-y-1">
              <div>
                <span className="font-bold">Código:</span> POL-SST-001
              </div>
              <div>
                <span className="font-bold">Versión:</span> {politica.versionActual}
              </div>
              <div>
                <span className="font-bold">Estado:</span>{' '}
                <span
                  className={`font-bold ${
                    politica.estado === 'Vigente' ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {politica.estado}
                </span>
              </div>
              <div>
                <span className="font-bold">Fecha:</span> {fechaActual}
              </div>
            </div>
          </div>

          {/* TÍTULO PRINCIPAL */}
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide uppercase">
              {politica.titulo}
            </h2>
            <p className="text-xs text-slate-500 italic">
              Conforme a los lineamientos del Decreto 1072 de 2015 y la Resolución 0312 de 2019
            </p>
          </div>

          {/* TEXTO INTRODUCTORIO */}
          <div className="text-justify text-sm sm:text-base leading-relaxed text-slate-800">
            <p className="indent-6">{politica.declaracionIntroductoria}</p>
          </div>

          {/* COMPROMISOS ENUMERADOS */}
          <div className="space-y-4 pt-2">
            {politica.compromisos.map((comp) => (
              <div
                key={comp.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-orange-300 transition-colors space-y-1"
              >
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center h-7 w-7 rounded-full bg-orange-500 text-white font-black text-sm shrink-0 shadow-sm mt-0.5">
                    {comp.id}
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900">{comp.titulo}</h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                      {comp.descripcion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CIERRE DE COMUNICACIÓN Y REVISIÓN ANUAL */}
          <div className="text-justify text-xs sm:text-sm text-slate-700 italic border-t border-slate-200 pt-4 leading-relaxed">
            {politica.comunicacionRevision}
          </div>

          {/* ESPACIO PARA FIRMA DEL GERENTE GENERAL */}
          <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="h-16 flex items-end">
                <div className="w-full border-b-2 border-slate-800 pb-1">
                  {politica.estado === 'Vigente' && (
                    <span className="text-xs font-mono font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Firma aprobada por Gerencia General (Frikaz S.A.S.)</span>
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{politica.nombreFirmante}</p>
                <p className="text-xs text-slate-600">{politica.cargoFirmante}</p>
                <p className="text-[11px] text-slate-500">Representante Legal · Frikaz S.A.S.</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 flex flex-col justify-end">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <Calendar className="h-3.5 w-3.5 text-orange-500" />
                  <span>Fecha de Emisión / Revisión:</span>
                </div>
                <p className="text-slate-900 font-semibold">{fechaActual}</p>
                <p className="text-[10px] text-slate-500">
                  Revisión obligatoria mínima: Anual (o ante cambios de procesos/norma)
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MODO DE EDICIÓN DE LA POLÍTICA */
        <form
          onSubmit={handleSaveEdit}
          className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-white"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
                <Edit3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  Editar Política de Seguridad y Salud en el Trabajo
                </h3>
                <p className="text-xs text-slate-400">
                  Modifique los textos, compromisos o estado de aprobación.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Título y Estado */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Título de la Política:
                </label>
                <input
                  type="text"
                  required
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Estado de Aprobación:
                </label>
                <select
                  value={editEstado}
                  onChange={(e) =>
                    setEditEstado(e.target.value as 'Pendiente de aprobación' | 'Vigente')
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Pendiente de aprobación">Pendiente de aprobación</option>
                  <option value="Vigente">Vigente (Aprobada por Gerencia)</option>
                </select>
              </div>
            </div>

            {/* Texto introductorio */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Declaración Inicial de la Alta Dirección:
              </label>
              <textarea
                rows={3}
                required
                value={editIntroduccion}
                onChange={(e) => setEditIntroduccion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>

            {/* Compromisos Enumerados */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-200 block border-b border-slate-800 pb-1">
                Compromisos Enumerados de la Política (4 Ejes Fundamentales):
              </label>
              {editCompromisos.map((comp) => (
                <div key={comp.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-orange-500 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                      {comp.id}
                    </span>
                    <span className="text-xs font-bold text-orange-300">{comp.titulo}</span>
                  </div>
                  <textarea
                    rows={3}
                    value={comp.descripcion}
                    onChange={(e) => handleEditCompromisoText(comp.id, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 leading-relaxed"
                  />
                </div>
              ))}
            </div>

            {/* Cierre */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Cláusula de Comunicación y Revisión:
              </label>
              <textarea
                rows={2}
                value={editComunicacion}
                onChange={(e) => setEditComunicacion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Firmante */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Nombre del Firmante (Gerente General):
                </label>
                <input
                  type="text"
                  value={editNombreFirmante}
                  onChange={(e) => setEditNombreFirmante(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Cargo del Firmante:
                </label>
                <input
                  type="text"
                  value={editCargoFirmante}
                  onChange={(e) => setEditCargoFirmante(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Motivo del cambio para el historial */}
            <div className="space-y-1 p-3 rounded-xl bg-purple-950/30 border border-purple-500/30">
              <label className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <History className="h-3.5 w-3.5" />
                <span>Motivo de la Modificación (para el Historial de Auditoría):</span>
              </label>
              <input
                type="text"
                placeholder="Ej. Revisión anual periódica 2026 / Actualización de alcance operacional..."
                value={motivoCambio}
                onChange={(e) => setMotivoCambio(e.target.value)}
                className="w-full bg-slate-950 border border-purple-500/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400 placeholder-slate-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* MODAL DE HISTORIAL DE ACTUALIZACIONES */}
      {/* ========================================================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Historial de Actualizaciones de la Política de SST
                  </h3>
                  <p className="text-xs text-slate-400">
                    Registro de trazabilidad y auditoría de cambios conforme al Decreto 1072/2015
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 overflow-y-auto">
              {politica.historialCambios.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  No hay registros de cambios en el historial.
                </p>
              ) : (
                politica.historialCambios.map((reg) => (
                  <div
                    key={reg.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-orange-400">
                          {reg.version}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            reg.estado === 'Vigente'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {reg.estado}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {reg.fecha} · {reg.hora}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 font-semibold">{reg.motivoCambio}</p>
                    <p className="text-[11px] text-slate-400">{reg.detallesModificacion}</p>
                    <p className="text-[10px] text-slate-500 italic">Registrado por: {reg.autor}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
