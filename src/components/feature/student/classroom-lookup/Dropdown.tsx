import { useState } from 'react';

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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="px-6 py-2 text-lg rounded-full bg-white flex items-center gap-2 disabled:opacity-50"
      >
        {value || placeholder}
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-48 bg-white rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="block w-full text-lg text-left px-4 py-2 hover:bg-gray-100"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
