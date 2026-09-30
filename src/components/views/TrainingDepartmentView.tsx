import React, { useState } from 'react';
import { useErp } from '../../context/ErpContext';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Calendar,
  Radio,
  Sparkles,
  BookOpen,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';

interface TrainingDepartmentViewProps {
  onOpenBroadcastModal: () => void;
}

export const TrainingDepartmentView: React.FC<TrainingDepartmentViewProps> = ({
  onOpenBroadcastModal,
}) => {
  const { trainingStatus, scheduleTrainingAudit } = useErp();
  const [newWorkshopName, setNewWorkshopName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkshopName.trim()) return;

    scheduleTrainingAudit(newWorkshopName);
    setSuccessToast(`Masterclass "${newWorkshopName}" scheduled & broadcasted!`);
    setNewWorkshopName('');
    setIsAdding(false);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Academy Department Header */}
      <div className="bg-gradient-to-br from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-3xl p-4 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold text-xs">
              🎓 Academy & Training
            </span>
            <span className="text-xs font-bold text-neutral-200">SOP & Stylist Quality</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
            {trainingStatus.networkAuditScore}% SOP Score
          </span>
        </div>

        {/* Training KPI Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Certified Stylists */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              Certified Stylists
            </span>
            <div className="text-base font-extrabold text-white mt-1">
              {trainingStatus.certifiedStylistsRatio}%
            </div>
            <span className="text-[10px] text-neutral-500">Gold & Master Colorists</span>
          </div>

          {/* Hygiene Compliance */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Hygiene Compliance
            </span>
            <div className="text-base font-extrabold text-emerald-300 mt-1">
              {trainingStatus.hygieneSopCompliance}%
            </div>
            <span className="text-[10px] text-neutral-500">ISO-45001 checklist</span>
          </div>

          {/* Upcoming Masterclasses */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-purple-500/30">
            <span className="text-[10px] uppercase font-bold text-purple-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-purple-400" />
              Scheduled Masterclasses
            </span>
            <div className="text-base font-extrabold text-purple-300 mt-1">
              {trainingStatus.upcomingWorkshopsCount} Workshops
            </div>
            <span className="text-[10px] text-neutral-400">Balayage & Hair Botox</span>
          </div>

          {/* Audit Readiness */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Quality Index
            </span>
            <div className="text-base font-extrabold text-neutral-200 mt-1">
              Tier A Star
            </div>
            <span className="text-[10px] text-neutral-500">Network Franchise Standard</span>
          </div>
        </div>

        {/* Quick Broadcast CTA */}
        <div className="mt-3 pt-3 border-t border-amber-500/20 flex items-center justify-between gap-2">
          <span className="text-[11px] text-neutral-400">Academy circulars & SOP alerts</span>
          <button
            onClick={onOpenBroadcastModal}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-amber-900/40 active:scale-95 transition-all"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Send Academy Circular</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Scheduled Workshops & Certifications */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            Upcoming Masterclasses & Workshops
          </h3>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-[10px] px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <PlusCircle className="w-3 h-3" />
            <span>Schedule Workshop</span>
          </button>
        </div>

        {/* Schedule form */}
        {isAdding && (
          <form
            onSubmit={handleSchedule}
            className="bg-neutral-900 p-3 rounded-2xl border border-amber-500/40 space-y-2.5 animate-fadeIn"
          >
            <span className="text-xs font-bold text-neutral-200 block">
              Schedule New Technical Workshop
            </span>
            <input
              type="text"
              placeholder="e.g., L'Oréal Pro Ammonia-Free Color Chemistry"
              value={newWorkshopName}
              onChange={e => setNewWorkshopName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-all"
              >
                Publish & Notify Outlets
              </button>
            </div>
          </form>
        )}

        {/* Workshop Cards */}
        <div className="space-y-2.5">
          {trainingStatus.upcomingWorkshops.map(ws => (
            <div
              key={ws.id}
              className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3.5 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-neutral-100">{ws.title}</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Lead Trainer: <strong className="text-neutral-300">{ws.leadTrainer}</strong>
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {ws.date}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-800">
                <span className="text-[11px] text-neutral-400">
                  Registered Stylists: <strong className="text-amber-300">{ws.registeredCount} Enrolled</strong>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Live Registration Open
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
