import PageWrapper from '@/components/ui/PageWrapper';
import SectionTitle from '@/components/ui/SectionTitle';

const MOCK_FRIENDS = [
  { name: 'Bạn bè 1', avatar: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Bạn bè 2', avatar: 'https://i.pravatar.cc/150?img=2' },
  { name: 'Bạn bè 3', avatar: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Bạn bè 4', avatar: 'https://i.pravatar.cc/150?img=4' },
  { name: 'Bạn bè 5', avatar: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Bạn bè 6', avatar: 'https://i.pravatar.cc/150?img=6' },
];

export default function Friend() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <SectionTitle subtitle="Danh sách bạn bè">Bạn Bè</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_FRIENDS.map((friend, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
            >
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-orange-100"
              />
              <div>
                <p className="font-semibold text-slate-700">{friend.name}</p>
                <p className="text-xs text-slate-400">Thành viên</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}