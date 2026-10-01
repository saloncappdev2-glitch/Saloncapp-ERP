import React, { useState } from 'react';
import { Ticket } from '../../types/erp';
import { useErp } from '../../context/ErpContext';
import {
  getSeverityBadgeStyle,
  getStatusBadgeStyle,
  formatTimeAgo,
} from '../../utils/formatters';
import {
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

interface EscalationCardProps {
  ticket: Ticket;
  onOpenApproveModal?: (ticket: Ticket) => void;
  onOpenRejectModal?: (ticket: Ticket) => void;
  onOpenEscalateModal?: (ticket: Ticket) => void;
}

export const EscalationCard: React.FC<EscalationCardProps> = ({
  ticket,
  onOpenApproveModal,
  onOpenRejectModal,
  onOpenEscalateModal,
}) => {
  const { currentRole, stores } = useErp();
  const [expanded, setExpanded] = useState(false);

  const sevStyle = getSeverityBadgeStyle(ticket.severity);
  const statStyle = getStatusBadgeStyle(ticket.status);
  const store = stores.find(s => s.id === ticket.storeId);

  // Can this role take action on this ticket?
  const canBusinessHeadAct = currentRole === 'business_head' && ticket.status === 'pending_bh';
  const canRegionAct = currentRole === 'region_manager' && ticket.status === 'pending_region';
  const canClusterAct = currentRole === 'cluster_manager' && ticket.status === 'pending_cluster';

  const isUrgent = ticket.severity === 'critical' || ticket.severity === 'high';

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isUrgent && (ticket.status === 'pending_cluster' || ticket.status === 'pending_region' || ticket.status === 'pending_bh')
          ? 'bg-gradient-to-b from-neutral-900 via-neutral-900 to-rose-950/20 border-rose-500/40 shadow-md shadow-rose-950/30'
          : 'bg-neutral-900/90 border-neutral-800'
      }`}
    >
      {/* Hierarchy Cycle Progress Track */}
      <div className="bg-neutral-950/80 border-b border-neutral-800/80 px-3.5 py-1.5 flex items-center justify-between gap-2 text-[10px]">
        <div className="flex items-center gap-1.5 font-mono overflow-x-auto">
          <span className="text-neutral-500 font-bold shrink-0">CYCLE:</span>
          <span className="text-neutral-400 font-medium shrink-0">Store</span>
          <span className="text-neutral-600 shrink-0">➔</span>
          <span
            className={`px-1.5 py-0.5 rounded font-bold shrink-0 ${
              ticket.status === 'pending_cluster'
                ? 'bg-purple-500/25 text-purple-200 border border-purple-500/50'
                : ticket.status === 'pending_region' || ticket.status === 'pending_bh' || ticket.status === 'approved' || ticket.status === 'resolved'
                ? 'text-emerald-400 font-medium'
                : 'text-neutral-500'
            }`}
          >
            1. Cluster {ticket.status === 'pending_region' || ticket.status === 'pending_bh' || ticket.status === 'approved' || ticket.status === 'resolved' ? '✓' : ''}
          </span>
          <span className="text-neutral-600 shrink-0">➔</span>
          <span
            className={`px-1.5 py-0.5 rounded font-bold shrink-0 ${
              ticket.status === 'pending_region'
                ? 'bg-blue-500/25 text-blue-200 border border-blue-500/50'
                : ticket.status === 'pending_bh' || ticket.status === 'approved' || ticket.status === 'resolved'
                ? 'text-emerald-400 font-medium'
                : 'text-neutral-500'
            }`}
          >
            2. Region {ticket.status === 'pending_bh' || ticket.status === 'approved' || ticket.status === 'resolved' ? '✓' : ''}
          </span>
          <span className="text-neutral-600 shrink-0">➔</span>
          <span
            className={`px-1.5 py-0.5 rounded font-bold shrink-0 ${
              ticket.status === 'pending_bh'
                ? 'bg-amber-500/25 text-amber-200 border border-amber-500/50'
                : ticket.status === 'approved' || ticket.status === 'resolved'
                ? 'text-emerald-400 font-medium'
                : 'text-neutral-500'
            }`}
          >
            3. Business Head {ticket.status === 'approved' || ticket.status === 'resolved' ? '✓' : ''}
          </span>
        </div>

        {isUrgent && (
          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-extrabold uppercase text-[9px] flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            Cycle Enforced • {ticket.severity}
          </span>
        )}
      </div>

      <div className="p-3.5">
        {/* Header row: Ticket number, time, severity & status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-neutral-400 font-semibold">
                {ticket.ticketNumber}
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(ticket.createdAt)}
              </span>
            </div>
            <h3 className="font-bold text-sm text-neutral-100 mt-1 leading-snug">
              {ticket.title}
            </h3>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border flex items-center gap-1 ${sevStyle.bg} ${sevStyle.text} ${sevStyle.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${sevStyle.dot}`}></span>
              {ticket.severity}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statStyle.bg} ${statStyle.text} ${statStyle.border}`}
            >
              {statStyle.label}
            </span>
          </div>
        </div>

        {/* Store & Category metadata */}
        <div className="bg-neutral-950/60 rounded-xl p-2.5 mb-2.5 border border-neutral-800/60 text-xs">
          <div className="grid grid-cols-2 gap-2 text-neutral-300">
            <div>
              <span className="text-neutral-500 text-[10px] block">Outlet:</span>
              <span className="font-semibold text-neutral-200 truncate block">
                {store?.name || 'Salon Outlet'}
              </span>
              <span className="text-[10px] text-neutral-400">{store?.city}</span>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] block">Category:</span>
              <span className="font-medium text-amber-300 truncate block">
                {ticket.category}
              </span>
              <span className="text-[10px] text-neutral-400">Raised by: {ticket.raisedByName}</span>
            </div>
          </div>
        </div>

        {/* Description snippet */}
        <p className={`text-xs text-neutral-300 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
          {ticket.description}
        </p>

        {/* Rejection / Resolution notes if any */}
        {ticket.rejectionReason && (
          <div className="mt-2.5 p-2 rounded-lg bg-rose-950/40 border border-rose-800/50 text-xs text-rose-300">
            <span className="font-bold block text-[10px] uppercase tracking-wider text-rose-400">
              Rejection Reason:
            </span>
            {ticket.rejectionReason}
          </div>
        )}
        {ticket.resolutionNote && (
          <div className="mt-2.5 p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-300">
            <span className="font-bold block text-[10px] uppercase tracking-wider text-emerald-400">
              Resolution Note:
            </span>
            {ticket.resolutionNote}
          </div>
        )}

        {/* Audit trail expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{expanded ? 'Hide audit timeline' : `View audit timeline (${ticket.timeline.length})`}</span>
        </button>

        {/* Expanded Timeline */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-neutral-800/80 space-y-2.5">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
              Escalation Audit Trail
            </span>
            <div className="space-y-2 border-l border-neutral-800 pl-3 ml-1.5">
              {ticket.timeline.map((step, idx) => (
                <div key={step.id || idx} className="relative text-xs">
                  <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-amber-400"></div>
                  <div className="font-semibold text-neutral-200">{step.action}</div>
                  <div className="text-[11px] text-neutral-400">
                    {step.performedByName} • {formatTimeAgo(step.timestamp)}
                  </div>
                  {step.note && (
                    <div className="mt-0.5 text-[11px] text-neutral-300 italic bg-neutral-950/50 p-1.5 rounded border border-neutral-800/50">
                      "{step.note}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUICK CTAs SECTION */}
        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          {/* Business Head Quick Actions */}
          {canBusinessHeadAct && (
            <div className="w-full flex items-center gap-2">
              <button
                onClick={() => onOpenApproveModal?.(ticket)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-950/50 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Quick Approve</span>
              </button>
              <button
                onClick={() => onOpenRejectModal?.(ticket)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          )}

          {/* Region Manager Quick Actions */}
          {canRegionAct && (
            <div className="w-full flex items-center gap-1.5">
              <button
                onClick={() => onOpenApproveModal?.(ticket)}
                className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
              {ticket.status !== 'pending_bh' && (
                <button
                  onClick={() => onOpenEscalateModal?.(ticket)}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Push to BH</span>
                </button>
              )}
              <button
                onClick={() => onOpenRejectModal?.(ticket)}
                className="py-1.5 px-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-semibold text-xs flex items-center justify-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          )}

          {/* Cluster Manager Quick Actions */}
          {canClusterAct && (
            <div className="w-full flex items-center gap-1.5">
              <button
                onClick={() => onOpenApproveModal?.(ticket)}
                className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Resolve</span>
              </button>
              <button
                onClick={() => onOpenEscalateModal?.(ticket)}
                className="flex-1 py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Escalate to RM</span>
              </button>
              <button
                onClick={() => onOpenRejectModal?.(ticket)}
                className="py-1.5 px-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-semibold text-xs flex items-center justify-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          )}

          {/* If already decided or store view */}
          {!canBusinessHeadAct && !canRegionAct && !canClusterAct && (
            <div className="w-full flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-neutral-500" />
                Current Stage: <strong className="text-neutral-200">{statStyle.label}</strong>
              </span>
              <span className="text-[10px] text-neutral-500">Read-only audit</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
