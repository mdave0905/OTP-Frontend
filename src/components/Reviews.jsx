import React from "react";
import emptyReviews from "../assets/empty_reviews.svg";
import ReviewItem from "./ReviewItem";

const Reviews = ({ ratings }) => {
  return (
    <div className="flex flex-col pt-2 overflow-y-scroll self-start h-auto scrollbar-hide">
      {ratings && ratings?.length > 0 ? (
        ratings?.map((result, index) => (
          <ReviewItem key={index} result={result} index={index} />
        ))
      ) : (
        <div className="flex justify-center items-center w-full mt-10">
          <img
            src={emptyReviews}
            alt="No meetings yet"
            className="w-1/2 h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default Reviews;
