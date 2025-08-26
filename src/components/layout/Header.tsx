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
    <div className="w-full h-28 bg-myongji flex items-center justify-between px-2">
      <div className="flex items-center gap-4">
        {(user?.role === 'STUDENT' || !user) && (
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-blue-700/20"
          >
            <Menu size={26} className="text-white" />
          </button>
        )}
        <Link to="/" className="flex items-center">
          <img className="h-9 sm:h-12" src={logo} alt="명지대학교" />
        </Link>
      </div>
      <AuthButtons />
    </div>
  );
};

export default Header;
