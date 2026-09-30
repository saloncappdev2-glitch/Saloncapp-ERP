import React from 'react';
import { useErp } from '../../context/ErpContext';
import { formatTimeAgo } from '../../utils/formatters';
import { X, Bell, CheckCheck, AlertCircle, ShieldAlert, Radio, DollarSign } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTicket?: (ticketId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTicket,
}) => {
  const {
    notifications,
    currentRole,
    currentUser,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
  } = useErp();

  if (!isOpen) return null;

  // Filter notifications for this role & jurisdiction
  const roleNotifications = notifications.filter(n => {
    if (!n.recipientRoles.includes(currentRole)) return false;
    if (n.targetScope?.regionId && currentUser.regionId && n.targetScope.regionId !== currentUser.regionId) {
      return false;
    }
    if (n.targetScope?.clusterId && currentUser.clusterId && n.targetScope.clusterId !== currentUser.clusterId) {
      return false;
    }
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'ticket_created':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'ticket_escalated':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'ticket_approved':
        return <CheckCheck className="w-4 h-4 text-emerald-400" />;
      case 'broadcast':
        return <Radio className="w-4 h-4 text-blue-400" />;
      default:
        return <DollarSign className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">Notifications & CC Alerts</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] font-semibold text-neutral-400 hover:text-amber-300 transition-colors px-2 py-1 rounded"
              title="Mark all as read"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1">
          {roleNotifications.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-xs">
              No recent notifications for your role.
            </div>
          ) : (
            roleNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.relatedTicketId) {
                    setActiveTab('escalations');
                    onClose();
                  } else if (notif.type === 'broadcast') {
                    setActiveTab('broadcasts');
                    onClose();
                  }
                }}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  notif.isRead
                    ? 'bg-neutral-950/40 border-neutral-800/60 text-neutral-400'
                    : 'bg-neutral-800/80 border-amber-500/30 text-neutral-100 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0">
                    {getNotifIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-xs truncate block text-neutral-200">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-neutral-500 shrink-0 font-mono">
                        {formatTimeAgo(notif.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-snug line-clamp-2">
                      {notif.message}
                    </p>
                    {notif.title.includes('CC') && (
                      <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold uppercase">
                        CC Notification
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
