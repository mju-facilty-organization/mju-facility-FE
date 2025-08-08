import React from 'react';
import { Plus, Settings } from 'lucide-react';

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
  const isAdmin = userRole === 'ADMIN';
  const isStudent = userRole === 'STUDENT';

  return (
    <div
      className="text-white p-8 rounded-lg mb-8"
      style={{ background: `linear-gradient(to right, #002e66, #003d80)` }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            건의함 목록
            {isAdmin && (
              <span className="ml-3 text-lg bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                관리자 모드
              </span>
            )}
          </h1>
          <p className="text-blue-100">
            {isAdmin
              ? '학생들의 건의사항을 확인하고 답변을 등록해 주세요.'
              : '재학생 건의사항을 확인하고 적극 활용해 주십시오.'}
          </p>
        </div>

        {isLoggedIn && (
          <div className="flex gap-3">
            {isStudent && (
              <button
                onClick={onCreateButtonClick}
                className="bg-white hover:bg-gray-50 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
                style={{ color: '#002e66' }}
              >
                <Plus size={20} />새 건의사항 작성
              </button>
            )}

            {isAdmin && (
              <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-lg">
                <Settings size={18} />
                <span className="text-sm font-medium">
                  답변 등록 및 상태 관리 가능
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
