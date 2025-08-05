import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';
import AuthButtons from '@/components/common/AuthButtons';
import { Menu } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useSidebarStore } from '@/store/useSidebarStore';

const Header = () => {
  const { user } = useAuthStore();
  const { toggle } = useSidebarStore();
  return (
    <>
      <div className="w-full h-32 bg-myongji">
        <Link to="/" className="h-full flex items-center ml-6">
          <img className="h-16" src={logo} alt="명지대학교" />
        </Link>
      </div>
      <div className="w-full h-14 flex items-center bg-white px-6">
        {(user?.role === 'STUDENT' || !user) && (
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu size={24} className="text-gray-custom" />
          </button>
        )}
        <div className="ml-auto">
          <AuthButtons />
        </div>
      </div>
    </>
  );
};
export default Header;
