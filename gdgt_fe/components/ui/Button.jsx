'use client';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-orange-200',
  secondary: 'bg-navy-800 hover:bg-navy-900 text-white shadow-md',
  ghost: 'bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-50',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md',
  outline: 'bg-white border-2 border-navy-800 text-navy-800 hover:bg-navy-50',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  ...props
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={`
        inline-flex items-center justify-center gap-2
        px-5 py-2.5 rounded-xl font-semibold text-sm
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}
