import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import NavButton from '@/components/common/NavButton';
import { useGetCurrentMember } from '@/hooks/useMember';
import { useEffect } from 'react';

const AuthButtons = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, updateUser } = useAuthStore();

  const { data: memberData, isLoading } = useGetCurrentMember();

  useEffect(() => {
    if (
      !memberData?.data?.name ||
      !isLoggedIn ||
      !user ||
      user.name === memberData.data.name
    ) {
      return;
    }

    updateUser({
      ...user,
      name: memberData.data.name,
      id: memberData.data.id.toString(),
    });
  }, [memberData, isLoggedIn, user, updateUser]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="mr-6">
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          {isLoading ? (
            <span className="text-gray-custom text-2xl">로딩 중...</span>
          ) : (
            <span className="text-gray-custom text-2xl">
              {memberData?.data?.name || user?.name || ''}님
            </span>
          )}
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
