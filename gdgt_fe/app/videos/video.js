import Link from 'next/link';
import { Play, User } from 'lucide-react';

export default function Video({ id, title, avatar, youtubeId }) {
  return (
    <Link href={`videos/detail/${id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all group cursor-pointer">
        <div className="relative aspect-video bg-slate-200">
          <img
            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow">
              <Play className="w-4 h-4 text-white ml-0.5" />
            </div>
          </div>
        </div>
        <div className="p-3 flex gap-2 items-start">
          {avatar ? (
            <img src={avatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0 object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-orange-500" />
            </div>
          )}
          <p className="text-sm font-semibold text-slate-700 line-clamp-2 group-hover:text-orange-500 transition-colors leading-snug">
            {title}
          </p>
        </div>
      </div>
    </Link>
  );
}