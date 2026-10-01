import React, { useState } from 'react';
import { useErp } from '../../context/ErpContext';
import { TicketSeverity, TicketCategory } from '../../types/erp';
import {
  X,
  AlertTriangle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Send,
  Building,
  Store as StoreIcon,
} from 'lucide-react';

interface CreateEscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: TicketCategory[] = [
  'Equipment & AC Breakdown',
  'Royalty & Billing',
  'Collateral Recovery',
  'Staff & Stylist Shortage',
  'Product & Chemical Supply',
  'Franchise Compliance',
  'Customer Dispute',
];

export const CreateEscalationModal: React.FC<CreateEscalationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createTicket, currentUser, stores } = useErp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Equipment & AC Breakdown');
  const [severity, setSeverity] = useState<TicketSeverity>('high');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStore = stores.find(s => s.id === currentUser.storeId) || stores[0];
  const isHighOrCritical = severity === 'high' || severity === 'critical';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const created = createTicket({
      title,
      description,
      category,
      severity,
    });

    setFeedback(
      `Ticket logged with ${severity.toUpperCase()} priority! Dispatched to Cluster Manager (Stage 1 of Hierarchy Cycle).`
    );

    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback(null);
      setTitle('');
      setDescription('');
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md sm:max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <h3 className="font-extrabold text-base text-white">Raise Issue / Escalation</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Outlet: {currentStore.name} ({currentStore.code})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Severity Picker with Rule Explanation */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Select Severity Level <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['low', 'medium', 'high', 'critical'] as TicketSeverity[]).map(sev => {
                const isSelected = severity === sev;
                const isUrgent = sev === 'high' || sev === 'critical';

                return (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2 px-1 rounded-xl text-center border font-bold text-xs capitalize transition-all ${
                      isSelected
                        ? isUrgent
                          ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-950/50 scale-102'
                          : 'bg-amber-500 text-neutral-950 border-amber-400 font-extrabold scale-102'
                        : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    {sev}
                  </button>
                );
              })}
            </div>

            {/* REAL-TIME SEVERITY ROUTING BANNER */}
            <div
              className={`mt-2.5 p-3 rounded-2xl border transition-all text-xs ${
                isHighOrCritical
                  ? 'bg-gradient-to-r from-rose-950/60 via-amber-950/40 to-neutral-900 border-rose-500/50 text-rose-200 shadow-md shadow-rose-950/40'
                  : 'bg-blue-950/30 border-blue-500/30 text-blue-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {isHighOrCritical ? (
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="font-extrabold flex items-center gap-1.5 uppercase text-white tracking-wide">
                    {isHighOrCritical
                      ? 'Strict Hierarchy Cycle Enforced (High/Critical)'
                      : 'Hierarchy Cycle: Standard Review (Stage 1: Cluster)'}
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-snug">
                    All issues follow the mandatory 4-tier chain of command:
                    <strong className="text-amber-300 ml-1">
                      Store ➔ Cluster Mgr ➔ Region Mgr ➔ Business Head
                    </strong>
                    . Direct escalation to Business Head is not permitted—even for High/Critical severities, your ticket is dispatched to your Cluster Manager (Rajesh Verma) for Stage 1 initial triage.
                  </p>
                  {isHighOrCritical && (
                    <div className="flex items-center gap-1.5 pt-1 text-[10px] text-amber-300/90 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                      <span>Region & Business Head receive automated SLA CC alerts while Cluster acts.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Issue Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as TicketCategory)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-hidden focus:border-amber-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Subject / Brief Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Central Chiller Breakdown during Peak Booking"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Detailed Description & Business Impact <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide exact facts, client impact, revenue at risk, and specific action requested from management..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-500 resize-none"
            />
          </div>

          {/* Notification Recipient Preview */}
          <div className="bg-neutral-950/80 rounded-2xl p-3 border border-neutral-800/80 text-[11px] text-neutral-400 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-300">
                Automated Cycle Notification Matrix:
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-semibold">Stage 1 Routing</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                Primary Action: Cluster Manager (Rajesh Verma)
              </span>
              {isHighOrCritical ? (
                <>
                  <span className="px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                    CC SLA: Region Mgr
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                    CC SLA: Business Head
                  </span>
                </>
              ) : null}
            </div>
            <p className="text-[10px] text-neutral-500 italic pt-0.5">
              {isHighOrCritical
                ? 'Action authority remains with Cluster Manager (Stage 1). Senior management receives automated CC alerts for visibility only.'
                : 'Ticket routes directly to Cluster Manager queue for inspection and operational support.'}
            </p>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !title || !description}
            className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
              isHighOrCritical
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/60'
                : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-950/60 font-black'
            }`}
          >
            {isSubmitting ? (
              <span>Dispatching to Cluster Queue...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>
                  {isHighOrCritical
                    ? 'Submit High/Critical to Cluster Queue (Stage 1 Cycle)'
                    : 'Submit to Cluster Manager (Stage 1 Cycle)'}
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
