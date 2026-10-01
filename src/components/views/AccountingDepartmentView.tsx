import React, { useState } from 'react';
import { useErp } from '../../context/ErpContext';
import { formatCurrency, formatCompactNumber } from '../../utils/formatters';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Radio,
  CheckCircle2,
  FileText,
  Clock,
  ShieldCheck,
  Building,
  CreditCard,
} from 'lucide-react';

interface AccountingDepartmentViewProps {
  onOpenBroadcastModal: () => void;
}

export const AccountingDepartmentView: React.FC<AccountingDepartmentViewProps> = ({
  onOpenBroadcastModal,
}) => {
  const {
    accountingStatus,
    stores,
    markOverdueSettled,
    sendStoreReminder,
    setActiveTab,
  } = useErp();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const delinquentStores = stores.filter(
    s => s.royaltyOverdue > 0 || s.collateralOverdue > 0
  );

  const handleSettle = (storeId: string, storeName: string, type: 'royalty' | 'collateral') => {
    markOverdueSettled(storeId, type);
    setToastMessage(`Successfully settled ${type} dues for ${storeName}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendWarning = (storeId: string, storeName: string) => {
    sendStoreReminder(
      storeId,
      `Official Finance Notice: GSTR reconciliation audit scheduled. Immediate payment required.`
    );
    setToastMessage(`Formal finance reminder dispatched to ${storeName}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Accounting Status Card */}
      <div className="bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-500/30 rounded-3xl p-4 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-xs">
              💳 Finance & Accounts
            </span>
            <span className="text-xs font-bold text-neutral-200">Audit & Royalties</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
            {accountingStatus.reconciliationRate}% Reconciled
          </span>
        </div>

        {/* Financial KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Collected */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Royalty Collected
            </span>
            <div className="text-base font-extrabold text-white mt-1">
              {formatCompactNumber(accountingStatus.totalRoyaltyCollected)}
            </div>
            <span className="text-[10px] text-neutral-500">Current Q3 FY26</span>
          </div>

          {/* Pending Overdues */}
          <div
            onClick={() => setActiveTab('overdues')}
            className="bg-neutral-950/80 p-3 rounded-2xl border border-amber-500/30 cursor-pointer hover:bg-neutral-950 transition-colors"
          >
            <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Overdue Receivables
            </span>
            <div className="text-base font-extrabold text-amber-300 mt-1">
              {formatCompactNumber(accountingStatus.totalRoyaltyPending)}
            </div>
            <span className="text-[10px] text-neutral-400">Tap for aging recovery</span>
          </div>

          {/* Collateral Reserve */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              Collateral Reserve
            </span>
            <div className="text-base font-extrabold text-neutral-200 mt-1">
              {formatCompactNumber(accountingStatus.collateralReservePool)}
            </div>
            <span className="text-[10px] text-neutral-500">Franchise escrow pool</span>
          </div>

          {/* Accounts on Hold */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-rose-500/30">
            <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              Supply Holds
            </span>
            <div className="text-base font-extrabold text-rose-300 mt-1">
              {accountingStatus.accountsOnHoldCount} Delinquent Outlets
            </div>
            <span className="text-[10px] text-neutral-400">Inventory shipments frozen</span>
          </div>
        </div>

        {/* Quick Broadcast CTA */}
        <div className="mt-3 pt-3 border-t border-emerald-500/20 flex items-center justify-between gap-2">
          <span className="text-[11px] text-neutral-400">Dispatch billing circulars</span>
          <button
            onClick={onOpenBroadcastModal}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-900/40 active:scale-95 transition-all"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Send Billing Mandate</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Active Billing Audits Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            High-Balance Franchise Audits
          </h3>
          <span className="text-[10px] text-neutral-500">
            {accountingStatus.recentBillingAudits.length} Accounts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {accountingStatus.recentBillingAudits.map((item, idx) => (
            <div
              key={idx}
              className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3.5 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-neutral-100">{item.storeName}</h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                      {item.storeCode}
                    </span>
                  </div>
                  <span className="text-xs text-amber-300 font-semibold mt-0.5 block">
                    Outstanding: {formatCurrency(item.amount)}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delinquent Stores Quick Recovery Actions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            Delinquent Store Overdues & Quick Settlements
          </h3>
          <button
            onClick={() => setActiveTab('overdues')}
            className="text-[10px] text-amber-400 font-semibold"
          >
            Overdue Desk ({delinquentStores.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {delinquentStores.slice(0, 3).map(store => (
            <div
              key={store.id}
              className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3.5 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-neutral-100">{store.name}</h4>
                  <p className="text-[11px] text-neutral-400">
                    Royalty Due: <strong className="text-amber-300">{formatCurrency(store.royaltyOverdue)}</strong> ({store.royaltyDaysOverdue}d)
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {store.code}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-neutral-800">
                <button
                  onClick={() => handleSettle(store.id, store.name, 'royalty')}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Settle Royalty</span>
                </button>
                <button
                  onClick={() => handleSendWarning(store.id, store.name)}
                  className="py-1.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition-colors"
                >
                  <span>Send Notice</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
