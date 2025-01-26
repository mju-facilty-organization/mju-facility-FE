interface InputProps {
  type?: 'text' | 'email' | 'password' | 'tel';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label?: string;
  description?: string;
  required?: boolean;
}

const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  label,
  description,
  required = true,
}: InputProps) => (
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
      type={type}
      name={name}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 ${
        label ? 'mt-2' : ''
      } bg-white border-b border-gray-300 placeholder-gray-400 text-xl focus:outline-none`}
    />
    {description && (
      <p className="text-base text-gray-500 mt-2">{description}</p>
    )}
  </div>
);

export default Input;
