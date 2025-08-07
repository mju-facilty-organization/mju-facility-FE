import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

type SuggestionFiltersProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  isMyPosts: boolean;
  setIsMyPosts: (isMyPosts: boolean) => void;
  isLoggedIn: boolean;
  categoryOptions: Array<{ value: string; label: string }>;
  statusOptions: Array<{ value: string; label: string }>;
  onResetFilters: () => void;
};

export const SuggestionFilters: React.FC<SuggestionFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  isMyPosts,
  setIsMyPosts,
  isLoggedIn,
  categoryOptions,
  statusOptions,
  onResetFilters,
}) => {
  const handleMyPostsToggle = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    setIsMyPosts(!isMyPosts);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            분야 선택
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            처리 상태
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            검색
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="제목, 내용으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {isLoggedIn && (
            <button
              onClick={handleMyPostsToggle}
              className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                isMyPosts
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={isMyPosts ? { backgroundColor: '#002e66' } : {}}
            >
              내 글 보기
            </button>
          )}
          <button
            onClick={onResetFilters}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-gray-700 font-medium"
          >
            <RotateCcw size={16} />
            초기화
          </button>
        </div>
      </div>
    </div>
  );
};
