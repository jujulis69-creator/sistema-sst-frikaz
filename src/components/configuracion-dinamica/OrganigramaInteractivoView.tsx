import React, { useState, useMemo } from 'react';
import { CargoSST, NivelJerarquicoSST } from '../../types/organigramaSst';
import {
  getStoredCargosSST,
  saveStoredCargosSST,
  exportarResponsabilidadesWord,
} from '../../services/organigramaService';
import {
  Crown,
  ShieldCheck,
  CheckCircle2,
  Scissors,
  Flame,
  Package,
  Truck,
  FileDown,
  FileText,
  User,
  Briefcase,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Info,
  Building2,
  Search,
  X,
  Printer,
  Check,
  AlertCircle,
  Users,
  Inbox,
} from 'lucide-react';

interface OrganigramaInteractivoViewProps {
  onIrAPoliticas?: () => void;
  onIrADocumentosDevueltos?: () => void;
}

export const OrganigramaInteractivoView: React.FC<OrganigramaInteractivoViewProps> = ({
  onIrAPoliticas,
  onIrADocumentosDevueltos,
}) => {
  const [cargos, setCargos] = useState<CargoSST[]>(() => getStoredCargosSST());
  const [cargoSeleccionado, setCargoSeleccionado] = useState<CargoSST | null>(() => {
    const list = getStoredCargosSST();
    return list[0] || null;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Formulario opcional para personalizar el nombre del trabajador en el .DOCX
  const [nombreTrabajador, setNombreTrabajador] = useState('');
  const [documentoTrabajador, setDocumentoTrabajador] = useState('');
  const [mostrarPersonalizacion, setMostrarPersonalizacion] = useState(false);

  // Icon selector helper
  const renderIconoCargo = (icono: string, className: string = 'h-5 w-5') => {
    switch (icono) {
      case 'Crown':
        return <Crown className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Scissors':
        return <Scissors className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Package':
        return <Package className={className} />;
      case 'Truck':
        return <Truck className={className} />;
      case 'CheckCircle2':
      default:
        return <CheckCircle2 className={className} />;
    }
  };

  // Group by level
  const nivel1AltaDireccion = useMemo(
    () => cargos.filter((c) => c.nivelJerarquico === 'ALTA_DIRECCION'),
    [cargos]
  );
  const nivel2Responsable = useMemo(
    () => cargos.filter((c) => c.nivelJerarquico === 'RESPONSABLE_SST'),
    [cargos]
  );
  const nivel3Operativo = useMemo(
    () => cargos.filter((c) => c.nivelJerarquico === 'NIVEL_OPERATIVO'),
    [cargos]
  );

  // Handle open modal for cargo
  const handleVerDetalles = (cargo: CargoSST) => {
    setCargoSeleccionado(cargo);
    setIsModalOpen(true);
    setMostrarPersonalizacion(false);
  };

  // Handle download Word
  const handleDescargarWord = async (cargo: CargoSST) => {
    try {
      setIsDownloadingWord(true);
      await exportarResponsabilidadesWord(cargo, {
        nombreTrabajador: nombreTrabajador || undefined,
        numeroIdentificacion: documentoTrabajador || undefined,
      });
      setDownloadSuccessToast(`Documento .DOCX de ${cargo.nombre} descargado exitosamente`);
      setTimeout(() => setDownloadSuccessToast(null), 4000);
    } catch (error) {
      console.error('Error generando documento Word:', error);
      alert('Ocurrió un error al generar el archivo .DOCX. Por favor reintente.');
    } finally {
      setIsDownloadingWord(false);
    }
  };

  // Print function for the selected cargo
  const handleImprimirCargo = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast de confirmación de descarga */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* HEADER DE LA SECCIÓN */}
      <div className="rounded-2xl border border-slate-700/80 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0a192f] p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-purple-500/20 px-3 py-1 text-xs font-black tracking-wider uppercase text-purple-300 border border-purple-500/30">
              <Crown className="h-3.5 w-3.5 text-purple-400" />
              Estructura Organizacional del SG-SST
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <span>Organigrama y Responsabilidades SST</span>
              <span className="text-purple-400 font-mono text-base">[Frikaz S.A.S.]</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Consulte la jerarquía formal en Seguridad y Salud en el Trabajo. Haga clic en cualquiera de los{' '}
              <strong className="text-white">7 cargos oficiales</strong> para explorar sus responsabilidades, compromisos de prevención y descargar el documento individual editable en formato{' '}
              <strong className="text-purple-300 font-mono">Word (.DOCX)</strong> listo para firma del colaborador y del responsable de SST.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onIrAPoliticas && (
              <button
                onClick={onIrAPoliticas}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="h-3.5 w-3.5 text-orange-400" />
                <span>Ver Política de SST</span>
              </button>
            )}
            <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Cargos</span>
              <span className="text-lg font-black text-white font-mono">{cargos.length} puestos</span>
            </div>
          </div>
        </div>
      </div>

      {/* ORGANIGRAMA VISUAL INTERACTIVO CON NIVELES Y CONECTORES */}
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-inner overflow-x-auto">
        <div className="min-w-[820px] max-w-5xl mx-auto flex flex-col items-center space-y-8">
          {/* ========================================================= */}
          {/* NIVEL 1: ALTA DIRECCIÓN */}
          {/* ========================================================= */}
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 shadow-sm">
                <Crown className="h-3.5 w-3.5 text-purple-400" />
                NIVEL 1. ALTA DIRECCIÓN
              </span>
            </div>

            {nivel1AltaDireccion.map((cargo) => (
              <div
                key={cargo.id}
                onClick={() => handleVerDetalles(cargo)}
                className="group relative cursor-pointer w-72 rounded-2xl p-4 bg-gradient-to-b from-slate-900 to-purple-950/40 border-2 border-purple-500/50 hover:border-purple-400 shadow-xl hover:shadow-purple-500/20 transition-all hover:-translate-y-1"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 group-hover:scale-110 transition-transform">
                    {renderIconoCargo(cargo.icono, 'h-6 w-6 text-purple-400')}
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-purple-400 block">
                      {cargo.nivelNombre}
                    </span>
                    <h3 className="text-base font-black text-white group-hover:text-purple-200 transition-colors">
                      {cargo.nombre}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {cargo.areaProceso}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-purple-500/20 flex items-center justify-between text-[11px]">
                  <span className="text-purple-300/80 font-medium flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>{cargo.responsabilidades.length} responsabilidades</span>
                  </span>
                  <span className="text-purple-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    <span>Ver detalles</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}

            {/* LÍNEA CONECTORA VERTICAL HACIA NIVEL 2 */}
            <div className="w-0.5 h-10 bg-gradient-to-b from-purple-500 to-emerald-500 my-1 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-slate-900" />
            </div>
          </div>

          {/* ========================================================= */}
          {/* NIVEL 2: RESPONSABLE DEL SG-SST */}
          {/* ========================================================= */}
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                NIVEL 2. RESPONSABLE DEL SG-SST
              </span>
            </div>

            {nivel2Responsable.map((cargo) => (
              <div
                key={cargo.id}
                onClick={() => handleVerDetalles(cargo)}
                className="group relative cursor-pointer w-76 rounded-2xl p-4 bg-gradient-to-b from-slate-900 to-emerald-950/40 border-2 border-emerald-500/50 hover:border-emerald-400 shadow-xl hover:shadow-emerald-500/20 transition-all hover:-translate-y-1"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                    {renderIconoCargo(cargo.icono, 'h-6 w-6 text-emerald-400')}
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block">
                      {cargo.nivelNombre}
                    </span>
                    <h3 className="text-base font-black text-white group-hover:text-emerald-200 transition-colors">
                      {cargo.nombre}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {cargo.areaProceso}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-300/80 font-medium flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>{cargo.responsabilidades.length} responsabilidades</span>
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    <span>Ver detalles</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}

            {/* RAMIFICACIÓN HACIA EL NIVEL 3 */}
            <div className="w-0.5 h-8 bg-emerald-500 mt-1 relative" />
            {/* LÍNEA HORIZONTAL DISTRIBUIDORA */}
            <div className="w-4/5 max-w-4xl h-0.5 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-slate-900" />
            </div>
            {/* 5 bajantes hacia los 5 cargos operativos */}
            <div className="w-4/5 max-w-4xl flex justify-between h-6">
              <div className="w-0.5 h-full bg-blue-500" />
              <div className="w-0.5 h-full bg-cyan-500" />
              <div className="w-0.5 h-full bg-orange-500" />
              <div className="w-0.5 h-full bg-amber-500" />
              <div className="w-0.5 h-full bg-emerald-500" />
            </div>
          </div>

          {/* ========================================================= */}
          {/* NIVEL 3: NIVEL OPERATIVO (5 CARGOS) */}
          {/* ========================================================= */}
          <div className="w-full">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1.5 shadow-sm">
                <Briefcase className="h-3.5 w-3.5 text-blue-400" />
                NIVEL 3. NIVEL OPERATIVO (5 PUESTOS)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {nivel3Operativo.map((cargo) => (
                <div
                  key={cargo.id}
                  onClick={() => handleVerDetalles(cargo)}
                  className={`group relative cursor-pointer rounded-2xl p-4 bg-slate-900/90 border-2 ${cargo.colorTheme.border} hover:border-white shadow-lg transition-all hover:-translate-y-1.5 flex flex-col justify-between`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div
                        className={`p-2 rounded-xl ${cargo.colorTheme.badgeBg} ${cargo.colorTheme.accent} border ${cargo.colorTheme.border}`}
                      >
                        {renderIconoCargo(cargo.icono, 'h-4 w-4')}
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {cargo.responsabilidades.length} resp.
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                        {cargo.nombre}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {cargo.areaProceso}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 group-hover:text-slate-300">Consultar</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      <span>Ver ficha</span>
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TARJETA INFORMATIVA / ACCESO RÁPIDO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400 shrink-0">
            <FileDown className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Descarga Individual en Word (.DOCX)</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Cada cargo genera un archivo editable formal con espacios listos para firmas manuscritas.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Decreto 1072 de 2015</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Cumple el Artículo 2.2.4.6.8 sobre comunicación formal de responsabilidades a todos los niveles.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">100% Adaptado a Frikaz S.A.S.</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Desde la alta dirección hasta la operación de freidoras industriales y distribución vial.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL DETALLADO DE CARGO, RESPONSABILIDADES Y DESCARGA WORD */}
      {/* ========================================================= */}
      {isModalOpen && cargoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className={`p-6 bg-gradient-to-r ${cargoSeleccionado.colorTheme.gradient} border-b border-slate-800 flex items-start justify-between gap-4`}>
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-white/10 text-white border border-white/20 backdrop-blur-sm shadow-md">
                  {renderIconoCargo(cargoSeleccionado.icono, 'h-7 w-7 text-white')}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/20">
                      {cargoSeleccionado.nivelNombre}
                    </span>
                    <span className="text-xs text-slate-300">Frikaz S.A.S.</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {cargoSeleccionado.nombre}
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{cargoSeleccionado.areaProceso}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 space-y-6 overflow-y-auto text-slate-200">
              {/* Descripción del puesto */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Propósito del Cargo en SST:</strong>
                  {cargoSeleccionado.descripcionPuesto}
                </div>
              </div>

              {/* RESPONSABILIDADES ESPECÍFICAS EN MATERIA DE SST */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    Responsabilidades Específicas en Materia de SST ({cargoSeleccionado.responsabilidades.length})
                  </h4>
                </div>

                <div className="space-y-2">
                  {cargoSeleccionado.responsabilidades.map((resp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 text-xs text-slate-200 flex items-start gap-3 transition-colors"
                    >
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold font-mono shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMPROMISOS QUE DEBE CUMPLIR EL TRABAJADOR */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    Compromisos Operativos frente al SG-SST ({cargoSeleccionado.compromisos.length})
                  </h4>
                </div>

                <div className="space-y-2">
                  {cargoSeleccionado.compromisos.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-xs text-slate-200 flex items-start gap-3"
                    >
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[11px] font-bold font-mono shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="leading-relaxed">{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PANEL DE PERSONALIZACIÓN OPCIONAL DE NOMBRES ANTES DE DESCARGAR */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="h-4 w-4 text-purple-400" />
                    <span>Personalizar datos del trabajador para el documento (Opcional):</span>
                  </span>
                  <button
                    onClick={() => setMostrarPersonalizacion(!mostrarPersonalizacion)}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                  >
                    {mostrarPersonalizacion ? 'Ocultar campos' : 'Ingresar nombre y cédula'}
                  </button>
                </div>

                {mostrarPersonalizacion && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                        Nombre completo del trabajador:
                      </label>
                      <input
                        type="text"
                        value={nombreTrabajador}
                        onChange={(e) => setNombreTrabajador(e.target.value)}
                        placeholder="Ej. Carlos Mario Rodríguez"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                        Número de identificación (C.C.):
                      </label>
                      <input
                        type="text"
                        value={documentoTrabajador}
                        onChange={(e) => setDocumentoTrabajador(e.target.value)}
                        placeholder="Ej. 1.020.345.678"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Documento oficial individual conforme al Decreto 1072/2015
              </span>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>

                {onIrADocumentosDevueltos && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      onIrADocumentosDevueltos();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    title="Ir a la bandeja de documentos devueltos por correo"
                  >
                    <Inbox className="h-4 w-4 text-purple-200" />
                    <span>Ver Devoluciones por Correo</span>
                  </button>
                )}

                {/* BOTÓN OBLIGATORIO: DESCARGAR RESPONSABILIDADES EN WORD */}
                <button
                  onClick={() => handleDescargarWord(cargoSeleccionado)}
                  disabled={isDownloadingWord}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-black transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  title="Generar y descargar documento oficial editable en formato Microsoft Word (.DOCX)"
                >
                  <FileDown className="h-4 w-4" />
                  <span>
                    {isDownloadingWord
                      ? 'Generando Word...'
                      : 'Descargar responsabilidades en Word'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
