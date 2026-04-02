'use client';
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
    <>
      <style>{`
        .footer-link {
          color: var(--footer-muted) !important;
          font-size: 14px;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: var(--footer-accent) !important;
        }
        .footer-creator-link {
          color: var(--footer-muted);
          transition: color 0.2s;
        }
        .footer-creator-link:hover {
          color: var(--footer-accent) !important;
        }
      `}</style>
      <footer style={{ backgroundColor: 'var(--footer-bg)', color: 'var(--footer-text)', marginTop: '64px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start gap-3 flex-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <ShieldCheck className="w-6 h-6" style={{ color: 'var(--footer-accent)' }} />
                </div>
                <span className="font-bold text-lg" style={{ color: 'var(--footer-text)' }}>
                  An Toàn <span style={{ color: 'var(--footer-accent)' }}>Giao Thông</span>
                </span>
              </div>
              <p className="text-sm text-center md:text-left max-w-xs" style={{ color: 'var(--footer-muted)' }}>
                Cùng nhau xây dựng văn hóa giao thông an toàn 🚦
              </p>
            </div>

            {/* Nav links */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 text-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'var(--footer-muted)' }}>
            <p>
              <strong style={{ color: 'var(--footer-text)' }}>Created</strong> by{' '}
              <a
                href="https://www.facebook.com"
                className="footer-creator-link"
              >
                Trần Thị Tuyết
              </a>
              {' '}· © {new Date().getFullYear()} An Toàn Giao Thông
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
