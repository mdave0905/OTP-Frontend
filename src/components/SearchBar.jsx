import React from "react";

//
export default function SearchBar({
  placeholder = "Search",
  onChange,
  className = "",
  ...props
}) {
  return (
    <div className={`relative w-full max-w-3xl mx-auto ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-md focus:ring-0 focus:outline-none text-gray-500"
        {...props}
      />

      <span
        className="material-symbols-rounded absolute left-4 top-1/2 transform -translate-y-1/2"
        style={{ left: "10px", width: "20px", height: "20px" }}
      >
        search
      </span>
    </div>
  );
}
