import React from 'react';
import { motion } from 'framer-motion';
import './Loading.css';

const Loading = ({ message = "Securing your vote..." }) => {
  return (
    <motion.div 
      className="loading-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loading-content">
        {/* Animated Gradient Spinner */}
        <motion.div
          className="spinner-track"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="spinner-gradient"></div>
        </motion.div>
        
        {/* Center Icon */}
        <div className="spinner-icon">🗳️</div>
        
        {/* Loading Text */}
        <motion.p
          className="loading-text"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Loading;