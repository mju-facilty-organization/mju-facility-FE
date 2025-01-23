interface InputProps {
  type: 'email' | 'password';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const Input = ({ type, name, value, onChange, placeholder }: InputProps) => (
  <input
    type={type}
    name={name}
    required
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full px-4 py-3 bg-white border-b border-gray-300 placeholder-gray-400 text-xl focus:outline-none"
  />
);

export default Input;
