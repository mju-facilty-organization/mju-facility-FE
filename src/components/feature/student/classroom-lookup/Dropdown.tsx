import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownProps {
  value: string;
  placeholder: string;
  options: readonly string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const Dropdown = ({
  value,
  placeholder,
  options,
  onChange,
  disabled = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          relative w-full px-4 py-3 text-left bg-white border-2 rounded-xl
          transition-all duration-200 ease-in-out
          ${
            disabled
              ? 'opacity-50 cursor-not-allowed border-gray-200'
              : isOpen
              ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          }
          focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
        `}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-base ${value ? 'text-gray-900' : 'text-gray-500'}`}
          >
            {value || placeholder}
          </span>
          <div className="flex items-center gap-2">
            {value && !disabled && (
              <button
                onClick={clearSelection}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-center">
                선택할 수 있는 옵션이 없습니다
              </div>
            ) : (
              options.map((option, index) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={`
                    w-full text-left px-4 py-3 flex items-center justify-between
                    transition-colors duration-150
                    ${
                      value === option
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-900 hover:bg-gray-50'
                    }
                    ${index === 0 ? '' : 'border-t border-gray-100'}
                  `}
                >
                  <span className="text-base">{option}</span>
                  {value === option && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
