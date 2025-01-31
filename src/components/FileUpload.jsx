import React, { useState } from "react";

const FileUpload = ({ label, id, onChange }) => {
  const [fileName, setFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange && onChange(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onChange && onChange(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-2 font-merriweather_sans">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex items-center justify-center w-full border-2 border-dashed rounded-md p-4 cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-blue-300 hover:border-blue-500 hover:bg-blue-50"
        }`}
      >
        <input
          type="file"
          id={id}
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        {fileName ? (
          <p className="text-gray-600 text-sm">
            Selected file: <span className="font-medium">{fileName}</span>
          </p>
        ) : (
          <p className="text-gray-500 text-sm">
            Drag & drop an image here or{" "}
            <span className="text-blue-500 font-medium">browse</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
