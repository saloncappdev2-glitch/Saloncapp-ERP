import React from 'react';
import { useErp } from '../../context/ErpContext';
import { USER_PROFILES } from '../../data/mockData';
import { RoleType } from '../../types/erp';
import {
  Layers,
  Crown,
  Users,
  CreditCard,
  GraduationCap,
  Megaphone,
  Building2,
  Store,
  Scissors,
  CheckCircle2,
  Zap,
  ArrowDown,
  ShieldCheck,
  Sparkles,
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
                {currentUser.department || 'Active'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 truncate">{currentUser.title}</p>
            <p className="text-[11px] text-neutral-500 font-mono mt-0.5 truncate">
              {currentUser.email} • {currentUser.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Top-Level HQ Corporate Departments Grid */}
      <div className="bg-neutral-900/90 rounded-3xl border border-neutral-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-amber-400" />
            Top-Level HQ Corporate Departments
          </h3>
          <span className="text-[10px] text-neutral-500">5 Executive Roles</span>
        </div>

        <div className="grid grid-cols-1 gap-2 text-xs">
          {/* Business Head */}
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
                <span className="font-bold text-neutral-100">👑 Business Head (Ananya S.)</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">All Regions Scope</span>
            </div>
            <p className="text-[11px] opacity-90 leading-tight">
              Oversees network revenue, royalty overdue aging, and high-impact approvals. Broadcasts nationwide.
            </p>
          </div>

          {/* HR Department */}
          <div
            onClick={() => setCurrentRole('hr_head')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              currentRole === 'hr_head'
                ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-200'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-neutral-100">👥 HR & People Operations (Priyanka S.)</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">Network Talent</span>
            </div>
            <p className="text-[11px] opacity-90 leading-tight">
              Monitors stylist vacancies, attendance compliance, and staff shortage escalations. Broadcasts staffing policies and approves transfers.
            </p>
          </div>

          {/* Accounting Department */}
          <div
            onClick={() => setCurrentRole('accounting_head')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              currentRole === 'accounting_head'
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-neutral-100">💳 Finance & Accounting (Ramesh S.)</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">Reconciliation & Royalty</span>
            </div>
            <p className="text-xs opacity-90 leading-tight">
              Oversees GST audit matching, overdue royalty recovery, and franchise collateral reserve pools. Broadcasts billing circulars.
            </p>
          </div>

          {/* Training Department */}
          <div
            onClick={() => setCurrentRole('training_head')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              currentRole === 'training_head'
                ? 'bg-purple-500/15 border-purple-500/50 text-purple-200'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-neutral-100">🎓 Academy & Quality SOP (Dr. Tanya K.)</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">Technical Masterclasses</span>
            </div>
            <p className="text-[11px] opacity-90 leading-tight">
              Monitors network hygiene audit scores, stylist skill certifications, and schedules upcoming masterclasses.
            </p>
          </div>

          {/* Marketing Department */}
          <div
            onClick={() => setCurrentRole('marketing_head')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              currentRole === 'marketing_head'
                ? 'bg-rose-500/15 border-rose-500/50 text-rose-200'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-neutral-100">📢 Brand Marketing & Growth (Aditya M.)</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">Footfall & Promos</span>
            </div>
            <p className="text-[11px] opacity-90 leading-tight">
              Drives national/regional festive campaigns, lead generation, CSAT Google ratings, and promotional coupon redemptions.
            </p>
          </div>
        </div>
      </div>

      {/* Field Operations Hierarchy */}
      <div className="bg-neutral-900/90 rounded-3xl border border-neutral-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-400" />
            Field Operations Hierarchy
          </h3>
          <span className="text-[10px] text-neutral-500">3-Tier Execution</span>
        </div>

        <div className="space-y-2 text-xs">
          {/* Region Manager */}
          <div
            onClick={() => setCurrentRole('region_manager')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              currentRole === 'region_manager'
                ? 'bg-blue-500/15 border-blue-500/50 text-blue-200'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-neutral-100">🏢 Level 2: Region Manager (North Region)</span>
              <span className="text-[10px] font-mono opacity-80">Vikram S.</span>
            </div>
            <p className="text-[11px] opacity-90 leading-tight">
              Supervises clusters, reviews regional overdue recovery, and reviews store escalations.
            </p>
          </div>

          <div className="flex justify-center text-neutral-600">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>

          {/* Cluster Manager */}
          <div
            onClick={() => setCurrentRole('cluster_manager')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              currentRole === 'cluster_manager'
                ? 'bg-purple-500/15 border-purple-500/50 text-purple-200'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-neutral-100">🏬 Level 3: Cluster Manager (Metro Hub Alpha)</span>
              <span className="text-[10px] font-mono opacity-80">Rajesh V.</span>
            </div>
            <p className="text-[11px] opacity-90 leading-tight">
              Monitors store targets, chairs, and local complaints. Resolves store requests or escalates to Region.
            </p>
          </div>

          <div className="flex justify-center text-neutral-600">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>

          {/* Store Outlet */}
          <div
            onClick={() => setCurrentRole('store_manager')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              currentRole === 'store_manager'
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-neutral-100">💇 Level 4: Store Outlet (Salon #104)</span>
              <span className="text-[10px] font-mono opacity-80">Pooja N.</span>
            </div>
            <p className="text-[11px] opacity-90 leading-tight">
              Daily revenue, royalty status, receiving broadcasts. High/Critical issues route directly to Business Head and CC Cluster & Region!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
