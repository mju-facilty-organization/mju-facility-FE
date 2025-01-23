import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';
import AuthButtons from '@/components/common/AuthButtons';

const Header = () => {
  return (
    <>
      <div className="w-full h-32 bg-myongji shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex">
        <Link to="/" className="ml-6 my-auto">
          <img className="h-16" src={logo} alt="명지대학교" />
        </Link>
      </div>
      <div className="w-full h-14 flex justify-end items-center  bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <AuthButtons />
      </div>
    </>
  );
};
export default Header;
