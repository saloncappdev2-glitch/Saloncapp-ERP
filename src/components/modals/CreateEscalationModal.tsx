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
      isHighOrCritical
        ? `⚡ Direct Escalation dispatched to Business Head! Cluster & Region Managers CC'd.`
        : `Ticket dispatched to Cluster Manager for standard review.`
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
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
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
                  ? 'bg-gradient-to-r from-rose-950/50 to-amber-950/30 border-rose-500/40 text-rose-200'
                  : 'bg-blue-950/30 border-blue-500/30 text-blue-200'
              }`}
            >
              <div className="flex items-start gap-2">
                {isHighOrCritical ? (
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    {isHighOrCritical
                      ? 'DIRECT ESCALATION TO BUSINESS HEAD'
                      : 'STANDARD HIERARCHY ROUTING'}
                  </div>
                  <p className="text-[11px] opacity-90 mt-0.5 leading-snug">
                    {isHighOrCritical
                      ? 'Because severity is High/Critical, this ticket bypasses standard queue directly to Business Head Ananya Sharma. Cluster Manager (Rajesh V.) & Region Manager (Vikram S.) are auto-notified & CC’d.'
                      : 'Low/Medium issues route directly to your Cluster Manager (Rajesh Verma) for localized review and resolution.'}
                  </p>
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
          <div className="bg-neutral-950/80 rounded-xl p-2.5 border border-neutral-800/80 text-[11px] text-neutral-400">
            <span className="font-semibold text-neutral-300 block mb-1">
              Automated Notification Matrix:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {isHighOrCritical ? (
                <>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                    Primary: Business Head
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                    CC: Region Mgr
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                    CC: Cluster Mgr
                  </span>
                </>
              ) : (
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  Primary: Cluster Manager (Rajesh Verma)
                </span>
              )}
            </div>
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
              <span>Dispatching Notification...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>
                  {isHighOrCritical
                    ? 'Escalate Directly to Business Head'
                    : 'Submit to Cluster Manager'}
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
