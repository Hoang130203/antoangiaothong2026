'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Heart, Laugh, ThumbsDown, Bookmark, Send, User, Clock, ArrowLeft } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import Link from 'next/link';
import PageWrapper from '@/components/ui/PageWrapper';
import Api from '../../../api/api';

const REACTIONS = [
  { id: '1', icon: ThumbsUp, color: 'text-blue-500', bg: 'hover:bg-blue-50' },
  { id: '2', icon: Heart, color: 'text-red-500', bg: 'hover:bg-red-50' },
  { id: '3', icon: Laugh, color: 'text-orange-500', bg: 'hover:bg-orange-50' },
  { id: '4', icon: ThumbsDown, color: 'text-slate-500', bg: 'hover:bg-slate-100' },
];

export default function Detail({ params }) {
  const [inputStr, setInputStr] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [post, setPost] = useState(null);
  const [lines, setLines] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState('0');
  const [listComment, setListComment] = useState([]);
  const [saved, setSaved] = useState(false);

  let avatar, name;
  try {
    avatar = typeof window !== 'undefined' ? localStorage.getItem('avatar') : null;
    name = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  } catch {}

  useEffect(() => {
    Api.getPostById(params.id)
      .then((res) => {
        setPost(res.data);
        setLines(res.data.content?.split('\n') || []);
        setListComment(res.data.listComment || []);
        setActive(res.data.react || '0');
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const clickReact = (value) => {
    const newActive = active === value ? '0' : value;
    setActive(newActive);
    Api.postReact(params.id, newActive).catch(() => {});
  };

  const handleComment = async () => {
    if (!inputStr.trim()) return;
    try {
      await Api.postComment(params.id, inputStr);
      setListComment([...listComment, { user: { avatar, name }, content: inputStr }]);
      setInputStr('');
    } catch {}
  };

  const formatDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch { return d; }
  };

  return (
    <PageWrapper>
      {!loaded && <div className="loader_container"><div className="loader_spinner" /></div>}

      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link href="/posts" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-500 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại bài viết
        </Link>

        {post && (
          <>
            {/* Article */}
            <article className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 leading-tight">{post.title}</h1>

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                {post.owner?.avatar ? (
                  <img src={post.owner.avatar} alt={post.owner.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-orange-500" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm text-slate-700">{post.owner?.name}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(post.time)}</p>
                </div>
              </div>

              {post.image && (
                <img src={post.image} alt={post.title} className="w-full rounded-xl mb-6 max-h-96 object-cover" />
              )}

              <div className="prose prose-slate max-w-none">
                {lines.map((line, i) => (
                  <p key={i} className="text-slate-600 text-base leading-relaxed mb-2">{line || <br />}</p>
                ))}
              </div>

              {/* Reactions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  {REACTIONS.map(({ id, icon: Icon, color, bg }) => (
                    <button
                      key={id}
                      onClick={() => clickReact(id)}
                      className={`p-2.5 rounded-xl transition-all ${bg} ${active === id ? 'bg-orange-50 ring-2 ring-orange-200' : ''}`}
                    >
                      <Icon className={`w-5 h-5 ${color}`} />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setSaved(!saved)}
                  className={`p-2.5 rounded-xl transition-all hover:bg-slate-100 ${saved ? 'text-orange-500' : 'text-slate-400'}`}
                >
                  <Bookmark className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} />
                </button>
              </div>
            </article>

            {/* Comments */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold text-slate-800 mb-5">Bình luận</h3>

              {/* Input */}
              {name && (
                <div className="flex gap-3 mb-6">
                  {avatar ? (
                    <img src={avatar} alt="you" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center">
                      <User className="w-4 h-4 text-orange-500" />
                    </div>
                  )}
                  <div className="flex-1 relative">
                    <textarea
                      value={inputStr}
                      onChange={(e) => setInputStr(e.target.value)}
                      placeholder="Chia sẻ ý kiến của bạn..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm text-slate-700 resize-none transition-all"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <button onClick={() => setShowPicker(!showPicker)} className="text-slate-400 hover:text-orange-400 text-sm">😊</button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleComment}
                        disabled={!inputStr.trim()}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold disabled:opacity-40 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" /> Gửi
                      </motion.button>
                    </div>
                    {showPicker && (
                      <div className="absolute z-50 bottom-full mb-1">
                        <EmojiPicker onEmojiClick={(e) => { setInputStr(s => s + e.emoji); setShowPicker(false); }} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Comment list */}
              <div className="space-y-4">
                {listComment.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                    {item?.user?.avatar ? (
                      <img src={item.user.avatar} alt={item.user.name} className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    )}
                    <div className="bg-slate-50 rounded-xl px-4 py-3 flex-1">
                      <p className="text-sm font-semibold text-slate-700 mb-1">{item?.user?.name}</p>
                      <p className="text-sm text-slate-600">{item?.content}</p>
                    </div>
                  </motion.div>
                ))}
                {listComment.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-4">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}