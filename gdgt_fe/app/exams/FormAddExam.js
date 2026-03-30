'use client';
import * as XLSX from 'xlsx';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Plus } from 'lucide-react';
import Api from '../api/api';

export default function AddExam({ handleClose }) {
  const [name, setName] = useState('');
  const [max, setMax] = useState('');
  const [time, setTime] = useState('');
  const [data, setData] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      setData(XLSX.utils.sheet_to_json(ws, { header: 1 }));
    };
    reader.readAsBinaryString(file);
  };

  const handleAddExam = async () => {
    setIsDisabled(true);
    const exam = [];
    for (let i = 2; i < data.length; i++) {
      const answer = data[i][5].toUpperCase();
      const answer_ = answer === 'A' ? 1 : answer === 'B' ? 2 : answer === 'C' ? 3 : 4;
      exam.push({ question: data[i][0], choice1: data[i][1], choice2: data[i][2], choice3: data[i][3], choice4: data[i][4] + '', answer: answer_ + '' });
    }
    try {
      const res = await Api.postExam(name, parseInt(time), parseInt(max), exam);
      if (res.status === 200) {
        alert('Thêm thành công');
        handleClose();
      }
    } catch {
      alert('Thêm thất bại');
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
      <h3 className="font-bold text-slate-800 text-lg mb-5">Thêm bài thi mới</h3>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Tên bài thi</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên bài kiểm tra an toàn giao thông..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm text-slate-700 transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Số lần làm tối đa</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm text-slate-700 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Thời gian (phút)</label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm text-slate-700 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-green-600" /> File đề thi (.xlsx)
          </label>
          <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-orange-300 cursor-pointer transition-all">
            <FileSpreadsheet className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-400">{data.length > 0 ? `${data.length - 2} câu đã tải` : 'Chọn file Excel...'}</span>
            <input type="file" accept=".xlsx" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </div>

      {/* Preview table */}
      {data.length > 0 && (
        <div className="max-h-40 overflow-auto rounded-xl border border-slate-100 mb-4">
          <table className="w-full text-xs">
            <tbody>
              {data.slice(0, 5).map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-2 py-1 text-slate-600 border-b border-slate-100 truncate max-w-20">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={handleClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all">
          Hủy
        </button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddExam}
          disabled={isDisabled || !name || !time || data.length === 0}
          className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {isDisabled ? 'Đang thêm...' : 'Thêm bài thi'}
        </motion.button>
      </div>
    </div>
  );
}