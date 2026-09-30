import React, { useState } from 'react';
import { Ticket } from '../../types/erp';
import { useErp } from '../../context/ErpContext';
import { X, CheckCircle2, XCircle, ArrowUpRight, ShieldAlert } from 'lucide-react';

interface ActionCtaModalProps {
  type: 'approve' | 'reject' | 'escalate';
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

const REJECTION_PRESETS = [
  'Budget limit exceeded for salon tier',
  'Requires physical cluster manager inspection first',
  'Violates standard franchise agreement terms',
  'Incomplete vendor quote & invoice breakdown',
  'Defer to month-end reconciliation cycle',
];

const APPROVAL_PRESETS = [
  'Immediate emergency release approved',
  'Approved with 7-day payment settlement condition',
  'Authorized within regional contingency budget',
  'Approved pending invoice submission within 48h',
];

export const ActionCtaModal: React.FC<ActionCtaModalProps> = ({
  type,
  ticket,
  isOpen,
  onClose,
}) => {
  const { currentRole, approveTicket, rejectTicket, escalateTicket } = useErp();
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !ticket) return null;

  const nextTierLabel = currentRole === 'cluster_manager' ? 'Region Manager (Vikram S.)' : 'Business Head (Ananya S.)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (type === 'approve') {
      approveTicket(ticket.id, note || 'Approved with standard terms.');
    } else if (type === 'reject') {
      rejectTicket(ticket.id, note || 'Rejected by operational authority.');
    } else if (type === 'escalate') {
      escalateTicket(ticket.id, note || 'Escalated for higher executive review.');
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setNote('');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2">
            {type === 'approve' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {type === 'reject' && <XCircle className="w-5 h-5 text-rose-400" />}
            {type === 'escalate' && <ArrowUpRight className="w-5 h-5 text-blue-400" />}
            <div>
              <h3 className="font-extrabold text-sm text-white capitalize">
                {type === 'approve' ? 'Approve Ticket' : type === 'reject' ? 'Reject Escalation' : 'Escalate to Next Tier'}
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono">{ticket.ticketNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs">
            <span className="font-bold text-neutral-200 block truncate">{ticket.title}</span>
            <span className="text-[11px] text-neutral-400 mt-0.5 block">
              Severity: <strong className="text-amber-400 uppercase">{ticket.severity}</strong> • Outlet: {ticket.storeId}
            </span>
          </div>

          {/* Quick Presets */}
          {type === 'reject' && (
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Quick Rejection Presets:
              </span>
              <div className="space-y-1">
                {REJECTION_PRESETS.slice(0, 3).map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNote(preset)}
                    className="w-full text-left text-[11px] p-2 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/60 transition-colors"
                  >
                    • {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {type === 'approve' && (
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Quick Approval Presets:
              </span>
              <div className="space-y-1">
                {APPROVAL_PRESETS.slice(0, 3).map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNote(preset)}
                    className="w-full text-left text-[11px] p-2 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/60 transition-colors"
                  >
                    • {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {type === 'escalate' && (
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
              <span className="font-bold block text-purple-300 mb-0.5">Escalating to: {nextTierLabel}</span>
              <p className="text-[11px] text-purple-300/80">
                This item will move into the senior management review dashboard with your transfer notes attached.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
              {type === 'reject' ? 'Reason for Rejection *' : 'Comments / Decision Notes'}
            </label>
            <textarea
              required={type === 'reject'}
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={
                type === 'reject'
                  ? 'Specify why this cannot be approved...'
                  : type === 'approve'
                  ? 'Add conditions or authorization details (optional)...'
                  : 'Add context for next tier authority...'
              }
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (type === 'reject' && !note.trim())}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98 ${
              type === 'approve'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                : type === 'reject'
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-950/50'
            }`}
          >
            {type === 'approve' && <CheckCircle2 className="w-4 h-4" />}
            {type === 'reject' && <XCircle className="w-4 h-4" />}
            {type === 'escalate' && <ArrowUpRight className="w-4 h-4" />}
            <span>
              {type === 'approve'
                ? 'Confirm Quick Approval'
                : type === 'reject'
                ? 'Confirm Rejection'
                : `Escalate to ${nextTierLabel}`}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
