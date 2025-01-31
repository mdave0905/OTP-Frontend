import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import { Rating, StickerStar } from "@smastrom/react-rating";
import React, { useState } from "react";
import apiClient from "../services/AxiosConfig";
import ActionButton from "./ActionButton";

const ratingStyle = {
  itemShapes: StickerStar,
  activeFillColor: "#4d72e3",
  inactiveFillColor: "#bcbcbc",
};

const RatingDialog = ({
  isOpen,
  setIsOpen,
  user,
  courseId,
  tutorId,
  refreshRatings,
}) => {
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");

  const onSubmit = async () => {
    try {
      let data;
      if (courseId) {
        if (review) {
          data = {
            points: rating,
            studentId: user.id,
            courseId: courseId,
            review: review,
          };
        } else {
          data = {
            points: rating,
            studentId: user.id,
            courseId: courseId,
          };
        }
        const res = await apiClient.post(`/student/rate-course`, data);
        if (res.status === 200) {
          refreshRatings();
        }
      } else if (tutorId) {
        if (review) {
          data = {
            points: rating,
            studentId: user.id,
            tutorId: tutorId,
            review: review,
          };
        } else {
          data = {
            points: rating,
            studentId: user.id,
            tutorId: tutorId,
          };
        }
        const res = await apiClient.post(`/student/rate-tutor`, data);
        if (res.status === 200) {
          refreshRatings();
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50 focus:outline-none"
    >
      {/* Background Blur Effect */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-lg w-full font-merriweather_sans bg-gray-900 text-white rounded-2xl p-8 shadow-lg backdrop-blur-2xl transition-all duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0">
          {/* Title */}
          <DialogTitle className="text-xl font-bold">
            {courseId ? "Rate this Course" : "Rate this Tutor"}
          </DialogTitle>

          {/* Description */}
          <Description className="text-gray-300">
            {courseId
              ? "Give your honest review of this course."
              : "Give your honest review of this tutor."}
          </Description>

          <Rating
            className="mt-2"
            readOnly={false}
            style={{ maxWidth: 150 }}
            value={rating}
            isRequired={true}
            onChange={setRating}
            itemStyles={ratingStyle}
          />
          <input
            type="text"
            name="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Add an optional review"
            className="w-full border mt-4 border-gray-300 rounded-md text-black px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <ActionButton
              onClick={() => setIsOpen(false)}
              text={"Cancel"}
              icon={"close"}
              design={"neutral"}
            />
            <ActionButton
              onClick={() => {
                onSubmit();
                setIsOpen(false);
              }}
              icon={"rate_review"}
              text={"Submit"}
              design={"action"}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default RatingDialog;
