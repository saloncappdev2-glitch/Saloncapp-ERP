import React, { useState } from 'react';
import { useErp } from '../../context/ErpContext';
import { RoleType } from '../../types/erp';
import {
  Crown,
  Users,
  CreditCard,
  GraduationCap,
  Megaphone,
  Building2,
  Store as StoreIcon,
  Scissors,
  CheckCircle2,
} from 'lucide-react';

interface RoleOption {
  role: RoleType;
  label: string;
  name: string;
  category: 'hq' | 'field';
  scope: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const ALL_ROLES: RoleOption[] = [
  // HQ & Corporate Departments
  {
    role: 'business_head',
    label: 'Business Head',
    name: 'Ananya S.',
    category: 'hq',
    scope: 'All Regions',
    icon: Crown,
    accentColor: 'border-amber-500/60 bg-amber-500/15 text-amber-300',
  },
  {
    role: 'hr_head',
    label: 'HR & People',
    name: 'Priyanka S.',
    category: 'hq',
    scope: 'Talent & Rosters',
    icon: Users,
    accentColor: 'border-indigo-500/60 bg-indigo-500/15 text-indigo-300',
  },
  {
    role: 'accounting_head',
    label: 'Accounting',
    name: 'Ramesh S.',
    category: 'hq',
    scope: 'Audits & Royalty',
    icon: CreditCard,
    accentColor: 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300',
  },
  {
    role: 'training_head',
    label: 'Academy & SOP',
    name: 'Dr. Tanya K.',
    category: 'hq',
    scope: 'Stylist Training',
    icon: GraduationCap,
    accentColor: 'border-purple-500/60 bg-purple-500/15 text-purple-300',
  },
  {
    role: 'marketing_head',
    label: 'Marketing',
    name: 'Aditya M.',
    category: 'hq',
    scope: 'Footfall & Promos',
    icon: Megaphone,
    accentColor: 'border-rose-500/60 bg-rose-500/15 text-rose-300',
  },

  // Field Hierarchy
  {
    role: 'region_manager',
    label: 'Region Mgr',
    name: 'Vikram S.',
    category: 'field',
    scope: 'North Region',
    icon: Building2,
    accentColor: 'border-blue-500/60 bg-blue-500/15 text-blue-300',
  },
  {
    role: 'cluster_manager',
    label: 'Cluster Mgr',
    name: 'Rajesh V.',
    category: 'field',
    scope: 'Metro Alpha',
    icon: StoreIcon,
    accentColor: 'border-purple-500/60 bg-purple-500/15 text-purple-300',
  },
  {
    role: 'store_manager',
    label: 'Store Outlet',
    name: 'Pooja N.',
    category: 'field',
    scope: 'Salon #104',
    icon: Scissors,
    accentColor: 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300',
  },
];

export const RoleSwitcherBar: React.FC = () => {
  const { currentRole, setCurrentRole } = useErp();

  const isCurrentRoleHq = ['business_head', 'hr_head', 'accounting_head', 'training_head', 'marketing_head'].includes(currentRole);
  const [activeGroup, setActiveGroup] = useState<'hq' | 'field'>(isCurrentRoleHq ? 'hq' : 'field');

  const visibleRoles = ALL_ROLES.filter(r => r.category === activeGroup);

  return (
    <div className="bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800/80 px-2.5 py-2 sticky top-0 z-30">
      {/* Top Group Switcher: HQ Departments vs Field Hierarchy */}
      <div className="flex items-center justify-between gap-1 mb-1.5 px-0.5">
        <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
          <button
            onClick={() => setActiveGroup('hq')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
              activeGroup === 'hq'
                ? 'bg-amber-500 text-neutral-950 font-black shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🏢 Top-Level Depts (5)
          </button>
          <button
            onClick={() => setActiveGroup('field')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
              activeGroup === 'field'
                ? 'bg-blue-500 text-white font-black shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            📍 Field Hierarchy (3)
          </button>
        </div>

        <span className="text-[9px] text-neutral-500 font-mono">
          Tap role to switch
        </span>
      </div>

      {/* Role Tiles Row */}
      <div
        className={`grid gap-1 ${
          activeGroup === 'hq' ? 'grid-cols-5' : 'grid-cols-3'
        }`}
      >
        {visibleRoles.map(r => {
          const isActive = currentRole === r.role;
          const Icon = r.icon;

          return (
            <button
              key={r.role}
              onClick={() => setCurrentRole(r.role)}
              className={`relative flex flex-col items-center justify-center p-1 rounded-xl border text-center transition-all ${
                isActive
                  ? `${r.accentColor} shadow-sm ring-1 ring-white/20 scale-[1.02]`
                  : 'bg-neutral-850/80 border-neutral-800/80 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-2 h-2" />
                </span>
              )}
              <Icon className={`w-3.5 h-3.5 mb-0.5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-bold leading-tight truncate w-full">
                {r.label}
              </span>
              <span className="text-[8px] opacity-75 truncate w-full">
                {r.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
