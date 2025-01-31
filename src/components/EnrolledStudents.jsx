import React from "react";
import emptyStudents from "../assets/empty_students.svg";
import EnrolledStudentItem from "./EnrolledStudentItem";

const EnrolledStudents = ({ enrolledStudents }) => {
  return (
    <div className="flex flex-col pt-2 rounded-xl overflow-y-scroll self-start h-auto scrollbar-hide ">
      {enrolledStudents && enrolledStudents?.length > 0 ? (
        enrolledStudents?.map((result, index) => (
          <EnrolledStudentItem key={index} result={result} />
        ))
      ) : (
        <div className="flex justify-center items-center w-full mt-10">
          <img
            src={emptyStudents}
            alt="No meetings yet"
            className="w-1/2 h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default EnrolledStudents;
