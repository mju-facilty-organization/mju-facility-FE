import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Calendar, List, Building, ClipboardList } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

  return (
    <div className="min-h-screen w-80 bg-white border-r border-gray-200">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-myongji">MJU Space</h1>
      </div>

      <nav className="px-4">
        <div className="space-y-2">
          {isStudent && (
            <>
              <Link
                to="/student/reservation"
                className="flex items-center px-4 py-3 text-gray-custom text-xl rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
              >
                <Calendar className="h-5 w-5 mr-3" />
                공간 예약하기
              </Link>

              <Link
                to="/student/my-reservations"
                className="flex items-center px-4 py-3 text-gray-custom text-xl rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
              >
                <ClipboardList className="h-5 w-5 mr-3" />내 예약 내역
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin/facilities"
                className="flex items-center px-4 py-3 text-gray-custom text-xl rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
              >
                <Building className="h-5 w-5 mr-3" />
                시설 관리
              </Link>

              <Link
                to="/admin/reservations"
                className="flex items-center px-4 py-3 text-gray-custom text-xl rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
              >
                <List className="h-5 w-5 mr-3" />
                시설 예약 리스트
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
