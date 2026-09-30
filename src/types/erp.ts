export type RoleType = 'business_head' | 'region_manager' | 'cluster_manager' | 'store_manager';

export type TicketSeverity = 'low' | 'medium' | 'high' | 'critical';

export type TicketCategory =
  | 'Royalty & Billing'
  | 'Collateral Recovery'
  | 'Equipment & AC Breakdown'
  | 'Staff & Stylist Shortage'
  | 'Product & Chemical Supply'
  | 'Franchise Compliance'
  | 'Customer Dispute';

export type TicketStatus =
  | 'pending_cluster'
  | 'pending_region'
  | 'pending_bh'
  | 'approved'
  | 'rejected'
  | 'resolved';

export interface UserProfile {
  id: string;
  name: string;
  role: RoleType;
  title: string;
  phone: string;
  email: string;
  regionId?: string;
  clusterId?: string;
  storeId?: string;
  avatar: string;
}

export interface Store {
  id: string;
  name: string;
  code: string;
  clusterId: string;
  regionId: string;
  city: string;
  chairs: number;
  managerName: string;
  phone: string;
  monthlyTarget: number;
  currentRevenue: number;
  footfallMonthly: number;
  royaltyOverdue: number;
  royaltyDaysOverdue: number;
  collateralOverdue: number;
  collateralDaysOverdue: number;
  status: 'active' | 'warning' | 'critical_overdue';
}

export interface Cluster {
  id: string;
  name: string;
  regionId: string;
  managerName: string;
  managerPhone: string;
  storeIds: string[];
  targetRevenue: number;
  achievedRevenue: number;
  totalRoyaltyOverdue: number;
  totalCollateralOverdue: number;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  managerName: string;
  managerPhone: string;
  clusterIds: string[];
  targetRevenue: number;
  achievedRevenue: number;
  totalRoyaltyOverdue: number;
  totalCollateralOverdue: number;
}

export interface TicketTimelineItem {
  id: string;
  action: string;
  performedByRole: RoleType;
  performedByName: string;
  note?: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: TicketCategory;
  severity: TicketSeverity;
  status: TicketStatus;
  storeId: string;
  clusterId: string;
  regionId: string;
  raisedByName: string;
  raisedByRole: RoleType;
  directToBH: boolean;
  ccNotifiedRoles: RoleType[];
  createdAt: string;
  updatedAt: string;
  resolutionNote?: string;
  rejectionReason?: string;
  timeline: TicketTimelineItem[];
}

export type BroadcastScope = 'all' | 'regions' | 'clusters' | 'stores';

export interface BroadcastMessage {
  id: string;
  senderRole: RoleType;
  senderName: string;
  senderTitle: string;
  title: string;
  content: string;
  priority: 'normal' | 'urgent' | 'critical';
  scope: BroadcastScope;
  targetRegionIds?: string[];
  targetClusterIds?: string[];
  targetStoreIds?: string[];
  timestamp: string;
  readCount: number;
  totalRecipients: number;
  category: 'Operational Notice' | 'Policy Update' | 'Overdue Escalation' | 'Emergency' | 'Target Drive';
}

export interface SystemNotification {
  id: string;
  recipientRoles: RoleType[];
  targetScope?: {
    regionId?: string;
    clusterId?: string;
    storeId?: string;
  };
  title: string;
  message: string;
  type: 'ticket_created' | 'ticket_escalated' | 'ticket_approved' | 'ticket_rejected' | 'broadcast' | 'overdue_alert';
  relatedTicketId?: string;
  timestamp: string;
  isRead: boolean;
}
