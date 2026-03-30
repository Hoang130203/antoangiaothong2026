'use client';
import { useState } from 'react';
import { X, Smile, ImagePlus, User } from 'lucide-react';
import { motion } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import Api from '../api/api';

export default function FormPost({ handleClick, onSuccess }) {
  const [inputStr, setInputStr] = useState('');
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [visibleImage, setVisibleImage] = useState(false);
  const [avt, setAvt] = useState('');
  const [file, setFile] = useState(null);

  let user, avatar, userId;
  try {
    user = localStorage.getItem('user');
    avatar = localStorage.getItem('avatar');
    userId = localStorage.getItem('info');
  } catch {}

  const onEmojiClick = (emojiData) => {
    setInputStr((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => setAvt(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handlePost = async () => {
    setIsDisabled(true);
    try {
      let imageUrl = '';
      if (avt.length > 0) {
        const uploadRes = await Api.PostImage(file);
        imageUrl = uploadRes.data.url;
      }
      const res = await Api.upPost(title, inputStr, imageUrl);
      // Always build locally so we have all fields (user.name, image, etc.)
      // Use server-generated id if available
      const newPost = {
        id: res?.data?.id || Date.now(),
        title,
        content: inputStr,
        image: imageUrl,
        time: new Date().toISOString(),
        user: { name: user },
      };
      if (onSuccess) onSuccess(newPost);
      handleClick();
    } catch {
      // signal failure to parent so it can show toast
      if (onSuccess) onSuccess(null);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div />
        <h3 className="font-bold text-slate-800 text-base">Tạo bài viết</h3>
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
          <p className="font-semibold text-sm text-slate-700">{user || ''}</p>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">Công khai</span>
        </div>
      </div>

      {/* Form body */}
      <div className="px-5 max-h-96 overflow-y-auto">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề bài viết"
          className="w-full text-xl font-bold text-slate-800 outline-none border-none mb-2 placeholder:text-slate-300"
        />
        <textarea
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          placeholder="Nhập nội dung bài viết về an toàn giao thông..."
          className="w-full min-h-24 text-slate-600 text-sm outline-none border-none resize-none placeholder:text-slate-300"
        />

        {/* Image preview */}
        {visibleImage && (
          <div className="relative border-2 border-dashed border-slate-200 rounded-xl h-40 flex items-center justify-center mb-3 overflow-hidden">
            {avt ? (
              <>
                <img src={avt} alt="preview" className="w-full h-full object-cover" />
                <button onClick={() => { setAvt(''); setFile(null); }} className="absolute top-2 right-2 p-1 bg-white rounded-full shadow text-slate-500">
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <label className="flex flex-col items-center gap-2 cursor-pointer text-slate-400">
                <ImagePlus className="w-8 h-8" />
                <span className="text-sm">Chọn ảnh</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPicker(!showPicker)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-orange-400 transition-all relative">
            <Smile className="w-5 h-5" />
            {showPicker && (
              <div className="absolute bottom-full left-0 z-50">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </button>
          <button onClick={() => setVisibleImage(!visibleImage)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-green-400 transition-all">
            <ImagePlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="px-5 pb-5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePost}
          disabled={isDisabled || (!title.trim() && !inputStr.trim())}
          className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all disabled:opacity-50"
        >
          {isDisabled ? 'Đang đăng...' : 'Đăng bài'}
        </motion.button>
      </div>
    </div>
  );
}