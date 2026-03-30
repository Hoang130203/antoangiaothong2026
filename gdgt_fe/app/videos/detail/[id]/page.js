'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/ui/PageWrapper';
import Api from '../../../api/api';

function OtherVideoCard({ id, title, youtubeId, name, avatar }) {
  return (
    <Link href={`/videos/detail/${id}`}>
      <motion.div
        whileHover={{ x: 2 }}
        className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
      >
        <div className="relative w-28 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200">
          <img src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-700 line-clamp-2 leading-snug mb-1">{title}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            {avatar ? <img src={avatar} alt="" className="w-4 h-4 rounded-full" /> : <User className="w-3 h-3" />}
            {name}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

export default function DetailVideo({ params }) {
  const [video, setVideo] = useState({});
  const [otherVideos, setOtherVideos] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Api.getVideoById(params.id).then((res) => {
      setVideo(res?.data);
      setLoaded(true);
    });
    Api.getAllVideo().then((res) => {
      setOtherVideos(res.data?.slice(0, 6) || []);
    });
  }, []);

  return (
    <PageWrapper>
      {!loaded && <div className="loader_container"><div className="loader_spinner" /></div>}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/videos" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-500 text-sm mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại video
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main video */}
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl overflow-hidden shadow-lg mb-4">
              {video?.youtubeId && (
                <LiteYouTubeEmbed
                  id={video.youtubeId}
                  title={video.title || 'Video an toàn giao thông'}
                  defaultPlay
                  params={{ autoplay: 1, modestbranding: 1 }}
                />
              )}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h1 className="text-lg font-bold text-slate-800 mb-3 leading-snug">{video?.title}</h1>
              {video?.owner && (
                <div className="flex items-center gap-3">
                  {video.owner.avatar ? (
                    <img src={video.owner.avatar} alt={video.owner.name} className="w-9 h-9 rounded-full border-2 border-orange-200 object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-orange-500" />
                    </div>
                  )}
                  <span className="font-semibold text-slate-700 text-sm italic">{video.owner.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <h3 className="font-bold text-slate-700 text-sm mb-3 px-1">Video khác</h3>
              <div className="space-y-1">
                {otherVideos.map((item) => (
                  <OtherVideoCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    youtubeId={item.youtubeId}
                    name={item.owner?.name}
                    avatar={item.owner?.avatar}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}