import React, { useState, useEffect } from 'react';
import {
  ConfiguracionPresentacion,
  FasePresentacionConfig,
} from '../types/presentationConfig';
import { FasePhva } from '../types/phvaEvidence';
import {
  X,
  Save,
  RotateCcw,
  Check,
  Type,
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface PresentacionEditorModalProps {
  isOpen: boolean;
  config: ConfiguracionPresentacion;
  onClose: () => void;
  onSave: (updated: ConfiguracionPresentacion) => void;
  onReset: () => void;
  initialTab?: 'banner' | 'fases' | 'modulos' | 'guia';
  activeFaseDefault?: FasePhva;
}

export const PresentacionEditorModal: React.FC<PresentacionEditorModalProps> = ({
  isOpen,
  config,
  onClose,
  onSave,
  onReset,
  initialTab = 'banner',
  activeFaseDefault = 'PLANEAR',
}) => {
  const [activeTab, setActiveTab] = useState<'banner' | 'fases' | 'modulos' | 'guia'>('banner');
  const [selectedFase, setSelectedFase] = useState<FasePhva>('PLANEAR');
  const [formData, setFormData] = useState<ConfiguracionPresentacion | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(JSON.parse(JSON.stringify(config)));
      setActiveTab(initialTab);
      setSelectedFase(activeFaseDefault);
      setSaveSuccess(false);
    }
  }, [isOpen, config, initialTab, activeFaseDefault]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 1500);
  };

  const handleReset = () => {
    if (
      window.confirm(
        '¿Desea restablecer todos los encabezados y descripciones de la presentación a los textos oficiales originales?'
      )
    ) {
      onReset();
      onClose();
    }
  };

  const updateBannerField = (field: keyof typeof formData.banner, value: string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        banner: {
          ...prev.banner,
          [field]: value,
        },
      };
    });
  };

  const updateFaseHeader = (
    fase: FasePhva,
    field: 'tituloFase' | 'subtituloFase',
    value: string
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        fases: {
          ...prev.fases,
          [fase]: {
            ...prev.fases[fase],
            [field]: value,
          },
        },
      };
    });
  };

  const updateModuloField = (
    fase: FasePhva,
    modIndex: number,
    field: 'titulo' | 'desc',
    value: string
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const modulosCopy = [...prev.fases[fase].modulos];
      modulosCopy[modIndex] = {
        ...modulosCopy[modIndex],
        [field]: value,
      };
      return {
        ...prev,
        fases: {
          ...prev.fases,
          [fase]: {
            ...prev.fases[fase],
            modulos: modulosCopy,
          },
        },
      };
    });
  };

  const updateGuiaField = (field: 'titulo' | 'descripcion', value: string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        guiaDocente: {
          ...prev.guiaDocente,
          [field]: value,
        },
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header - Azul Oscuro con Logo y Acentos Naranja */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0f172a] text-white border-b-4 border-[#f97316]">
          <div className="flex items-center gap-3">
            <img
              src="/frikaz_logo.jpg"
              alt="Logo Frikaz"
              className="h-11 w-auto max-w-[90px] object-contain rounded-lg border border-orange-200/40 bg-white p-0.5 shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#fed7aa] px-2 py-0.5 text-[10px] font-black uppercase text-[#0f172a]">
                  Personalización Total
                </span>
                <span className="text-xs text-orange-200 font-bold flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-[#fed7aa]" />
                  Editor de Presentación
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                Editar Encabezados, Módulos y Textos de la Presentación
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold transition-colors"
              title="Restablecer textos por defecto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Restablecer</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Cerrar editor"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside Editor */}
        <div className="flex items-center gap-1 bg-slate-100 px-6 py-2.5 border-b border-slate-200 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('banner')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'banner'
                ? 'bg-[#0f172a] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Type className="h-3.5 w-3.5 text-[#fed7aa]" />
            <span>1. Banner & Título Principal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fases')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'fases'
                ? 'bg-[#0f172a] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-[#fed7aa]" />
            <span>2. Títulos de las 4 Fases (P-H-V-A)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('modulos')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'modulos'
                ? 'bg-[#0f172a] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#fed7aa]" />
            <span>3. Los 16 Módulos / Cuadrantes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guia')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'guia'
                ? 'bg-[#0f172a] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-[#fed7aa]" />
            <span>4. Guía Pedagógica / Docente</span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-800">
          {saveSuccess && (
            <div className="rounded-xl bg-emerald-50 border-2 border-emerald-500 p-3.5 flex items-center justify-between text-emerald-900 shadow-xs animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-xs">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>¡Textos y encabezados de la presentación actualizados exitosamente!</span>
              </div>
            </div>
          )}

          {/* TAB 1: BANNER PRINCIPAL */}
          {activeTab === 'banner' && (
            <div className="space-y-4">
              <div className="bg-[#fff7ed] border border-orange-200 rounded-xl p-3.5">
                <span className="font-bold text-orange-950 text-xs uppercase block">
                  Encabezado Principal de la Presentación:
                </span>
                <p className="text-[11px] text-orange-900 mt-0.5">
                  Modifique el título, subtítulo, etiquetas de evidencia y texto descriptivo que aparecen en la parte superior.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Título Principal de la Presentación:
                  </label>
                  <input
                    type="text"
                    value={formData.banner.titulo}
                    onChange={(e) => updateBannerField('titulo', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-bold text-slate-900 focus:border-[#0f172a] focus:outline-hidden"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Descripción / Resumen de la Presentación:
                  </label>
                  <textarea
                    rows={3}
                    value={formData.banner.descripcion}
                    onChange={(e) => updateBannerField('descripcion', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-700 focus:border-[#0f172a] focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Etiqueta Principal (Badge Superior):
                  </label>
                  <input
                    type="text"
                    value={formData.banner.etiqueta}
                    onChange={(e) => updateBannerField('etiqueta', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Subetiqueta de Herramienta:
                  </label>
                  <input
                    type="text"
                    value={formData.banner.subetiqueta}
                    onChange={(e) => updateBannerField('subetiqueta', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Contexto de Empresa / Ubicación:
                  </label>
                  <input
                    type="text"
                    value={formData.banner.empresaInfo}
                    onChange={(e) => updateBannerField('empresaInfo', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TÍTULOS DE LAS 4 FASES PHVA */}
          {activeTab === 'fases' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <span className="font-bold text-slate-900 text-xs uppercase block">
                  Encabezados de las 4 Fases del Ciclo PHVA:
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Personalice el título y la instrucción pedagógica de cada fase (Planear, Hacer, Verificar, Actuar).
                </p>
              </div>

              {(['PLANEAR', 'HACER', 'VERIFICAR', 'ACTUAR'] as FasePhva[]).map((fase) => (
                <div key={fase} className="rounded-xl border border-slate-300 p-4 bg-white shadow-2xs space-y-2.5">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="rounded-md bg-[#0f172a] text-[#fed7aa] px-2 py-0.5 font-black text-[10px] uppercase">
                      FASE {fase}
                    </span>
                    <strong className="text-slate-800 text-xs">
                      Configuración de la Diapositiva {fase}
                    </strong>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Título de la Sección {fase}:
                    </label>
                    <input
                      type="text"
                      value={formData.fases[fase].tituloFase}
                      onChange={(e) => updateFaseHeader(fase, 'tituloFase', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Subtítulo / Instrucción al Evaluador:
                    </label>
                    <input
                      type="text"
                      value={formData.fases[fase].subtituloFase}
                      onChange={(e) => updateFaseHeader(fase, 'subtituloFase', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-600"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: LOS 16 MÓDULOS / CUADRANTES */}
          {activeTab === 'modulos' && (
            <div className="space-y-4">
              {/* Fase Selector Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <span className="font-bold text-slate-700 text-xs">Seleccione Fase a Editar:</span>
                {(['PLANEAR', 'HACER', 'VERIFICAR', 'ACTUAR'] as FasePhva[]).map((fase) => (
                  <button
                    key={fase}
                    type="button"
                    onClick={() => setSelectedFase(fase)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedFase === fase
                        ? 'bg-[#f97316] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {fase}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.fases[selectedFase].modulos.map((mod, idx) => (
                  <div
                    key={mod.subtema}
                    className="rounded-xl border border-slate-300 p-4 bg-slate-50/70 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-black text-[10px] text-[#f97316] uppercase">
                        MÓDULO {idx + 1} ({selectedFase})
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 font-bold">
                        {mod.subtema}
                      </span>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Título del Módulo {idx + 1}:
                      </label>
                      <input
                        type="text"
                        value={mod.titulo}
                        onChange={(e) =>
                          updateModuloField(selectedFase, idx, 'titulo', e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-900 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Descripción Resumida:
                      </label>
                      <textarea
                        rows={2}
                        value={mod.desc}
                        onChange={(e) =>
                          updateModuloField(selectedFase, idx, 'desc', e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-700 bg-white"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GUÍA PEDAGÓGICA / DOCENTE */}
          {activeTab === 'guia' && (
            <div className="space-y-4">
              <div className="bg-[#fff7ed] border border-orange-200 rounded-xl p-3.5">
                <span className="font-bold text-orange-950 text-xs uppercase block">
                  Recuadro de la Guía de Evaluación del Docente:
                </span>
                <p className="text-[11px] text-orange-900 mt-0.5">
                  Edite el texto que aparece al pie de la presentación explicando los 6 círculos obligatorios de la evidencia.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Título del Recuadro:
                </label>
                <input
                  type="text"
                  value={formData.guiaDocente.titulo}
                  onChange={(e) => updateGuiaField('titulo', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Contenido / Instrucción Detallada:
                </label>
                <textarea
                  rows={5}
                  value={formData.guiaDocente.descripcion}
                  onChange={(e) => updateGuiaField('descripcion', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-700 leading-relaxed"
                  required
                />
              </div>
            </div>
          )}

          {/* Modal Footer with Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-colors"
            >
              Cerrar
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2 rounded-lg bg-[#0f172a] text-white text-xs font-black hover:bg-slate-800 transition-all shadow-md cursor-pointer"
            >
              <Save className="h-4 w-4 text-[#fed7aa]" />
              <span>Guardar Todos los Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
