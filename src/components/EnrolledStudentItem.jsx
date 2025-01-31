import React from "react";

const EnrolledStudentItem = ({ result }) => {
  return (
    <div className="text-sm text-gray-100 mt-1.5 bg-gray-800 p-4 rounded-xl transition-all ease-in-out duration-300">
      {result.fullName} ({result.email})
    </div>
  );
};

export default EnrolledStudentItem;
