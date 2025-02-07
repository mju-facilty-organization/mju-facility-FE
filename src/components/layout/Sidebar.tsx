import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="h-full bg-white">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-myongji">MJU Space</h1>
      </div>

      <nav className="px-4">
        <div className="space-y-2">
          {!isAdmin && (
            <Link
              to="/student/reservation"
              className="flex items-center px-4 py-3 text-gray-custom text-xl rounded-lg hover:bg-myongji hover:text-white transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              공간 예약하기
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
