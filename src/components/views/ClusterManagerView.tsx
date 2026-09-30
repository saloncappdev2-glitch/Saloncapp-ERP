import React from 'react';
import { useErp } from '../../context/ErpContext';
import { formatCurrency, formatCompactNumber } from '../../utils/formatters';
import { EscalationCard } from '../common/EscalationCard';
import { Ticket } from '../../types/erp';
import {
  Store,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  Radio,
  Scissors,
  Users,
} from 'lucide-react';

interface ClusterManagerViewProps {
  onOpenApproveModal: (ticket: Ticket) => void;
  onOpenRejectModal: (ticket: Ticket) => void;
  onOpenEscalateModal: (ticket: Ticket) => void;
  onOpenBroadcastModal: () => void;
}

export const ClusterManagerView: React.FC<ClusterManagerViewProps> = ({
  onOpenApproveModal,
  onOpenRejectModal,
  onOpenEscalateModal,
  onOpenBroadcastModal,
}) => {
  const {
    scopedClusters,
    scopedStores,
    scopedTickets,
    setActiveTab,
  } = useErp();

  const myCluster = scopedClusters[0];
  const clusterStores = scopedStores;

  const totalRevenue = myCluster?.achievedRevenue || 0;
  const targetRevenue = myCluster?.targetRevenue || 1;
  const royaltyOverdue = myCluster?.totalRoyaltyOverdue || 0;
  const collateralOverdue = myCluster?.totalCollateralOverdue || 0;

  // Store issues pending Cluster Manager review
  const pendingCMTickets = scopedTickets.filter(
    t => t.status === 'pending_cluster'
  );

  return (
    <div className="space-y-4 pb-6">
      {/* Cluster Summary Header Card */}
      <div className="bg-gradient-to-br from-purple-950/40 via-neutral-900 to-neutral-900 border border-purple-500/30 rounded-3xl p-4 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 font-bold text-xs">
              🏬 Cluster Manager
            </span>
            <span className="text-xs font-bold text-neutral-200 truncate max-w-[160px]">
              {myCluster?.name}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
            {((totalRevenue / targetRevenue) * 100).toFixed(0)}% Target
          </span>
        </div>

        {/* Minimal metrics */}
        <div className="grid grid-cols-2 gap-2">
          {/* Revenue */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Cluster Revenue
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
            className="bg-neutral-950/80 p-3 rounded-2xl border border-purple-500/30 cursor-pointer hover:bg-neutral-950 transition-colors"
          >
            <span className="text-[10px] uppercase font-bold text-purple-400 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-purple-400" />
              Store Escalations
            </span>
            <div className="text-base font-extrabold text-purple-300 mt-1">
              {pendingCMTickets.length} Pending
            </div>
            <span className="text-[10px] text-neutral-400">Tap to resolve or escalate</span>
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
            <span className="text-[10px] text-neutral-400">Tap to clear or remind</span>
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
            <span className="text-[10px] text-neutral-500">Security deposits</span>
          </div>
        </div>

        {/* Quick action broadcast */}
        <div className="mt-3 pt-3 border-t border-purple-500/20 flex items-center justify-between gap-2">
          <span className="text-[11px] text-neutral-400">Cluster notices & rosters</span>
          <button
            onClick={onOpenBroadcastModal}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-purple-900/40 active:scale-95 transition-all"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Broadcast to Outlets</span>
          </button>
        </div>
      </div>

      {/* Stores Performance Under Cluster */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-purple-400" />
            Outlets Under Your Cluster
          </h3>
          <span className="text-[10px] text-neutral-500">{clusterStores.length} Salons</span>
        </div>

        <div className="space-y-2.5">
          {clusterStores.map(store => {
            const pct = Math.round((store.currentRevenue / store.monthlyTarget) * 100);

            return (
              <div
                key={store.id}
                className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3.5 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-neutral-100">{store.name}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        {store.code}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      Mgr: {store.managerName} • {store.chairs} Styling Chairs
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

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  ></div>
                </div>

                {/* Dues */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-neutral-950/70 p-2 rounded-xl border border-neutral-800/80">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                      Royalty Overdue
                    </span>
                    <span
                      className={`font-bold text-xs ${
                        store.royaltyOverdue > 0 ? 'text-amber-400' : 'text-neutral-400'
                      }`}
                    >
                      {formatCurrency(store.royaltyOverdue)}
                    </span>
                  </div>
                  <div className="bg-neutral-950/70 p-2 rounded-xl border border-neutral-800/80">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                      Collateral Due
                    </span>
                    <span className="font-bold text-xs text-neutral-200">
                      {formatCurrency(store.collateralOverdue)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Store Issues Awaiting Cluster Review */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
            Issues Awaiting Cluster Action
          </h3>
          <span className="text-[10px] text-neutral-500">Resolve or Escalate to RM</span>
        </div>

        {pendingCMTickets.length === 0 ? (
          <div className="p-6 text-center text-xs text-neutral-500 bg-neutral-900/50 rounded-2xl border border-neutral-800/60">
            No pending tickets in cluster queue.
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingCMTickets.map(tkt => (
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
