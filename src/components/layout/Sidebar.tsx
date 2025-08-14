import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import {
  Calendar,
  List,
  Building,
  Building2,
  ClipboardList,
  MessageSquare,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuthStore();
  const { close } = useSidebarStore();
  const isAdmin = user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

  const [expandedMenus, setExpandedMenus] = useState<{
    reservation: boolean;
    facility: boolean;
    schedule: boolean;
  }>({
    reservation: false,
    facility: false,
    schedule: false,
  });

  const toggleMenu = (menuKey: keyof typeof expandedMenus) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  return (
    <div className="min-h-screen w-80 bg-white border-r border-gray-200 rounded-r-xl shadow-sm">
      <div className="flex justify-between items-center px-6 py-8">
        <h1 className="text-2xl font-bold text-myongji">MJU Space</h1>
        {!isAdmin && (
          <button
            onClick={close}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {user && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-myongji rounded-full flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {user.name || '사용자'}
              </p>
              <p className="text-sm text-gray-500">
                {isAdmin ? '관리자' : isStudent ? '학생' : '게스트'}
              </p>
            </div>
          </div>
        </div>
      )}
      <nav className="px-4 pt-4">
        <div className="space-y-2">
          {!user && (
            <>
              <Link
                to="/reservation"
                className="flex items-center px-6 py-4 text-gray-custom text-xl rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
              >
                <Calendar className="h-5 w-5 mr-3" />
                공간 예약하기
              </Link>

              <Link
                to="/suggestions"
                className="flex items-center px-6 py-4 text-gray-custom text-xl rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                건의함
              </Link>
            </>
          )}

          {isStudent && (
            <>
              <Link
                to="/reservation"
                className="flex items-center px-6 py-4 text-gray-custom text-xl rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
              >
                <Calendar className="h-5 w-5 mr-3" />
                공간 예약하기
              </Link>

              <Link
                to="/my-reservations"
                className="flex items-center px-6 py-4 text-gray-custom text-xl rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
              >
                <ClipboardList className="h-5 w-5 mr-3" />내 예약 내역
              </Link>

              <Link
                to="/suggestions"
                className="flex items-center px-6 py-4 text-gray-custom text-xl rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                건의함
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <div>
                <button
                  onClick={() => toggleMenu('reservation')}
                  className="w-full flex items-center justify-between px-6 py-4 text-gray-custom text-xl rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <List className="h-5 w-5 mr-3" />
                    예약
                  </div>
                  {expandedMenus.reservation ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedMenus.reservation && (
                  <div className="ml-6 mt-1 space-y-1">
                    <Link
                      to="/admin/reservations"
                      className="flex items-center px-6 py-3 text-gray-custom text-lg rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
                    >
                      <List className="h-4 w-4 mr-3" />
                      예약 리스트
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleMenu('facility')}
                  className="w-full flex items-center justify-between px-6 py-4 text-gray-custom text-xl rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-3" />
                    시설
                  </div>
                  {expandedMenus.facility ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedMenus.facility && (
                  <div className="ml-6 mt-1 space-y-1">
                    <Link
                      to="/admin/facilities"
                      className="flex items-center px-6 py-3 text-gray-custom text-lg rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
                    >
                      <Building className="h-4 w-4 mr-3" />
                      시설 목록
                    </Link>
                    <Link
                      to="/admin/facilities/create"
                      className="flex items-center px-6 py-3 text-gray-custom text-lg rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
                    >
                      <Building2 className="h-4 w-4 mr-3" />
                      시설 생성
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleMenu('schedule')}
                  className="w-full flex items-center justify-between px-6 py-4 text-gray-custom text-xl rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3" />
                    스케줄
                  </div>
                  {expandedMenus.schedule ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedMenus.schedule && (
                  <div className="ml-6 mt-1 space-y-1">
                    <Link
                      to="/admin/schedules"
                      className="flex items-center px-6 py-3 text-gray-custom text-lg rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
                    >
                      <Calendar className="h-4 w-4 mr-3" />
                      시설 스케줄
                    </Link>
                    <Link
                      to="/admin/schedules/regular"
                      className="flex items-center px-6 py-3 text-gray-custom text-lg rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
                    >
                      <Calendar className="h-4 w-4 mr-3" />
                      정기 스케줄 생성
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/suggestions"
                className="flex items-center px-6 py-4 text-gray-custom text-xl rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                건의함
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
