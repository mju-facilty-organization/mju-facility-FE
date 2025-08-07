import React from 'react';

type SuggestionStatisticsProps = {
  total: number;
  received: number;
  inReview: number;
  completed: number;
};

export const SuggestionStatistics: React.FC<SuggestionStatisticsProps> = ({
  total,
  received,
  inReview,
  completed,
}) => {
  return (
    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <div className="text-sm text-gray-600 mb-2">전체 건의사항</div>
        <div className="text-3xl font-bold" style={{ color: '#002e66' }}>
          {total}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <div className="text-sm text-gray-600 mb-2">접수됨</div>
        <div className="text-3xl font-bold" style={{ color: '#002e66' }}>
          {received}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <div className="text-sm text-gray-600 mb-2">검토중</div>
        <div className="text-3xl font-bold text-orange-600">{inReview}</div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <div className="text-sm text-gray-600 mb-2">완료</div>
        <div className="text-3xl font-bold text-green-600">{completed}</div>
      </div>
    </div>
  );
};
