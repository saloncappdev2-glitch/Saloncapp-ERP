import React from 'react';
import { useErp } from '../../context/ErpContext';
import {
  Bell,
  Smartphone,
  Monitor,
  Sparkles,
  Send,
  PlusCircle,
  LayoutDashboard,
  AlertCircle,
  ShieldAlert,
  MessageSquareText,
  Layers,
  Users,
  CreditCard,
  GraduationCap,
  Megaphone,
} from 'lucide-react';

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
    activeTab,
    setActiveTab,
    scopedTickets,
    scopedStores,
  } = useErp();

  const pendingEscalationsCount = scopedTickets.filter(
    t => t.status === 'pending_bh' || t.status === 'pending_region' || t.status === 'pending_cluster'
  ).length;

  const overdueStoresCount = scopedStores.filter(
    s => s.royaltyOverdue > 0 || s.collateralOverdue > 0
  ).length;

  const getDesktopNavItems = () => {
    switch (currentRole) {
      case 'hr_head':
        return [
          { id: 'overview' as const, label: 'HR Hub', icon: Users },
          { id: 'overdues' as const, label: 'Shortages', icon: AlertCircle },
          {
            id: 'escalations' as const,
            label: 'Staff Tickets',
            icon: ShieldAlert,
            badge: pendingEscalationsCount,
          },
          { id: 'broadcasts' as const, label: 'Circulars', icon: MessageSquareText },
          { id: 'profile' as const, label: 'Franchise Hierarchy', icon: Layers },
        ];
      case 'accounting_head':
        return [
          { id: 'overview' as const, label: 'Accounting Hub', icon: CreditCard },
          {
            id: 'overdues' as const,
            label: 'Overdues & Audits',
            icon: AlertCircle,
            badge: overdueStoresCount,
          },
          {
            id: 'escalations' as const,
            label: 'Billing Desk',
            icon: ShieldAlert,
            badge: pendingEscalationsCount,
          },
          { id: 'broadcasts' as const, label: 'Notices', icon: MessageSquareText },
          { id: 'profile' as const, label: 'Franchise Hierarchy', icon: Layers },
        ];
      case 'training_head':
        return [
          { id: 'overview' as const, label: 'Academy SOP', icon: GraduationCap },
          { id: 'overdues' as const, label: 'Workshops', icon: AlertCircle },
          {
            id: 'escalations' as const,
            label: 'Quality Tickets',
            icon: ShieldAlert,
            badge: pendingEscalationsCount,
          },
          { id: 'broadcasts' as const, label: 'SOP Circulars', icon: MessageSquareText },
          { id: 'profile' as const, label: 'Franchise Hierarchy', icon: Layers },
        ];
      case 'marketing_head':
        return [
          { id: 'overview' as const, label: 'Marketing Hub', icon: Megaphone },
          { id: 'overdues' as const, label: 'Campaign Promos', icon: AlertCircle },
          {
            id: 'escalations' as const,
            label: 'Customer Disputes',
            icon: ShieldAlert,
            badge: pendingEscalationsCount,
          },
          { id: 'broadcasts' as const, label: 'Promo Broadcasts', icon: MessageSquareText },
          { id: 'profile' as const, label: 'Franchise Hierarchy', icon: Layers },
        ];
      default:
        return [
          { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
          {
            id: 'overdues' as const,
            label: currentRole === 'store_manager' ? 'Store Dues' : 'Overdue Recovery',
            icon: AlertCircle,
            badge: overdueStoresCount,
          },
          {
            id: 'escalations' as const,
            label: 'Escalations Desk',
            icon: ShieldAlert,
            badge: pendingEscalationsCount,
          },
          { id: 'broadcasts' as const, label: 'Communication Hub', icon: MessageSquareText },
          { id: 'profile' as const, label: 'Franchise Hierarchy', icon: Layers },
        ];
    }
  };

  const getHeaderAction = () => {
    if (currentRole === 'store_manager') {
      return (
        <button
          onClick={onOpenTicketModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/40 transition-transform active:scale-95 cursor-pointer"
          title="Report / Escalate Issue"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Issue</span>
        </button>
      );
    }

    if (currentRole === 'hr_head') {
      return (
        <button
          onClick={onOpenBroadcastModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/40 transition-transform active:scale-95 cursor-pointer"
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-transform active:scale-95 cursor-pointer"
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-950/40 transition-transform active:scale-95 cursor-pointer"
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/40 transition-transform active:scale-95 cursor-pointer"
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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black shadow-md shadow-amber-950/40 transition-transform active:scale-95 cursor-pointer"
        title="Broadcast Announcement"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Broadcast</span>
      </button>
    );
  };

  const navItems = getDesktopNavItems();

  return (
    <header className="bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 sticky top-0 z-20 transition-all">
      <div className={`flex items-center justify-between gap-3 ${
        mobileDeviceFrame ? 'px-4 py-2.5' : 'px-4 sm:px-6 lg:px-8 py-3 w-full'
      }`}>
        {/* Left Section: Mobile Brand OR Desktop View Title */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Shown on mobile or in phone simulator frame */}
          {(mobileDeviceFrame) ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-300 p-0.5 shadow-md shadow-amber-500/10 flex items-center justify-center">
                <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-black text-sm sm:text-base tracking-tight text-white">saloncapp</h1>
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ERP
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 truncate max-w-[140px]">
                  {currentUser.title}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile screen brand when not in simulator frame */}
              <div className="flex md:hidden items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-black text-sm text-white">saloncapp</span>
                    <span className="text-[9px] font-black uppercase px-1 rounded bg-amber-500/20 text-amber-300">ERP</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 block truncate max-w-[130px]">{currentUser.title}</span>
                </div>
              </div>

              {/* Desktop breadcrumb / header context when sidebar is active */}
              <div className="hidden md:flex items-center gap-2 text-xs">
                <span className="font-semibold text-neutral-400">Portal</span>
                <span className="text-neutral-600">/</span>
                <span className="font-bold text-white uppercase tracking-wider text-[11px] px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800">
                  {currentUser.title}
                </span>
                <span className="text-neutral-600">/</span>
                <span className="text-amber-400 font-extrabold capitalize text-xs">
                  {activeTab === 'overview'
                    ? 'Dashboard & Operations'
                    : activeTab === 'overdues'
                    ? 'Overdues & Compliance'
                    : activeTab === 'escalations'
                    ? 'Hierarchy Escalations'
                    : activeTab === 'broadcasts'
                    ? 'Circulars & Directives'
                    : 'Franchise Hierarchy'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick role-specific main action */}
          {getHeaderAction()}

          {/* View Mode Switcher: Mobile Phone Simulator vs Web Responsive */}
          <button
            onClick={toggleDeviceFrame}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              mobileDeviceFrame
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
            }`}
            title={mobileDeviceFrame ? 'Switch to Full Web Responsive View with Sidebar' : 'Switch to Phone Frame Simulator'}
          >
            {mobileDeviceFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline text-[11px]">Full Web</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline text-[11px]">Phone Frame</span>
              </>
            )}
          </button>

          {/* User Avatar (Desktop) */}
          {!mobileDeviceFrame && (
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-neutral-800">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-xl object-cover border border-neutral-700"
              />
              <div className="text-left">
                <span className="text-[11px] font-bold text-neutral-200 block leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[9px] text-neutral-400 font-mono block">
                  {currentUser.department || 'HQ'}
                </span>
              </div>
            </div>
          )}

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
            title="System Notifications"
            aria-label="System Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
