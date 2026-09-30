import React, { useState } from 'react';
import { useErp } from '../../context/ErpContext';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

export const TrainingWorkshopsView: React.FC = () => {
  const { trainingStatus, scheduleTrainingAudit } = useErp();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    scheduleTrainingAudit(newTitle);
    setSuccessToast(`Masterclass "${newTitle}" published & added to salon calendar!`);
    setNewTitle('');
    setIsAdding(false);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const hygieneChecklist = [
    { item: 'Autoclave 134°C Instrument Sterilization', status: 'Compliant (98%)', icon: ShieldCheck },
    { item: 'Chemical Expiry & Patch-Test Protocols', status: 'Compliant (96%)', icon: ShieldCheck },
    { item: 'Single-Use Disposable Towels & Capes', status: 'Optimal (100%)', icon: ShieldCheck },
    { item: 'Hair Wash Basin Disinfection Cycle', status: 'Audit Ready (94%)', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-purple-950/40 via-neutral-900 to-neutral-900 border border-purple-500/30 rounded-3xl p-4 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <h3 className="font-extrabold text-sm text-white">Academy & SOP Masterclasses</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {trainingStatus.networkAuditScore}% Quality Score
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              Certified Stylists
            </span>
            <div className="text-base font-extrabold text-purple-300 mt-1">
              {trainingStatus.certifiedStylistsRatio}%
            </div>
            <span className="text-[10px] text-neutral-500">215 Certified Master Colorists</span>
          </div>

          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              Hygiene SOP Compliance
            </span>
            <div className="text-base font-extrabold text-emerald-400 mt-1">
              {trainingStatus.hygieneSopCompliance}%
            </div>
            <span className="text-[10px] text-neutral-500">ISO-45001 checklist verified</span>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Scheduled Masterclasses */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            Scheduled Technical Masterclasses
          </h4>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-[10px] px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-purple-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <PlusCircle className="w-3 h-3" />
            <span>Schedule Class</span>
          </button>
        </div>

        {/* Schedule form */}
        {isAdding && (
          <form
            onSubmit={handleSchedule}
            className="bg-neutral-900 p-3 rounded-2xl border border-purple-500/40 space-y-2.5 animate-fadeIn"
          >
            <span className="text-xs font-bold text-neutral-200 block">
              Schedule New Technical Workshop
            </span>
            <input
              type="text"
              placeholder="e.g., L'Oréal Pro French Glossing & Toning Techniques"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-hidden focus:border-purple-500"
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
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all"
              >
                Broadcast to Store Tablets
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2.5">
          {trainingStatus.upcomingWorkshops.map(ws => (
            <div
              key={ws.id}
              className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3.5 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-bold text-sm text-neutral-100">{ws.title}</h5>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Lead Trainer: <strong className="text-neutral-200">{ws.leadTrainer}</strong>
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {ws.date}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-neutral-800">
                <span className="text-[11px] text-neutral-400">
                  Confirmed: <strong className="text-purple-300">{ws.registeredCount} Stylists</strong>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Tablets Notified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Salon Hygiene Audit Protocols */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5 text-emerald-400" />
            Franchise Hygiene & Sterilization Checklist
          </h4>
          <span className="text-[10px] text-neutral-500">ISO-45001 SOP</span>
        </div>

        <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3 space-y-2">
          {hygieneChecklist.map((c, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/60 last:border-0">
              <span className="text-neutral-300">{c.item}</span>
              <span className="text-[10px] font-bold text-emerald-400">{c.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
