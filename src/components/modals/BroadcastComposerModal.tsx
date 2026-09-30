import React, { useState } from 'react';
import { useErp } from '../../context/ErpContext';
import { BroadcastScope } from '../../types/erp';
import {
  X,
  Send,
  Radio,
  Users,
  Building,
  Store as StoreIcon,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';

interface BroadcastComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BroadcastComposerModal: React.FC<BroadcastComposerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentRole, currentUser, regions, clusters, stores, isHqRole, sendBroadcast } = useErp();

  const getDefaultCategory = () => {
    switch (currentRole) {
      case 'hr_head':
        return 'HR & Staffing';
      case 'accounting_head':
        return 'Accounting & Billing';
      case 'training_head':
        return 'Training & Academy';
      case 'marketing_head':
        return 'Marketing & Campaign';
      default:
        return 'Operational Notice';
    }
  };

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'critical'>('urgent');
  const [category, setCategory] = useState<any>(getDefaultCategory());

  // Broadcast Scope selector
  const [scope, setScope] = useState<BroadcastScope>('all');
  const [selectedRegionIds, setSelectedRegionIds] = useState<string[]>([]);
  const [selectedClusterIds, setSelectedClusterIds] = useState<string[]>([]);
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Filter selectable options by hierarchy
  const availableRegions = regions;
  const availableClusters =
    isHqRole
      ? clusters
      : clusters.filter(c => c.regionId === currentUser.regionId);

  const availableStores =
    isHqRole
      ? stores
      : currentRole === 'region_manager'
      ? stores.filter(s => s.regionId === currentUser.regionId)
      : stores.filter(s => s.clusterId === currentUser.clusterId);

  // Compute live recipient estimate
  const getRecipientSummary = () => {
    if (scope === 'all') {
      if (isHqRole) return `All ${stores.length} Outlets Nationwide (3 Regions, 6 Clusters)`;
      if (currentRole === 'region_manager') return `All ${availableStores.length} Outlets in North Region`;
      return `All ${availableStores.length} Outlets in Metro Alpha Cluster`;
    }
    if (scope === 'regions') {
      const count = stores.filter(s => selectedRegionIds.includes(s.regionId)).length;
      return `${selectedRegionIds.length} Region(s) selected (~${count} Outlets)`;
    }
    if (scope === 'clusters') {
      const count = stores.filter(s => selectedClusterIds.includes(s.clusterId)).length;
      return `${selectedClusterIds.length} Cluster(s) selected (~${count} Outlets)`;
    }
    return `${selectedStoreIds.length} Specific Outlet(s) selected`;
  };

  const toggleRegion = (id: string) => {
    setSelectedRegionIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleCluster = (id: string) => {
    setSelectedClusterIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleStore = (id: string) => {
    setSelectedStoreIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    sendBroadcast({
      title,
      content,
      priority,
      category,
      scope,
      targetRegionIds: scope === 'regions' ? selectedRegionIds : undefined,
      targetClusterIds: scope === 'clusters' ? selectedClusterIds : undefined,
      targetStoreIds: scope === 'stores' ? selectedStoreIds : undefined,
    });

    setFeedback('Broadcast successfully transmitted across hierarchy!');
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback(null);
      setTitle('');
      setContent('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div>
            <div className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
              <h3 className="font-extrabold text-base text-white">Broadcast Announcement</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              From: {currentUser.name} ({currentUser.title})
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
        <form onSubmit={handleSend} className="p-5 overflow-y-auto space-y-4">
          {/* Target Audience Scope */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Broadcast Audience Scope <span className="text-amber-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setScope('all')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                  scope === 'all'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400'
                }`}
              >
                <span>
                  {currentRole === 'business_head'
                    ? 'All Stores (Nationwide)'
                    : currentRole === 'region_manager'
                    ? 'All Stores in Region'
                    : 'All Outlets in Cluster'}
                </span>
                {scope === 'all' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>

              {isHqRole && (
                <button
                  type="button"
                  onClick={() => setScope('regions')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                    scope === 'regions'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400'
                  }`}
                >
                  <span>Specific Region(s)</span>
                  {scope === 'regions' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              )}

              {currentRole !== 'cluster_manager' && (
                <button
                  type="button"
                  onClick={() => setScope('clusters')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                    scope === 'clusters'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400'
                  }`}
                >
                  <span>Specific Cluster(s)</span>
                  {scope === 'clusters' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              )}

              <button
                type="button"
                onClick={() => setScope('stores')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                  scope === 'stores'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400'
                }`}
              >
                <span>Specific Store(s)</span>
                {scope === 'stores' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Conditional Multi-Select Pickers */}
          {scope === 'regions' && (
            <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800 space-y-2">
              <span className="text-[11px] font-bold text-neutral-400 block uppercase">
                Select Regions ({selectedRegionIds.length} selected):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableRegions.map(reg => {
                  const isChecked = selectedRegionIds.includes(reg.id);
                  return (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => toggleRegion(reg.id)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                        isChecked
                          ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400'
                          : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                      }`}
                    >
                      {reg.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {scope === 'clusters' && (
            <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800 space-y-2">
              <span className="text-[11px] font-bold text-neutral-400 block uppercase">
                Select Clusters ({selectedClusterIds.length} selected):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableClusters.map(cl => {
                  const isChecked = selectedClusterIds.includes(cl.id);
                  return (
                    <button
                      key={cl.id}
                      type="button"
                      onClick={() => toggleCluster(cl.id)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                        isChecked
                          ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400'
                          : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                      }`}
                    >
                      {cl.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {scope === 'stores' && (
            <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800 space-y-2 max-h-36 overflow-y-auto">
              <span className="text-[11px] font-bold text-neutral-400 block uppercase sticky top-0 bg-neutral-950 py-0.5">
                Select Outlets ({selectedStoreIds.length} selected):
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {availableStores.map(st => {
                  const isChecked = selectedStoreIds.includes(st.id);
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => toggleStore(st.id)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                          : 'bg-neutral-800/80 text-neutral-300 border-neutral-700'
                      }`}
                    >
                      <span>
                        {st.name} <span className="text-[10px] text-neutral-400">({st.city})</span>
                      </span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Priority & Category */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-2 text-xs text-neutral-200 focus:outline-hidden focus:border-amber-500"
              >
                <option value="normal">Normal Priority</option>
                <option value="urgent">Urgent</option>
                <option value="critical">Critical / Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-2 text-xs text-neutral-200 focus:outline-hidden focus:border-amber-500"
              >
                <option value="Operational Notice">Operational Notice</option>
                <option value="Policy Update">Policy Update</option>
                <option value="Overdue Escalation">Overdue Escalation</option>
                <option value="HR & Staffing">HR & Staffing</option>
                <option value="Accounting & Billing">Accounting & Billing</option>
                <option value="Training & Academy">Training & Academy</option>
                <option value="Marketing & Campaign">Marketing & Campaign</option>
                <option value="Target Drive">Target Drive</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
              Broadcast Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Mandatory Overdue Royalty Clearance by Friday"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
              Message Content <span className="text-amber-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Write clear instructions, deadlines, consequences, and contact details..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-500 resize-none"
            />
          </div>

          {/* Live Recipient Counter */}
          <div className="bg-neutral-950/80 p-2.5 rounded-xl border border-neutral-800/80 flex items-center justify-between text-xs text-neutral-300">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              Target Audience:
            </span>
            <span className="font-bold text-amber-300 truncate max-w-[200px]">
              {getRecipientSummary()}
            </span>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={isSubmitting || !title || !content}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 transition-all active:scale-98"
          >
            {isSubmitting ? (
              <span>Broadcasting across network...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Transmit Broadcast Message</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
