import React, { useState } from 'react';
import { useErp } from '../../context/ErpContext';
import {
  Users,
  UserPlus,
  Clock,
  AlertCircle,
  Radio,
  CheckCircle2,
  Calendar,
  Briefcase,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { EscalationCard } from '../common/EscalationCard';
import { Ticket } from '../../types/erp';

interface HrDepartmentViewProps {
  onOpenBroadcastModal: () => void;
  onOpenApproveModal?: (ticket: Ticket) => void;
  onOpenRejectModal?: (ticket: Ticket) => void;
}

export const HrDepartmentView: React.FC<HrDepartmentViewProps> = ({
  onOpenBroadcastModal,
  onOpenApproveModal,
  onOpenRejectModal,
}) => {
  const { hrStatus, approveStaffTransfer, scopedTickets, setActiveTab } = useErp();
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Staff-related tickets
  const hrTickets = scopedTickets.filter(
    t => t.category === 'Staff & Stylist Shortage' || t.title.toLowerCase().includes('stylist')
  );

  const handleApproveShortage = (storeName: string, role: string) => {
    approveStaffTransfer(storeName, role);
    setSuccessToast(`Emergency transfer approved for ${storeName}!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Department Status Header */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-neutral-900 border border-indigo-500/30 rounded-3xl p-4 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 font-bold text-xs">
              👥 Human Resources
            </span>
            <span className="text-xs font-bold text-neutral-200">People & Talent Department</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
            {hrStatus.attendanceRate}% Attendance
          </span>
        </div>

        {/* HR KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {/* Total Staff */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-indigo-400" />
              Total Active Staff
            </span>
            <div className="text-base font-extrabold text-white mt-1">
              {hrStatus.totalStaff} Stylists & Staff
            </div>
            <span className="text-[10px] text-neutral-500">18 Outlets Nationwide</span>
          </div>

          {/* Open Vacancies */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-rose-500/30">
            <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
              <UserPlus className="w-3 h-3 text-rose-400" />
              Open Vacancies
            </span>
            <div className="text-base font-extrabold text-rose-300 mt-1">
              {hrStatus.openStylistVacancies} Positions
            </div>
            <span className="text-[10px] text-neutral-400">Recruitment drive ongoing</span>
          </div>

          {/* Pending Transfers */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-amber-500/30">
            <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              Transfer Requests
            </span>
            <div className="text-base font-extrabold text-amber-300 mt-1">
              {hrStatus.pendingTransfersCount} Awaiting Review
            </div>
            <span className="text-[10px] text-neutral-500">Peak season shifts</span>
          </div>

          {/* Attrition */}
          <div className="bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-emerald-400" />
              Monthly Attrition
            </span>
            <div className="text-base font-extrabold text-emerald-300 mt-1">
              {hrStatus.monthlyAttritionPct}% (Healthy)
            </div>
            <span className="text-[10px] text-neutral-500">Industry benchmark: 5.5%</span>
          </div>
        </div>

        {/* Quick Broadcast CTA */}
        <div className="mt-3 pt-3 border-t border-indigo-500/20 flex items-center justify-between gap-2">
          <span className="text-[11px] text-neutral-400">Broadcast HR policies or rosters</span>
          <button
            onClick={onOpenBroadcastModal}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-900/40 active:scale-95 transition-all"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Send HR Circular</span>
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

      {/* Immediate Store Staff Shortage Triage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            Urgent Outlet Staffing Alerts
          </h3>
          <span className="text-[10px] text-neutral-500">
            {hrStatus.recentShortages.length} Requests
          </span>
        </div>

        {hrStatus.recentShortages.length === 0 ? (
          <div className="p-6 text-center text-xs text-neutral-500 bg-neutral-900/50 rounded-2xl border border-neutral-800/60">
            All outlet stylist allocations currently filled!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {hrStatus.recentShortages.map((shortage, idx) => (
              <div
                key={idx}
                className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-3.5 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-neutral-100">{shortage.storeName}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        {shortage.storeCode}
                      </span>
                    </div>
                    <p className="text-xs text-rose-300 font-semibold mt-0.5">
                      Required: {shortage.missingRoles}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      shortage.urgency === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {shortage.urgency}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-neutral-800/80">
                  <button
                    onClick={() => handleApproveShortage(shortage.storeName, shortage.missingRoles)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Temporary Roster Transfer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HR Related Escalation Tickets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            Staffing Escalations in Network
          </h3>
          <button
            onClick={() => setActiveTab('escalations')}
            className="text-[10px] text-indigo-400 font-semibold"
          >
            All tickets ({scopedTickets.length})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {hrTickets.slice(0, 2).map(ticket => (
            <EscalationCard
              key={ticket.id}
              ticket={ticket}
              onOpenApproveModal={onOpenApproveModal}
              onOpenRejectModal={onOpenRejectModal}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
