import React from 'react';
import { useErp } from '../../context/ErpContext';
import { RoleType } from '../../types/erp';
import { Crown, Building2, Store as StoreIcon, Scissors, CheckCircle2 } from 'lucide-react';

interface RoleOption {
  role: RoleType;
  label: string;
  name: string;
  scope: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const ROLES: RoleOption[] = [
  {
    role: 'business_head',
    label: 'Business Head',
    name: 'Ananya S.',
    scope: 'All Regions',
    icon: Crown,
    accentColor: 'border-amber-500/60 bg-amber-500/10 text-amber-300',
  },
  {
    role: 'region_manager',
    label: 'Region Manager',
    name: 'Vikram S.',
    scope: 'North Region',
    icon: Building2,
    accentColor: 'border-blue-500/60 bg-blue-500/10 text-blue-300',
  },
  {
    role: 'cluster_manager',
    label: 'Cluster Manager',
    name: 'Rajesh V.',
    scope: 'Metro Alpha',
    icon: StoreIcon,
    accentColor: 'border-purple-500/60 bg-purple-500/10 text-purple-300',
  },
  {
    role: 'store_manager',
    label: 'Store Outlet',
    name: 'Pooja N.',
    scope: 'Salon #104',
    icon: Scissors,
    accentColor: 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300',
  },
];

export const RoleSwitcherBar: React.FC = () => {
  const { currentRole, setCurrentRole } = useErp();

  return (
    <div className="bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800/80 px-3 py-2 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-1 mb-1.5 px-0.5">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          Active Hierarchy Persona
        </span>
        <span className="text-[10px] text-neutral-500">Tap to switch view</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {ROLES.map(r => {
          const isActive = currentRole === r.role;
          const Icon = r.icon;

          return (
            <button
              key={r.role}
              onClick={() => setCurrentRole(r.role)}
              className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl border text-center transition-all ${
                isActive
                  ? `${r.accentColor} shadow-sm ring-1 ring-white/10 scale-[1.02]`
                  : 'bg-neutral-800/50 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                </span>
              )}
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[11px] font-bold leading-tight truncate w-full">{r.label}</span>
              <span className="text-[9px] opacity-75 truncate w-full">{r.scope}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
