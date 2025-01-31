import FormatDateTime from "../helpers/FormatDateTime";
import { format } from "date-fns";
import apiClient from "../services/AxiosConfig";
import { Tooltip } from "react-tooltip";
import React from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "./ActionButton";

const MeetingItem = ({
  result,
  isYourMeeting,
  isBooked,
  fetchStudentBookingStatus,
}) => {
  const {
    meetingId,
    meetingType,
    startTime,
    endTime,
    duration_in_minutes,
    roomNum,
    campusName,
    universityName,
    courseId,
  } = result;

  const tooltipText =
    meetingType === "ONLINE"
      ? isYourMeeting
        ? null
        : "Contact your tutor for meeting link"
      : `${roomNum}, ${universityName} (${campusName})`;

  const navigate = useNavigate();

  const handleActionClick = async () => {
    if (!isYourMeeting) {
      try {
        if (isBooked) {
          const { data } = await apiClient.delete(
            `/user/meetings/cancel/${meetingId}`,
          );
          console.log(data);
        } else {
          const { data } = await apiClient.post(
            `/user/meetings/book/${meetingId}`,
          );
          console.log(data);
        }

        fetchStudentBookingStatus();
      } catch (e) {
        console.error(e);
      }
    } else {
      navigate(
        `/create-meeting?edit=true&courseId=${courseId}&meetingId=${meetingId}?ref=course`,
      );
    }
  };

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-7 items-center text-sm text-gray-100 mt-1.5 bg-gray-800 p-4 rounded-xl transition-all ease-in-out duration-300">
      {/* Meeting Type & Location Info */}
      <div className="flex items-center flex-wrap">
        <span className="font-semibold text-base">{meetingType}</span>

        {/* Info Icon with Tooltip (only if tooltipText exists) */}
        {tooltipText && (
          <>
            <span
              style={{ fontSize: "1.15rem" }}
              className="cursor-pointer ml-2 material-symbols-rounded"
              data-tooltip-id={`tooltip-${meetingId}`}
            >
              {meetingType === "ONLINE" ? "info" : "pin_drop"}
            </span>

            <Tooltip id={`tooltip-${meetingId}`} place="top">
              {tooltipText}
            </Tooltip>
          </>
        )}
      </div>

      {/* Time Range */}
      <div className="whitespace-nowrap">
        <span>
          {FormatDateTime(startTime)} - {format(new Date(endTime), "HH:mm")}
        </span>
      </div>

      {/* Duration */}
      <div className="text-gray-400 whitespace-nowrap">
        {duration_in_minutes} min
      </div>

      {/* Edit Button */}
      <ActionButton
        onClick={handleActionClick}
        icon={isYourMeeting ? "edit_calendar" : isBooked ? "close" : "event"}
        text={isYourMeeting ? "Edit" : isBooked ? "Cancel" : "Book"}
        design={isYourMeeting ? "neutral" : isBooked ? "alert" : "action"}
      />
    </div>
  );
};

export default MeetingItem;
