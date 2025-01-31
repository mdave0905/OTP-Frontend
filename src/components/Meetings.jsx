import React from "react";
import emptyMeetings from "../assets/empty_meetings.svg";
import MeetingItem from "./MeetingItem";

const Meetings = ({
  meetings,
  user,
  bookedMeetings,
  fetchStudentBookingStatus,
}) => {
  return (
    <div className="flex flex-col pt-2 overflow-y-scroll self-start h-auto scrollbar-hide">
      {meetings && meetings.length > 0 ? (
        meetings.map((result, index) => (
          <div key={index}>
            <MeetingItem
              result={result}
              isYourMeeting={result.tutorId === user.id}
              fetchStudentBookingStatus={fetchStudentBookingStatus}
              isBooked={
                bookedMeetings
                  ? bookedMeetings.some((m) => m.meetingId === result.meetingId)
                  : false
              }
            />
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center w-full mt-16">
          <img
            src={emptyMeetings}
            alt="No meetings yet"
            className="w-2/5 h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default Meetings;
