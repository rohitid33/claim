import React from 'react';
import { useToastStore } from '@/stores/toast-notification-store';
import NotificationToast from './NotificationToast';

const NotificationContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
      {toasts.map((toast) => (
        <NotificationToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer; 