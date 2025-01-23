interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton = ({ isActive, onClick, children }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 pb-4 text-[22px] font-medium border-b-2 transition-colors
          ${
            isActive
              ? 'border-myongji text-myongji'
              : 'border-transparent text-gray-custom'
          }`}
    >
      {children}
    </button>
  );
};

export default TabButton;
