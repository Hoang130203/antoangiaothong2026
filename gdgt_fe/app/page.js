'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { BookOpen, Video, ClipboardList, ArrowRight, Shield, Users, Award } from 'lucide-react';
import Button from '@/components/ui/Button';

// --- Traffic Light SVG ---
function TrafficLight() {
  return (
    <svg width="80" height="220" viewBox="0 0 80 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pole */}
      <rect x="36" y="180" width="8" height="40" fill="#475569" rx="2" />
      {/* Housing */}
      <rect x="8" y="10" width="64" height="175" rx="16" fill="#1e293b" />
      <rect x="12" y="14" width="56" height="167" rx="12" fill="#0f172a" />
      {/* Red light */}
      <circle cx="40" cy="52" r="20" fill="#dc2626" className="traffic-red" />
      <circle cx="40" cy="52" r="14" fill="#ef4444" className="traffic-red" style={{ opacity: 0.7 }} />
      {/* Amber light */}
      <circle cx="40" cy="110" r="20" fill="#f59e0b" className="traffic-amber" />
      <circle cx="40" cy="110" r="14" fill="#fbbf24" className="traffic-amber" style={{ opacity: 0.7 }} />
      {/* Green light */}
      <circle cx="40" cy="168" r="20" fill="#16a34a" className="traffic-green" />
      <circle cx="40" cy="168" r="14" fill="#22c55e" className="traffic-green" style={{ opacity: 0.7 }} />
    </svg>
  );
}

// --- Stats ---
const stats = [
  { value: '11.000+', label: 'Người thiệt mạng/năm' },
  { value: '40.000+', label: 'Người bị thương/năm' },
  { value: '95%', label: 'Do ý thức người lái' },
  { value: '1/3', label: 'Số vụ liên quan tốc độ' },
  { value: '30%', label: 'Giảm nhờ đeo mũ bảo hiểm' },
  { value: '0‰', label: 'Nồng độ cồn an toàn' },
];

// --- Feature cards ---
const features = [
  {
    icon: BookOpen,
    title: 'Bài viết',
    description: 'Kiến thức an toàn giao thông cập nhật mỗi ngày — luật lệ, kỹ năng lái xe, xử lý sự cố.',
    href: '/posts',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: Video,
    title: 'Video',
    description: 'Video hướng dẫn sinh động về kỹ năng tham gia giao thông an toàn.',
    href: '/videos',
    color: 'from-orange-400 to-orange-600',
  },
  {
    icon: ClipboardList,
    title: 'Thi thử',
    description: 'Kiểm tra kiến thức an toàn giao thông với bộ đề thi sát hạch lái xe.',
    href: '/exams',
    color: 'from-green-500 to-green-700',
  },
];

// --- Stagger variants ---
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Home() {
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' });
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' });

  return (
    <main className="overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f1d33 0%, #1a2b4a 50%, #1e3a5f 100%)' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-orange-500 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-blue-500 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-medium mb-6"
            >
              <Shield className="w-4 h-4" />
              An toàn giao thông — Trách nhiệm của mỗi người
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
            >
              Cùng Nhau Xây Dựng{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                Văn Hóa Giao Thông
              </span>{' '}
              An Toàn
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-slate-300 text-lg mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Khám phá kiến thức, xem video hướng dẫn và kiểm tra hiểu biết của bạn về an toàn giao thông.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link href="/exams">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base shadow-lg shadow-orange-500/30 transition-all"
                >
                  <ClipboardList className="w-5 h-5" />
                  Thi thử ngay
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </motion.button>
              </Link>
              <Link href="/posts">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/30 hover:border-orange-400 text-white font-semibold text-base transition-all"
                >
                  <BookOpen className="w-5 h-5" />
                  Xem bài viết
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Traffic Light */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
            className="flex-shrink-0"
          >
            <TrafficLight />
          </motion.div>
        </div>
      </section>

      {/* ── STATS MARQUEE ── */}
      <section ref={statsRef} className="py-6 bg-orange-500 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={statsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="relative flex"
        >
          <div className="animate-marquee flex gap-12 whitespace-nowrap">
            {[...stats, ...stats].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 flex-shrink-0">
                <span className="text-white font-black text-xl">{stat.value}</span>
                <span className="text-orange-100 text-sm">{stat.label}</span>
                <span className="text-orange-200 text-2xl">·</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section ref={featuresRef} className="py-20 px-4 bg-bg" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-3" style={{ color: '#1a2b4a' }}>
              Khám Phá Nội Dung
            </h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full mb-4" />
            <p className="text-slate-500 max-w-xl mx-auto">
              Tất cả những gì bạn cần để trở thành người tham gia giao thông an toàn và có trách nhiệm.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? 'show' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {features.map((feat) => (
              <motion.div key={feat.href} variants={itemVariants}>
                <Link href={feat.href}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 cursor-pointer group h-full"
                  >
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feat.color} mb-5`}>
                      <feat.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-500 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{feat.description}</p>
                    <span className="inline-flex items-center gap-1 text-orange-500 text-sm font-semibold group-hover:gap-2 transition-all">
                      Khám phá <ArrowRight className="w-4 h-4" />
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-4" style={{ backgroundColor: '#1a2b4a' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <Award className="w-14 h-14 text-orange-400 mx-auto mb-5" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Kiểm Tra Kiến Thức Của Bạn
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Tham gia bài kiểm tra an toàn giao thông để đánh giá mức độ hiểu biết của bạn.
          </p>
          <Link href="/exams">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-xl shadow-orange-500/30 transition-all"
            >
              Bắt đầu thi thử
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
