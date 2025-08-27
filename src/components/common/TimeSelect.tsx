const generateTimeOptions = (startHour: number = 8, endHour: number = 22) => {
  const options = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    options.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < endHour) {
      options.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return options;
};

const TimeSelect = ({
  id,
  value,
  onChange,
  error,
  label,
  required = false,
  startHour = 8,
  endHour = 22,
  placeholder = '시간을 선택하세요',
  disabled = false,
  className = '',
}) => {
  const timeOptions = generateTimeOptions(startHour, endHour);

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-3 pr-12 text-lg border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-myongji bg-white hover:border-gray-400 transition-colors appearance-none cursor-pointer shadow-sm ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <option value="">{placeholder}</option>
          {timeOptions.map((time) => (
            <option key={time} value={time} className="py-2">
              {time}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"></div>
      </div>

      {error && <p className="mt-2 text-base text-red-500">{error}</p>}
    </div>
  );
};

export default TimeSelect;
