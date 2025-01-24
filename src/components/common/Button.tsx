interface ButtonProps {
  variant: 'primary' | 'secondary';
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button = ({
  variant,
  type = 'button',
  onClick,
  disabled,
  children,
}: ButtonProps) => {
  const styles = {
    primary: `bg-myongji text-white hover:bg-opacity-90 focus:ring-myongji ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`,
    secondary: 'text-gray-custom border border-[#DBDBDB] hover:text-gray-800',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-4 text-2xl rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
