'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Menu, X, LogIn, LogOut, UserPlus, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import ThemePicker from './ThemePicker';

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/posts', label: 'Bài viết' },
  { href: '/videos', label: 'Video' },
  { href: '/simulation', label: 'Mô phỏng' },
  { href: '/images', label: 'Hình ảnh' },
  { href: '/documents', label: 'Tài liệu' },
  { href: '/exams', label: 'Thi thử' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [mounted, setMounted] = useState(false);

  const syncAuth = () => {
    try {
      setUser(localStorage.getItem('user'));
      setAvatar(localStorage.getItem('avatar'));
    } catch {}
  };

  useEffect(() => {
    syncAuth();
    setMounted(true);

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('auth-update', syncAuth);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('auth-update', syncAuth);
    };
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('avatar');
      localStorage.removeItem('info');
      localStorage.removeItem('account');
      localStorage.removeItem('password');
      await signOut({ redirect: false });
      window.location.href = '/login';
    } catch {}
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : ''
      }`}
      style={{
        backgroundColor: 'var(--header-bg)',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.18)' : 'none',
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div
              className="p-1.5 rounded-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <ShieldCheck className="w-6 h-6" style={{ color: 'var(--header-accent)' }} />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--header-text)' }}>
              An Toàn{' '}
              <span style={{ color: 'var(--header-accent)' }}>Giao Thông</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium transition-colors group"
                style={{ color: 'var(--header-link)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--header-text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--header-link)'}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"
                  style={{ background: 'var(--header-accent)' }}
                />
              </Link>
            ))}
          </div>

          {/* Right side: ThemePicker + Auth */}
          <div className="hidden md:flex items-center gap-2">
            <ThemePicker />

            {!mounted ? (
              <div className="w-24 h-8 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }} />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/info"
                  className="flex items-center gap-2 transition-colors"
                  style={{ color: 'var(--header-link)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--header-text)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--header-link)'}
                >
                  {avatar ? (
                    <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border-2" style={{ borderColor: 'var(--header-accent)' }} />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{user}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--header-text)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{ color: 'var(--header-link)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--header-text)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--header-link)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <LogIn className="w-4 h-4" />
                  Đăng nhập
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-md text-white"
                  style={{ background: 'var(--header-accent)', color: '#1e1e1e' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <UserPlus className="w-4 h-4" />
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemePicker />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg transition-all"
              style={{ color: 'var(--header-link)' }}
              aria-label="Toggle menu"
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t overflow-hidden"
            style={{
              backgroundColor: 'var(--header-mobile-bg)',
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{ color: 'var(--header-link)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--header-text)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--header-link)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t flex flex-col gap-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                {user ? (
                  <>
                    <Link href="/info" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                      style={{ color: 'var(--header-text)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {avatar ? (
                        <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border-2" style={{ borderColor: 'var(--header-accent)' }} />
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="text-sm font-medium">{user}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium"
                      style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--header-text)' }}
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium"
                      style={{ color: 'var(--header-link)' }}>
                      Đăng nhập
                    </Link>
                    <Link href="/signup" onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-center text-white"
                      style={{ background: 'var(--primary)' }}>
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
