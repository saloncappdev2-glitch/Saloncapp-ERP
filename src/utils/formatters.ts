export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCompactNumber = (num: number): string => {
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)} L`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(0)} K`;
  }
  return `₹${num}`;
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export const getSeverityBadgeStyle = (severity: string): { bg: string; text: string; border: string; dot: string } => {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-rose-500/15',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
        dot: 'bg-rose-500 animate-pulse',
      };
    case 'high':
      return {
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        dot: 'bg-amber-500',
      };
    case 'medium':
      return {
        bg: 'bg-sky-500/15',
        text: 'text-sky-400',
        border: 'border-sky-500/40',
        dot: 'bg-sky-500',
      };
    default:
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-500',
      };
  }
};

export const getStatusBadgeStyle = (status: string): { label: string; bg: string; text: string; border: string } => {
  switch (status) {
    case 'pending_bh':
      return {
        label: 'Awaiting Business Head',
        bg: 'bg-purple-500/20',
        text: 'text-purple-300',
        border: 'border-purple-500/40',
      };
    case 'pending_region':
      return {
        label: 'Awaiting Region Mgr',
        bg: 'bg-blue-500/20',
        text: 'text-blue-300',
        border: 'border-blue-500/40',
      };
    case 'pending_cluster':
      return {
        label: 'Awaiting Cluster Mgr',
        bg: 'bg-amber-500/20',
        text: 'text-amber-300',
        border: 'border-amber-500/40',
      };
    case 'approved':
      return {
        label: 'Approved',
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-300',
        border: 'border-emerald-500/40',
      };
    case 'rejected':
      return {
        label: 'Rejected',
        bg: 'bg-rose-500/20',
        text: 'text-rose-300',
        border: 'border-rose-500/40',
      };
    case 'resolved':
      return {
        label: 'Resolved',
        bg: 'bg-teal-500/20',
        text: 'text-teal-300',
        border: 'border-teal-500/40',
      };
    default:
      return {
        label: status,
        bg: 'bg-neutral-800',
        text: 'text-neutral-300',
        border: 'border-neutral-700',
      };
  }
};
