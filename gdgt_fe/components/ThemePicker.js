'use client';
import { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme, themes } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemePicker() {
  const { themeId, setThemeId } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        id="theme-picker-btn"
        onClick={() => setOpen(!open)}
        title="Chọn màu giao diện"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 10px',
          borderRadius: '10px',
          border: '1.5px solid rgba(255,255,255,0.25)',
          background: 'rgba(255,255,255,0.12)',
          color: 'var(--header-text)',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600',
          backdropFilter: 'blur(6px)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
      >
        <Palette style={{ width: 15, height: 15 }} />
        <span className="hidden sm:inline">Màu sắc</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 10px)',
              background: 'white',
              borderRadius: '18px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)',
              padding: '16px',
              minWidth: '240px',
              zIndex: 9999,
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            {/* Arrow */}
            <div style={{
              position: 'absolute',
              top: -7,
              right: 16,
              width: 14,
              height: 14,
              background: 'white',
              transform: 'rotate(45deg)',
              borderLeft: '1px solid rgba(0,0,0,0.06)',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }} />

            <p style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#94a3b8',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '10px',
              paddingLeft: '2px',
            }}>
              🎨 Chọn giao diện
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {Object.values(themes).map((theme) => {
                const isActive = themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    id={`theme-opt-${theme.id}`}
                    onClick={() => { setThemeId(theme.id); setOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 10px',
                      borderRadius: '12px',
                      border: isActive ? `2px solid ${theme.vars['--primary']}` : '2px solid transparent',
                      background: isActive ? `${theme.vars['--primary']}12` : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      width: '100%',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) e.currentTarget.style.background = '#f8fafc';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* Color swatches */}
                    <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                      {theme.preview.map((color, i) => (
                        <div
                          key={i}
                          style={{
                            width: i === 0 ? 18 : 14,
                            height: i === 0 ? 18 : 14,
                            borderRadius: '50%',
                            background: color,
                            border: '1.5px solid rgba(0,0,0,0.08)',
                            marginTop: i === 0 ? 0 : 2,
                          }}
                        />
                      ))}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#1e293b',
                        lineHeight: 1.2,
                      }}>
                        {theme.name}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#94a3b8',
                        marginTop: '1px',
                      }}>
                        {theme.description}
                      </div>
                    </div>

                    {/* Active check */}
                    {isActive && (
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: theme.vars['--primary'],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Check style={{ width: 10, height: 10, color: 'white' }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
