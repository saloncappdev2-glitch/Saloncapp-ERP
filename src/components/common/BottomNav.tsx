import React from 'react';
import { useErp } from '../../context/ErpContext';
import { LayoutDashboard, AlertCircle, ShieldAlert, MessageSquareText, Layers } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, scopedTickets, scopedStores } = useErp();

  // Pending escalations needing action in current scope
  const pendingEscalationsCount = scopedTickets.filter(
    t => t.status === 'pending_bh' || t.status === 'pending_region' || t.status === 'pending_cluster'
  ).length;

  // Stores with overdue royalty or collateral
  const overdueStoresCount = scopedStores.filter(
    s => s.royaltyOverdue > 0 || s.collateralOverdue > 0
  ).length;

  const navItems = [
    {
      id: 'overview' as const,
      label: 'Home',
      icon: LayoutDashboard,
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

  return (
    <nav className="bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800/80 px-2 py-2 flex items-center justify-around sticky bottom-0 z-20">
      {navItems.map(item => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
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
            <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            {isActive && (
              <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-amber-400"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
