import React, { useState, useEffect, useRef } from 'react';
import { useErp } from '../../context/ErpContext';
import { RoleType } from '../../types/erp';
import { ScrollableChipBar } from './ScrollableChipBar';
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
  SlidersHorizontal,
} from 'lucide-react';

interface RoleOption {
  role: RoleType;
  label: string;
  name: string;
  category: 'hq' | 'field';
  scope: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
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
    accentColor: 'border-amber-500/70 bg-amber-500/15 text-amber-300 ring-amber-500/30',
    badgeBg: 'bg-amber-500/20 text-amber-300',
  },
  {
    role: 'hr_head',
    label: 'HR & People',
    name: 'Priyanka S.',
    category: 'hq',
    scope: 'Talent & Rosters',
    icon: Users,
    accentColor: 'border-indigo-500/70 bg-indigo-500/15 text-indigo-300 ring-indigo-500/30',
    badgeBg: 'bg-indigo-500/20 text-indigo-300',
  },
  {
    role: 'accounting_head',
    label: 'Accounting',
    name: 'Ramesh S.',
    category: 'hq',
    scope: 'Audits & Royalty',
    icon: CreditCard,
    accentColor: 'border-emerald-500/70 bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
    badgeBg: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    role: 'training_head',
    label: 'Academy & SOP',
    name: 'Dr. Tanya K.',
    category: 'hq',
    scope: 'Stylist Training',
    icon: GraduationCap,
    accentColor: 'border-purple-500/70 bg-purple-500/15 text-purple-300 ring-purple-500/30',
    badgeBg: 'bg-purple-500/20 text-purple-300',
  },
  {
    role: 'marketing_head',
    label: 'Marketing',
    name: 'Aditya M.',
    category: 'hq',
    scope: 'Footfall & Promos',
    icon: Megaphone,
    accentColor: 'border-rose-500/70 bg-rose-500/15 text-rose-300 ring-rose-500/30',
    badgeBg: 'bg-rose-500/20 text-rose-300',
  },

  // Field Hierarchy
  {
    role: 'region_manager',
    label: 'Region Mgr',
    name: 'Vikram S.',
    category: 'field',
    scope: 'North Region',
    icon: Building2,
    accentColor: 'border-blue-500/70 bg-blue-500/15 text-blue-300 ring-blue-500/30',
    badgeBg: 'bg-blue-500/20 text-blue-300',
  },
  {
    role: 'cluster_manager',
    label: 'Cluster Mgr',
    name: 'Rajesh V.',
    category: 'field',
    scope: 'Metro Alpha',
    icon: StoreIcon,
    accentColor: 'border-purple-500/70 bg-purple-500/15 text-purple-300 ring-purple-500/30',
    badgeBg: 'bg-purple-500/20 text-purple-300',
  },
  {
    role: 'store_manager',
    label: 'Store Outlet',
    name: 'Pooja N.',
    category: 'field',
    scope: 'Salon #104',
    icon: Scissors,
    accentColor: 'border-emerald-500/70 bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
    badgeBg: 'bg-emerald-500/20 text-emerald-300',
  },
];

export const RoleSwitcherBar: React.FC = () => {
  const { currentRole, setCurrentRole, mobileDeviceFrame } = useErp();
  const [filterCategory, setFilterCategory] = useState<'all' | 'hq' | 'field'>('all');
  const activeChipRef = useRef<HTMLButtonElement | null>(null);

  const displayedRoles = ALL_ROLES.filter(r => {
    if (filterCategory === 'all') return true;
    return r.category === filterCategory;
  });

  // When role changes, ensure active chip is scrolled into view smoothly
  useEffect(() => {
    if (activeChipRef.current) {
      activeChipRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentRole, filterCategory]);

  return (
    <div className="bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800/80 sticky top-0 z-30">
      <div className={`space-y-1.5 ${
        mobileDeviceFrame ? 'px-2.5 py-2' : 'px-4 sm:px-6 lg:px-8 py-2.5 max-w-7xl mx-auto w-full'
      }`}>
        {/* Category Filter Pills & Scroll Hint */}
      <div className="flex items-center justify-between gap-1.5 px-0.5">
        <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
              filterCategory === 'all'
                ? 'bg-amber-500 text-neutral-950 font-black shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Roles (8)
          </button>
          <button
            onClick={() => setFilterCategory('hq')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
              filterCategory === 'hq'
                ? 'bg-indigo-500 text-white font-black shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🏢 Depts (5)
          </button>
          <button
            onClick={() => setFilterCategory('field')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
              filterCategory === 'field'
                ? 'bg-blue-500 text-white font-black shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            📍 Field (3)
          </button>
        </div>

        <div className="flex items-center gap-1 text-[9px] text-amber-400/80 font-mono font-medium">
          <SlidersHorizontal className="w-2.5 h-2.5 text-amber-400" />
          <span>Scrollable Chips</span>
        </div>
      </div>

      {/* Horizontally Scrollable Role Chips with Scroll Buttons */}
      <ScrollableChipBar className="w-full">
        {displayedRoles.map(r => {
          const isActive = currentRole === r.role;
          const Icon = r.icon;

          return (
            <button
              key={r.role}
              ref={isActive ? activeChipRef : null}
              onClick={() => setCurrentRole(r.role)}
              className={`relative shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-left transition-all active:scale-95 ${
                isActive
                  ? `${r.accentColor} shadow-md ring-1 scale-[1.02]`
                  : 'bg-neutral-850/90 border-neutral-800/80 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}

              <div
                className={`p-1.5 rounded-xl border ${
                  isActive
                    ? 'bg-white/10 border-white/20'
                    : 'bg-neutral-900 border-neutral-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'scale-110' : 'text-neutral-400'}`} />
              </div>

              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-extrabold whitespace-nowrap ${isActive ? 'text-white' : 'text-neutral-300'}`}>
                    {r.label}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${r.badgeBg}`}>
                    {r.scope}
                  </span>
                </div>
                <div className="text-[9px] text-neutral-400 truncate max-w-[120px]">
                  {r.name}
                </div>
              </div>
            </button>
          );
        })}
      </ScrollableChipBar>
      </div>
    </div>
  );
};
