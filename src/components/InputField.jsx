import React from "react";
//
const InputField = ({
  label,
  placeholder,
  value,
  onChange,
  name,
  type = "text",
  className,
}) => {
  return (
    <div>
      <label
        className={`block text-gray-700 text-sm font-medium mb-2 mt-4 ${className}`}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
};

export default InputField;
