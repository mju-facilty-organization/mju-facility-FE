import { Link } from 'react-router-dom';

interface NavButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  className?: string;
}

const NavButton = ({
  children,
  onClick,
  to,
  className = '',
}: NavButtonProps) => {
  const baseStyle = 'text-[#656565] text-2xl hover:underline transition-colors';

  if (to) {
    return (
      <Link to={to} className={`${baseStyle} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseStyle} ${className}`}>
      {children}
    </button>
  );
};

export default NavButton;
