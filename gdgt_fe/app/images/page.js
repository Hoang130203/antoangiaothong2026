'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus } from 'lucide-react';
import PageWrapper from '@/components/ui/PageWrapper';
import SectionTitle from '@/components/ui/SectionTitle';
import Api from '../api/api';

export default function Images() {
  const [file, setFile] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [loaded, setLoaded] = useState(false);

  let isAdmin, userId;
  try {
    isAdmin = typeof window !== 'undefined' ? localStorage.getItem('account') === 'admin' : false;
    userId = typeof window !== 'undefined' ? localStorage.getItem('info') : null;
  } catch {}

  useEffect(() => {
    Api.getImages().then((res) => {
      setImageUrls(res.data);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const handlePostImage = async () => {
    if (!file) return;
    try {
      const res = await Api.PostImage(file);
      await Api.insertImage(res.data.url, userId);
      alert('Thêm ảnh thành công');
      window.location.reload();
    } catch { alert('Thêm ảnh thất bại'); }
  };

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <PageWrapper>
      {!loaded && <div className="loader_container"><div className="loader_spinner" /></div>}

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <SectionTitle subtitle="Hình ảnh về an toàn giao thông">Hình Ảnh</SectionTitle>

          {isAdmin && (
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-slate-200 hover:border-orange-300 text-sm text-slate-400 cursor-pointer transition-all">
                <ImagePlus className="w-4 h-4" />
                {file ? file.name.slice(0, 20) + '...' : 'Chọn ảnh'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              </label>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handlePostImage}
                disabled={!file}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all disabled:opacity-50"
              >
                Thêm ảnh
              </motion.button>
            </div>
          )}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={loaded ? 'show' : 'hidden'}
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
        >
          {imageUrls.map((image, index) => (
            <motion.div key={index} variants={itemVariants} className="break-inside-avoid">
              <img
                src={image.url}
                alt={`Hình ${index + 1}`}
                className="w-full rounded-2xl shadow-sm hover:shadow-md transition-all"
              />
            </motion.div>
          ))}
          {loaded && imageUrls.length === 0 && (
            <div className="col-span-3 text-center py-16 text-slate-400">
              <p>Chưa có hình ảnh nào.</p>
            </div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}