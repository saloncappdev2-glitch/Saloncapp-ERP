import React from 'react';
import { useErp } from '../../context/ErpContext';
import {
  LayoutDashboard,
  AlertCircle,
  ShieldAlert,
  MessageSquareText,
  Layers,
  Users,
  Clock,
  Briefcase,
  CreditCard,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Megaphone,
  Tag,
  Star,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    scopedTickets,
    scopedStores,
    currentRole,
    hrStatus,
    trainingStatus,
    marketingStatus,
    mobileDeviceFrame,
  } = useErp();

  // Pending escalations in current role's scoped tickets
  const pendingEscalationsCount = scopedTickets.filter(
    t => t.status === 'pending_bh' || t.status === 'pending_region' || t.status === 'pending_cluster'
  ).length;

  // Stores with overdue royalty or collateral
  const overdueStoresCount = scopedStores.filter(
    s => s.royaltyOverdue > 0 || s.collateralOverdue > 0
  ).length;

  // Build department-specific nav items
  const getNavItems = () => {
    switch (currentRole) {
      case 'hr_head':
        return [
          {
            id: 'overview' as const,
            label: 'HR Hub',
            icon: Users,
          },
          {
            id: 'overdues' as const,
            label: 'Shortages',
            icon: Clock,
            badge: hrStatus.recentShortages.length > 0 ? hrStatus.recentShortages.length : undefined,
            badgeColor: 'bg-rose-500 text-white',
          },
          {
            id: 'escalations' as const,
            label: 'Staff Tickets',
            icon: Briefcase,
            badge: pendingEscalationsCount > 0 ? pendingEscalationsCount : undefined,
            badgeColor: 'bg-amber-500 text-neutral-950',
          },
          {
            id: 'broadcasts' as const,
            label: 'Circulars',
            icon: MessageSquareText,
          },
          {
            id: 'profile' as const,
            label: 'Hierarchy',
            icon: Layers,
          },
        ];

      case 'accounting_head':
        return [
          {
            id: 'overview' as const,
            label: 'Accounts',
            icon: CreditCard,
          },
          {
            id: 'overdues' as const,
            label: 'Overdues',
            icon: AlertCircle,
            badge: overdueStoresCount > 0 ? overdueStoresCount : undefined,
            badgeColor: 'bg-amber-500 text-neutral-950',
          },
          {
            id: 'escalations' as const,
            label: 'Billing Desk',
            icon: ShieldAlert,
            badge: pendingEscalationsCount > 0 ? pendingEscalationsCount : undefined,
            badgeColor: 'bg-rose-500 text-white',
          },
          {
            id: 'broadcasts' as const,
            label: 'Notices',
            icon: MessageSquareText,
          },
          {
            id: 'profile' as const,
            label: 'Hierarchy',
            icon: Layers,
          },
        ];

      case 'training_head':
        return [
          {
            id: 'overview' as const,
            label: 'Academy',
            icon: GraduationCap,
          },
          {
            id: 'overdues' as const,
            label: 'Workshops',
            icon: BookOpen,
            badge: trainingStatus.upcomingWorkshopsCount > 0 ? trainingStatus.upcomingWorkshopsCount : undefined,
            badgeColor: 'bg-purple-500 text-white',
          },
          {
            id: 'escalations' as const,
            label: 'SOP Tickets',
            icon: ShieldCheck,
            badge: pendingEscalationsCount > 0 ? pendingEscalationsCount : undefined,
            badgeColor: 'bg-rose-500 text-white',
          },
          {
            id: 'broadcasts' as const,
            label: 'Circulars',
            icon: MessageSquareText,
          },
          {
            id: 'profile' as const,
            label: 'Hierarchy',
            icon: Layers,
          },
        ];

      case 'marketing_head':
        return [
          {
            id: 'overview' as const,
            label: 'Growth',
            icon: Megaphone,
          },
          {
            id: 'overdues' as const,
            label: 'Promos',
            icon: Tag,
            badge: marketingStatus.topPromotions.length > 0 ? marketingStatus.topPromotions.length : undefined,
            badgeColor: 'bg-rose-500 text-white',
          },
          {
            id: 'escalations' as const,
            label: 'Disputes',
            icon: Star,
            badge: pendingEscalationsCount > 0 ? pendingEscalationsCount : undefined,
            badgeColor: 'bg-amber-500 text-neutral-950',
          },
          {
            id: 'broadcasts' as const,
            label: 'Campaigns',
            icon: MessageSquareText,
          },
          {
            id: 'profile' as const,
            label: 'Hierarchy',
            icon: Layers,
          },
        ];

      default:
        // Business Head, Region Manager, Cluster Manager, Store Outlet
        return [
          {
            id: 'overview' as const,
            label: 'Home',
            icon: LayoutDashboard,
          },
          {
            id: 'overdues' as const,
            label: currentRole === 'store_manager' ? 'Store Dues' : 'Overdues',
            icon: AlertCircle,
            badge: overdueStoresCount > 0 ? overdueStoresCount : undefined,
            badgeColor: 'bg-amber-500 text-neutral-950',
          },
          {
            id: 'escalations' as const,
            label: 'Escalations',
            icon: ShieldAlert,
            badge: pendingEscalationsCount > 0 ? pendingEscalationsCount : undefined,
            badgeColor: 'bg-rose-500 text-white',
          },
          {
            id: 'broadcasts' as const,
            label: 'Broadcasts',
            icon: MessageSquareText,
          },
          {
            id: 'profile' as const,
            label: 'Hierarchy',
            icon: Layers,
          },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className={`bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800/80 px-2 py-2 flex items-center justify-around sticky bottom-0 z-20 transition-all ${
      mobileDeviceFrame ? 'w-full' : 'md:hidden w-full'
    }`}>
      {navItems.map(item => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isActive
                ? 'text-amber-400 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              {item.badge !== undefined && (
                <span
                  className={`absolute -top-1 -right-2 text-[9px] font-extrabold min-w-3.5 h-3.5 px-1 rounded-full flex items-center justify-center ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate max-w-[62px]">
              {item.label}
            </span>
            {isActive && (
              <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-amber-400"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
