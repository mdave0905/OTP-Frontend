import React, { useState } from "react";

export default function CustomDropdown({
  selectedOption,
  setSelectedOption,
  options,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="text-left absolute top-1/2 right-1.5 -translate-y-1/2">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between py-1.5 px-3 rounded-md font-merriweather_sans bg-gray-200"
      >
        <span>{selectedOption}</span>
        {!isOpen && (
          <span className="material-symbols-rounded">keyboard_arrow_down</span>
        )}
        {isOpen && (
          <span className="material-symbols-rounded">keyboard_arrow_up</span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
          onMouseLeave={() => setIsOpen(false)}
        >
          <ul className="py-1">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => selectOption(option)}
                className="px-4 py-2 cursor-pointer font-merriweather_sans text-gray-800 hover:bg-gray-100"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
