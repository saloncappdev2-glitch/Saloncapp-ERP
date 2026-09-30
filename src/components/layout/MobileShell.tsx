import React, { useState } from 'react';
import { useErp } from '../../context/ErpContext';
import { Header } from '../common/Header';
import { RoleSwitcherBar } from '../common/RoleSwitcherBar';
import { BottomNav } from '../common/BottomNav';
import { BusinessHeadView } from '../views/BusinessHeadView';
import { RegionManagerView } from '../views/RegionManagerView';
import { ClusterManagerView } from '../views/ClusterManagerView';
import { StoreManagerView } from '../views/StoreManagerView';
import { OverduesTabView } from '../views/OverduesTabView';
import { EscalationsTabView } from '../views/EscalationsTabView';
import { BroadcastsTabView } from '../views/BroadcastsTabView';
import { AuditHierarchyTabView } from '../views/AuditHierarchyTabView';
import { CreateEscalationModal } from '../modals/CreateEscalationModal';
import { BroadcastComposerModal } from '../modals/BroadcastComposerModal';
import { ActionCtaModal } from '../modals/ActionCtaModal';
import { NotificationDrawer } from '../modals/NotificationDrawer';
import { Ticket } from '../../types/erp';
import { Wifi, Battery, Signal } from 'lucide-react';

export const MobileShell: React.FC = () => {
  const { currentRole, activeTab, mobileDeviceFrame } = useErp();

  // Modals state
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Quick CTA modal state
  const [actionCtaType, setActionCtaType] = useState<'approve' | 'reject' | 'escalate'>('approve');
  const [actionCtaTicket, setActionCtaTicket] = useState<Ticket | null>(null);
  const [isActionCtaOpen, setIsActionCtaOpen] = useState(false);

  const handleOpenApproveModal = (ticket: Ticket) => {
    setActionCtaType('approve');
    setActionCtaTicket(ticket);
    setIsActionCtaOpen(true);
  };

  const handleOpenRejectModal = (ticket: Ticket) => {
    setActionCtaType('reject');
    setActionCtaTicket(ticket);
    setIsActionCtaOpen(true);
  };

  const handleOpenEscalateModal = (ticket: Ticket) => {
    setActionCtaType('escalate');
    setActionCtaTicket(ticket);
    setIsActionCtaOpen(true);
  };

  // Render content according to active tab
  const renderTabContent = () => {
    if (activeTab === 'overdues') {
      return <OverduesTabView />;
    }
    if (activeTab === 'escalations') {
      return (
        <EscalationsTabView
          onOpenApproveModal={handleOpenApproveModal}
          onOpenRejectModal={handleOpenRejectModal}
          onOpenEscalateModal={handleOpenEscalateModal}
          onOpenTicketModal={() => setIsEscalateModalOpen(true)}
        />
      );
    }
    if (activeTab === 'broadcasts') {
      return (
        <BroadcastsTabView
          onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
        />
      );
    }
    if (activeTab === 'profile') {
      return <AuditHierarchyTabView />;
    }

    // Default: 'overview' tab based on role
    switch (currentRole) {
      case 'business_head':
        return (
          <BusinessHeadView
            onOpenApproveModal={handleOpenApproveModal}
            onOpenRejectModal={handleOpenRejectModal}
            onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
          />
        );
      case 'region_manager':
        return (
          <RegionManagerView
            onOpenApproveModal={handleOpenApproveModal}
            onOpenRejectModal={handleOpenRejectModal}
            onOpenEscalateModal={handleOpenEscalateModal}
            onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
          />
        );
      case 'cluster_manager':
        return (
          <ClusterManagerView
            onOpenApproveModal={handleOpenApproveModal}
            onOpenRejectModal={handleOpenRejectModal}
            onOpenEscalateModal={handleOpenEscalateModal}
            onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
          />
        );
      case 'store_manager':
        return (
          <StoreManagerView
            onOpenTicketModal={() => setIsEscalateModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-0 sm:p-4 md:p-6">
      {/* Mobile Device Frame or Responsive Container */}
      <div
        className={`w-full bg-neutral-950 flex flex-col transition-all overflow-hidden ${
          mobileDeviceFrame
            ? 'max-w-[420px] h-[92vh] max-h-[890px] rounded-[48px] border-[10px] border-neutral-800 shadow-2xl ring-1 ring-white/10 relative'
            : 'max-w-md min-h-screen border-x border-neutral-800/80 shadow-2xl relative'
        }`}
      >
        {/* iOS / Phone Status Bar (when frame is active) */}
        {mobileDeviceFrame && (
          <div className="bg-neutral-950 pt-2.5 px-6 pb-1 flex items-center justify-between text-neutral-300 text-xs shrink-0 select-none z-30">
            <span className="font-extrabold text-[12px] tracking-tight">9:41</span>
            {/* Dynamic Island Notch Pill */}
            <div className="w-24 h-4 bg-neutral-900 rounded-full flex items-center justify-center border border-neutral-800">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-950 mr-2"></div>
              <div className="w-2 h-2 rounded-full bg-blue-500/80 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        )}

        {/* Persistent Top Header */}
        <Header
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
          onOpenTicketModal={() => setIsEscalateModalOpen(true)}
        />

        {/* Quick Role Switcher Bar */}
        <RoleSwitcherBar />

        {/* Main Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-3.5 pt-3.5">
          {renderTabContent()}
        </main>

        {/* Persistent Bottom Nav */}
        <BottomNav />

        {/* iPhone Home Indicator bar */}
        {mobileDeviceFrame && (
          <div className="bg-neutral-950 py-1.5 flex justify-center shrink-0">
            <div className="w-32 h-1 bg-neutral-700/80 rounded-full"></div>
          </div>
        )}

        {/* Modals */}
        <CreateEscalationModal
          isOpen={isEscalateModalOpen}
          onClose={() => setIsEscalateModalOpen(false)}
        />

        <BroadcastComposerModal
          isOpen={isBroadcastModalOpen}
          onClose={() => setIsBroadcastModalOpen(false)}
        />

        <ActionCtaModal
          isOpen={isActionCtaOpen}
          type={actionCtaType}
          ticket={actionCtaTicket}
          onClose={() => {
            setIsActionCtaOpen(false);
            setActionCtaTicket(null);
          }}
        />

        <NotificationDrawer
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />
      </div>
    </div>
  );
};
