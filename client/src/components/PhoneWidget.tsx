import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PhoneWidget: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCall = () => {
    window.location.href = 'tel:+918630959445';
  };

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 right-0 bg-white text-primary px-4 py-2 rounded-full shadow-lg text-sm whitespace-nowrap"
          >
            Call us: +91 8630959445
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        className="relative cursor-pointer group"
        whileHover={{ scale: 1.1 }}
        animate={{
          rotate: [0, -15, 15, -15, 15, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
        onClick={handleCall}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
      >
        <motion.div
          className="absolute -inset-2 bg-primary/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="bg-primary rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow relative">
          <Phone className="h-6 w-6 text-white" />
        </div>
      </motion.div>
    </div>
  );
};

export default PhoneWidget; 