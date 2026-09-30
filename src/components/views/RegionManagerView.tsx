import React from 'react';
import { useErp } from '../../context/ErpContext';
import { formatCurrency, formatCompactNumber } from '../../utils/formatters';
import { EscalationCard } from '../common/EscalationCard';
import { Ticket } from '../../types/erp';
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  Radio,
  Store,
} from 'lucide-react';

interface RegionManagerViewProps {
  onOpenApproveModal: (ticket: Ticket) => void;
  onOpenRejectModal: (ticket: Ticket) => void;
  onOpenEscalateModal: (ticket: Ticket) => void;
  onOpenBroadcastModal: () => void;
}

export const RegionManagerView: React.FC<RegionManagerViewProps> = ({
  onOpenApproveModal,
  onOpenRejectModal,
  onOpenEscalateModal,
  onOpenBroadcastModal,
}) => {
  const {
    currentUser,
    scopedRegions,
    scopedClusters,
    scopedStores,
    scopedTickets,
    setActiveTab,
  } = useErp();

  const myRegion = scopedRegions[0];
  const regionClusters = scopedClusters;

  // Regional metrics
  const totalRevenue = myRegion?.achievedRevenue || 0;
  const targetRevenue = myRegion?.targetRevenue || 1;
  const royaltyOverdue = myRegion?.totalRoyaltyOverdue || 0;
  const collateralOverdue = myRegion?.totalCollateralOverdue || 0;

  // Escalations in this region needing RM action or review
  const pendingRMTickets = scopedTickets.filter(
    t => t.status === 'pending_region' || (t.directToBH && t.status === 'pending_bh')
  );

  return (
    <div className="space-y-4 pb-6">
      {/* Regional Status Summary Card */}
      <div className="bg-gradient-to-br from-blue-950/40 via-neutral-900 to-neutral-900 border border-blue-500/30 rounded-3xl p-4 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold text-xs">
              🏢 Region Manager
            </span>
            <span className="text-xs font-bold text-neutral-200">{myRegion?.name}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
            {((totalRevenue / targetRevenue) * 100).toFixed(0)}% Target
          </span>
        </div>

        {/* Minimal metrics grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Revenue */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Regional Sales
            </span>
            <div className="text-base font-extrabold text-white mt-1">
              {formatCompactNumber(totalRevenue)}
            </div>
            <span className="text-[10px] text-neutral-500">
              Target: {formatCompactNumber(targetRevenue)}
            </span>
          </div>

          {/* Pending Reviews */}
          <div
            onClick={() => setActiveTab('escalations')}
            className="bg-neutral-950/80 p-3 rounded-2xl border border-blue-500/30 cursor-pointer hover:bg-neutral-950 transition-colors"
          >
            <span className="text-[10px] uppercase font-bold text-blue-400 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-blue-400" />
              Review Queue
            </span>
            <div className="text-base font-extrabold text-blue-300 mt-1">
              {pendingRMTickets.length} Tickets
            </div>
            <span className="text-[10px] text-neutral-400">Clusters & Stores awaiting CTA</span>
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
              {formatCurrency(royaltyOverdue)}
            </div>
            <span className="text-[10px] text-neutral-400">Tap for cluster breakdown</span>
          </div>

          {/* Collateral Overdue */}
          <div
            onClick={() => setActiveTab('overdues')}
            className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80 cursor-pointer hover:bg-neutral-950 transition-colors"
          >
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-neutral-400" />
              Collateral Due
            </span>
            <div className="text-base font-extrabold text-neutral-200 mt-1">
              {formatCurrency(collateralOverdue)}
            </div>
            <span className="text-[10px] text-neutral-500">Regional asset security</span>
          </div>
        </div>

        {/* Quick action broadcast */}
        <div className="mt-3 pt-3 border-t border-blue-500/20 flex items-center justify-between gap-2">
          <span className="text-[11px] text-neutral-400">Regional directives & notices</span>
          <button
            onClick={onOpenBroadcastModal}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-900/40 active:scale-95 transition-all"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Broadcast to Clusters</span>
          </button>
        </div>
      </div>

      {/* Cluster Performance Breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-blue-400" />
            Clusters Under Your Region
          </h3>
          <span className="text-[10px] text-neutral-500">{regionClusters.length} Clusters</span>
        </div>

        <div className="space-y-2.5">
          {regionClusters.map(cluster => {
            const pct = Math.round((cluster.achievedRevenue / cluster.targetRevenue) * 100);

            return (
              <div
                key={cluster.id}
                className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3.5 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-neutral-100">{cluster.name}</h4>
                    <span className="text-[11px] text-neutral-400">
                      Mgr: {cluster.managerName} ({cluster.storeIds.length} Outlets)
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

                {/* Progress */}
                <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  ></div>
                </div>

                {/* Dues */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-neutral-950/70 p-2 rounded-xl border border-neutral-800/80">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                      Royalty Overdue
                    </span>
                    <span className="font-bold text-neutral-200">
                      {formatCurrency(cluster.totalRoyaltyOverdue)}
                    </span>
                  </div>
                  <div className="bg-neutral-950/70 p-2 rounded-xl border border-neutral-800/80">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                      Collateral Overdue
                    </span>
                    <span className="font-bold text-neutral-200">
                      {formatCurrency(cluster.totalCollateralOverdue)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Escalation Review Queue */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
            Escalations from Clusters & Outlets
          </h3>
          <span className="text-[10px] text-neutral-500">Quick Approval / Push to BH</span>
        </div>

        {pendingRMTickets.length === 0 ? (
          <div className="p-6 text-center text-xs text-neutral-500 bg-neutral-900/50 rounded-2xl border border-neutral-800/60">
            No pending escalations awaiting regional review.
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingRMTickets.map(tkt => (
              <EscalationCard
                key={tkt.id}
                ticket={tkt}
                onOpenApproveModal={onOpenApproveModal}
                onOpenRejectModal={onOpenRejectModal}
                onOpenEscalateModal={onOpenEscalateModal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
