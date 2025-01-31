import formatDate from "../helpers/FormatDate";
import { useNavigate } from "react-router-dom";
import { Rating, StickerStar } from "@smastrom/react-rating";
import React from "react";

const ratingStyle = {
  itemShapes: StickerStar,
  activeFillColor: "#ffffff",
  inactiveFillColor: "#878787",
};

function CourseSearchResultItem({ course }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/course?id=" + course.courseId);
  };
  return (
    <li
      key={course.courseId}
      onClick={handleClick}
      className="cursor-pointer flex rounded-2xl shadow-gray-300 shadow-sm bg-gray-900 p-7 mt-5"
    >
      <div>
        <span className="text-blue-100 py-1 px-2 rounded-sm font-merriweather_sans bg-blue-600 bg-opacity-40 text-xs">
          {course.courseCategories[0]?.categoryName}
        </span>

        <div className="font-merriweather_sans text-sm text-gray-400 mt-2">
          <Rating
            readOnly={true}
            style={{ maxWidth: 100 }}
            value={course.averageRating}
            itemStyles={ratingStyle}
          />
        </div>

        <div className="font-merriweather_sans text-xl text-white">
          {course.courseName}
        </div>
        <div className="font-merriweather_sans text-sm text-white mb-[10px]">
          {course.descriptionShort}
        </div>
        <span className="inline-flex items-center font-merriweather_sans text-sm bg-white text-black px-2 rounded-md">
          By {course.tutorName}
          {course.tutor?.isVerified && (
            <span className="material-symbols-rounded ml-1 text-xl">
              verified
            </span>
          )}
        </span>
      </div>
      <div className="flex flex-col justify-center ml-auto items-end font-merriweather_sans text-sm text-white">
        <div className="bg-gray-800 py-2 px-4 rounded-full text-center w-40">
          <span className="block text-gray-400">From</span>
          <span className="text-green-300">{formatDate(course.startDate)}</span>
        </div>
        <div className="bg-gray-800 py-2 px-4 rounded-full text-center w-40 mt-2">
          <span className="block text-gray-400">To</span>
          <span className="text-red-300">{formatDate(course.endDate)}</span>
        </div>
      </div>
    </li>
  );
}

export default CourseSearchResultItem;
