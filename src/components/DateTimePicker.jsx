const DateTimePicker = ({ onChange, value, label, name, className }) => {
  return (
    <div className="flex flex-col">
      <label
        className={`block text-gray-700 text-sm font-medium mb-2 mt-4 ${className}`}
      >
        {label}
      </label>
      <input
        type="datetime-local"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
};

export default DateTimePicker;
