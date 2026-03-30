'use client';
import { useState } from 'react';
import { X, Video as Youtube, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Api from '../api/api';

export default function FormVideo({ handleClick, onSuccess }) {
  const [idVideo, setIdVideo] = useState('');
  const [title, setTitle] = useState('');
  const [loaded, setLoaded] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  let avatar, name;
  try {
    avatar = localStorage.getItem('avatar');
    name = localStorage.getItem('user');
  } catch {}

  const postVideo = async () => {
    setLoaded(false);
    setIsDisabled(true);
    try {
      const youtubeId = idVideo.replace('https://www.youtube.com/watch?v=', '').split('&')[0];
      const res = await Api.postVideo(title, youtubeId);
      const newVideo = res?.data || { id: Date.now(), title, youtubeId, owner: { name } };
      if (onSuccess) onSuccess(newVideo);
      handleClick();
    } catch {
      if (onSuccess) onSuccess(null);
    } finally {
      setLoaded(true);
      setIsDisabled(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
      {!loaded && (
        <div className="loader_container">
          <div className="loader_spinner" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div />
        <h3 className="font-bold text-slate-800 text-base">Đăng video</h3>
        <button onClick={handleClick} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3 px-5 py-3">
        {avatar ? (
          <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <User className="w-5 h-5 text-orange-500" />
          </div>
        )}
        <div>
          <p className="font-semibold text-sm text-slate-700">{name || ''}</p>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">Công khai</span>
        </div>
      </div>

      {/* Form body */}
      <div className="px-5 py-2 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Tiêu đề video</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm text-slate-700 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5 flex items-center gap-1.5">
            <Youtube className="w-4 h-4 text-red-500" /> Đường dẫn YouTube
          </label>
          <input
            value={idVideo}
            onChange={(e) => setIdVideo(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm text-slate-700 transition-all"
          />
        </div>

        {/* YouTube preview */}
        {idVideo && idVideo.includes('v=') && (
          <div className="rounded-xl overflow-hidden border border-slate-200">
            <img
              src={`https://img.youtube.com/vi/${idVideo.replace('https://www.youtube.com/watch?v=', '').split('&')[0]}/mqdefault.jpg`}
              alt="preview"
              className="w-full h-32 object-cover"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="px-5 pb-5 pt-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={postVideo}
          disabled={isDisabled || !title.trim() || !idVideo.trim()}
          className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all disabled:opacity-50"
        >
          {isDisabled ? 'Đang đăng...' : 'Đăng video'}
        </motion.button>
      </div>
    </div>
  );
}