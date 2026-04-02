'use client';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', onClick, padding = 'p-6' }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.10)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1.5px solid var(--card-border)',
      }}
      className={`
        rounded-2xl shadow-sm
        transition-colors duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${padding}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
