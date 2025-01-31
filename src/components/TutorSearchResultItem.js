import { useNavigate } from "react-router-dom";
import React from "react";
import { Rating, StickerStar } from "@smastrom/react-rating";

const ratingStyle = {
  itemShapes: StickerStar,
  activeFillColor: "#4d72e3",
  inactiveFillColor: "#bcbcbc",
};

function TutorSearchResultItem({ tutor }) {
  const navigate = useNavigate();
  const getInitials = (name) =>
    name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  const initials = getInitials(tutor.fullName);

  return (
    <li
      key={tutor.userId}
      onClick={() => navigate("/tutor?id=" + tutor.userId)}
      className="col-span-2 cursor-pointer flex rounded-2xl bg-gray-900 py-6 pr-8 pl-4 mt-1 flex-col justify-between"
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center font-bold ml-4 mb-2  text-blue-800 text-lg">
          {initials}
        </div>
      </div>
      <div className="flex-grow ml-4">
        <div className="font-merriweather_sans text-xl text-white">
          {tutor.firstName} {tutor.lastName}
        </div>
        <Rating
          itemStyles={ratingStyle}
          value={tutor.averageRating}
          readOnly={true}
          style={{ maxWidth: 100 }}
        />
        <div className="font-merriweather_sans text-sm text-white mt-3 bg-gray-700 py-1 px-2 rounded-md">
          {tutor.tutorCourses.length}{" "}
          {tutor.tutorCourses.length === 1 ? "Course" : "Courses"}
        </div>
      </div>
    </li>
  );
}

export default TutorSearchResultItem;
