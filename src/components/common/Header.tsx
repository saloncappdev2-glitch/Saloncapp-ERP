import React from 'react';
import { useErp } from '../../context/ErpContext';
import { Bell, Smartphone, Monitor, Sparkles, Send, PlusCircle } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenBroadcastModal: () => void;
  onOpenTicketModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenBroadcastModal,
  onOpenTicketModal,
}) => {
  const {
    currentUser,
    currentRole,
    unreadNotificationCount,
    mobileDeviceFrame,
    toggleDeviceFrame,
  } = useErp();

  const getHeaderAction = () => {
    if (currentRole === 'store_manager') {
      return (
        <button
          onClick={onOpenTicketModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs shadow-rose-900/30 transition-transform active:scale-95"
          title="Report / Escalate Issue"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Escalate</span>
        </button>
      );
    }

    if (currentRole === 'hr_head') {
      return (
        <button
          onClick={onOpenBroadcastModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs shadow-indigo-900/30 transition-transform active:scale-95"
          title="Send HR Circular"
        >
          <Send className="w-3.5 h-3.5" />
          <span>HR Circular</span>
        </button>
      );
    }

    if (currentRole === 'accounting_head') {
      return (
        <button
          onClick={onOpenBroadcastModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs shadow-emerald-900/30 transition-transform active:scale-95"
          title="Send Billing Mandate"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Billing Notice</span>
        </button>
      );
    }

    if (currentRole === 'training_head') {
      return (
        <button
          onClick={onOpenBroadcastModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs shadow-purple-900/30 transition-transform active:scale-95"
          title="Publish Academy SOP"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Academy SOP</span>
        </button>
      );
    }

    if (currentRole === 'marketing_head') {
      return (
        <button
          onClick={onOpenBroadcastModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs shadow-rose-900/30 transition-transform active:scale-95"
          title="Broadcast Campaign"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Promo Push</span>
        </button>
      );
    }

    return (
      <button
        onClick={onOpenBroadcastModal}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 text-xs font-bold shadow-xs shadow-amber-900/30 transition-transform active:scale-95"
        title="Broadcast Announcement"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Broadcast</span>
      </button>
    );
  };

  return (
    <header className="bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3 flex items-center justify-between gap-3 sticky top-0 z-20">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-300 p-0.5 shadow-md shadow-amber-500/10 flex items-center justify-center">
          <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-sm tracking-tight text-white">saloncapp</h1>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {currentUser.department ? currentUser.department.slice(0, 10) : 'ERP'}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 truncate max-w-[150px]">
            {currentUser.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick role-specific main action */}
        {getHeaderAction()}

        {/* Device Frame Toggle */}
        <button
          onClick={toggleDeviceFrame}
          className="p-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700/60 text-neutral-300 hover:text-white transition-colors"
          title={mobileDeviceFrame ? 'Switch to Full Mobile View' : 'Switch to iPhone Frame'}
        >
          {mobileDeviceFrame ? (
            <Monitor className="w-4 h-4 text-neutral-400 hover:text-white" />
          ) : (
            <Smartphone className="w-4 h-4 text-neutral-400 hover:text-white" />
          )}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700/60 text-neutral-300 hover:text-white transition-colors"
          title="System Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
              {unreadNotificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
