import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import {
  Calendar,
  List,
  Building,
  ClipboardList,
  MessageSquare,
  X,
  ChevronDown,
  ChevronRight,
  FileText,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuthStore();
  const { close } = useSidebarStore();
  const sidebarRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    if (!isAdmin) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [close, isAdmin]);

  return (
    <div
      ref={sidebarRef}
      className="h-full w-80 bg-white border-r border-gray-200 rounded-r-xl shadow-sm flex flex-col"
    >
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
      <nav className="px-4 pt-4 flex-1">
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
                  className="w-full flex items-center justify-between px-6 py-4 text-gray-custom text-xl rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <List className="h-5 w-5 mr-3 text-gray-500" />
                    <span className="font-medium">예약 관리</span>
                  </div>
                  {expandedMenus.reservation ? (
                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-myongji transition-colors" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-myongji transition-colors" />
                  )}
                </button>
                {expandedMenus.reservation && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100">
                    <Link
                      to="/admin/reservations"
                      className="flex items-center px-6 py-3 ml-4 text-gray-600 text-lg rounded-lg hover:bg-myongji hover:text-white transition-all duration-200 relative"
                    >
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>
                      예약 리스트
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleMenu('facility')}
                  className="w-full flex items-center justify-between px-6 py-4 text-gray-custom text-xl rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-3 text-gray-500" />
                    <span className="font-medium">시설 관리</span>
                  </div>
                  {expandedMenus.facility ? (
                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-myongji transition-colors" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-myongji transition-colors" />
                  )}
                </button>
                {expandedMenus.facility && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100">
                    <Link
                      to="/admin/facilities"
                      className="flex items-center px-6 py-3 ml-4 text-gray-600 text-lg rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
                    >
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>
                      시설 목록
                    </Link>
                    <Link
                      to="/admin/facilities/create"
                      className="flex items-center px-6 py-3 ml-4 text-gray-600 text-lg rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
                    >
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>
                      시설 생성
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleMenu('schedule')}
                  className="w-full flex items-center justify-between px-6 py-4 text-gray-custom text-xl rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                    <span className="font-medium">스케줄 관리</span>
                  </div>
                  {expandedMenus.schedule ? (
                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-myongji transition-colors" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-myongji transition-colors" />
                  )}
                </button>
                {expandedMenus.schedule && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100">
                    <Link
                      to="/admin/schedules"
                      className="flex items-center px-6 py-3 ml-4 text-gray-600 text-lg rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
                    >
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>
                      시설 스케줄
                    </Link>
                    <Link
                      to="/admin/schedules/regular"
                      className="flex items-center px-6 py-3 ml-4 text-gray-600 text-lg rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
                    >
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>
                      정기 스케줄 생성
                    </Link>
                    <Link
                      to="/admin/schedules/uploadExcel"
                      className="flex items-center px-6 py-3 ml-4 text-gray-600 text-lg rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
                    >
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>
                      시간표 등록
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/admin/notice"
                className="flex items-center px-6 py-4 text-gray-custom text-xl rounded-lg hover:bg-myongji hover:text-white transition-all duration-200 mt-4"
              >
                <FileText className="h-5 w-5 mr-3 text-gray-500" />
                <span className="font-medium">공지사항</span>
              </Link>

              <Link
                to="/suggestions"
                className="flex items-center px-6 py-4 text-gray-custom text-xl rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
              >
                <MessageSquare className="h-5 w-5 mr-3 text-gray-500" />
                <span className="font-medium">건의함</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
