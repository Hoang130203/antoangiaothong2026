'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Menu, X, LogIn, LogOut, UserPlus, User } from 'lucide-react';
import { signOut } from 'next-auth/react';

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/posts', label: 'Bài viết' },
  { href: '/videos', label: 'Video' },
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
        scrolled ? 'bg-navy-800 shadow-lg shadow-navy-900/30' : 'bg-navy-800'
      }`}
      style={{ backgroundColor: '#1a2b4a' }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
              <ShieldCheck className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              An Toàn{' '}
              <span className="text-orange-400">Giao Thông</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-slate-300 hover:text-white text-sm font-medium transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {!mounted ? (
              <div className="w-24 h-8 bg-white/10 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link href="/info" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                  {avatar ? (
                    <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border-2 border-orange-400" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{user}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Đăng nhập
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  Đăng ký
                </Link>
              </>
            ) }
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
            className="md:hidden border-t border-white/10 overflow-hidden"
            style={{ backgroundColor: '#1a2b4a' }}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/10 text-white text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-sm font-medium">
                      Đăng nhập
                    </Link>
                    <Link href="/signup" onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold text-center">
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
