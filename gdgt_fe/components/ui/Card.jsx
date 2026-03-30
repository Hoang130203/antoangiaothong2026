'use client';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', onClick, padding = 'p-6' }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(26,43,74,0.12)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-sm border border-slate-100
        transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${padding}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
