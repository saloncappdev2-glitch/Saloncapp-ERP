import React, { useState } from 'react';
import { Store } from '../../types/erp';
import { useErp } from '../../context/ErpContext';
import { formatCurrency } from '../../utils/formatters';
import { AlertTriangle, CheckCircle, BellRing, PhoneCall, ChevronRight, ShieldAlert } from 'lucide-react';

interface OverdueCardProps {
  store: Store;
}

export const OverdueCard: React.FC<OverdueCardProps> = ({ store }) => {
  const { currentRole, markOverdueSettled, sendStoreReminder } = useErp();
  const [noticeSent, setNoticeSent] = useState(false);
  const [settledSuccess, setSettledSuccess] = useState<string | null>(null);

  const totalOverdue = store.royaltyOverdue + store.collateralOverdue;

  const handleClearOverdue = (type: 'royalty' | 'collateral') => {
    markOverdueSettled(store.id, type);
    setSettledSuccess(`${type.toUpperCase()} settled successfully!`);
    setTimeout(() => setSettledSuccess(null), 3000);
  };

  const handleSendNotice = () => {
    sendStoreReminder(
      store.id,
      `Urgent: Outstanding royalty balance of ${formatCurrency(
        store.royaltyOverdue
      )} is ${store.royaltyDaysOverdue} days past due. Please clear within 48h to prevent operational holds.`
    );
    setNoticeSent(true);
    setTimeout(() => setNoticeSent(false), 3500);
  };

  const getAgingBadge = (days: number) => {
    if (days >= 60) {
      return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
    }
    if (days >= 30) {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
    return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  };

  return (
    <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3.5 space-y-3 relative overflow-hidden">
      {/* Top Banner if Critical Overdue */}
      {store.royaltyDaysOverdue > 60 && (
        <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
          Legal Risk (&gt;60d)
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-sm text-neutral-100">{store.name}</h4>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
              {store.code}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            {store.city} • Mgr: {store.managerName}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Total Overdue</span>
          <span className="font-extrabold text-sm text-rose-400">
            {formatCurrency(totalOverdue)}
          </span>
        </div>
      </div>

      {/* Dues Breakdown Row */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Royalty Overdue */}
        <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Royalty Dues</span>
            {store.royaltyOverdue > 0 && (
              <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${getAgingBadge(store.royaltyDaysOverdue)}`}>
                {store.royaltyDaysOverdue}d Overdue
              </span>
            )}
          </div>
          <div className="font-extrabold text-sm text-neutral-200">
            {formatCurrency(store.royaltyOverdue)}
          </div>
          {store.royaltyOverdue > 0 && currentRole !== 'store_manager' && (
            <button
              onClick={() => handleClearOverdue('royalty')}
              className="mt-2 text-[10px] font-bold py-1 px-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1 transition-colors"
            >
              <CheckCircle className="w-3 h-3" />
              <span>Settle Royalty</span>
            </button>
          )}
        </div>

        {/* Collateral Overdue */}
        <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Collateral Dues</span>
            {store.collateralOverdue > 0 && (
              <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${getAgingBadge(store.collateralDaysOverdue)}`}>
                {store.collateralDaysOverdue}d Overdue
              </span>
            )}
          </div>
          <div className="font-extrabold text-sm text-neutral-200">
            {formatCurrency(store.collateralOverdue)}
          </div>
          {store.collateralOverdue > 0 && currentRole !== 'store_manager' && (
            <button
              onClick={() => handleClearOverdue('collateral')}
              className="mt-2 text-[10px] font-bold py-1 px-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1 transition-colors"
            >
              <CheckCircle className="w-3 h-3" />
              <span>Settle Collateral</span>
            </button>
          )}
        </div>
      </div>

      {/* Settlement feedback toast */}
      {settledSuccess && (
        <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5 animate-fadeIn">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{settledSuccess}</span>
        </div>
      )}

      {/* Quick CTAs for Higher Management */}
      {currentRole !== 'store_manager' && totalOverdue > 0 && (
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-2">
          <button
            onClick={handleSendNotice}
            disabled={noticeSent}
            className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              noticeSent
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
            }`}
          >
            <BellRing className="w-3.5 h-3.5 text-amber-400" />
            <span>{noticeSent ? 'Notice Dispatched!' : 'Send Formal Notice'}</span>
          </button>

          <a
            href={`tel:${store.phone}`}
            className="py-1.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>Call Mgr</span>
          </a>
        </div>
      )}
    </div>
  );
};
