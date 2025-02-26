import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      description,
      error,
      required = true,
      className = '',
      ...props
    },
    ref
  ) => (
    <div className="relative">
      {label && (
        <>
          {required && (
            <span className="text-red-500 absolute -left-4 text-xl">*</span>
          )}
          <label className="text-xl font-medium">{label}</label>
        </>
      )}
      <input
        placeholder="텍스트를 입력하세요"
        type={type}
        ref={ref}
        required={required}
        className={`w-full py-3 ${
          label ? 'mt-2' : ''
        } bg-white border-b border-gray-300 placeholder-gray-400 text-base focus:outline-none ${className}`}
        {...props}
      />
      {description && (
        <p className="text-base text-gray-500 mt-2">{description}</p>
      )}
      {error && <p className="text-base text-red-500 mt-1">{error}</p>}
    </div>
  )
);

export default Input;
