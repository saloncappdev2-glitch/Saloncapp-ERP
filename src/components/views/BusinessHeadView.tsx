import React from 'react';
import { useErp } from '../../context/ErpContext';
import { formatCurrency, formatCompactNumber } from '../../utils/formatters';
import { EscalationCard } from '../common/EscalationCard';
import { OverdueCard } from '../common/OverdueCard';
import { Ticket } from '../../types/erp';
import {
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Building2,
  ChevronRight,
  Radio,
  CheckCircle2,
  Flame,
  Zap,
} from 'lucide-react';

interface BusinessHeadViewProps {
  onOpenApproveModal: (ticket: Ticket) => void;
  onOpenRejectModal: (ticket: Ticket) => void;
  onOpenBroadcastModal: () => void;
}

export const BusinessHeadView: React.FC<BusinessHeadViewProps> = ({
  onOpenApproveModal,
  onOpenRejectModal,
  onOpenBroadcastModal,
}) => {
  const { regions, stores, tickets, setActiveTab } = useErp();

  // Aggregate calculations
  const totalRevenue = regions.reduce((sum, r) => sum + r.achievedRevenue, 0);
  const totalTarget = regions.reduce((sum, r) => sum + r.targetRevenue, 0);
  const totalRoyaltyOverdue = regions.reduce((sum, r) => sum + r.totalRoyaltyOverdue, 0);
  const totalCollateralOverdue = regions.reduce((sum, r) => sum + r.totalCollateralOverdue, 0);

  // Tickets awaiting BH decision (including Direct High/Critical escalations)
  const pendingBHTickets = tickets.filter(t => t.status === 'pending_bh');
  const directBHTickets = pendingBHTickets.filter(t => t.directToBH);

  // Delinquent stores (>30 days overdue)
  const delinquentStores = stores.filter(s => s.royaltyDaysOverdue > 30 || s.collateralDaysOverdue > 30);

  return (
    <div className="space-y-4 pb-6">
      {/* Executive Greeting & Hierarchy Status */}
      <div className="bg-gradient-to-br from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-3xl p-4 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold text-xs">
              👑 Executive Head
            </span>
            <span className="text-[11px] text-neutral-400">All Regions Snapshot</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
            {((totalRevenue / totalTarget) * 100).toFixed(0)}% of Target
          </span>
        </div>

        {/* Executive Minimal Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Revenue */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Network Revenue
            </span>
            <div className="text-base font-extrabold text-white mt-1">
              {formatCompactNumber(totalRevenue)}
            </div>
            <span className="text-[10px] text-neutral-500">
              Target: {formatCompactNumber(totalTarget)}
            </span>
          </div>

          {/* Pending Escalations */}
          <div
            onClick={() => setActiveTab('escalations')}
            className="bg-neutral-950/80 p-3 rounded-2xl border border-rose-500/30 cursor-pointer hover:bg-neutral-950 transition-colors"
          >
            <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              BH Action Queue
            </span>
            <div className="text-base font-extrabold text-rose-300 mt-1 flex items-center gap-1.5">
              <span>{pendingBHTickets.length}</span>
              {directBHTickets.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/30 text-rose-200 border border-rose-500/40 animate-pulse font-normal">
                  {directBHTickets.length} Direct
                </span>
              )}
            </div>
            <span className="text-[10px] text-neutral-400">Tap to review & decide</span>
          </div>

          {/* Royalty Overdue */}
          <div
            onClick={() => setActiveTab('overdues')}
            className="bg-neutral-950/80 p-3 rounded-2xl border border-amber-500/30 cursor-pointer hover:bg-neutral-950 transition-colors"
          >
            <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Royalty Overdue
            </span>
            <div className="text-base font-extrabold text-amber-300 mt-1">
              {formatCompactNumber(totalRoyaltyOverdue)}
            </div>
            <span className="text-[10px] text-neutral-500">
              {delinquentStores.length} Stores with dues &gt;30d
            </span>
          </div>

          {/* Collateral Overdue */}
          <div
            onClick={() => setActiveTab('overdues')}
            className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80 cursor-pointer hover:bg-neutral-950 transition-colors"
          >
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-neutral-400" />
              Collateral Overdue
            </span>
            <div className="text-base font-extrabold text-neutral-200 mt-1">
              {formatCompactNumber(totalCollateralOverdue)}
            </div>
            <span className="text-[10px] text-neutral-500">Franchise asset security</span>
          </div>
        </div>

        {/* Quick CTA broadcast strip */}
        <div className="mt-3 pt-3 border-t border-amber-500/20 flex items-center justify-between gap-2">
          <span className="text-[11px] text-neutral-400">Need network-wide action?</span>
          <button
            onClick={onOpenBroadcastModal}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-amber-900/40 active:scale-95 transition-all"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Broadcast Directives</span>
          </button>
        </div>
      </div>

      {/* Direct High/Critical Escalations Banner (The key prompt requirement) */}
      {directBHTickets.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              Direct Store Escalations (High / Critical)
            </span>
            <span className="text-[10px] font-semibold text-rose-300">Requires BH CTA</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {directBHTickets.map(ticket => (
              <EscalationCard
                key={ticket.id}
                ticket={ticket}
                onOpenApproveModal={onOpenApproveModal}
                onOpenRejectModal={onOpenRejectModal}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regional Performance & Status Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            Regions Performance & Overdue Status
          </h3>
          <span className="text-[10px] text-neutral-500">3 Regions Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {regions.map(region => {
            const pct = Math.round((region.achievedRevenue / region.targetRevenue) * 100);
            const isWarning = region.totalRoyaltyOverdue > 300000;

            return (
              <div
                key={region.id}
                className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3.5 space-y-3"
              >
                {/* Region Title & Manager */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-neutral-100">{region.name}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        {region.code}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      Head: {region.managerName} ({region.clusterIds.length} Clusters)
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${
                      pct >= 90
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {pct}% Target
                  </span>
                </div>

                {/* Target Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Target Achievement</span>
                    <span className="text-neutral-200 font-semibold">
                      {formatCurrency(region.achievedRevenue)} / {formatCurrency(region.targetRevenue)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 90 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Overdues Row */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-neutral-950/70 p-2 rounded-xl border border-neutral-800/80">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                      Royalty Overdue
                    </span>
                    <span
                      className={`font-extrabold text-xs ${
                        region.totalRoyaltyOverdue > 300000 ? 'text-rose-400' : 'text-neutral-200'
                      }`}
                    >
                      {formatCurrency(region.totalRoyaltyOverdue)}
                    </span>
                  </div>
                  <div className="bg-neutral-950/70 p-2 rounded-xl border border-neutral-800/80">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                      Collateral Overdue
                    </span>
                    <span className="font-extrabold text-xs text-neutral-200">
                      {formatCurrency(region.totalCollateralOverdue)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
