'use client';
import { FileText, ExternalLink } from 'lucide-react';
import PageWrapper from '@/components/ui/PageWrapper';
import SectionTitle from '@/components/ui/SectionTitle';

const documents = [
  {
    title: 'Luật Giao thông đường bộ 2008 (hợp nhất 2023)',
    href: 'https://docs.google.com/document/d/1qbKrV_yOQYZTkntZiv_12ACwAGXbk2to/edit',
  },
  {
    title: 'Cẩm nang an toàn giao thông cho học sinh, sinh viên',
    href: 'https://docs.google.com/document/d/1eO-Jz4qvzqOg2q7PID2UfCZSKzWFsGD9/edit',
  },
  {
    title: 'Quy tắc ứng xử khi tham gia giao thông',
    href: 'https://docs.google.com/document/d/13T8Nn-lmpZ1k_fl2K_ssi6W-TdlyhHyC/edit',
  },
  {
    title: 'Hướng dẫn xử lý tình huống nguy hiểm khi tham gia giao thông',
    href: 'https://docs.google.com/document/d/13V8ltZcoTkxXLXxOh0Tm3YrPbv3uhqAe/edit',
  },
  {
    title: 'Biển báo giao thông đường bộ — Ôn thi sát hạch lái xe',
    href: 'https://docs.google.com/document/d/1lc26ysrPB0BLiAC4ApvChAkcUp_5qB6K/edit#heading=h.gjdgxs',
  },
  {
    title: 'Kỹ năng lái xe an toàn trong điều kiện thời tiết xấu',
    href: 'https://docs.google.com/document/d/1mRvq627jSGjYoGgmET4ZK3emSW4nW3KA/edit#heading=h.gjdgxs',
  },
  {
    title: 'Tổng hợp câu hỏi và đáp án thi sát hạch lái xe A1, B1, B2',
    href: 'https://docs.google.com/document/d/1ry3y8YdZW50b4pnQC197El3GOhvb_YhK/edit',
  },
];

export default function Document() {
  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <SectionTitle subtitle="Tài liệu tham khảo về an toàn giao thông">Tài Liệu</SectionTitle>

        <div className="space-y-3 mt-6">
          {documents.map((doc, index) => (
            <a
              key={index}
              href={doc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-orange-200 transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-orange-50 flex-shrink-0">
                <FileText className="w-5 h-5 text-orange-500" />
              </div>
              <span className="flex-1 text-sm font-medium text-slate-700 group-hover:text-orange-600 transition-colors">
                {index + 1}. {doc.title}
              </span>
              <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-orange-400 flex-shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
