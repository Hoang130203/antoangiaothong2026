'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, LogIn, Eye, EyeOff } from 'lucide-react';
import Api from '../api/api.js';
import SigninButton from '../../components/SigninButton';

export default function SignIn() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!account || !password) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setLoading(true);
    try {
      const res = await Api.login(account, password, '0');
      if (res.status === 200) {
        localStorage.setItem('user', res.data.name);
        localStorage.setItem('info', res.data.id);
        localStorage.setItem('account', res.data.account);
        localStorage.setItem('password', res.data.password);
        localStorage.setItem('avatar', res.data.avatar);
        window.location.href = '/';
      } else {
        alert('Đăng nhập thất bại, vui lòng kiểm tra lại thông tin');
      }
    } catch {
      alert('Đăng nhập thất bại, vui lòng kiểm tra lại thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, var(--hero-from) 0%, var(--hero-via) 60%, var(--hero-to) 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl mb-3" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <ShieldCheck className="w-8 h-8" style={{ color: 'var(--header-accent)' }} />
          </div>
          <h1 className="text-2xl font-bold text-white">An Toàn Giao Thông</h1>
          <p className="text-slate-400 text-sm mt-1">Đăng nhập để tiếp tục</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl shadow-2xl p-8" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-heading)' }}>Đăng nhập</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Tài khoản</label>
              <input
                id="account"
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Nhập tài khoản..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Nhập mật khẩu..."
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-slate-800 text-sm"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleLogin}
            disabled={loading}
            className="mt-6 w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </motion.button>

          {/* Google signin */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-400">hoặc</span></div>
          </div>
          <SigninButton />

          <p className="mt-5 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Chưa có tài khoản?{' '}
            <Link href="/signup" className="font-semibold" style={{ color: 'var(--primary)' }}>
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}