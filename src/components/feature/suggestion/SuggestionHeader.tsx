import React from 'react';
import { Plus } from 'lucide-react';

type SuggestionHeaderProps = {
  isLoggedIn: boolean;
  userRole?: string;
  onCreateButtonClick: () => void;
};

export const SuggestionHeader: React.FC<SuggestionHeaderProps> = ({
  isLoggedIn,
  userRole,
  onCreateButtonClick,
}) => {
  return (
    <div
      className="text-white p-8 rounded-lg mb-8"
      style={{ background: `linear-gradient(to right, #002e66, #003d80)` }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">건의함 목록</h1>
          <p className="text-blue-100">
            재학생 건의사항을 확인하고 적극 활용해 주십시오.
          </p>
        </div>
        {isLoggedIn && userRole === 'STUDENT' && (
          <button
            onClick={onCreateButtonClick}
            className="bg-white hover:bg-gray-50 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
            style={{ color: '#002e66' }}
          >
            <Plus size={20} />새 건의사항 작성
          </button>
        )}
      </div>
    </div>
  );
};
