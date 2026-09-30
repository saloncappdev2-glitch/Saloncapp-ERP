import React, { useState } from 'react';
import { useErp } from '../../context/ErpContext';
import { formatTimeAgo } from '../../utils/formatters';
import { BroadcastMessage } from '../../types/erp';
import {
  Radio,
  Send,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
  Sparkles,
  Building,
  Store,
  ChevronRight,
} from 'lucide-react';

interface BroadcastsTabViewProps {
  onOpenBroadcastModal: () => void;
}

export const BroadcastsTabView: React.FC<BroadcastsTabViewProps> = ({
  onOpenBroadcastModal,
}) => {
  const { scopedBroadcasts, currentRole, currentUser } = useErp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredBroadcasts = scopedBroadcasts.filter(b => {
    if (selectedCategory === 'all') return true;
    return b.category === selectedCategory;
  });

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
      case 'urgent':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  const getSenderRoleBadge = (role: string) => {
    switch (role) {
      case 'business_head':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'region_manager':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'cluster_manager':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400" />
            Communication Hub
          </h2>
          <p className="text-xs text-neutral-400">
            {currentRole === 'store_manager'
              ? 'Official circulars & operational mandates'
              : 'Multi-tier broadcast network & directives'}
          </p>
        </div>

        {currentRole !== 'store_manager' && (
          <button
            onClick={onOpenBroadcastModal}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/50 active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All Notices' },
          { id: 'Overdue Escalation', label: '💰 Overdues' },
          { id: 'Operational Notice', label: '📋 Operational' },
          { id: 'Target Drive', label: '🎯 Target Drives' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-neutral-950 border-amber-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Broadcast Feed */}
      <div className="space-y-3">
        {filteredBroadcasts.map(bc => (
          <div
            key={bc.id}
            className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-4 space-y-2.5 shadow-xs"
          >
            {/* Top row: Sender & Priority */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSenderRoleBadge(
                    bc.senderRole
                  )}`}
                >
                  {bc.senderTitle}
                </span>
                <span className="text-[11px] text-neutral-400 font-semibold truncate max-w-[130px]">
                  {bc.senderName}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getPriorityStyle(
                    bc.priority
                  )}`}
                >
                  {bc.priority}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-extrabold text-sm text-neutral-100 leading-snug">
              {bc.title}
            </h3>

            {/* Message Body */}
            <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/60">
              {bc.content}
            </p>

            {/* Footer Metadata */}
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/80">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-neutral-500" />
                Scope: <strong className="text-neutral-300 uppercase">{bc.scope}</strong>
                <span>({bc.totalRecipients} Outlets)</span>
              </span>
              <span className="flex items-center gap-1 font-mono text-[10px] text-neutral-500">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(bc.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
