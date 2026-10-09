import React, { useRef } from 'react';
import {
  Menu,
  Bell,
  Download,
  Upload,
  RefreshCw,
  Printer,
  Shield,
} from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { exportFullDatabase, importFullDatabase, resetDatabaseToOfficialSeed } from '../services/storageService';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  alertCount: number;
  setMobileOpen: (open: boolean) => void;
  onRefreshData?: () => void;
}

const TAB_TITLES: Record<ActiveTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Panel de Control Automatizado',
    subtitle: 'Indicadores en tiempo real de cumplimiento SST y Ambiental',
  },
  matriz: {
    title: 'Matriz de Requisitos Legales',
    subtitle: 'Normativa colombiana aplicable a la planta de fritos (Bosa, Bogotá)',
  },
  obligaciones: {
    title: 'Obligaciones Legales Específicas',
    subtitle: 'Gestión individual de exigencias normativas y estados de cumplimiento',
  },
  phva: {
    title: 'Ciclo PHVA Automatizado',
    subtitle: 'Planear, Hacer, Verificar y Actuar para cada compromiso legal',
  },
  evidencias: {
    title: 'Módulo Documental de Evidencias',
    subtitle: 'Soportes jurídicos, certificados de ACU, actas y conceptos médicos',
  },
  acciones: {
    title: 'Plan de Acciones Correctivas',
    subtitle: 'Gestión de hallazgos, causa raíz y verificación estricta de eficacia',
  },
  ambiental: {
    title: 'Módulo Especializado de Gestión Ambiental',
    subtitle: 'Aceite de cocina usado (ACU), vertimientos, trampa de grasas y residuos',
  },
  sst: {
    title: 'Módulo de Seguridad y Salud en el Trabajo',
    subtitle: 'Estándares mínimos (Res. 0312), peligros GTC 45 y prevención de quemaduras',
  },
  alertas: {
    title: 'Centro de Notificaciones y Alertas',
    subtitle: 'Actividades vencidas, próximas a vencer y normas pendientes de validación',
  },
  informes: {
    title: 'Generación de Informes y Exportación',
    subtitle: 'Descarga de matrices en Excel/CSV e informe ejecutivo imprimible',
  },
  empresa: {
    title: 'Ficha Técnica Frikaz S.A.S.',
    subtitle: 'Perfil empresarial, maquinaria, insumos y condiciones operativas',
  },
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  alertCount,
  setMobileOpen,
  onRefreshData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentTabInfo = TAB_TITLES[activeTab] || {
    title: 'Sistema Normativo',
    subtitle: 'Frikaz S.A.S.',
  };

  const handleBackupExport = () => {
    const jsonStr = exportFullDatabase();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup_Normativa_Frikaz_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const res = importFullDatabase(content);
        if (res.success) {
          alert('Base de datos restaurada correctamente.');
          if (onRefreshData) onRefreshData();
        } else {
          alert(`Error: ${res.message}`);
        }
      }
    };
    reader.readAsText(file);
    if (event.target) event.target.value = '';
  };

  const handleResetData = () => {
    const confirmed = window.confirm(
      '¿Desea restaurar la base de datos a los datos oficiales iniciales de Frikaz S.A.S.? Esta acción repondrá las normas, obligaciones y evidencias oficiales colombianas.'
    );
    if (confirmed) {
      resetDatabaseToOfficialSeed();
      if (onRefreshData) onRefreshData();
      alert('Base de datos restaurada a la versión oficial de Frikaz S.A.S.');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-8 print:hidden">
      {/* Zone 1: Mobile toggle & Breadcrumb title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3">
          <img
            src="/frikaz_logo.jpg"
            alt="Logo Frikaz"
            className="h-10 w-auto max-w-[80px] object-contain rounded-lg border border-orange-200/50 bg-white p-0.5 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-bold text-[#0f172a]">Frikaz S.A.S.</span>
              <span>/</span>
              <span className="text-slate-700">{currentTabInfo.title}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight sm:text-xl">
              {currentTabInfo.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Zone 3: Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Alerts shortcut button */}
        <button
          onClick={() => setActiveTab('alertas')}
          className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
            alertCount > 0
              ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
          title="Ver alertas del sistema"
        >
          <Bell className={`h-4 w-4 ${alertCount > 0 ? 'text-amber-600' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">Alertas</span>
          {alertCount > 0 && (
            <span className="ml-1 rounded-full bg-[#991b1b] px-1.5 py-0.2 text-[10px] font-bold text-white tabular-nums">
              {alertCount}
            </span>
          )}
        </button>

        {/* Print / Export Report shortcut */}
        <button
          onClick={() => {
            setActiveTab('informes');
          }}
          className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          title="Generar Informes Oficiales"
        >
          <Printer className="h-4 w-4 text-slate-500" />
          <span>Informes</span>
        </button>

        {/* Database Management Dropdown / Buttons */}
        <div className="relative group">
          <button
            className="flex items-center gap-1.5 rounded-lg bg-[#0f172a] px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
            title="Opciones de persistencia y respaldo"
          >
            <Shield className="h-4 w-4 text-[#fed7aa]" />
            <span className="hidden sm:inline">Base de Datos</span>
          </button>

          <div className="absolute right-0 mt-1 hidden w-56 rounded-lg border border-slate-200 bg-white py-1.5 shadow-lg group-hover:block z-50">
            <button
              onClick={handleBackupExport}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              <Download className="h-4 w-4 text-emerald-700" />
              <span>Descargar Copia JSON</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              <Upload className="h-4 w-4 text-blue-700" />
              <span>Restaurar Copia JSON</span>
            </button>
            <div className="my-1 border-t border-slate-100" />
            <button
              onClick={handleResetData}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-medium text-red-700 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 text-red-600" />
              <span>Restablecer Datos Semilla</span>
            </button>
          </div>
        </div>

        {/* Hidden input for JSON file restore */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileImport}
          className="hidden"
        />
      </div>
    </header>
  );
};
