import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  CheckSquare,
  RefreshCw,
  FolderLock,
  AlertTriangle,
  Leaf,
  ShieldCheck,
  Building2,
  Bell,
  FileDown,
  X,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'matriz'
  | 'obligaciones'
  | 'phva'
  | 'evidencias'
  | 'acciones'
  | 'ambiental'
  | 'sst'
  | 'empresa'
  | 'alertas'
  | 'informes';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  alertCount: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  alertCount,
  mobileOpen,
  setMobileOpen,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Panel de Control', icon: LayoutDashboard },
    { id: 'matriz' as ActiveTab, label: 'Matriz Normativa', icon: FileSpreadsheet },
    { id: 'obligaciones' as ActiveTab, label: 'Obligaciones Legales', icon: CheckSquare },
    { id: 'phva' as ActiveTab, label: 'Ciclo PHVA', icon: RefreshCw },
    { id: 'evidencias' as ActiveTab, label: 'Gestión de Evidencias', icon: FolderLock },
    { id: 'acciones' as ActiveTab, label: 'Acciones Correctivas', icon: AlertTriangle },
    { id: 'ambiental' as ActiveTab, label: 'Gestión Ambiental', icon: Leaf },
    { id: 'sst' as ActiveTab, label: 'Seguridad y Salud (SST)', icon: ShieldCheck },
    {
      id: 'alertas' as ActiveTab,
      label: 'Centro de Alertas',
      icon: Bell,
      badge: alertCount > 0 ? alertCount : undefined,
    },
    { id: 'informes' as ActiveTab, label: 'Informes y Exportación', icon: FileDown },
    { id: 'empresa' as ActiveTab, label: 'Ficha Frikaz S.A.S.', icon: Building2 },
  ];

  const handleSelect = (id: ActiveTab) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-slate-100 border-r border-slate-800 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } print:hidden`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-[#0a192f]">
          <div className="flex items-center gap-3">
            <img
              src="/frikaz_logo.jpg"
              alt="Logo Frikaz"
              className="h-10 w-auto max-w-[90px] object-contain rounded-lg border border-orange-200/50 bg-white p-0.5 shadow-sm"
            />
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-white leading-tight">
                Frikaz S.A.S.
              </span>
              <span className="text-xs text-[#fed7aa] font-bold">
                SST & Gestión Ambiental
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white md:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Plant location tag */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span className="truncate">Sede: Bosa, Piamonte (Bogotá)</span>
          <span className="tabular-nums text-slate-300 font-medium">10 trab.</span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full tabular-nums ${
                      isActive
                        ? 'bg-red-500 text-white'
                        : 'bg-red-600/90 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom company summary */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex flex-col space-y-1 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Sector:</span>
              <span className="text-slate-200 font-medium truncate max-w-[150px]">Snacks Fritos</span>
            </div>
            <div className="flex justify-between">
              <span>Riesgo ARL:</span>
              <span className="text-emerald-400 font-medium">Clase II / III</span>
            </div>
            <div className="flex justify-between">
              <span>Jurisdicción:</span>
              <span className="text-slate-200">SDA Bogotá / MinTrabajo</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
