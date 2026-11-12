import React, { useState, useMemo } from 'react';
import { CargoSST } from '../../types/organigramaSst';
import {
  getStoredCargosSST,
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
  ChevronRight,
  X,
  Check,
  Users,
  Mail,
  Send,
  Eye,
  Building2,
  Shield,
  Sparkles,
  ArrowDown,
  Download,
  Info,
  ExternalLink,
} from 'lucide-react';
import { ModalEnviarDocumento } from './documentos-firmados/ModalEnviarDocumento';

interface OrganigramaInteractivoViewProps {
  onIrAPoliticas?: () => void;
}

export const OrganigramaInteractivoView: React.FC<OrganigramaInteractivoViewProps> = ({
  onIrAPoliticas,
}) => {
  const [cargos] = useState<CargoSST[]>(() => getStoredCargosSST());
  const [cargoSeleccionado, setCargoSeleccionado] = useState<CargoSST | null>(() => {
    const list = getStoredCargosSST();
    return list[0] || null;
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Formulario opcional para personalizar el nombre del trabajador en el .DOCX
  const [nombreTrabajador, setNombreTrabajador] = useState('');
  const [documentoTrabajador, setDocumentoTrabajador] = useState('');
  const [mostrarPersonalizacion, setMostrarPersonalizacion] = useState(false);

  // Estado para el modal de envío de responsabilidades por correo
  const [isModalEnviarOpen, setIsModalEnviarOpen] = useState(false);
  const [cargoParaEnviar, setCargoParaEnviar] = useState<CargoSST | null>(null);

  const handleAbrirModalEnvio = (cargo: CargoSST, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCargoParaEnviar(cargo);
    setIsModalEnviarOpen(true);
  };

  // Selector de ícono para cada cargo
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

  // Agrupación jerárquica canónica (3 niveles)
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

  // Selección de cargo y apertura de panel lateral interactivo
  const handleSeleccionarCargo = (cargo: CargoSST) => {
    setCargoSeleccionado(cargo);
    setIsPanelOpen(true);
    setMostrarPersonalizacion(false);
  };

  // Descarga formal en Word (Times New Roman 12pt)
  const handleDescargarWord = async (cargo: CargoSST) => {
    try {
      setIsDownloadingWord(true);
      await exportarResponsabilidadesWord(cargo, {
        nombreTrabajador: nombreTrabajador || undefined,
        numeroIdentificacion: documentoTrabajador || undefined,
      });
      setDownloadSuccessToast(
        `Documento Word (.DOCX) de ${cargo.nombre} generado en Times New Roman 12 pt exitosamente`
      );
      setTimeout(() => setDownloadSuccessToast(null), 4500);
    } catch (error) {
      console.error('Error generando documento Word:', error);
      alert('Ocurrió un error al generar el archivo .DOCX. Por favor reintente.');
    } finally {
      setIsDownloadingWord(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast de confirmación de descarga */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. BARRA SUPERIOR DE ACCIONES Y ENLACES                     */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Building2 className="h-4 w-4 text-orange-400 shrink-0" />
          <span>Configuración Dinámica</span>
          <ChevronRight className="h-3 w-3 text-slate-600" />
          <span className="font-bold text-white">Organigrama y Responsabilidades SST</span>
        </div>

        <div className="flex items-center gap-2.5">
          {onIrAPoliticas && (
            <button
              onClick={onIrAPoliticas}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="h-3.5 w-3.5 text-orange-400" />
              <span>Ver Políticas del SG-SST</span>
            </button>
          )}

          <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>7 Cargos Oficiales</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. ESCENARIO DEL ORGANIGRAMA: REDISEÑO EMPRESARIAL 3D        */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-b from-[#070b14] via-[#0c1527] to-[#070b14] p-6 sm:p-10 text-white shadow-2xl shadow-black/80">
        {/* Fondo decorativo con malla geométrica y patrones tecnológicos */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Malla geométrica de cuadrícula tecnológica */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="corporate-tech-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#38bdf8" strokeWidth="0.8" />
                <circle cx="48" cy="48" r="1.5" fill="#38bdf8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#corporate-tech-grid)" />
          </svg>

          {/* Destellos de iluminación ambiental corporativa */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />

          {/* Líneas decorativas sutiles en los costados */}
          <div className="absolute top-0 left-8 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-slate-700/40 to-transparent" />
          <div className="absolute top-0 right-8 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-slate-700/40 to-transparent" />
        </div>

        {/* CONTENIDO INTERNO DEL ORGANIGRAMA */}
        <div className="relative z-10 space-y-10">
          {/* ======================================================== */}
          {/* ENCABEZADO CORPORATIVO CON LOGO Y TÍTULOS REQUERIDOS    */}
          {/* ======================================================== */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            {/* Composición visual de Frikaz S.A.S. y Seguridad Laboral */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 shadow-lg backdrop-blur-md">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-black text-xs text-white shadow-md">
                F
              </div>
              <span className="font-black text-sm tracking-widest uppercase text-white font-mono">
                FRIKAZ S.A.S.
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Seguridad Laboral</span>
              </span>
            </div>

            {/* Título Principal Requerido */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
              ESTRUCTURA ORGANIZACIONAL – SEGURIDAD Y SALUD EN EL TRABAJO
            </h1>

            {/* Descripción Requerida */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Conoce los niveles jerárquicos y las responsabilidades de cada cargo dentro del SG-SST
            </p>

            {/* Subtítulo con insignias de cumplimiento normativo y formato Word */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Decreto 1072 de 2015 · Art. 2.2.4.6.8
              </span>
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Resolución 0312 de 2019
              </span>
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-300 border border-orange-500/30 font-mono">
                Word: Times New Roman 12 pt · Caja de Calidad Frikaz S.A.S.
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ÁRBOL JERÁRQUICO CONECTADO VERTICALMENTE                */}
          {/* ======================================================== */}
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[840px] max-w-5xl mx-auto flex flex-col items-center space-y-6">
              {/* ===================================================== */}
              {/* PRIMER NIVEL – ALTA DIRECCIÓN (GERENTE GENERAL)       */}
              {/* ===================================================== */}
              <div className="flex flex-col items-center w-full">
                <div className="mb-3">
                  <span className="px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-gradient-to-r from-purple-500/20 via-purple-500/30 to-purple-500/20 text-purple-200 border border-purple-400/40 shadow-lg shadow-purple-950/50 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-purple-400" />
                    <span>PRIMER NIVEL – ALTA DIRECCIÓN</span>
                  </span>
                </div>

                {nivel1AltaDireccion.map((cargo) => {
                  const isSelected = cargoSeleccionado?.id === cargo.id;
                  return (
                    <div
                      key={cargo.id}
                      onClick={() => handleSeleccionarCargo(cargo)}
                      className={`group relative cursor-pointer w-84 rounded-3xl p-5 bg-gradient-to-b from-slate-900/95 via-purple-950/30 to-slate-950/95 border-2 transition-all duration-300 backdrop-blur-md shadow-xl ${
                        isSelected
                          ? 'border-purple-400 ring-4 ring-purple-500/30 shadow-purple-500/30 scale-[1.02]'
                          : 'border-purple-500/50 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-2'
                      }`}
                    >
                      {/* Indicador de Selección Superior */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {cargo.nivelNombre}
                        </span>
                        <span className="text-[10px] text-purple-300/80 font-bold flex items-center gap-1 group-hover:text-purple-200 transition-colors">
                          <span>Ver responsabilidades</span>
                          <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>

                      {/* Cuerpo de la Tarjeta */}
                      <div className="flex items-start gap-4">
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/30 to-indigo-600/30 text-purple-300 border border-purple-400/40 shadow-inner group-hover:scale-110 transition-transform">
                          {renderIconoCargo(cargo.icono, 'h-7 w-7 text-purple-300')}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-black text-white group-hover:text-purple-200 transition-colors">
                            {cargo.nombre}
                          </h3>
                          <p className="text-xs text-slate-300 mt-1 leading-snug">
                            {cargo.areaProceso}
                          </p>
                          <span className="inline-block mt-2 text-[10px] text-purple-300/90 font-mono bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                            {cargo.responsabilidades.length} responsabilidades asignadas
                          </span>
                        </div>
                      </div>

                      {/* Botones de acción directa integrados */}
                      <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSeleccionarCargo(cargo);
                          }}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-bold transition-all border border-purple-500/40 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-purple-300" />
                          <span>Ver ficha</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleAbrirModalEnvio(cargo, e)}
                          className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-purple-900/40 text-purple-200 text-xs font-bold transition-all border border-purple-500/30 flex items-center gap-1.5 cursor-pointer"
                          title="Enviar responsabilidades por correo electrónico"
                        >
                          <Mail className="h-3.5 w-3.5 text-purple-300" />
                          <span>Enviar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* CONECTOR VERTICAL PRINCIPAL DE NIVEL 1 A NIVEL 2 */}
                <div className="relative w-full flex flex-col items-center my-1">
                  <div className="w-1 h-10 bg-gradient-to-b from-purple-500 to-emerald-500 rounded-full" />
                  <div className="h-4 w-4 rounded-full bg-emerald-400 ring-4 ring-slate-950 shadow-md flex items-center justify-center -mt-2">
                    <ArrowDown className="h-2.5 w-2.5 text-slate-950 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* ===================================================== */}
              {/* SEGUNDO NIVEL – RESPONSABLE DEL SG-SST                */}
              {/* ===================================================== */}
              <div className="flex flex-col items-center w-full">
                <div className="mb-3">
                  <span className="px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-gradient-to-r from-emerald-500/20 via-emerald-500/30 to-emerald-500/20 text-emerald-200 border border-emerald-400/40 shadow-lg shadow-emerald-950/50 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>SEGUNDO NIVEL – RESPONSABLE DEL SG-SST</span>
                  </span>
                </div>

                {nivel2Responsable.map((cargo) => {
                  const isSelected = cargoSeleccionado?.id === cargo.id;
                  return (
                    <div
                      key={cargo.id}
                      onClick={() => handleSeleccionarCargo(cargo)}
                      className={`group relative cursor-pointer w-88 rounded-3xl p-5 bg-gradient-to-b from-slate-900/95 via-emerald-950/30 to-slate-950/95 border-2 transition-all duration-300 backdrop-blur-md shadow-xl ${
                        isSelected
                          ? 'border-emerald-400 ring-4 ring-emerald-500/30 shadow-emerald-500/30 scale-[1.02]'
                          : 'border-emerald-500/50 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-2'
                      }`}
                    >
                      {/* Indicador de Selección Superior */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {cargo.nivelNombre}
                        </span>
                        <span className="text-[10px] text-emerald-300/80 font-bold flex items-center gap-1 group-hover:text-emerald-200 transition-colors">
                          <span>Ver responsabilidades</span>
                          <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>

                      {/* Cuerpo de la Tarjeta */}
                      <div className="flex items-start gap-4">
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-600/30 text-emerald-300 border border-emerald-400/40 shadow-inner group-hover:scale-110 transition-transform">
                          {renderIconoCargo(cargo.icono, 'h-7 w-7 text-emerald-300')}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-black text-white group-hover:text-emerald-200 transition-colors">
                            {cargo.nombre}
                          </h3>
                          <p className="text-xs text-slate-300 mt-1 leading-snug">
                            {cargo.areaProceso}
                          </p>
                          <span className="inline-block mt-2 text-[10px] text-emerald-300/90 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                            {cargo.responsabilidades.length} responsabilidades técnicas
                          </span>
                        </div>
                      </div>

                      {/* Botones de acción directa integrados */}
                      <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSeleccionarCargo(cargo);
                          }}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 text-xs font-bold transition-all border border-emerald-500/40 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-emerald-300" />
                          <span>Ver ficha</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleAbrirModalEnvio(cargo, e)}
                          className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-emerald-900/40 text-emerald-200 text-xs font-bold transition-all border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
                          title="Enviar responsabilidades por correo electrónico"
                        >
                          <Mail className="h-3.5 w-3.5 text-emerald-300" />
                          <span>Enviar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* CONECTOR DISTRIBUIDOR DE NIVEL 2 HACIA NIVEL 3 */}
                <div className="relative w-full flex flex-col items-center my-1">
                  {/* Bajante vertical */}
                  <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-cyan-500" />
                  {/* Nodo central */}
                  <div className="h-4 w-4 rounded-full bg-cyan-400 ring-4 ring-slate-950 shadow-md flex items-center justify-center -mt-2 z-10">
                    <ArrowDown className="h-2.5 w-2.5 text-slate-950 stroke-[3]" />
                  </div>
                  {/* Barra horizontal distribuidora */}
                  <div className="w-[90%] max-w-4xl h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-500 rounded-full -mt-2" />
                  {/* 5 bajantes hacia los 5 cargos operativos */}
                  <div className="w-[90%] max-w-4xl flex justify-between h-7 px-8">
                    <div className="w-0.5 h-full bg-gradient-to-b from-blue-500 to-blue-400" />
                    <div className="w-0.5 h-full bg-gradient-to-b from-cyan-500 to-cyan-400" />
                    <div className="w-0.5 h-full bg-gradient-to-b from-orange-500 to-orange-400" />
                    <div className="w-0.5 h-full bg-gradient-to-b from-amber-500 to-amber-400" />
                    <div className="w-0.5 h-full bg-gradient-to-b from-emerald-500 to-emerald-400" />
                  </div>
                </div>
              </div>

              {/* ===================================================== */}
              {/* TERCER NIVEL – NIVEL OPERATIVO (5 CARGOS)             */}
              {/* ===================================================== */}
              <div className="w-full">
                <div className="flex items-center justify-center mb-4">
                  <span className="px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-gradient-to-r from-blue-500/20 via-sky-500/30 to-blue-500/20 text-blue-200 border border-blue-400/40 shadow-lg shadow-blue-950/50 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-sky-400" />
                    <span>TERCER NIVEL – NIVEL OPERATIVO (5 CARGOS EN PLANTA Y RUTA)</span>
                  </span>
                </div>

                {/* Cuadrícula responsiva de 5 cargos operativos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {nivel3Operativo.map((cargo) => {
                    const isSelected = cargoSeleccionado?.id === cargo.id;
                    return (
                      <div
                        key={cargo.id}
                        onClick={() => handleSeleccionarCargo(cargo)}
                        className={`group relative cursor-pointer rounded-3xl p-4 bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-[#070b14] border-2 transition-all duration-300 backdrop-blur-md shadow-xl flex flex-col justify-between ${
                          isSelected
                            ? `${cargo.colorTheme.border} ring-4 ring-sky-500/30 scale-[1.02] shadow-2xl`
                            : `${cargo.colorTheme.border} hover:border-white hover:shadow-2xl hover:-translate-y-2.5`
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Encabezado de la tarjeta */}
                          <div className="flex items-center justify-between">
                            <div
                              className={`p-2.5 rounded-2xl ${cargo.colorTheme.badgeBg} ${cargo.colorTheme.accent} border ${cargo.colorTheme.border} shadow-inner group-hover:scale-110 transition-transform`}
                            >
                              {renderIconoCargo(cargo.icono, 'h-5 w-5')}
                            </div>

                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700">
                              {cargo.responsabilidades.length} resp.
                            </span>
                          </div>

                          {/* Nombre y Área */}
                          <div>
                            <span className="text-[9px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
                              Nivel Operativo
                            </span>
                            <h4 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors leading-snug mt-0.5">
                              {cargo.nombre}
                            </h4>
                            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                              {cargo.areaProceso}
                            </p>
                          </div>
                        </div>

                        {/* Pie de tarjeta con indicador interactivo y acciones */}
                        <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 group-hover:text-slate-200">
                              Seleccionar
                            </span>
                            <span className="text-sky-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                              <span>Ver</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSeleccionarCargo(cargo);
                              }}
                              className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold transition-all border border-slate-700 text-center cursor-pointer"
                            >
                              Ficha
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleAbrirModalEnvio(cargo, e)}
                              className="py-1 px-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 text-sky-300 text-[10px] font-bold transition-all border border-sky-500/30 flex items-center gap-1 cursor-pointer"
                              title="Enviar responsabilidades por correo electrónico"
                            >
                              <Mail className="h-3 w-3" />
                              <span>Enviar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. PANEL LATERAL DESLIZANTE / VENTANA EMERGENTE INTERACTIVA */}
      {/* ============================================================ */}
      {isPanelOpen && cargoSeleccionado && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          {/* Fondo para cerrar al hacer clic afuera */}
          <div
            className="flex-1 cursor-pointer"
            onClick={() => setIsPanelOpen(false)}
            title="Cerrar y regresar al organigrama"
          />

          {/* Panel Lateral Deslizante */}
          <div className="w-full max-w-xl bg-slate-900 border-l border-slate-700/80 shadow-2xl flex flex-col h-full animate-slideInRight text-slate-200 overflow-hidden">
            {/* Header del Panel */}
            <div
              className={`p-6 bg-gradient-to-r ${cargoSeleccionado.colorTheme.gradient} border-b border-slate-800 flex items-start justify-between gap-4`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-white/10 text-white border border-white/20 backdrop-blur-sm shadow-md">
                  {renderIconoCargo(cargoSeleccionado.icono, 'h-7 w-7 text-white')}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/20">
                      {cargoSeleccionado.nivelNombre}
                    </span>
                    <span className="text-xs text-slate-300 font-bold">Frikaz S.A.S.</span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">
                    {cargoSeleccionado.nombre}
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{cargoSeleccionado.areaProceso}</span>
                  </p>
                </div>
              </div>

              {/* Botón Cerrar Superior */}
              <button
                onClick={() => setIsPanelOpen(false)}
                className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                title="Cerrar y regresar al organigrama"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenido del Panel - Scrollable */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* Propósito del Puesto en SST */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-3 shadow-inner">
                <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5 font-bold uppercase tracking-wider text-[11px]">
                    Propósito del Cargo en Seguridad y Salud en el Trabajo:
                  </strong>
                  {cargoSeleccionado.descripcionPuesto}
                </div>
              </div>

              {/* LISTA COMPLETA DE RESPONSABILIDADES ESPECÍFICAS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      Responsabilidades Específicas en Materia de SST ({cargoSeleccionado.responsabilidades.length})
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300">
                    Decreto 1072/2015
                  </span>
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

              {/* LISTA DE COMPROMISOS OPERATIVOS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      Compromisos del Trabajador frente al SG-SST ({cargoSeleccionado.compromisos.length})
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300">
                    Resolución 0312/2019
                  </span>
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

              {/* PANEL DE PERSONALIZACIÓN OPCIONAL DE NOMBRES */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="h-4 w-4 text-purple-400" />
                    <span>Personalizar datos del trabajador para el .DOCX (Opcional):</span>
                  </span>
                  <button
                    onClick={() => setMostrarPersonalizacion(!mostrarPersonalizacion)}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                  >
                    {mostrarPersonalizacion ? 'Ocultar campos' : 'Ingresar datos'}
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
                        placeholder="Ej. Colaborador: Operario de Frito"
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

              {/* Aviso normativo de formato Word obligatorio */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>Formato documental oficial de exportación:</span>
                <span className="font-mono text-white font-bold bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-center">
                  Caja de Calidad Frikaz S.A.S. · Times New Roman 12 pt
                </span>
              </div>
            </div>

            {/* Footer Fijo con Botones Requeridos */}
            <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
                {/* BOTÓN OBLIGATORIO: DESCARGAR RESPONSABILIDADES EN WORD */}
                <button
                  onClick={() => handleDescargarWord(cargoSeleccionado)}
                  disabled={isDownloadingWord}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-black transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  title="Descargar documento oficial en Microsoft Word con fuente Times New Roman 12 pt"
                >
                  <FileDown className="h-4 w-4" />
                  <span>
                    {isDownloadingWord
                      ? 'Generando Word...'
                      : 'Descargar responsabilidades en Word'}
                  </span>
                </button>

                {/* BOTÓN: ENVIAR RESPONSABILIDADES POR CORREO */}
                <button
                  onClick={() => {
                    handleAbrirModalEnvio(cargoSeleccionado);
                  }}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  title="Enviar por correo electrónico al trabajador"
                >
                  <Mail className="h-4 w-4" />
                  <span>Enviar por correo</span>
                </button>
              </div>

              {/* BOTÓN PARA CERRAR Y REGRESAR AL ORGANIGRAMA */}
              <button
                onClick={() => setIsPanelOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer text-center"
              >
                Cerrar y regresar al organigrama
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. MODAL PARA ENVIAR RESPONSABILIDADES POR CORREO ELECTRÓNICO */}
      {/* ============================================================ */}
      {isModalEnviarOpen && cargoParaEnviar && (
        <ModalEnviarDocumento
          isOpen={isModalEnviarOpen}
          onClose={() => setIsModalEnviarOpen(false)}
          tipoDocumento="responsabilidades"
          tituloEntidad={cargoParaEnviar.nombre}
          nombreDocumentoAdjunto={`Responsabilidades_SST_${cargoParaEnviar.nombre.replace(/\s+/g, '_')}_Frikaz.docx`}
          nombreTrabajadorSugerido={nombreTrabajador || ''}
          onEnvioExitoso={(envioId, dest) => {
            setDownloadSuccessToast(`Responsabilidades enviadas por correo a ${dest} [${envioId}]`);
            setTimeout(() => setDownloadSuccessToast(null), 4000);
          }}
        />
      )}
    </div>
  );
};
