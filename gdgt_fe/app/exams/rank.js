'use client';
import { useEffect, useState } from 'react';
import { Medal } from 'lucide-react';
import Api from '../api/api';

export default function Rank({ id }) {
  const [rank, setRank] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Api.getRank(id)
      .then((res) => {
        setRank(res.data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [id]);

  const medalColor = (i) => {
    if (i === 0) return 'text-amber-400';
    if (i === 1) return 'text-slate-400';
    if (i === 2) return 'text-orange-600';
    return 'text-slate-300';
  };

  return (
    <div>
      {!loaded && (
        <div className="loader_container">
          <div className="loader_spinner" />
        </div>
      )}

      <div className="w-full max-h-96 overflow-auto">
        {rank.length === 0 && loaded ? (
          <p className="text-center text-slate-400 py-6 text-sm">Chưa có kết quả nào.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 px-3 text-slate-500 font-medium">#</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Họ tên</th>
                <th className="text-center py-2 px-3 text-slate-500 font-medium">Kết quả</th>
                <th className="text-center py-2 px-3 text-slate-500 font-medium">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {rank.map((item, index) => (
                <tr key={index} className="border-b border-slate-50 hover:bg-orange-50 transition-colors">
                  <td className="py-2.5 px-3">
                    <span className={`font-bold ${medalColor(index)}`}>
                      {index < 3 ? <Medal className="w-4 h-4 inline" /> : null} {index + 1}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-700">{item?.name}</td>
                  <td className="py-2.5 px-3 text-center text-orange-600 font-semibold">
                    {item?.result?.numberCorrect}/{item?.result?.totalQuestion}
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-500">{item?.result?.time}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
