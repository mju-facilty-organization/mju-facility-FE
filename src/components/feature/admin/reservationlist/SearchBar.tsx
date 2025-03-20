import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface SearchBarProps {
  categories: string[];
  onSearch: (category: string, query: string) => void;
}

export const SearchBar = ({ categories, onSearch }: SearchBarProps) => {
  const [searchCategory, setSearchCategory] = useState(
    categories.length > 0 ? categories[0] : ''
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    onSearch(searchCategory, searchText.trim());
  };

  return (
    <div className="flex items-center gap-0">
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="px-4 py-2 bg-myongji/20 text-myongji border-2 border-myongji border-r-0 rounded-l-md hover:bg-myongji/30 text-lg flex items-center gap-2 w-40 justify-between font-bold"
        >
          <span>{searchCategory}</span>
          <ChevronDown className="w-5 h-5" />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 w-40 mt-1 bg-white border-2 border-myongji rounded-md shadow-lg">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSearchCategory(category);
                  setIsDropdownOpen(false);
                }}
                className="block w-full px-4 py-2 text-left hover:bg-myongji/20 text-myongji text-lg font-bold"
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative flex-1">
        <input
          type="text"
          placeholder="텍스트를 입력하세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          className="w-64 pl-4 pr-12 py-2 border-2 border-myongji rounded-r-md focus:outline-none focus:border-myongji text-lg"
        />
        <button
          onClick={handleSearch}
          disabled={!searchText.trim()}
          className={`absolute right-0 top-0 h-full px-3 
          ${
            searchText.trim()
              ? 'text-myongji hover:text-myongji/80'
              : 'text-gray-300 cursor-not-allowed'
          } font-bold`}
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
