import React, { useState } from 'react';
import { useErp } from '../../context/ErpContext';
import { OverdueCard } from '../common/OverdueCard';
import { ScrollableChipBar } from '../common/ScrollableChipBar';
import { formatCurrency } from '../../utils/formatters';
import { AlertCircle, Filter, CheckCircle2, ShieldAlert } from 'lucide-react';

export const OverduesTabView: React.FC = () => {
  const { scopedStores, currentRole } = useErp();
  const [filter, setFilter] = useState<'all' | 'critical' | 'royalty' | 'collateral'>('all');

  const storesWithOverdue = scopedStores.filter(
    s => s.royaltyOverdue > 0 || s.collateralOverdue > 0
  );

  const filteredStores = storesWithOverdue.filter(s => {
    if (filter === 'critical') return s.royaltyDaysOverdue > 60 || s.collateralDaysOverdue > 60;
    if (filter === 'royalty') return s.royaltyOverdue > 0;
    if (filter === 'collateral') return s.collateralOverdue > 0;
    return true;
  });

  const totalRoyalty = scopedStores.reduce((sum, s) => sum + s.royaltyOverdue, 0);
  const totalCollateral = scopedStores.reduce((sum, s) => sum + s.collateralOverdue, 0);

  return (
    <div className="space-y-4 pb-6">
      {/* Overview Tally Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">Overdue Recovery Desk</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {storesWithOverdue.length} Delinquent Outlets
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-amber-400 block">
              Royalty Overdue
            </span>
            <div className="text-base font-extrabold text-amber-300 mt-1">
              {formatCurrency(totalRoyalty)}
            </div>
            <span className="text-[10px] text-neutral-500">Franchise revenue cut</span>
          </div>

          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              Collateral Dues
            </span>
            <div className="text-base font-extrabold text-neutral-200 mt-1">
              {formatCurrency(totalCollateral)}
            </div>
            <span className="text-[10px] text-neutral-500">Asset security guarantee</span>
          </div>

          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-rose-400 block">
              Delinquent Stores
            </span>
            <div className="text-base font-extrabold text-rose-300 mt-1">
              {storesWithOverdue.length} Outlets
            </div>
            <span className="text-[10px] text-neutral-500">Unsettled accounts</span>
          </div>

          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-purple-400 block">
              Critical &gt;30 Days
            </span>
            <div className="text-base font-extrabold text-purple-300 mt-1">
              {storesWithOverdue.filter(s => s.royaltyDaysOverdue > 30 || s.collateralDaysOverdue > 30).length} Outlets
            </div>
            <span className="text-[10px] text-neutral-500">Legal escalation threshold</span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <ScrollableChipBar>
        {[
          { id: 'all', label: `All Overdue (${storesWithOverdue.length})` },
          { id: 'critical', label: '🚨 >60 Days Overdue' },
          { id: 'royalty', label: 'Royalty Only' },
          { id: 'collateral', label: 'Collateral Only' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border shrink-0 transition-all ${
              filter === f.id
                ? 'bg-amber-500 text-neutral-950 border-amber-400 font-black'
                : 'bg-neutral-850 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </ScrollableChipBar>

      {/* Stores List */}
      {filteredStores.length === 0 ? (
        <div className="py-16 text-center text-xs text-neutral-500 bg-neutral-900/40 rounded-3xl border border-neutral-800/60 p-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
          <p className="font-semibold text-neutral-300">All clear!</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            No outlets found matching the selected overdue filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredStores.map(store => (
            <OverdueCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </div>
  );
};
