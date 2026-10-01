import React from 'react';
import { useErp } from '../../context/ErpContext';
import { formatCurrency, formatCompactNumber, formatTimeAgo } from '../../utils/formatters';
import { EscalationCard } from '../common/EscalationCard';
import {
  Scissors,
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  Radio,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface StoreManagerViewProps {
  onOpenTicketModal: () => void;
}

export const StoreManagerView: React.FC<StoreManagerViewProps> = ({
  onOpenTicketModal,
}) => {
  const {
    currentUser,
    scopedStores,
    scopedTickets,
    scopedBroadcasts,
    setActiveTab,
  } = useErp();

  const myStore = scopedStores[0];

  const currentRevenue = myStore?.currentRevenue || 0;
  const targetRevenue = myStore?.monthlyTarget || 1;
  const targetPct = Math.round((currentRevenue / targetRevenue) * 100);

  const activeTickets = scopedTickets;
  const directTickets = activeTickets.filter(t => t.directToBH);
  const latestBroadcasts = scopedBroadcasts.slice(0, 2);

  return (
    <div className="space-y-4 pb-6">
      {/* Store Outlet Greeting & Dues Banner */}
      <div className="bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-500/30 rounded-3xl p-4 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-xs">
              💇 Store Manager
            </span>
            <span className="text-xs font-bold text-neutral-200 truncate max-w-[160px]">
              {myStore?.name}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
            {targetPct}% Target
          </span>
        </div>

        {/* Minimal metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Revenue */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Store Revenue
            </span>
            <div className="text-base font-extrabold text-white mt-1">
              {formatCompactNumber(currentRevenue)}
            </div>
            <span className="text-[10px] text-neutral-500">
              Target: {formatCompactNumber(targetRevenue)}
            </span>
          </div>

          {/* Footfall & Chairs */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-blue-400" />
              Chairs & Clients
            </span>
            <div className="text-base font-extrabold text-neutral-200 mt-1">
              {myStore?.chairs} Chairs
            </div>
            <span className="text-[10px] text-neutral-500">
              {myStore?.footfallMonthly} Visits this month
            </span>
          </div>

          {/* Royalty Overdue */}
          <div
            onClick={() => setActiveTab('overdues')}
            className={`p-3 rounded-2xl border cursor-pointer transition-colors ${
              (myStore?.royaltyOverdue || 0) > 0
                ? 'bg-amber-950/40 border-amber-500/40'
                : 'bg-neutral-950/80 border-neutral-800/80'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Royalty Overdue
            </span>
            <div className="text-base font-extrabold text-amber-300 mt-1">
              {formatCurrency(myStore?.royaltyOverdue || 0)}
            </div>
            <span className="text-[10px] text-amber-400/80">
              {(myStore?.royaltyDaysOverdue || 0) > 0
                ? `${myStore?.royaltyDaysOverdue} days overdue`
                : 'Settled'}
            </span>
          </div>

          {/* Collateral Overdue */}
          <div
            onClick={() => setActiveTab('overdues')}
            className={`p-3 rounded-2xl border cursor-pointer transition-colors ${
              (myStore?.collateralOverdue || 0) > 0
                ? 'bg-neutral-950/80 border-rose-500/30'
                : 'bg-neutral-950/80 border-neutral-800/80'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-neutral-400" />
              Collateral Dues
            </span>
            <div className="text-base font-extrabold text-neutral-200 mt-1">
              {formatCurrency(myStore?.collateralOverdue || 0)}
            </div>
            <span className="text-[10px] text-neutral-500">Deposit balance</span>
          </div>
        </div>

        {/* PROMINENT ISSUE REPORTING BUTTON */}
        <div className="mt-3 pt-3 border-t border-emerald-500/20">
          <button
            onClick={onOpenTicketModal}
            className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/60 active:scale-98 transition-all"
          >
            <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Report / Escalate Issue (With Severity Routing)</span>
          </button>
          <p className="text-[10px] text-neutral-400 text-center mt-1.5">
            High & Critical issues route straight to Business Head & CC your Cluster/Region Managers.
          </p>
        </div>
      </div>

      {/* Broadcasts Received from Leadership */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            Executive Broadcasts & Directives
          </h3>
          <button
            onClick={() => setActiveTab('broadcasts')}
            className="text-[10px] text-amber-400 font-semibold"
          >
            View all ({scopedBroadcasts.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {latestBroadcasts.map(bc => (
            <div
              key={bc.id}
              className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {bc.senderTitle}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {formatTimeAgo(bc.timestamp)}
                </span>
              </div>
              <h4 className="font-bold text-xs text-neutral-100">{bc.title}</h4>
              <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed">
                {bc.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* My Store Escalation Tickets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            My Escalation Tickets ({activeTickets.length})
          </h3>
          <span className="text-[10px] text-neutral-500">Live Status Tracking</span>
        </div>

        {activeTickets.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500 bg-neutral-900/50 rounded-2xl border border-neutral-800/60">
            No issues currently logged for your outlet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {activeTickets.map(tkt => (
              <EscalationCard key={tkt.id} ticket={tkt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
