import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import {
  RoleType,
  UserProfile,
  Region,
  Cluster,
  Store,
  Ticket,
  BroadcastMessage,
  SystemNotification,
  TicketSeverity,
  TicketCategory,
  BroadcastScope,
  HrDepartmentStatus,
  AccountingDepartmentStatus,
  TrainingDepartmentStatus,
  MarketingDepartmentStatus,
} from '../types/erp';
import {
  USER_PROFILES,
  INITIAL_REGIONS,
  INITIAL_CLUSTERS,
  INITIAL_STORES,
  INITIAL_TICKETS,
  INITIAL_BROADCASTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_HR_STATUS,
  INITIAL_ACCOUNTING_STATUS,
  INITIAL_TRAINING_STATUS,
  INITIAL_MARKETING_STATUS,
} from '../data/mockData';

interface ErpContextType {
  currentRole: RoleType;
  currentUser: UserProfile;
  setCurrentRole: (role: RoleType) => void;
  mobileDeviceFrame: boolean;
  setMobileDeviceFrame: (enabled: boolean) => void;
  toggleDeviceFrame: () => void;
  activeTab: 'overview' | 'overdues' | 'escalations' | 'broadcasts' | 'profile';
  setActiveTab: (tab: 'overview' | 'overdues' | 'escalations' | 'broadcasts' | 'profile') => void;

  regions: Region[];
  clusters: Cluster[];
  stores: Store[];
  tickets: Ticket[];
  broadcasts: BroadcastMessage[];
  notifications: SystemNotification[];

  // Department Statuses
  hrStatus: HrDepartmentStatus;
  accountingStatus: AccountingDepartmentStatus;
  trainingStatus: TrainingDepartmentStatus;
  marketingStatus: MarketingDepartmentStatus;

  // Role-filtered slices
  scopedStores: Store[];
  scopedClusters: Cluster[];
  scopedRegions: Region[];
  scopedTickets: Ticket[];
  scopedBroadcasts: BroadcastMessage[];
  unreadNotificationCount: number;
  isHqRole: boolean;

  // Actions
  createTicket: (data: {
    title: string;
    description: string;
    category: TicketCategory;
    severity: TicketSeverity;
  }) => Ticket;
  approveTicket: (ticketId: string, note?: string) => void;
  rejectTicket: (ticketId: string, reason: string) => void;
  escalateTicket: (ticketId: string, note: string) => void;
  resolveTicket: (ticketId: string, note: string) => void;
  sendBroadcast: (data: {
    title: string;
    content: string;
    priority: 'normal' | 'urgent' | 'critical';
    category:
      | 'Operational Notice'
      | 'Policy Update'
      | 'Overdue Escalation'
      | 'Emergency'
      | 'Target Drive'
      | 'HR & Staffing'
      | 'Accounting & Billing'
      | 'Training & Academy'
      | 'Marketing & Campaign';
    scope: BroadcastScope;
    targetRegionIds?: string[];
    targetClusterIds?: string[];
    targetStoreIds?: string[];
  }) => void;
  markOverdueSettled: (storeId: string, type: 'royalty' | 'collateral') => void;
  sendStoreReminder: (storeId: string, message: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Department Specific Quick Actions
  approveStaffTransfer: (storeName: string, role: string) => void;
  scheduleTrainingAudit: (title: string) => void;
  launchMarketingPromo: (name: string, discount: string) => void;
}

const ErpContext = createContext<ErpContextType | undefined>(undefined);

export const ErpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<RoleType>('business_head');
  const [mobileDeviceFrame, setMobileDeviceFrame] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'overdues' | 'escalations' | 'broadcasts' | 'profile'>('overview');

  const [regions, setRegions] = useState<Region[]>(INITIAL_REGIONS);
  const [clusters, setClusters] = useState<Cluster[]>(INITIAL_CLUSTERS);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(INITIAL_BROADCASTS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);

  // Department state
  const [hrStatus, setHrStatus] = useState<HrDepartmentStatus>(INITIAL_HR_STATUS);
  const [accountingStatus, setAccountingStatus] = useState<AccountingDepartmentStatus>(INITIAL_ACCOUNTING_STATUS);
  const [trainingStatus, setTrainingStatus] = useState<TrainingDepartmentStatus>(INITIAL_TRAINING_STATUS);
  const [marketingStatus, setMarketingStatus] = useState<MarketingDepartmentStatus>(INITIAL_MARKETING_STATUS);

  const currentUser = USER_PROFILES[currentRole];
  const isHqRole = useMemo(() => {
    return [
      'business_head',
      'hr_head',
      'accounting_head',
      'training_head',
      'marketing_head',
    ].includes(currentRole);
  }, [currentRole]);

  // Helper to re-sum clusters and regions when store overdues change
  const recalculateAggregates = (updatedStores: Store[]) => {
    setClusters(prevClusters =>
      prevClusters.map(cl => {
        const clusterStores = updatedStores.filter(s => s.clusterId === cl.id);
        const totalRoyalty = clusterStores.reduce((sum, s) => sum + s.royaltyOverdue, 0);
        const totalCollateral = clusterStores.reduce((sum, s) => sum + s.collateralOverdue, 0);
        const achieved = clusterStores.reduce((sum, s) => sum + s.currentRevenue, 0);
        return {
          ...cl,
          totalRoyaltyOverdue: totalRoyalty,
          totalCollateralOverdue: totalCollateral,
          achievedRevenue: achieved,
        };
      })
    );

    setRegions(prevRegions =>
      prevRegions.map(reg => {
        const regionStores = updatedStores.filter(s => s.regionId === reg.id);
        const totalRoyalty = regionStores.reduce((sum, s) => sum + s.royaltyOverdue, 0);
        const totalCollateral = regionStores.reduce((sum, s) => sum + s.collateralOverdue, 0);
        const achieved = regionStores.reduce((sum, s) => sum + s.currentRevenue, 0);
        return {
          ...reg,
          totalRoyaltyOverdue: totalRoyalty,
          totalCollateralOverdue: totalCollateral,
          achievedRevenue: achieved,
        };
      })
    );
  };

  // Scoped views based on hierarchy rules
  const scopedStores = useMemo(() => {
    if (isHqRole) return stores;
    if (currentRole === 'region_manager') {
      return stores.filter(s => s.regionId === currentUser.regionId);
    }
    if (currentRole === 'cluster_manager') {
      return stores.filter(s => s.clusterId === currentUser.clusterId);
    }
    // Store manager: only their own store
    return stores.filter(s => s.id === currentUser.storeId);
  }, [isHqRole, currentRole, currentUser, stores]);

  const scopedClusters = useMemo(() => {
    if (isHqRole) return clusters;
    if (currentRole === 'region_manager') {
      return clusters.filter(c => c.regionId === currentUser.regionId);
    }
    if (currentRole === 'cluster_manager') {
      return clusters.filter(c => c.id === currentUser.clusterId);
    }
    // Store manager: their cluster
    return clusters.filter(c => c.id === currentUser.clusterId);
  }, [isHqRole, currentRole, currentUser, clusters]);

  const scopedRegions = useMemo(() => {
    if (isHqRole) return regions;
    return regions.filter(r => r.id === currentUser.regionId);
  }, [isHqRole, currentUser, regions]);

  // Scoped tickets strictly filtered by department domain
  const scopedTickets = useMemo(() => {
    if (currentRole === 'business_head') {
      return tickets;
    }
    if (currentRole === 'hr_head') {
      // ONLY HR & Stylist Staffing issues
      return tickets.filter(t => t.category === 'Staff & Stylist Shortage');
    }
    if (currentRole === 'accounting_head') {
      // ONLY Finance, Royalty & Collateral issues
      return tickets.filter(
        t => t.category === 'Royalty & Billing' || t.category === 'Collateral Recovery'
      );
    }
    if (currentRole === 'training_head') {
      // ONLY Academy, SOP, Hygiene & Quality Audits
      return tickets.filter(
        t =>
          t.category === 'Training & Quality Audit' ||
          t.category === 'Franchise Compliance' ||
          t.category === 'Equipment & AC Breakdown'
      );
    }
    if (currentRole === 'marketing_head') {
      // ONLY Promotions, Campaigns & Customer Disputes
      return tickets.filter(
        t => t.category === 'Marketing & Promo Request' || t.category === 'Customer Dispute'
      );
    }
    if (currentRole === 'region_manager') {
      return tickets.filter(t => t.regionId === currentUser.regionId);
    }
    if (currentRole === 'cluster_manager') {
      return tickets.filter(t => t.clusterId === currentUser.clusterId);
    }
    // Store manager sees tickets for their store
    return tickets.filter(t => t.storeId === currentUser.storeId);
  }, [currentRole, currentUser, tickets]);

  // Scoped broadcasts visible to this role (strictly department-filtered)
  const scopedBroadcasts = useMemo(() => {
    return broadcasts.filter(b => {
      if (currentRole === 'hr_head') {
        return (
          b.category === 'HR & Staffing' ||
          b.category === 'Policy Update' ||
          b.category === 'Operational Notice'
        );
      }
      if (currentRole === 'accounting_head') {
        return (
          b.category === 'Accounting & Billing' ||
          b.category === 'Overdue Escalation' ||
          b.category === 'Policy Update'
        );
      }
      if (currentRole === 'training_head') {
        return (
          b.category === 'Training & Academy' ||
          b.category === 'Operational Notice' ||
          b.category === 'Policy Update'
        );
      }
      if (currentRole === 'marketing_head') {
        return (
          b.category === 'Marketing & Campaign' ||
          b.category === 'Target Drive' ||
          b.category === 'Operational Notice'
        );
      }

      if (b.scope === 'all') return true;
      if (currentRole === 'business_head') return true;

      if (currentRole === 'region_manager') {
        if (b.scope === 'regions' && b.targetRegionIds?.includes(currentUser.regionId || '')) return true;
        return true;
      }

      if (currentRole === 'cluster_manager') {
        if (b.scope === 'clusters' && b.targetClusterIds?.includes(currentUser.clusterId || '')) return true;
        if (b.scope === 'regions' && b.targetRegionIds?.includes(currentUser.regionId || '')) return true;
        return true;
      }

      // Store manager
      if (b.scope === 'stores' && b.targetStoreIds?.includes(currentUser.storeId || '')) return true;
      if (b.scope === 'clusters' && b.targetClusterIds?.includes(currentUser.clusterId || '')) return true;
      if (b.scope === 'regions' && b.targetRegionIds?.includes(currentUser.regionId || '')) return true;
      return false;
    });
  }, [broadcasts, currentRole, currentUser]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => {
      if (n.isRead) return false;

      // Department-specific notification filtering
      if (currentRole === 'hr_head') {
        return (
          n.recipientRoles.includes('hr_head') ||
          n.title.toLowerCase().includes('staff') ||
          n.title.toLowerCase().includes('stylist')
        );
      }
      if (currentRole === 'accounting_head') {
        return (
          n.recipientRoles.includes('accounting_head') ||
          n.type === 'overdue_alert' ||
          n.title.toLowerCase().includes('royalty') ||
          n.title.toLowerCase().includes('billing')
        );
      }
      if (currentRole === 'training_head') {
        return (
          n.recipientRoles.includes('training_head') ||
          n.title.toLowerCase().includes('workshop') ||
          n.title.toLowerCase().includes('hygiene') ||
          n.title.toLowerCase().includes('audit')
        );
      }
      if (currentRole === 'marketing_head') {
        return (
          n.recipientRoles.includes('marketing_head') ||
          n.title.toLowerCase().includes('campaign') ||
          n.title.toLowerCase().includes('promo')
        );
      }

      const roleMatch = n.recipientRoles.includes(currentRole);
      if (!roleMatch) return false;
      if (n.targetScope?.regionId && currentUser.regionId && n.targetScope.regionId !== currentUser.regionId) {
        return false;
      }
      if (n.targetScope?.clusterId && currentUser.clusterId && n.targetScope.clusterId !== currentUser.clusterId) {
        return false;
      }
      return true;
    }).length;
  }, [notifications, currentRole, currentUser]);

  // CREATE TICKET (with severity restriction & notification rule)
  const createTicket = (data: {
    title: string;
    description: string;
    category: TicketCategory;
    severity: TicketSeverity;
  }): Ticket => {
    const isHighOrCritical = data.severity === 'high' || data.severity === 'critical';
    const store = stores.find(s => s.id === (currentUser.storeId || 'str_104')) || stores[0];

    const ticketNumber = `ESC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newTicket: Ticket = {
      id: `tkt_${Date.now()}`,
      ticketNumber,
      title: data.title,
      description: data.description,
      category: data.category,
      severity: data.severity,
      status: isHighOrCritical ? 'pending_bh' : 'pending_cluster',
      storeId: store.id,
      clusterId: store.clusterId,
      regionId: store.regionId,
      raisedByName: currentUser.name,
      raisedByRole: currentRole,
      directToBH: isHighOrCritical,
      ccNotifiedRoles: isHighOrCritical ? ['cluster_manager', 'region_manager'] : [],
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: `tl_${Date.now()}`,
          action: isHighOrCritical
            ? `Direct High/Critical Escalation to Business Head`
            : `Ticket Raised to Cluster Manager`,
          performedByName: `${currentUser.name} (${currentUser.title})`,
          performedByRole: currentRole,
          note: isHighOrCritical
            ? `[SEVERITY RULE TRIGGERED] Severity is "${data.severity.toUpperCase()}". Direct route to Business Head enabled. Auto-notified Cluster Manager Rajesh V. and Region Manager Vikram S.`
            : `Standard issue logged for cluster review.`,
          timestamp: now,
        },
      ],
    };

    setTickets(prev => [newTicket, ...prev]);

    // Create system notification
    const newNotifications: SystemNotification[] = [];

    if (isHighOrCritical) {
      newNotifications.push({
        id: `notif_${Date.now()}_bh`,
        recipientRoles: ['business_head'],
        targetScope: { regionId: store.regionId, clusterId: store.clusterId, storeId: store.id },
        title: `🚨 ${data.severity.toUpperCase()} Escalation Direct from ${store.name}`,
        message: `${currentUser.name} raised ticket ${ticketNumber}: "${data.title}". Immediate BH review requested.`,
        type: 'ticket_created',
        relatedTicketId: newTicket.id,
        timestamp: now,
        isRead: false,
      });

      newNotifications.push({
        id: `notif_${Date.now()}_cc`,
        recipientRoles: ['cluster_manager', 'region_manager'],
        targetScope: { regionId: store.regionId, clusterId: store.clusterId, storeId: store.id },
        title: `⚠️ CC Notice: Direct Escalation to BH from ${store.name}`,
        message: `High/Critical ticket ${ticketNumber} ("${data.title}") was sent straight to Business Head by ${store.name}. You are CC'd.`,
        type: 'ticket_created',
        relatedTicketId: newTicket.id,
        timestamp: now,
        isRead: false,
      });
    } else {
      newNotifications.push({
        id: `notif_${Date.now()}_cm`,
        recipientRoles: ['cluster_manager'],
        targetScope: { regionId: store.regionId, clusterId: store.clusterId, storeId: store.id },
        title: `📋 New Store Ticket: ${data.title}`,
        message: `${store.name} submitted ${data.severity.toUpperCase()} priority ticket ${ticketNumber} for cluster review.`,
        type: 'ticket_created',
        relatedTicketId: newTicket.id,
        timestamp: now,
        isRead: false,
      });
    }

    setNotifications(prev => [...newNotifications, ...prev]);
    return newTicket;
  };

  // APPROVE TICKET
  const approveTicket = (ticketId: string, note?: string) => {
    const now = new Date().toISOString();
    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'approved',
          resolutionNote: note || 'Approved by authority.',
          updatedAt: now,
          timeline: [
            ...t.timeline,
            {
              id: `tl_${Date.now()}`,
              action: `Ticket APPROVED by ${currentUser.title}`,
              performedByName: `${currentUser.name} (${currentUser.title})`,
              performedByRole: currentRole,
              note: note || 'Quick Approval granted.',
              timestamp: now,
            },
          ],
        };
      })
    );

    // Notify store manager
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRoles: ['store_manager', 'cluster_manager'],
        title: `✅ Ticket Approved: ${ticketId}`,
        message: `Decision granted by ${currentUser.name} (${currentUser.title}). Note: ${note || 'Approved'}`,
        type: 'ticket_approved',
        relatedTicketId: ticketId,
        timestamp: now,
        isRead: false,
      },
      ...prev,
    ]);
  };

  // REJECT TICKET
  const rejectTicket = (ticketId: string, reason: string) => {
    const now = new Date().toISOString();
    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'rejected',
          rejectionReason: reason,
          updatedAt: now,
          timeline: [
            ...t.timeline,
            {
              id: `tl_${Date.now()}`,
              action: `Ticket REJECTED by ${currentUser.title}`,
              performedByName: `${currentUser.name} (${currentUser.title})`,
              performedByRole: currentRole,
              note: `Reason: ${reason}`,
              timestamp: now,
            },
          ],
        };
      })
    );

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRoles: ['store_manager'],
        title: `❌ Ticket Rejected: ${ticketId}`,
        message: `Decision by ${currentUser.name} (${currentUser.title}). Reason: ${reason}`,
        type: 'ticket_rejected',
        relatedTicketId: ticketId,
        timestamp: now,
        isRead: false,
      },
      ...prev,
    ]);
  };

  // ESCALATE TICKET TO NEXT TIER
  const escalateTicket = (ticketId: string, note: string) => {
    const now = new Date().toISOString();
    const nextStatus = currentRole === 'cluster_manager' ? 'pending_region' : 'pending_bh';
    const nextRecipientRole: RoleType = currentRole === 'cluster_manager' ? 'region_manager' : 'business_head';
    const nextTierName = currentRole === 'cluster_manager' ? 'Region Manager' : 'Business Head';

    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: nextStatus,
          updatedAt: now,
          timeline: [
            ...t.timeline,
            {
              id: `tl_${Date.now()}`,
              action: `Escalated to ${nextTierName}`,
              performedByName: `${currentUser.name} (${currentUser.title})`,
              performedByRole: currentRole,
              note: note || `Escalated for higher tier review.`,
              timestamp: now,
            },
          ],
        };
      })
    );

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRoles: [nextRecipientRole],
        title: `🔺 Escalation Received from ${currentUser.name}`,
        message: `Ticket escalated to your queue for review: "${note}"`,
        type: 'ticket_escalated',
        relatedTicketId: ticketId,
        timestamp: now,
        isRead: false,
      },
      ...prev,
    ]);
  };

  // RESOLVE TICKET
  const resolveTicket = (ticketId: string, note: string) => {
    const now = new Date().toISOString();
    setTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'resolved',
          resolutionNote: note,
          updatedAt: now,
          timeline: [
            ...t.timeline,
            {
              id: `tl_${Date.now()}`,
              action: `Marked RESOLVED by ${currentUser.title}`,
              performedByName: `${currentUser.name} (${currentUser.title})`,
              performedByRole: currentRole,
              note: note,
              timestamp: now,
            },
          ],
        };
      })
    );
  };

  // BROADCAST MESSAGE
  const sendBroadcast = (data: {
    title: string;
    content: string;
    priority: 'normal' | 'urgent' | 'critical';
    category:
      | 'Operational Notice'
      | 'Policy Update'
      | 'Overdue Escalation'
      | 'Emergency'
      | 'Target Drive'
      | 'HR & Staffing'
      | 'Accounting & Billing'
      | 'Training & Academy'
      | 'Marketing & Campaign';
    scope: BroadcastScope;
    targetRegionIds?: string[];
    targetClusterIds?: string[];
    targetStoreIds?: string[];
  }) => {
    const now = new Date().toISOString();
    let recipientCount = 0;

    if (data.scope === 'all') {
      recipientCount = stores.length;
    } else if (data.scope === 'regions') {
      recipientCount = stores.filter(s => data.targetRegionIds?.includes(s.regionId)).length;
    } else if (data.scope === 'clusters') {
      recipientCount = stores.filter(s => data.targetClusterIds?.includes(s.clusterId)).length;
    } else if (data.scope === 'stores') {
      recipientCount = data.targetStoreIds?.length || 0;
    }

    const newBroadcast: BroadcastMessage = {
      id: `bc_${Date.now()}`,
      senderRole: currentRole,
      senderName: currentUser.name,
      senderTitle: currentUser.title,
      title: data.title,
      content: data.content,
      priority: data.priority,
      category: data.category,
      scope: data.scope,
      targetRegionIds: data.targetRegionIds,
      targetClusterIds: data.targetClusterIds,
      targetStoreIds: data.targetStoreIds,
      timestamp: now,
      readCount: 0,
      totalRecipients: recipientCount || 1,
    };

    setBroadcasts(prev => [newBroadcast, ...prev]);

    // Push notification to target roles
    const recipientRoles: RoleType[] =
      data.scope === 'all'
        ? ['region_manager', 'cluster_manager', 'store_manager']
        : data.scope === 'regions'
        ? ['region_manager', 'cluster_manager', 'store_manager']
        : data.scope === 'clusters'
        ? ['cluster_manager', 'store_manager']
        : ['store_manager'];

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRoles,
        title: `📢 Broadcast from ${currentUser.title}`,
        message: `${data.title}: ${data.content.slice(0, 80)}...`,
        type: 'broadcast',
        timestamp: now,
        isRead: false,
      },
      ...prev,
    ]);
  };

  // OVERDUE SETTLEMENT
  const markOverdueSettled = (storeId: string, type: 'royalty' | 'collateral') => {
    const updated = stores.map(s => {
      if (s.id !== storeId) return s;
      if (type === 'royalty') {
        return {
          ...s,
          royaltyOverdue: 0,
          royaltyDaysOverdue: 0,
          status: s.collateralOverdue > 50000 ? ('warning' as const) : ('active' as const),
        };
      } else {
        return {
          ...s,
          collateralOverdue: 0,
          collateralDaysOverdue: 0,
          status: s.royaltyOverdue > 50000 ? ('warning' as const) : ('active' as const),
        };
      }
    });

    setStores(updated);
    recalculateAggregates(updated);

    const store = stores.find(s => s.id === storeId);
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRoles: ['business_head', 'region_manager', 'cluster_manager'],
        title: `💰 Overdue Cleared: ${store?.name}`,
        message: `${type.toUpperCase()} overdue successfully marked cleared by ${currentUser.name}.`,
        type: 'overdue_alert',
        timestamp: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);
  };

  // SEND STORE REMINDER
  const sendStoreReminder = (storeId: string, message: string) => {
    const store = stores.find(s => s.id === storeId);
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRoles: ['store_manager'],
        targetScope: { storeId },
        title: `⚠️ Overdue Notice from ${currentUser.title}`,
        message: `Notice for ${store?.name}: ${message}`,
        type: 'overdue_alert',
        timestamp: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);
  };

  // DEPARTMENT SPECIFIC ACTIONS
  const approveStaffTransfer = (storeName: string, role: string) => {
    setHrStatus(prev => ({
      ...prev,
      pendingTransfersCount: Math.max(0, prev.pendingTransfersCount - 1),
      recentShortages: prev.recentShortages.filter(s => s.storeName !== storeName),
    }));

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRoles: ['store_manager', 'cluster_manager', 'region_manager'],
        title: `👥 Staff Transfer Approved by HR`,
        message: `${role} allocation approved for ${storeName} by Priyanka Sen (VP HR).`,
        type: 'ticket_approved',
        timestamp: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);
  };

  const scheduleTrainingAudit = (title: string) => {
    const newWs = {
      id: `ws_${Date.now()}`,
      title,
      date: 'Next Tuesday, 11:00 AM',
      registeredCount: 18,
      leadTrainer: 'Dr. Tanya Kapoor',
    };
    setTrainingStatus(prev => ({
      ...prev,
      upcomingWorkshopsCount: prev.upcomingWorkshopsCount + 1,
      upcomingWorkshops: [newWs, ...prev.upcomingWorkshops],
    }));

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRoles: ['cluster_manager', 'store_manager'],
        title: `🎓 New Academy Workshop Scheduled`,
        message: `Dr. Tanya Kapoor scheduled "${title}". Register store stylists on ERP.`,
        type: 'broadcast',
        timestamp: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);
  };

  const launchMarketingPromo = (name: string, discount: string) => {
    const newPromo = {
      id: `pr_${Date.now()}`,
      name,
      discount,
      redemptions: 45,
      activeTill: 'End of Month',
    };
    setMarketingStatus(prev => ({
      ...prev,
      activeCampaignsCount: prev.activeCampaignsCount + 1,
      totalCampaignLeads: prev.totalCampaignLeads + 120,
      topPromotions: [newPromo, ...prev.topPromotions],
    }));

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRoles: ['region_manager', 'cluster_manager', 'store_manager'],
        title: `📢 New Marketing Campaign Dispatched`,
        message: `Campaign "${name}" (${discount}) activated across outlets by Aditya Mathur.`,
        type: 'broadcast',
        timestamp: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const toggleDeviceFrame = () => {
    setMobileDeviceFrame(prev => !prev);
  };

  return (
    <ErpContext.Provider
      value={{
        currentRole,
        currentUser,
        setCurrentRole,
        mobileDeviceFrame,
        setMobileDeviceFrame,
        toggleDeviceFrame,
        activeTab,
        setActiveTab,
        regions,
        clusters,
        stores,
        tickets,
        broadcasts,
        notifications,
        hrStatus,
        accountingStatus,
        trainingStatus,
        marketingStatus,
        scopedStores,
        scopedClusters,
        scopedRegions,
        scopedTickets,
        scopedBroadcasts,
        unreadNotificationCount,
        isHqRole,
        createTicket,
        approveTicket,
        rejectTicket,
        escalateTicket,
        resolveTicket,
        sendBroadcast,
        markOverdueSettled,
        sendStoreReminder,
        markNotificationRead,
        markAllNotificationsRead,
        approveStaffTransfer,
        scheduleTrainingAudit,
        launchMarketingPromo,
      }}
    >
      {children}
    </ErpContext.Provider>
  );
};

export const useErp = () => {
  const context = useContext(ErpContext);
  if (!context) {
    throw new Error('useErp must be used within an ErpProvider');
  }
  return context;
};
