'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, User, Plus, X, Edit, Trash2 } from 'lucide-react';
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      setAvatar(localStorage.getItem('avatar'));
      setUser(localStorage.getItem('user'));
      setIsAdmin(localStorage.getItem('account') === 'admin');
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

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Báº¡n cÃ³ cháº¯c muá»‘n xÃ³a bÃ i viáº¿t nÃ y?')) return;
    try {
      await Api.deletePost(id);
      setListPost(prev => prev.filter(p => p.id !== id));
      setToast({ message: 'XÃ³a bÃ i viáº¿t thÃ nh cÃ´ng!', type: 'success' });
    } catch {
      setToast({ message: 'XÃ³a bÃ i viáº¿t tháº¥t báº¡i!', type: 'error' });
    }
  };

  const [editingPost, setEditingPost] = useState(null);

  const handleEdit = (e, post) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingPost(post);
    setShowForm(true);
  };

  return (
    <PageWrapper>
      {!loaded && (
        <div className="loader_container">
          <div className="loader_spinner" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10">
        <SectionTitle subtitle="CÃ¡c bÃ i viáº¿t vá» an toÃ n giao thÃ´ng">BÃ i Viáº¿t</SectionTitle>

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
              ÄÄƒng bÃ i viáº¿t má»›i vá» an toÃ n giao thÃ´ng...
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
              <button onClick={() => { setShowForm(false); setEditingPost(null); }} className="absolute -top-3 -right-3 p-1.5 bg-white rounded-full shadow-lg text-slate-500 hover:text-slate-700 z-20">
                <X className="w-4 h-4" />
              </button>
              <FormPost
                handleClick={() => {
                  setShowForm(false);
                  setEditingPost(null);
                }}
                editingPost={editingPost}
                onSuccess={(post) => {
                  if (post) {
                    if (editingPost) {
                      setListPost(prev => prev.map(p => p.id === post.id ? post : p));
                      setToast({ message: 'Cáº­p nháº­t bÃ i viáº¿t thÃ nh cÃ´ng!', type: 'success' });
                    } else {
                      setListPost((prev) => [post, ...prev]);
                      setToast({ message: 'ÄÄƒng bÃ i thÃ nh cÃ´ng!', type: 'success' });
                    }
                  } else {
                    setToast({ message: editingPost ? 'Cáº­p nháº­t tháº¥t báº¡i!' : 'ÄÄƒng bÃ i tháº¥t báº¡i!', type: 'error' });
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

                    {isAdmin && (
                      <div className="flex flex-col gap-2 z-20">
                        <button
                          onClick={(e) => handleEdit(e, item)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-500 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, item.id)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
          {loaded && listPost.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg">ChÆ°a cÃ³ bÃ i viáº¿t nÃ o.</p>
            </div>
          )}
        </motion.div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </PageWrapper>
  );
}
