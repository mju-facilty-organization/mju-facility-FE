import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthButtons() {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="mr-6">
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <span className="text-[#656565] text-lg font-['ABeeZee']">
            {user?.name}님
          </span>
          <button
            onClick={handleLogout}
            className="text-[#656565] text-lg font-['ABeeZee'] hover:underline transition-colors"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-[#656565] text-lg font-['ABeeZee'] hover:underline transition-colors"
          >
            로그인
          </Link>
          <span className="text-[#656565] text-lg font-['ABeeZee']">|</span>
          <Link
            to="/register"
            className="text-[#656565] text-lg font-['ABeeZee'] hover:underline transition-colors"
          >
            회원가입
          </Link>
        </div>
      )}
    </div>
  );
}
