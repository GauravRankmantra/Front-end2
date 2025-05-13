import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ size = 48 }) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div
        className="rounded-full border-t-4 border-b-4 border-blue-500"
        style={{
          width: size,
          height: size,
          borderLeft: '2px solid transparent',
          borderRight: '2px solid transparent',
        }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.1,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default Loading;
