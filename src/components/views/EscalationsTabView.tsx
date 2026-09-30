import React, { useState } from 'react';
import { useErp } from '../../context/ErpContext';
import { EscalationCard } from '../common/EscalationCard';
import { Ticket } from '../../types/erp';
import { ShieldAlert, PlusCircle, CheckCircle2, Zap, Filter } from 'lucide-react';

interface EscalationsTabViewProps {
  onOpenApproveModal: (ticket: Ticket) => void;
  onOpenRejectModal: (ticket: Ticket) => void;
  onOpenEscalateModal: (ticket: Ticket) => void;
  onOpenTicketModal: () => void;
}

export const EscalationsTabView: React.FC<EscalationsTabViewProps> = ({
  onOpenApproveModal,
  onOpenRejectModal,
  onOpenEscalateModal,
  onOpenTicketModal,
}) => {
  const { scopedTickets, currentRole } = useErp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'direct' | 'resolved'>('all');

  const filteredTickets = scopedTickets.filter(t => {
    if (filter === 'pending') {
      return (
        t.status === 'pending_bh' ||
        t.status === 'pending_region' ||
        t.status === 'pending_cluster'
      );
    }
    if (filter === 'direct') return t.directToBH;
    if (filter === 'resolved') return t.status === 'approved' || t.status === 'resolved' || t.status === 'rejected';
    return true;
  });

  const pendingCount = scopedTickets.filter(
    t =>
      t.status === 'pending_bh' ||
      t.status === 'pending_region' ||
      t.status === 'pending_cluster'
  ).length;

  const directCount = scopedTickets.filter(t => t.directToBH).length;

  const getDeskInfo = () => {
    switch (currentRole) {
      case 'hr_head':
        return {
          title: 'HR & Staffing Escalations',
          subtitle: 'Stylist shortages, absentee rosters, and emergency transfer requests',
        };
      case 'accounting_head':
        return {
          title: 'Finance & Royalty Disputes',
          subtitle: 'Billing reconciliation, royalty penalty waivers, and collateral holds',
        };
      case 'training_head':
        return {
          title: 'Academy SOP & Quality Audits',
          subtitle: 'Salon hygiene infractions, autoclave breakdowns, and protocol audits',
        };
      case 'marketing_head':
        return {
          title: 'Marketing & Promo Complaints',
          subtitle: 'Campaign discount errors, booking coupon sync, and customer reviews',
        };
      case 'business_head':
        return {
          title: 'Executive Escalation Desk',
          subtitle: 'Executive approvals & high-priority network interventions',
        };
      case 'region_manager':
        return {
          title: 'Regional Escalation Desk',
          subtitle: 'Regional reviews & cluster dispute triage',
        };
      case 'cluster_manager':
        return {
          title: 'Cluster Escalation Desk',
          subtitle: 'Cluster store reviews & operational support',
        };
      default:
        return {
          title: 'Store Escalation Desk',
          subtitle: 'Logged salon issues & management resolution timeline',
        };
    }
  };

  const deskInfo = getDeskInfo();

  return (
    <div className="space-y-4 pb-6">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            {deskInfo.title}
          </h2>
          <p className="text-xs text-neutral-400">
            {deskInfo.subtitle}
          </p>
        </div>

        {currentRole === 'store_manager' && (
          <button
            onClick={onOpenTicketModal}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-950/50"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Issue</span>
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
            filter === 'all'
              ? 'bg-neutral-200 text-neutral-950 border-white'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400'
          }`}
        >
          All Tickets ({scopedTickets.length})
        </button>

        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
            filter === 'pending'
              ? 'bg-amber-500 text-neutral-950 border-amber-400'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400'
          }`}
        >
          Awaiting Action ({pendingCount})
        </button>

        <button
          onClick={() => setFilter('direct')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
            filter === 'direct'
              ? 'bg-rose-500 text-white border-rose-400'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400'
          }`}
        >
          ⚡ Direct to BH ({directCount})
        </button>

        <button
          onClick={() => setFilter('resolved')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
            filter === 'resolved'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400'
          }`}
        >
          Archived / Resolved
        </button>
      </div>

      {/* Escalation Cards List */}
      {filteredTickets.length === 0 ? (
        <div className="py-16 text-center text-xs text-neutral-500 bg-neutral-900/40 rounded-3xl border border-neutral-800/60 p-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
          <p className="font-semibold text-neutral-300">No tickets found</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Your escalation queue has no items for this filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map(ticket => (
            <EscalationCard
              key={ticket.id}
              ticket={ticket}
              onOpenApproveModal={onOpenApproveModal}
              onOpenRejectModal={onOpenRejectModal}
              onOpenEscalateModal={onOpenEscalateModal}
            />
          ))}
        </div>
      )}
    </div>
  );
};
