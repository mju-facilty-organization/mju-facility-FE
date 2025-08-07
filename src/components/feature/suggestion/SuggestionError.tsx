import React from 'react';

export const SuggestionError: React.FC = () => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <p className="text-red-600">
        데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
      </p>
    </div>
  );
};
