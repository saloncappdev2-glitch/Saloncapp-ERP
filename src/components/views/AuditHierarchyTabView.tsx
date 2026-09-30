import React from 'react';
import { useErp } from '../../context/ErpContext';
import { USER_PROFILES } from '../../data/mockData';
import { RoleType } from '../../types/erp';
import {
  Layers,
  Crown,
  Building2,
  Store,
  Scissors,
  CheckCircle2,
  Zap,
  ArrowDown,
  ArrowUp,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const AuditHierarchyTabView: React.FC = () => {
  const { currentRole, setCurrentRole, currentUser } = useErp();

  return (
    <div className="space-y-4 pb-6">
      {/* Current Persona Card */}
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-4 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500/40"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white truncate">{currentUser.name}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Active
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 truncate">{currentUser.title}</p>
            <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
              {currentUser.email} • {currentUser.phone}
            </p>
          </div>
        </div>
      </div>

      {/* 4-Tier Hierarchy Architecture Diagram */}
      <div className="bg-neutral-900/90 rounded-3xl border border-neutral-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-400" />
            saloncapp ERP Operational Hierarchy
          </h3>
          <span className="text-[10px] text-neutral-500">Dual-Way Flow</span>
        </div>

        <div className="space-y-2 text-xs">
          {/* Level 1: Business Head */}
          <div
            onClick={() => setCurrentRole('business_head')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              currentRole === 'business_head'
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-neutral-100">Level 1: Business Head</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">All Regions Scope</span>
            </div>
            <p className="text-[11px] opacity-90 leading-tight">
              Oversees network revenue, royalty overdue &gt;30d aging, collateral due, and high-impact CTAs. Broadcasts to All / Regions / Clusters / Stores.
            </p>
          </div>

          {/* Hierarchy Connector */}
          <div className="flex justify-center text-neutral-600">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>

          {/* Level 2: Region Manager */}
          <div
            onClick={() => setCurrentRole('region_manager')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              currentRole === 'region_manager'
                ? 'bg-blue-500/15 border-blue-500/50 text-blue-200'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-neutral-100">Level 2: Region Manager</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">North Region Head</span>
            </div>
            <p className="text-[11px] opacity-90 leading-tight">
              Reviews clusters performance & regional overdues. Reviews cluster/store escalations with quick Approve, Reject, or Push to Business Head.
            </p>
          </div>

          {/* Hierarchy Connector */}
          <div className="flex justify-center text-neutral-600">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>

          {/* Level 3: Cluster Manager */}
          <div
            onClick={() => setCurrentRole('cluster_manager')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              currentRole === 'cluster_manager'
                ? 'bg-purple-500/15 border-purple-500/50 text-purple-200'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-neutral-100">Level 3: Cluster Manager</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">Metro Hub Alpha</span>
            </div>
            <p className="text-[11px] opacity-90 leading-tight">
              Monitors store targets, chair occupancy, and overdue balances. Resolves store operational issues or escalates to Region Manager.
            </p>
          </div>

          {/* Hierarchy Connector */}
          <div className="flex justify-center text-neutral-600">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>

          {/* Level 4: Store Outlet */}
          <div
            onClick={() => setCurrentRole('store_manager')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              currentRole === 'store_manager'
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-neutral-100">Level 4: Store Outlet</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">Salon #104</span>
            </div>
            <p className="text-[11px] opacity-90 leading-tight">
              Sees store revenue, dues status, and messages. Can raise issues: Low/Med routes to Cluster; High/Critical routes DIRECTLY to Business Head with auto CC to Cluster & Region!
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Verification Playbook */}
      <div className="bg-gradient-to-r from-amber-950/40 to-neutral-900 border border-amber-500/30 rounded-3xl p-4 space-y-2.5">
        <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400" />
          How to Test the Full Working Flow
        </h4>
        <ol className="text-xs text-neutral-300 space-y-2 list-decimal list-inside leading-relaxed">
          <li>
            <strong className="text-white">Store to BH Direct Escalation:</strong> Switch to{' '}
            <span className="text-emerald-400 font-semibold">Store Manager</span>, tap{' '}
            <strong className="text-rose-400">Escalate</strong>, pick{' '}
            <span className="text-rose-400 font-bold">Critical</span> or{' '}
            <span className="text-amber-400 font-bold">High</span> severity, and submit.
          </li>
          <li>
            <strong className="text-white">Business Head Decision:</strong> Switch to{' '}
            <span className="text-amber-400 font-semibold">Business Head</span>. You’ll see the ticket waiting under{' '}
            <strong className="text-white">Direct Store Escalations</strong>. Tap{' '}
            <strong className="text-emerald-400">Quick Approve</strong>.
          </li>
          <li>
            <strong className="text-white">Cluster & Region CC Audit:</strong> Switch to{' '}
            <span className="text-purple-400 font-semibold">Cluster Manager</span> or{' '}
            <span className="text-blue-400 font-semibold">Region Manager</span>, tap the{' '}
            <strong className="text-amber-400">Bell Icon</strong> at the top right to verify the auto-generated CC notification!
          </li>
          <li>
            <strong className="text-white">Overdue Settlement CTA:</strong> Open the{' '}
            <strong className="text-amber-400">Overdues</strong> tab as BH or RM and tap{' '}
            <strong className="text-emerald-400">Settle Royalty</strong> to clear delinquent franchise balances.
          </li>
        </ol>
      </div>
    </div>
  );
};
