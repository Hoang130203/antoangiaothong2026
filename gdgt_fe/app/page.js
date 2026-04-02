'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { BookOpen, Video, ClipboardList, ArrowRight, Shield, Users, Award, Star, Zap } from 'lucide-react';

// --- Traffic Light SVG ---
function TrafficLight() {
  return (
    <div style={{ position: 'relative' }}>
      {/* Glow behind traffic light */}
      <div style={{
        position: 'absolute',
        inset: -20,
        background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
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
    </div>
  );
}

// --- Floating emoji decoration ---
function FloatingEmoji({ emoji, style }) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        fontSize: '2rem',
        opacity: 0.6,
        userSelect: 'none',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {emoji}
    </motion.div>
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
    emoji: '📚',
    title: 'Bài viết',
    description: 'Kiến thức an toàn giao thông cập nhật mỗi ngày — luật lệ, kỹ năng lái xe, xử lý sự cố.',
    href: '/posts',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    icon: Video,
    emoji: '🎬',
    title: 'Video',
    description: 'Video hướng dẫn sinh động về kỹ năng tham gia giao thông an toàn.',
    href: '/videos',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    icon: ClipboardList,
    emoji: '📝',
    title: 'Thi thử',
    description: 'Kiểm tra kiến thức an toàn giao thông với bộ đề thi sát hạch lái xe.',
    href: '/exams',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
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
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, var(--hero-from) 0%, var(--hero-via) 50%, var(--hero-to) 100%)` }}
      >
        {/* Background decoration blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '10%', left: '5%',
              width: 400, height: 400, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', filter: 'blur(60px)',
            }}
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{
              position: 'absolute', bottom: '10%', right: '5%',
              width: 500, height: 500, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', filter: 'blur(80px)',
            }}
          />
          {/* Grid pattern */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            opacity: 0.4,
          }} />
        </div>

        {/* Floating emojis */}
        <FloatingEmoji emoji="🚗" style={{ top: '15%', left: '8%' }} />
        <FloatingEmoji emoji="🛵" style={{ top: '25%', right: '10%' }} />
        <FloatingEmoji emoji="🚦" style={{ bottom: '20%', left: '12%' }} />
        <FloatingEmoji emoji="⭐" style={{ top: '60%', right: '8%' }} />
        <FloatingEmoji emoji="🎯" style={{ top: '40%', left: '5%' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                color: 'var(--hero-text)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Shield className="w-4 h-4" />
              An toàn giao thông — Trách nhiệm của mỗi người 🌟
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6"
              style={{ color: 'var(--hero-text)', fontFamily: 'Nunito, sans-serif' }}
            >
              Cùng Nhau Xây Dựng{' '}
              <span style={{
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '12px',
                padding: '0 8px',
                display: 'inline-block',
              }}>
                Văn Hóa
              </span>{' '}
              Giao Thông An Toàn ✨
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-lg mb-8 max-w-xl mx-auto lg:mx-0 font-semibold"
              style={{ color: 'var(--hero-sub)' }}
            >
              Khám phá kiến thức, xem video hướng dẫn và kiểm tra hiểu biết của bạn về an toàn giao thông 🚀
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link href="/exams">
                <motion.button
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-base transition-all"
                  style={{
                    background: 'white',
                    color: 'var(--primary)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                    fontFamily: 'Nunito, sans-serif',
                  }}
                >
                  <ClipboardList className="w-5 h-5" />
                  Thi thử ngay 🎯
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </motion.button>
              </Link>
              <Link href="/posts">
                <motion.button
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-base transition-all"
                  style={{
                    border: '2.5px solid rgba(255,255,255,0.6)',
                    color: 'var(--hero-text)',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(6px)',
                    fontFamily: 'Nunito, sans-serif',
                  }}
                >
                  <BookOpen className="w-5 h-5" />
                  Xem bài viết 📖
                </motion.button>
              </Link>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex gap-6 mt-10 justify-center lg:justify-start flex-wrap"
            >
              {[
                { icon: '🏆', label: 'Bộ đề thi phong phú' },
                { icon: '📱', label: 'Dễ học mọi lúc' },
                { icon: '🆓', label: 'Hoàn toàn miễn phí' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--hero-sub)' }}>{item.label}</span>
                </div>
              ))}
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

        {/* Wave bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 80L48 69.3C96 59 192 37 288 32C384 27 480 37 576 48C672 59 768 69 864 64C960 59 1056 37 1152 32C1248 27 1344 37 1392 42.7L1440 48V80H0Z" fill="var(--page-bg)" />
          </svg>
        </div>
      </section>

      {/* ── STATS MARQUEE ── */}
      <section ref={statsRef} className="py-5 overflow-hidden" style={{ background: 'var(--stats-bg)' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={statsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="relative flex"
        >
          <div className="animate-marquee flex gap-12 whitespace-nowrap">
            {[...stats, ...stats].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 flex-shrink-0">
                <span className="font-black text-xl" style={{ color: 'var(--stats-text)' }}>
                  {stat.value}
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--stats-sub)' }}>
                  {stat.label}
                </span>
                <span className="text-2xl" style={{ color: 'var(--stats-sub)' }}>·</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section ref={featuresRef} className="py-20 px-4" style={{ backgroundColor: 'var(--page-bg)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4"
              style={{ background: `${getComputedStyle ? 'var(--primary)' : '#FF6B35'}20`, color: 'var(--primary)' }}>
              <Star className="w-4 h-4" />
              Khám phá nội dung
            </div>
            <h2
              className="text-3xl md:text-4xl font-black mb-3"
              style={{ color: 'var(--text-heading)', fontFamily: 'Nunito, sans-serif' }}
            >
              Học An Toàn Giao Thông{' '}
              <span style={{
                background: `linear-gradient(135deg, var(--primary), var(--accent))`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Thật Dễ!</span> 🎉
            </h2>
            <div className="w-20 h-1.5 mx-auto rounded-full mb-4 transition-all"
              style={{ background: `linear-gradient(90deg, var(--primary), var(--accent))` }} />
            <p className="max-w-xl mx-auto font-semibold" style={{ color: 'var(--text-muted)' }}>
              Tất cả những gì bạn cần để trở thành người tham gia giao thông an toàn và có trách nhiệm 🚀
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? 'show' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {features.map((feat, idx) => (
              <motion.div key={feat.href} variants={itemVariants}>
                <Link href={feat.href}>
                  <motion.div
                    whileHover={{ scale: 1.04, y: -8 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="rounded-3xl p-8 cursor-pointer group h-full relative overflow-hidden card-shine"
                    style={{
                      background: 'var(--card-bg)',
                      border: `2px solid var(--card-border)`,
                      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    }}
                  >
                    {/* Background gradient accent */}
                    <div
                      className="absolute top-0 right-0 w-32 h-32 rounded-bl-[60px] opacity-10 group-hover:opacity-20 transition-opacity"
                      style={{ background: feat.gradient }}
                    />

                    <div className="relative z-10">
                      <div className="text-5xl mb-4">{feat.emoji}</div>
                      <div
                        className="inline-flex p-3 rounded-2xl mb-5 group-hover:scale-110 transition-transform"
                        style={{ background: feat.gradient }}
                      >
                        <feat.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3
                        className="text-xl font-black mb-2 transition-colors"
                        style={{ color: 'var(--text-heading)', fontFamily: 'Nunito, sans-serif' }}
                      >
                        {feat.title}
                      </h3>
                      <p className="text-sm leading-relaxed mb-5 font-semibold" style={{ color: 'var(--text-muted)' }}>
                        {feat.description}
                      </p>
                      <span
                        className="inline-flex items-center gap-1.5 text-sm font-black group-hover:gap-3 transition-all"
                        style={{ color: 'var(--primary)' }}
                      >
                        Khám phá ngay <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FUN FACT STRIP ── */}
      <section className="py-12 px-4" style={{ background: `linear-gradient(135deg, var(--primary), var(--accent))` }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-6 text-center"
          >
            {[
              { emoji: '🎓', label: 'Học mọi lúc', sub: 'Trên điện thoại, máy tính' },
              { emoji: '🏅', label: 'Kết quả ngay', sub: 'Biết ngay đáp án đúng sai' },
              { emoji: '💡', label: 'Kiến thức thực tế', sub: 'Áp dụng vào cuộc sống' },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-2"
              >
                <span style={{ fontSize: '2.5rem' }}>{item.emoji}</span>
                <div className="font-black text-white text-sm md:text-base" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {item.label}
                </div>
                <div className="text-xs md:text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {item.sub}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-4" style={{ backgroundColor: 'var(--cta-bg)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Stars decoration */}
          <div className="flex justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              >
                <Star className="w-5 h-5 fill-current" style={{ color: 'var(--accent)' }} />
              </motion.div>
            ))}
          </div>

          <Award className="w-16 h-16 mx-auto mb-5" style={{ color: 'var(--accent)' }} />
          <h2
            className="text-3xl md:text-4xl font-black text-white mb-4"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            🚀 Kiểm Tra Kiến Thức Của Bạn!
          </h2>
          <p className="mb-8 text-lg font-semibold" style={{ color: 'var(--hero-sub)' }}>
            Tham gia bài kiểm tra an toàn giao thông để đánh giá mức độ hiểu biết của bạn 💪
          </p>
          <Link href="/exams">
            <motion.button
              whileHover={{ scale: 1.06, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-lg transition-all"
              style={{
                background: 'white',
                color: 'var(--primary)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
                fontFamily: 'Nunito, sans-serif',
              }}
            >
              <Zap className="w-5 h-5" />
              Bắt đầu thi thử ngay!
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
