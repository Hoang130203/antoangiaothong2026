import Link from 'next/link';
import { User, Clock } from 'lucide-react';

export default function Post({ id, title, image, time, username, useravatar }) {
  if (!image || image.length === 0)
    image = 'https://i1-vnexpress.vnecdn.net/2024/02/06/VNE-Bridge-6840-1707217751.jpg?w=1020&h=0&q=100&dpr=1&fit=crop&s=CReOm7XfMKVaTMfMHrzOKQ';
  if (!useravatar || useravatar.length === 0)
    useravatar = 'https://genk.mediacdn.vn/2020/1/2/photo-1-1577935737189597218219.jpg';

  const dateStr = time ? time.substring(0, 10) : '';

  return (
    <div
      className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
      style={{ height: '300px', background: `url("${image}") center/cover no-repeat` }}
    >
      <Link href={`/posts/detail/${id}`} className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="inline-block px-2 py-0.5 bg-orange-500 text-white text-xs font-semibold rounded-md mb-2">
            An toàn giao thông
          </span>
          <h3 className="text-white font-bold text-base leading-snug line-clamp-2 mb-3">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={useravatar} alt={username} className="w-7 h-7 rounded-full border-2 border-white/50 object-cover" />
              <span className="text-white/90 text-xs font-medium">{username}</span>
            </div>
            <div className="flex items-center gap-1 text-white/70 text-xs">
              <Clock className="w-3 h-3" />
              {dateStr}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}