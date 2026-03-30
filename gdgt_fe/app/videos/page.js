'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Play } from 'lucide-react';
import PageWrapper from '@/components/ui/PageWrapper';
import SectionTitle from '@/components/ui/SectionTitle';
import Card from '@/components/ui/Card';
import Api from '../api/api';
import FormVideo from './FormVideo';
import Link from 'next/link';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function Videos() {
  const [listVideos, setListVideos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  let avatar, isAdmin;
  try {
    avatar = typeof window !== 'undefined' ? localStorage.getItem('avatar') : null;
    isAdmin = typeof window !== 'undefined' ? localStorage.getItem('account') === 'admin' : false;
  } catch {}

  useEffect(() => {
    Api.getAllVideo()
      .then((res) => {
        setListVideos(res.data?.reverse());
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <PageWrapper>
      {!loaded && (
        <div className="loader_container">
          <div className="loader_spinner" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <SectionTitle subtitle="Video hướng dẫn an toàn giao thông">Video</SectionTitle>
          {isAdmin && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Thêm video
            </motion.button>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm" style={{ backgroundColor: 'rgba(26,43,74,0.5)' }} />
            <div className="relative z-10 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowForm(false)} className="absolute -top-3 -right-3 p-1.5 bg-white rounded-full shadow-lg text-slate-500 z-20">
                <X className="w-4 h-4" />
              </button>
              <FormVideo handleClick={() => setShowForm(false)} />
            </div>
          </div>
        )}

        {/* Video Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={loaded ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {listVideos.map((item) => (
            <motion.div key={item?.id} variants={itemVariants}>
              <Link href={`/videos/detail/${item?.id}`}>
                <Card padding="p-0" className="overflow-hidden group cursor-pointer">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-slate-900">
                    <img
                      src={`https://img.youtube.com/vi/${item?.youtubeId}/mqdefault.jpg`}
                      alt={item?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-navy-900/40 group-hover:bg-navy-900/20 transition-all flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-lg"
                      >
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </motion.div>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors">
                      {item?.title}
                    </h3>
                    {item?.owner?.avatar && (
                      <div className="flex items-center gap-2 mt-2">
                        <img src={item.owner.avatar} alt="" className="w-5 h-5 rounded-full" />
                        <span className="text-xs text-slate-400">{item?.owner?.name}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
          {loaded && listVideos.length === 0 && (
            <div className="col-span-3 text-center py-16 text-slate-400">
              <p className="text-lg">Chưa có video nào.</p>
            </div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}