'use client';
import { motion } from 'framer-motion';

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
  const getStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--primary)',
          color: 'white',
          boxShadow: '0 4px 14px var(--primary-shadow)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--header-bg)',
          color: 'white',
        };
      case 'ghost':
        return {
          background: 'transparent',
          border: '2px solid var(--primary)',
          color: 'var(--primary)',
        };
      case 'danger':
        return {
          backgroundColor: '#dc2626',
          color: 'white',
        };
      case 'outline':
        return {
          background: 'var(--card-bg)',
          border: '2px solid var(--text-heading)',
          color: 'var(--text-heading)',
        };
      default:
        return {
          backgroundColor: 'var(--primary)',
          color: 'white',
        };
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      style={getStyle()}
      className={`
        inline-flex items-center justify-center gap-2
        px-5 py-2.5 rounded-xl font-semibold text-sm
        transition-colors duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}
