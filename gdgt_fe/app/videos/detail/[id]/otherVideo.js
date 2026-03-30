import Link from 'next/link';
import { User } from 'lucide-react';

export default function Other({ id, title, youtubeId, name, avatar }) {
  return (
    <Link href={`/videos/detail/${id}`}>
      <div className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer mb-1">
        <div className="relative w-28 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200">
          <img
            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-700 line-clamp-2 leading-snug mb-1">{title}</p>
          <div className="flex items-center gap-1.5">
            {avatar ? (
              <img src={avatar} alt={name} className="w-4 h-4 rounded-full object-cover" />
            ) : (
              <User className="w-3 h-3 text-slate-400" />
            )}
            <span className="text-xs text-slate-400 italic">{name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}