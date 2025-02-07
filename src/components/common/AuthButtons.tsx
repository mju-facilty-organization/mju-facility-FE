import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import NavButton from '@/components/common/NavButton';

const AuthButtons = () => {
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
          <span className="text-gray-custom text-2xl ">{user?.name}님</span>
          <NavButton onClick={handleLogout}>로그아웃</NavButton>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <NavButton to="/login">로그인</NavButton>
          <span className="text-gray-custom text-2xl ">|</span>
          <NavButton to="/privacy-agreement">회원가입</NavButton>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;
