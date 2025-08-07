import React from 'react';
import { Search } from 'lucide-react';

type SuggestionEmptyStateProps = {
  isMyPosts: boolean;
};

export const SuggestionEmptyState: React.FC<SuggestionEmptyStateProps> = ({
  isMyPosts,
}) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
      <div className="text-gray-400 mb-4">
        <Search size={48} className="mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {isMyPosts ? '작성한 건의사항이 없습니다' : '검색 결과가 없습니다'}
      </h3>
      <p className="text-gray-600">
        {isMyPosts
          ? '새로운 건의사항을 작성해보세요'
          : '다른 검색어나 필터를 사용해보세요'}
      </p>
    </div>
  );
};
