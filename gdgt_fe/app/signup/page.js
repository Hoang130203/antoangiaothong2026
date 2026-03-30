'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, UserPlus, Eye, EyeOff } from 'lucide-react';
import Api from '../api/api.js';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !email || !password) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setLoading(true);
    try {
      const res = await Api.register(email, password, `${firstName} ${lastName}`.trim());
      if (res.status === 200) {
        alert('Đăng ký thành công!');
        window.location.href = '/login';
      } else {
        alert('Đăng ký thất bại');
      }
    } catch {
      alert('Đăng ký thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #0f1d33 0%, #1a2b4a 60%, #1e3a5f 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-orange-500/20 mb-3">
            <ShieldCheck className="w-8 h-8 text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">An Toàn Giao Thông</h1>
          <p className="text-slate-400 text-sm mt-1">Tạo tài khoản mới</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Đăng ký</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Họ</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Họ..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Tên</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Tên..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-slate-800 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
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
            onClick={handleSignUp}
            disabled={loading}
            className="mt-6 w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </motion.button>

          <p className="mt-5 text-center text-sm text-slate-500">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-orange-500 hover:text-orange-600 font-semibold">
              Đăng nhập
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}