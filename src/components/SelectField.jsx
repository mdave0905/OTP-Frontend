import React from "react";

const SelectField = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  className,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className={`block text-sm font-medium text-gray-700 ${className}`}
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-2 p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option, index) => {
          if (typeof option === "string") {
            return (
              <option key={index} value={option}>
                {option}
              </option>
            );
          }

          if (option.categoryName) {
            return (
              <option key={index} value={option.categoryName}>
                {option.categoryName}
              </option>
            );
          }

          if (option.streetName) {
            const {
              streetName,
              houseNum,
              campusName,
              university,
              city,
              postalCode,
            } = option;

            const universityName =
              university?.universityName || "Unknown University";
            const formattedAddress = `${universityName} \u00A0\u00A0•\u00A0\u00A0 ${houseNum}, ${streetName}, ${city}, ${postalCode}\u00A0\u00A0  (${campusName})`;

            return (
              <option key={index} value={option.addressId}>
                {formattedAddress}
              </option>
            );
          }

          if (option.affiliation?.universityName) {
            return (
              <option key={index} value={option.affiliation.universityName}>
                {option.affiliation.universityName}
              </option>
            );
          }

          return null;
        })}
      </select>
    </div>
  );
};

export default SelectField;
