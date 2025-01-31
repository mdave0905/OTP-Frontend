import { Rating, StickerStar } from "@smastrom/react-rating";
import React from "react";

const ratingStyle = {
  itemShapes: StickerStar,
  activeFillColor: "#4d72e3",
  inactiveFillColor: "#bcbcbc",
};

const ReviewItem = ({ result, index }) => {
  return (
    <div className="bg-gray-800 mt-1 rounded-xl py-3 px-5">
      <div className="text-sm text-white">{result.studentName}</div>
      <Rating
        key={index}
        readOnly
        value={result.points}
        style={{ maxWidth: 100 }}
        itemStyles={ratingStyle}
      />
      <div className="text-sm italic text-gray-300">{result.review}</div>
    </div>
  );
};

export default ReviewItem;
