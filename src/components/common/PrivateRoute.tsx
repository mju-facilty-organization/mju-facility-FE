import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface PrivateRouteProps {
  children: React.ReactNode;
  role: 'STUDENT' | 'ADMIN';
}

const PrivateRoute = ({ children, role }: PrivateRouteProps) => {
  const { isLoggedIn, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || user?.role !== role) {
      navigate('/login');
    }
  }, [isLoggedIn, user, role, navigate]);

  return <>{children}</>;
};

export default PrivateRoute;
