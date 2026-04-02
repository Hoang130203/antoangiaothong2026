'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, User, Plus, X } from 'lucide-react';
import PageWrapper from '@/components/ui/PageWrapper';
import SectionTitle from '@/components/ui/SectionTitle';
import Card from '@/components/ui/Card';
import Toast from '@/components/ui/Toast';
import Api from '../api/api';
import FormPost from './FormCreatePost';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Posts() {
  const [listPost, setListPost] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      setAvatar(localStorage.getItem('avatar'));
      setUser(localStorage.getItem('user'));
    } catch {}
    Api.getPost()
      .then((res) => {
        setListPost(res?.data.reverse());
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch { return dateStr; }
  };

  return (
    <PageWrapper>
      {!loaded && (
        <div className="loader_container">
          <div className="loader_spinner" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10">
        <SectionTitle subtitle="Các bài viết về an toàn giao thông">Bài Viết</SectionTitle>

        {/* Create post bar */}
        {user && (
          <div className="rounded-2xl shadow-sm p-4 mb-8 flex items-center gap-3"
            style={{ backgroundColor: 'var(--card-bg)', border: '1.5px solid var(--card-border)' }}>
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2"
                style={{ borderColor: 'var(--accent)' }} />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 12%, white)' }}>
                <User className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="flex-1 text-left px-4 py-2.5 rounded-xl text-sm transition-all"
              style={{
                backgroundColor: 'var(--page-bg)',
                border: '1.5px solid var(--card-border)',
                color: 'var(--text-muted)',
              }}
            >
              Đăng bài viết mới về an toàn giao thông...
            </button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="p-2 rounded-xl text-white transition-all"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm" style={{ backgroundColor: 'rgba(26,43,74,0.5)' }} />
            <div className="relative z-10 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowForm(false)} className="absolute -top-3 -right-3 p-1.5 bg-white rounded-full shadow-lg text-slate-500 hover:text-slate-700 z-20">
                <X className="w-4 h-4" />
              </button>
              <FormPost
                handleClick={() => setShowForm(false)}
                onSuccess={(newPost) => {
                  if (newPost) {
                    setListPost((prev) => [newPost, ...prev]);
                    setToast({ message: 'Đăng bài thành công!', type: 'success' });
                  } else {
                    setToast({ message: 'Đăng bài thất bại, thử lại!', type: 'error' });
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Post list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={loaded ? 'show' : 'hidden'}
          className="space-y-4"
        >
          {listPost.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Link href={`/posts/detail/${item.id}`}>
                <Card padding="p-0" className="overflow-hidden">
                  <div className="flex gap-4 p-5">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base leading-snug mb-2 line-clamp-2 transition-colors"
                        style={{ color: 'var(--text-heading)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-heading)'}>
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {item.user?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(item.time)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
          {loaded && listPost.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg">Chưa có bài viết nào.</p>
            </div>
          )}
        </motion.div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </PageWrapper>
  );
}