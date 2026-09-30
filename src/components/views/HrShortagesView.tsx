import React, { useState } from 'react';
import { useErp } from '../../context/ErpContext';
import {
  Users,
  UserPlus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Briefcase,
  Building2,
  ShieldCheck,
  TrendingDown,
  PhoneCall,
} from 'lucide-react';

export const HrShortagesView: React.FC = () => {
  const { hrStatus, stores, approveStaffTransfer } = useErp();
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleApprove = (storeName: string, missingRoles: string) => {
    approveStaffTransfer(storeName, missingRoles);
    setSuccessToast(`Temporary transfer of ${missingRoles} approved for ${storeName}!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-neutral-900 border border-indigo-500/30 rounded-3xl p-4 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className="font-extrabold text-sm text-white">Staffing & Stylist Shortages Desk</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {hrStatus.openStylistVacancies} Open Vacancies
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              Network Attendance
            </span>
            <div className="text-base font-extrabold text-emerald-400 mt-1">
              {hrStatus.attendanceRate}% Present
            </div>
            <span className="text-[10px] text-neutral-500">235/248 on duty today</span>
          </div>

          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              Monthly Attrition
            </span>
            <div className="text-base font-extrabold text-indigo-300 mt-1">
              {hrStatus.monthlyAttritionPct}% Rate
            </div>
            <span className="text-[10px] text-neutral-500">Benchmark: &lt;5.0%</span>
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

      {/* Immediate Shortages Awaiting HR Approval */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            Urgent Outlet Staffing Demands
          </h4>
          <span className="text-[10px] text-neutral-500">
            {hrStatus.recentShortages.length} Shortages Pending
          </span>
        </div>

        {hrStatus.recentShortages.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500 bg-neutral-900/40 rounded-3xl border border-neutral-800/60">
            <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
            <p className="font-semibold text-neutral-300">All Outlets Fully Staffed</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              No emergency stylist reallocations pending.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {hrStatus.recentShortages.map((req, idx) => (
              <div
                key={idx}
                className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3.5 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="font-bold text-sm text-neutral-100">{req.storeName}</h5>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        {req.storeCode}
                      </span>
                    </div>
                    <p className="text-xs text-rose-300 font-semibold mt-0.5">
                      Urgent Need: {req.missingRoles}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      req.urgency === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {req.urgency} Priority
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleApprove(req.storeName, req.missingRoles)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs shadow-emerald-950/40"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Authorize Emergency Transfer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Salon Outlets Staffing Breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Salon Outlets Staffing Roster
          </h4>
          <span className="text-[10px] text-neutral-500">{stores.length} Outlets</span>
        </div>

        <div className="space-y-2">
          {stores.map(st => {
            const staffedChairs = Math.max(st.chairs - 1, 4);
            const isFull = staffedChairs >= st.chairs;

            return (
              <div
                key={st.id}
                className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3 flex items-center justify-between gap-2"
              >
                <div>
                  <h5 className="font-bold text-xs text-neutral-100">{st.name}</h5>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Manager: {st.managerName} • {st.city}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isFull
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {staffedChairs}/{st.chairs} Stylists
                  </span>
                  <span className="text-[9px] text-neutral-500 block mt-0.5">
                    {isFull ? 'Optimal Coverage' : '1 Vacant Chair'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
