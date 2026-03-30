import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/posts', label: 'Bài viết' },
  { href: '/videos', label: 'Video' },
  { href: '/images', label: 'Hình ảnh' },
  { href: '/documents', label: 'Tài liệu' },
  { href: '/exams', label: 'Thi thử' },
];

export default function Footer() {
  return (
    <footer className="bg-navy-800 text-slate-300 mt-16" style={{ backgroundColor: '#1a2b4a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3 flex-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/20">
                <ShieldCheck className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-white font-bold text-lg">
                An Toàn <span className="text-orange-400">Giao Thông</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm text-center md:text-left max-w-xs">
              Cùng nhau xây dựng văn hóa giao thông an toàn
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-400 hover:text-orange-400 text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-slate-500 text-sm">
          <p>
            <strong className="text-slate-400">Create</strong> by{' '}
            <a href="https://www.facebook.com" className="hover:text-orange-400 transition-colors">
              Trần Thị Tuyết
            </a>
            {' '}· © {new Date().getFullYear()} An Toàn Giao Thông
          </p>
        </div>
      </div>
    </footer>
  );
}
