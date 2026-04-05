'use client';
import * as XLSX from 'xlsx';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Plus, Download } from 'lucide-react';
import Api from '../api/api';

export default function AddExam({ handleClose, onSuccess, editingExam }) {
  const [name, setName] = useState(editingExam ? editingExam.name : '');
  const [max, setMax] = useState(editingExam ? editingExam.maxTimes : '');
  const [time, setTime] = useState(editingExam ? editingExam.time : '');
  const [data, setData] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['Câu hỏi', 'Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D', 'Đáp án đúng'],
      ['(Hướng dẫn: điền câu hỏi, 4 đáp án, cột cuối là A/B/C/D)', '', '', '', '', ''],
      ['Khi đi bộ sang đường, bạn nên làm gì?', 'Nhìn trái rồi phải rồi mới đi', 'Chạy thật nhanh qua đường', 'Đi thẳng không cần nhìn', 'Đứng giữa đường chờ xe', 'A'],
      ['Tốc độ tối đa trong khu dân cư là bao nhiêu?', '30 km/h', '40 km/h', '50 km/h', '60 km/h', 'C'],
    ]);
    ws['!cols'] = [{ wch: 40 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 15 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DeThi');
    XLSX.writeFile(wb, 'template_de_thi.xlsx');
  };

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
    if (data.length > 0) {
      for (let i = 2; i < data.length; i++) {
        const answer = data[i][5].toUpperCase();
        const answer_ = answer === 'A' ? 1 : answer === 'B' ? 2 : answer === 'C' ? 3 : 4;
        exam.push({ question: data[i][0], choice1: data[i][1], choice2: data[i][2], choice3: data[i][3], choice4: data[i][4] + '', answer: answer_ + '' });
      }
    }
    try {
      let res;
      if (editingExam) {
        // For update, we might allow skipping re-uploading file if data is empty, 
        // but the backend logic currently deletes/re-adds questions. 
        // We'll proceed assuming user uploads file for questions.
        res = await Api.updateExam(editingExam.id, { ...editingExam, name, time: parseInt(time), maxTimes: parseInt(max), questions: exam });
      } else {
        res = await Api.postExam(name, parseInt(time), parseInt(max), exam);
      }
      const newExam = {
        id: editingExam?.id || res?.data?.id || Date.now(),
        name,
        time: parseInt(time),
        maxTimes: parseInt(max),
      };
      if (onSuccess) onSuccess(newExam);
      handleClose();
    } catch {
      if (onSuccess) onSuccess(null);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-slate-800 text-lg">{editingExam ? 'Cập nhật đề thi' : 'Thêm bài thi mới'}</h3>
        <button
          type="button"
          onClick={downloadTemplate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium transition-all"
        >
          <Download className="w-3.5 h-3.5" /> Tải file mẫu
        </button>
      </div>

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
          disabled={isDisabled || !name || !time || (editingExam ? false : data.length === 0)}
          className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {isDisabled ? (editingExam ? 'Đang cập nhật...' : 'Đang thêm...') : (editingExam ? 'Cập nhật đề thi' : 'Thêm bài thi')}
        </motion.button>
      </div>
    </div>
  );
}