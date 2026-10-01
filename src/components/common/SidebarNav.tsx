import React from 'react';
import { useErp } from '../../context/ErpContext';
import {
  LayoutDashboard,
  AlertCircle,
  ShieldAlert,
  MessageSquareText,
  Layers,
  Users,
  CreditCard,
  GraduationCap,
  Megaphone,
  Sparkles,
  Send,
  PlusCircle,
  Bell,
  Smartphone,
  ChevronRight,
  TrendingUp,
  Store,
  Building2,
  MapPin,
  Clock,
} from 'lucide-react';

interface SidebarNavProps {
  onOpenNotifications: () => void;
  onOpenBroadcastModal: () => void;
  onOpenTicketModal: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  onOpenNotifications,
  onOpenBroadcastModal,
  onOpenTicketModal,
}) => {
  const {
    currentRole,
    currentUser,
    activeTab,
    setActiveTab,
    scopedTickets,
    scopedStores,
    unreadNotificationCount,
    toggleDeviceFrame,
    hrStatus,
    trainingStatus,
    marketingStatus,
  } = useErp();

  const pendingEscalationsCount = scopedTickets.filter(
    t => t.status === 'pending_bh' || t.status === 'pending_region' || t.status === 'pending_cluster'
  ).length;

  const urgentEscalationsCount = scopedTickets.filter(
    t => (t.severity === 'high' || t.severity === 'critical') &&
         (t.status === 'pending_bh' || t.status === 'pending_region' || t.status === 'pending_cluster')
  ).length;

  const overdueStoresCount = scopedStores.filter(
    s => s.royaltyOverdue > 0 || s.collateralOverdue > 0
  ).length;

  // Role-specific navigation items
  const getNavItems = () => {
    switch (currentRole) {
      case 'hr_head':
        return [
          {
            id: 'overview' as const,
            label: 'HR Department Hub',
            shortLabel: 'Overview',
            icon: Users,
            description: 'Talent & staffing overview',
          },
          {
            id: 'overdues' as const,
            label: 'Stylist Shortages',
            shortLabel: 'Shortages',
            icon: Clock,
            badge: hrStatus.recentShortages.length > 0 ? hrStatus.recentShortages.length : undefined,
            badgeColor: 'bg-rose-500 text-white',
            description: 'Salon vacancy alerts',
          },
          {
            id: 'escalations' as const,
            label: 'Staffing Escalations',
            shortLabel: 'Escalations',
            icon: ShieldAlert,
            badge: pendingEscalationsCount,
            badgeColor: 'bg-amber-500 text-neutral-950 font-black',
            description: 'Transfers & grievance desk',
          },
          {
            id: 'broadcasts' as const,
            label: 'HR Circulars',
            shortLabel: 'Circulars',
            icon: MessageSquareText,
            description: 'Network policy broadcasts',
          },
          {
            id: 'profile' as const,
            label: 'Franchise Hierarchy',
            shortLabel: 'Hierarchy',
            icon: Layers,
            description: 'Role access & team personas',
          },
        ];
      case 'accounting_head':
        return [
          {
            id: 'overview' as const,
            label: 'Finance Hub',
            shortLabel: 'Overview',
            icon: CreditCard,
            description: 'Royalty & collateral ledger',
          },
          {
            id: 'overdues' as const,
            label: 'Overdue Dues & GST',
            shortLabel: 'Overdues',
            icon: AlertCircle,
            badge: overdueStoresCount,
            badgeColor: 'bg-rose-500 text-white',
            description: 'Franchise payment recovery',
          },
          {
            id: 'escalations' as const,
            label: 'Billing Disputes',
            shortLabel: 'Escalations',
            icon: ShieldAlert,
            badge: pendingEscalationsCount,
            badgeColor: 'bg-amber-500 text-neutral-950 font-black',
            description: 'Waivers & penalty reviews',
          },
          {
            id: 'broadcasts' as const,
            label: 'Billing Circulars',
            shortLabel: 'Circulars',
            icon: MessageSquareText,
            description: 'Financial notices & circulars',
          },
          {
            id: 'profile' as const,
            label: 'Franchise Hierarchy',
            shortLabel: 'Hierarchy',
            icon: Layers,
            description: 'Role access & team personas',
          },
        ];
      case 'training_head':
        return [
          {
            id: 'overview' as const,
            label: 'Academy & Quality Hub',
            shortLabel: 'Overview',
            icon: GraduationCap,
            description: 'Hygiene SOP & audit scores',
          },
          {
            id: 'overdues' as const,
            label: 'Masterclasses & Audits',
            shortLabel: 'Workshops',
            icon: AlertCircle,
            badge: trainingStatus.upcomingWorkshops.length,
            badgeColor: 'bg-purple-500 text-white',
            description: 'Stylist certification calendar',
          },
          {
            id: 'escalations' as const,
            label: 'Quality Escalations',
            shortLabel: 'Escalations',
            icon: ShieldAlert,
            badge: pendingEscalationsCount,
            badgeColor: 'bg-amber-500 text-neutral-950 font-black',
            description: 'Hygiene & autoclave complaints',
          },
          {
            id: 'broadcasts' as const,
            label: 'Academy SOP Circulars',
            shortLabel: 'Circulars',
            icon: MessageSquareText,
            description: 'Stylist training mandates',
          },
          {
            id: 'profile' as const,
            label: 'Franchise Hierarchy',
            shortLabel: 'Hierarchy',
            icon: Layers,
            description: 'Role access & team personas',
          },
        ];
      case 'marketing_head':
        return [
          {
            id: 'overview' as const,
            label: 'Growth & Brand Hub',
            shortLabel: 'Overview',
            icon: Megaphone,
            description: 'Campaigns & customer CSAT',
          },
          {
            id: 'overdues' as const,
            label: 'Campaign Promos',
            shortLabel: 'Promotions',
            icon: AlertCircle,
            badge: marketingStatus.activeCampaignsCount,
            badgeColor: 'bg-rose-500 text-white',
            description: 'Coupons & festive drives',
          },
          {
            id: 'escalations' as const,
            label: 'Customer Disputes',
            shortLabel: 'Escalations',
            icon: ShieldAlert,
            badge: pendingEscalationsCount,
            badgeColor: 'bg-amber-500 text-neutral-950 font-black',
            description: 'Google reviews & CSAT issues',
          },
          {
            id: 'broadcasts' as const,
            label: 'Marketing Directives',
            shortLabel: 'Circulars',
            icon: MessageSquareText,
            description: 'Promotional push notices',
          },
          {
            id: 'profile' as const,
            label: 'Franchise Hierarchy',
            shortLabel: 'Hierarchy',
            icon: Layers,
            description: 'Role access & team personas',
          },
        ];
      case 'business_head':
        return [
          {
            id: 'overview' as const,
            label: 'Executive Overview',
            shortLabel: 'Overview',
            icon: LayoutDashboard,
            description: 'All regions snapshot & revenue',
          },
          {
            id: 'overdues' as const,
            label: 'Network Overdues',
            shortLabel: 'Overdues',
            icon: AlertCircle,
            badge: overdueStoresCount,
            badgeColor: 'bg-rose-500 text-white',
            description: 'Aging debt & delinquency',
          },
          {
            id: 'escalations' as const,
            label: 'Executive Approvals',
            shortLabel: 'Escalations',
            icon: ShieldAlert,
            badge: pendingEscalationsCount,
            badgeColor: 'bg-amber-500 text-neutral-950 font-black',
            description: 'Cycle Stage 3 final decisions',
          },
          {
            id: 'broadcasts' as const,
            label: 'Executive Directives',
            shortLabel: 'Directives',
            icon: MessageSquareText,
            description: 'Network-wide circulars',
          },
          {
            id: 'profile' as const,
            label: 'Franchise Hierarchy',
            shortLabel: 'Hierarchy',
            icon: Layers,
            description: '8-role organizational tree',
          },
        ];
      case 'region_manager':
        return [
          {
            id: 'overview' as const,
            label: 'Regional Command Hub',
            shortLabel: 'Overview',
            icon: Building2,
            description: 'North region cluster metrics',
          },
          {
            id: 'overdues' as const,
            label: 'Regional Overdue Recovery',
            shortLabel: 'Overdues',
            icon: AlertCircle,
            badge: overdueStoresCount,
            badgeColor: 'bg-rose-500 text-white',
            description: 'Cluster fee collections',
          },
          {
            id: 'escalations' as const,
            label: 'Regional Queue (Stage 2)',
            shortLabel: 'Escalations',
            icon: ShieldAlert,
            badge: pendingEscalationsCount,
            badgeColor: 'bg-amber-500 text-neutral-950 font-black',
            description: 'Review cluster escalations',
          },
          {
            id: 'broadcasts' as const,
            label: 'Regional Directives',
            shortLabel: 'Directives',
            icon: MessageSquareText,
            description: 'Broadcast to clusters/stores',
          },
          {
            id: 'profile' as const,
            label: 'Franchise Hierarchy',
            shortLabel: 'Hierarchy',
            icon: Layers,
            description: 'Supervisory chain of command',
          },
        ];
      case 'cluster_manager':
        return [
          {
            id: 'overview' as const,
            label: 'Cluster Operations Hub',
            shortLabel: 'Overview',
            icon: MapPin,
            description: 'Store targets & chair occupancy',
          },
          {
            id: 'overdues' as const,
            label: 'Store Overdues',
            shortLabel: 'Overdues',
            icon: AlertCircle,
            badge: overdueStoresCount,
            badgeColor: 'bg-rose-500 text-white',
            description: 'Outlet royalty settlements',
          },
          {
            id: 'escalations' as const,
            label: 'Store Queue (Stage 1)',
            shortLabel: 'Escalations',
            icon: ShieldAlert,
            badge: pendingEscalationsCount,
            badgeColor: 'bg-amber-500 text-neutral-950 font-black',
            description: 'Triage store escalations',
          },
          {
            id: 'broadcasts' as const,
            label: 'Cluster Notices',
            shortLabel: 'Notices',
            icon: MessageSquareText,
            description: 'Local store directives',
          },
          {
            id: 'profile' as const,
            label: 'Franchise Hierarchy',
            shortLabel: 'Hierarchy',
            icon: Layers,
            description: '4-tier escalation path',
          },
        ];
      default:
        // Store manager
        return [
          {
            id: 'overview' as const,
            label: 'Store Outlet Hub',
            shortLabel: 'Overview',
            icon: Store,
            description: 'Daily revenue & chairs',
          },
          {
            id: 'overdues' as const,
            label: 'Store Dues & Deposit',
            shortLabel: 'Dues',
            icon: AlertCircle,
            badge: overdueStoresCount > 0 ? 'Due' : undefined,
            badgeColor: 'bg-amber-500 text-neutral-950 font-bold',
            description: 'Royalty & security balances',
          },
          {
            id: 'escalations' as const,
            label: 'My Escalation Tickets',
            shortLabel: 'Escalations',
            icon: ShieldAlert,
            badge: pendingEscalationsCount,
            badgeColor: 'bg-amber-500 text-neutral-950 font-black',
            description: '4-tier hierarchy tracking',
          },
          {
            id: 'broadcasts' as const,
            label: 'Leadership Directives',
            shortLabel: 'Directives',
            icon: MessageSquareText,
            description: 'Broadcasts from HQ & Cluster',
          },
          {
            id: 'profile' as const,
            label: 'Franchise Hierarchy',
            shortLabel: 'Hierarchy',
            icon: Layers,
            description: 'Contact chain & support',
          },
        ];
    }
  };

  const navItems = getNavItems();

  const getPrimaryAction = () => {
    if (currentRole === 'store_manager') {
      return (
        <button
          onClick={onOpenTicketModal}
          className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 transition-all active:scale-98 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Raise Escalation Ticket</span>
        </button>
      );
    }

    if (currentRole === 'hr_head') {
      return (
        <button
          onClick={onOpenBroadcastModal}
          className="w-full py-2.5 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition-all active:scale-98 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Broadcast HR Circular</span>
        </button>
      );
    }

    if (currentRole === 'accounting_head') {
      return (
        <button
          onClick={onOpenBroadcastModal}
          className="w-full py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-98 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Send Billing Notice</span>
        </button>
      );
    }

    if (currentRole === 'training_head') {
      return (
        <button
          onClick={onOpenBroadcastModal}
          className="w-full py-2.5 px-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 transition-all active:scale-98 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Publish Academy SOP</span>
        </button>
      );
    }

    if (currentRole === 'marketing_head') {
      return (
        <button
          onClick={onOpenBroadcastModal}
          className="w-full py-2.5 px-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 transition-all active:scale-98 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Push Promo Campaign</span>
        </button>
      );
    }

    return (
      <button
        onClick={onOpenBroadcastModal}
        className="w-full py-2.5 px-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition-all active:scale-98 cursor-pointer"
      >
        <Send className="w-4 h-4" />
        <span>Broadcast Directive</span>
      </button>
    );
  };

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 bg-neutral-950 border-r border-neutral-800/90 h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-300 p-0.5 shadow-md shadow-amber-500/10 flex items-center justify-center">
            <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-white">saloncapp</span>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ERP
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium truncate max-w-[130px]">
              Franchise Ops Platform
            </p>
          </div>
        </div>

        {/* System Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
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

      {/* User Persona Profile Strip */}
      <div className="p-3.5 mx-3 mt-3 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 flex items-center gap-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-10 h-10 rounded-xl object-cover border border-neutral-700 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-white truncate block">
              {currentUser.name}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase font-semibold shrink-0">
              {currentUser.department?.slice(0, 5) || 'HQ'}
            </span>
          </div>
          <span className="text-[11px] text-neutral-400 truncate block">
            {currentUser.title}
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="px-3 pt-3">
        {getPrimaryAction()}
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="px-2 pb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500">
            Navigation Menu
          </span>
          <span className="text-[10px] font-mono text-neutral-600">
            {navItems.length} Tabs
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-950/40'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900/90 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-neutral-950 text-amber-400'
                        : 'bg-neutral-900 text-neutral-400 group-hover:text-amber-400 group-hover:bg-neutral-850'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block leading-tight truncate">
                      {item.label}
                    </span>
                    <span
                      className={`text-[10px] block leading-tight truncate ${
                        isActive ? 'text-neutral-900/80' : 'text-neutral-500'
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-neutral-950 text-amber-300'
                          : item.badgeColor || 'bg-amber-500 text-neutral-950'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-neutral-950 translate-x-0.5' : 'text-neutral-600 group-hover:text-neutral-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Controls */}
      <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/80 space-y-2">
        {/* Switch to Phone Frame Simulator Toggle */}
        <button
          onClick={toggleDeviceFrame}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-medium transition-all active:scale-98 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span>Mobile Phone Preview</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
            Simulator
          </span>
        </button>

        {/* Hierarchy Cycle Note */}
        <div className="px-2 py-1 bg-neutral-900/40 rounded-xl border border-neutral-800/40 text-[10px] text-neutral-500 leading-snug">
          <span className="text-neutral-400 font-semibold block">Escalation Policy:</span>
          Store ➔ Cluster ➔ Region ➔ BH
        </div>
      </div>
    </aside>
  );
};
