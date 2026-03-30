'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, User } from 'lucide-react';
import PageWrapper from '@/components/ui/PageWrapper';
import SectionTitle from '@/components/ui/SectionTitle';
import Toast from '@/components/ui/Toast';
import Api from '../api/api';

export default function Info() {
  const [isChanged, setIsChanged] = useState(false);
  const [toast, setToast] = useState(null);
  const [gender, setGender] = useState(true);
  const [avt, setAvt] = useState('');
  const [file, setFile] = useState(null);
  const [isPosting, setIsPosting] = useState(true);
  const [names, setName] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [classs, setClass] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    Api.getInfo().then((res) => {
      setAvt(res.data.avatar || '');
      setGender(res.data.gender);
      setName(res.data.name || '');
      setPassword(res.data.password || '');
      setSchool(res.data.school || '');
      setClass(res.data.ofClass || '');
      setEmail(res.data.email || '');
    }).catch(console.log);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => setAvt(reader.result);
    reader.readAsDataURL(selectedFile);
    setIsPosting(false);
  };

  const handleChangeAvt = async () => {
    if (!file) return;
    setIsPosting(true);
    try {
      const res = await Api.PostImage(file);
      await Api.updateAvatar(res.data.url);
      // Update localStorage + notify Header to re-render
      localStorage.setItem('avatar', res.data.url);
      window.dispatchEvent(new CustomEvent('auth-update'));
      setAvt(res.data.url);
      setFile(null);
      setToast({ message: 'Đổi ảnh đại diện thành công!', type: 'success' });
    } catch {
      setToast({ message: 'Lỗi khi đổi ảnh, thử lại!', type: 'error' });
    } finally { setIsPosting(false); }
  };

  const updateInfo = async () => {
    setIsChanged(false);
    try {
      await Api.updateInfo(email, password, names, school, avt, gender, classs);
      // Update name in localStorage + notify Header
      localStorage.setItem('user', names);
      window.dispatchEvent(new CustomEvent('auth-update'));
      setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
    } catch {
      setToast({ message: 'Cập nhật thất bại, thử lại!', type: 'error' });
    }
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm text-slate-700 transition-all';

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <SectionTitle subtitle="Quản lý thông tin cá nhân">Hồ Sơ Của Tôi</SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Avatar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center gap-5">
            <h3 className="font-bold text-slate-700 text-base">Ảnh đại diện</h3>
            <div className="relative">
              {avt ? (
                <img src={avt} alt="avatar" className="w-48 h-48 rounded-full object-cover border-4 border-orange-100 shadow-md" />
              ) : (
                <div className="w-48 h-48 rounded-full bg-orange-50 border-4 border-orange-100 flex items-center justify-center">
                  <User className="w-20 h-20 text-orange-200" />
                </div>
              )}
              <label className="absolute bottom-2 right-2 p-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer shadow-lg transition-all">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleChangeAvt}
              disabled={isPosting}
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all disabled:opacity-50"
            >
              Cập nhật ảnh
            </motion.button>
          </div>

          {/* Info form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-4">
            <h3 className="font-bold text-slate-700 text-base mb-5">Thông tin cá nhân</h3>

            {[
              { label: 'Email', value: email, set: setEmail },
              { label: 'Mật khẩu', value: password, set: setPassword, type: 'password' },
              { label: 'Họ tên', value: names, set: setName },
              { label: 'Trường', value: school, set: setSchool },
              { label: 'Lớp', value: classs, set: setClass },
            ].map(({ label, value, set, type = 'text' }) => (
              <div key={label}>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
                <input
                  type={type}
                  value={value || ''}
                  onChange={(e) => { set(e.target.value); setIsChanged(true); }}
                  className={inputClass}
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Giới tính</label>
              <select
                value={gender ? 'Nam' : 'Nữ'}
                onChange={(e) => { setGender(e.target.value === 'Nam'); setIsChanged(true); }}
                className={inputClass}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={updateInfo}
              disabled={!isChanged}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all disabled:opacity-40 flex items-center justify-center gap-2 mt-2"
            >
              <Save className="w-4 h-4" /> Lưu thay đổi
            </motion.button>
          </div>
        </div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </PageWrapper>
  );
}