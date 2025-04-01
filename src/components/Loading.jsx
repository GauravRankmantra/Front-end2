import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <motion.div
        className="relative w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-spin"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <motion.div
          className="absolute inset-1 rounded-full bg-gray-900"
          initial={{ scale: 1 }}
          animate={{ scale: 0.9 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </div>
  );
};

export default Loading;