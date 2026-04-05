'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, X, Clock, ClipboardList, Trophy, Trash2, Edit } from 'lucide-react';
import PageWrapper from '@/components/ui/PageWrapper';
import SectionTitle from '@/components/ui/SectionTitle';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Toast from '@/components/ui/Toast';
import Api from '../api/api';
import AddExam from './FormAddExam';
import Rank from './rank';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const getDifficultyColor = (time) => {
  if (time <= 10) return 'green';
  if (time <= 20) return 'amber';
  return 'red';
};
const getDifficultyLabel = (time) => {
  if (time <= 10) return 'Dễ';
  if (time <= 20) return 'Trung bình';
  return 'Khó';
};

export default function Exams() {
  const [tab, setTab] = useState(0);
  const [listExams, setListExams] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rankExam, setRankExam] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try { setIsAdmin(localStorage.getItem('account') === 'admin'); } catch {}
    Api.getListExams().then((res) => {
      setListExams(res.data);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Bạn có chắc muốn xóa đề thi này?')) return;
    try {
      await Api.deleteExam(id);
      setListExams(prev => prev.filter(ex => ex.id !== id));
      setToast({ message: 'Xóa đề thi thành công!', type: 'success' });
    } catch {
      setToast({ message: 'Xóa đề thi thất bại!', type: 'error' });
    }
  };

  const [editingExam, setEditingExam] = useState(null);

  const handleEdit = (e, exam) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingExam(exam);
    setShowForm(true);
  };

  return (
    <PageWrapper>
      {!loaded && (
        <div className="loader_container">
          <div className="loader_spinner" />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8" style={{ borderBottom: '2px solid var(--card-border)' }}>
          {['Danh sách đề thi', 'Kết quả của tôi'].map((label, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              className={`px-5 py-3 text-sm font-bold transition-all relative`}
              style={{ color: tab === i ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              {label}
              {tab === i && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--primary)' }} />
              )}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <SectionTitle subtitle="Bài kiểm tra an toàn giao thông">Đề Thi</SectionTitle>
              {isAdmin && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-sm transition-all"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <Plus className="w-4 h-4" /> Thêm bài thi
                </motion.button>
              )}
            </div>

            {/* Form Modal */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(26,43,74,0.5)' }} />
                <div className="relative z-10 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setShowForm(false)} className="absolute -top-3 -right-3 p-1.5 bg-white rounded-full shadow-lg text-slate-500 z-20">
                    <X className="w-4 h-4" />
                  </button>
                  <AddExam
                    handleClose={() => {
                        setShowForm(false);
                        setEditingExam(null);
                    }}
                    editingExam={editingExam}
                    onSuccess={(exam) => {
                      if (exam) {
                        if (editingExam) {
                          setListExams(prev => prev.map(ex => ex.id === exam.id ? exam : ex));
                          setToast({ message: 'Cập nhật đề thi thành công!', type: 'success' });
                        } else {
                          setListExams((prev) => [...prev, exam]);
                          setToast({ message: 'Thêm bài thi thành công!', type: 'success' });
                        }
                      } else {
                        setToast({ message: editingExam ? 'Cập nhật thất bại!' : 'Thêm bài thi thất bại!', type: 'error' });
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Rank Modal */}
            {rankExam && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setRankExam(null)}>
                <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(26,43,74,0.5)' }} />
                <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> Bảng xếp hạng</h3>
                    <button onClick={() => setRankExam(null)} className="p-1 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button>
                  </div>
                  <Rank id={rankExam} />
                </div>
              </div>
            )}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={loaded ? 'show' : 'hidden'}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {listExams.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Card className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-xl" style={{ background: 'color-mix(in srgb, var(--primary) 10%, white)' }}>
                        <ClipboardList className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                      </div>
                      <Badge color={getDifficultyColor(item.time)}>
                        {getDifficultyLabel(item.time)}
                      </Badge>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => handleEdit(e, item)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-500 transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, item.id)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-800 text-base mb-2 flex-1">{item.name}</h3>
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{item.time} phút</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/exams/${item.id}`} className="flex-1">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-sm transition-all"
                          style={{ backgroundColor: 'var(--primary)' }}
                        >
                          Làm bài thi
                        </motion.button>
                      </Link>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setRankExam(item.id)}
                        className="py-2.5 px-4 rounded-xl border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold text-sm transition-all flex items-center gap-1"
                      >
                        <Trophy className="w-4 h-4" /> Xếp hạng
                      </motion.button>
                    </div>
                  </Card>
                </motion.div>
              ))}
              {loaded && listExams.length === 0 && (
                <div className="col-span-2 text-center py-16 text-slate-400">
                  <p>Chưa có đề thi nào.</p>
                </div>
              )}
            </motion.div>
          </>
        )}

        {tab === 1 && (
          <div className="text-center py-20 text-slate-400">
            <Trophy className="w-14 h-14 mx-auto mb-4 text-amber-300" />
            <p className="text-lg font-medium text-slate-600 mb-2">Kết quả của bạn</p>
            <p className="text-sm">Tham gia bài thi để xem kết quả ở đây.</p>
            <Link href="/exams" onClick={() => setTab(0)}>
              <button className="mt-6 px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all"
                style={{ backgroundColor: 'var(--primary)' }}>
                Xem đề thi
              </button>
            </Link>
          </div>
        )}
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </PageWrapper>
  );
}