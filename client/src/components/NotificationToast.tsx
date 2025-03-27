import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Wait for exit animation to complete
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${getBackgroundColor()} min-w-[300px] max-w-md`}
        >
          <div className="flex items-center justify-between">
            <p className="mr-8">{message}</p>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast; 