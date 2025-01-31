import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import React, { useCallback, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Rating, StickerStar } from "@smastrom/react-rating";
import { useAuth } from "../services/AuthContext";
import { BACKEND_URL, STUDENT_ROLE, TUTOR_ROLE } from "../config";
import getCourseDuration from "../helpers/CalculateDuration";
import apiClient from "../services/AxiosConfig";
import InfoTabs from "../components/InfoTabs";
import ConfirmationDialog from "../components/ConfirmationDialog";
import RatingDialog from "../components/RatingDialog";
import ActionButton from "../components/ActionButton";
import error404 from "../assets/error404.svg";

const ratingStyle = {
  itemShapes: StickerStar,
  activeFillColor: "#1e40af",
  inactiveFillColor: "#bcbcbc",
};

const categoryImages = {
  Programming:
    "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  Astronomy:
    "https://images.unsplash.com/photo-1533251107558-25299f5a3893?q=80&w=2644&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  Mathematics:
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  Philosophy:
    "https://images.unsplash.com/photo-1521920592574-49e0b121c964?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  Physics:
    "https://images.unsplash.com/photo-1663669066662-1c696543b852?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  Business:
    "https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  Chemistry:
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

function Course() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");
  const { user, isAuthenticated, checkRole } = useAuth();
  const [course, setCourse] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const [meetings, setMeetings] = useState(null);
  const [visibleTabs, setVisibleTabs] = useState(null);
  const [bookedMeetings, setBookedMeetings] = useState(null);
  const [isOpenWithdraw, setIsOpenWithdraw] = useState(false);
  const [isOpenRating, setIsOpenRating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStudentEnrollStatus = async (courseData) => {
    if (!courseData) return;
    if (!checkRole(STUDENT_ROLE)) return;
    setEnrolled(false);
    try {
      const res = await apiClient.get(`/student/enrolled-courses`);
      let localEnrollStatus;
      if (res.status === 200) {
        res.data.forEach((enrolledCourse) => {
          if (enrolledCourse.courseId === courseData.courseId) {
            setEnrolled(true);
            localEnrollStatus = true;
          }
        });
      } else {
        setEnrolled(false);
        localEnrollStatus = false;
      }
      await fetchCourseMeetings(courseData, localEnrollStatus);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEnrolledStudents = async (courseData) => {
    if (!courseData) return;
    if (!checkRole(TUTOR_ROLE)) return;
    setEnrolledStudents(null);
    try {
      const res = await apiClient.get(
        `/tutor/get-students-enrolled/${courseData.courseId}`,
      );
      if (res.status === 200) {
        setEnrolledStudents(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCourseMeetings = async (courseData, localEnrollStatus) => {
    if (!courseData) return;
    setMeetings(null);

    if (
      (checkRole(TUTOR_ROLE) && user.id === courseData.tutorId) ||
      (checkRole(STUDENT_ROLE) && localEnrollStatus)
    ) {
      try {
        const res = await apiClient.get(
          `/user/meetings/course/${courseData.courseId}`,
        );
        if (res.status === 200) {
          // Sort meetings by startTime (ascending order)
          const sortedMeetings = res.data.sort(
            (a, b) => new Date(a.startTime) - new Date(b.startTime),
          );

          if (
            sortedMeetings.length > 0 &&
            checkRole(STUDENT_ROLE) &&
            localEnrollStatus
          ) {
            await fetchStudentBookingStatus();
          }

          setMeetings(sortedMeetings);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchStudentBookingStatus = async () => {
    if (user) {
      try {
        const res = await fetch(`${BACKEND_URL}/user/get-meetings/${user.id}`);
        const data = await res.json();
        setBookedMeetings(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleStudentEnroll = async () => {
    if (!isAuthenticated || !checkRole(STUDENT_ROLE)) return;
    try {
      const res = await apiClient.post(
        `/student/enroll-course/${course.courseId}`,
      );
      if (res.status === 200) {
        setEnrolled(true);
      }

      await fetchCourseMeetings(course, true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStudentUnenroll = async () => {
    if (!isAuthenticated || !checkRole(STUDENT_ROLE)) return;
    try {
      const res = await apiClient.post(
        `/student/unenroll-course/${course.courseId}`,
      );
      console.log(res);
      if (res.status === 200) {
        setEnrolled(false);
      }
      setVisibleTabs((prevTabs) =>
        prevTabs.filter((tab) => tab !== "meetings"),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCourseDetails = useCallback(async () => {
    if (!id || !user) return;
    setCourse(null);
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/search/get-course/${id}`);
      const data = await res.json();
      setCourse(data);
      await fetchRelatedCourses(data);
      if (data.tutorId === user.id) {
        await fetchEnrolledStudents(data);
      }
      if (checkRole(STUDENT_ROLE)) {
        await fetchStudentEnrollStatus(data);
      } else {
        await fetchCourseMeetings(data, false);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  const fetchCourseRatings = useCallback(async () => {
    if (!id) return;
    setRatings(null);
    try {
      const res = await fetch(`${BACKEND_URL}/user/get-course-ratings/${id}`);
      const data = await res.json();
      setRatings(data);
    } catch (error) {
      console.error("Error fetching course ratings:", error);
    }
  }, [id]);

  const fetchRelatedCourses = async (courseData) => {
    if (!courseData || !courseData.courseCategories?.[0]?.categoryName) return;
    setRelatedCourses(null);
    try {
      const res = await fetch(
        `${BACKEND_URL}/search/category/${courseData.courseCategories[0].categoryName}`,
      );
      const data = await res.json();
      setRelatedCourses(data);
    } catch (error) {
      console.error("Error fetching related courses:", error);
    }
  };

  useEffect(() => {
    if (user && id && course) {
      if (course?.tutorId === user?.id) {
        setVisibleTabs(["reviews", "students", "meetings"]);
      } else if (checkRole(STUDENT_ROLE) && enrolled) {
        setVisibleTabs(["reviews", "meetings"]);
      } else {
        setVisibleTabs(["reviews"]);
      }
    }
  }, [id, user, course, enrolled]);

  useEffect(() => {
    if (user) {
      fetchCourseDetails();
    }
  }, [id, user]);

  useEffect(() => {
    fetchCourseRatings();
  }, [id]);

  return (
    <div className="flex flex-col items-center w-full bg-white overflow-hidden">
      <NavBar isLoggedIn={false} currentPage="/" />
      {!loading && course && (
        <div className="mt-[120px] w-full max-w-7xl font-merriweather_sans mb-10">
          {/* Course Banner */}
          <div className="w-full h-60 bg-gray-300 flex items-center justify-center text-gray-600 rounded-xl">
            <img
              src={categoryImages[course.courseCategories[0]?.categoryName]}
              alt={course.courseName}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Breadcrumb Navigation */}
          <div className="flex items-center mt-5">
            <div className="flex flex-col w-full">
              <div className="flex bg-white overflow-hidden text-sm">
                <span className="cursor-pointer" onClick={() => navigate("/")}>
                  Home
                </span>
                <span className="mx-1">/</span>
                <span
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(
                      "/search?categoryName=" +
                        course.courseCategories[0]?.categoryName,
                    )
                  }
                >
                  {course.courseCategories[0]?.categoryName}
                </span>
                <span className="mx-1">/</span>
                <span
                  className="cursor-pointer"
                  onClick={() => navigate("/course?id=" + id)}
                >
                  {course.courseName}
                </span>
              </div>

              {/* Course Title & Share Link */}
              <div className="inline-flex items-center w-full mt-3">
                <div className="text-4xl font-bold">{course.courseName}</div>
                <span
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                  className="copy_link_anchor_element material-symbols-rounded text-3xl ml-3 cursor-pointer text-blue-600"
                >
                  link
                </span>
                {user && user.id === course.tutorId && (
                  <span
                    onClick={() =>
                      navigate(
                        "/create-course?edit=true&courseId=" + course.courseId,
                      )
                    }
                    className="material-symbols-rounded text-2xl ml-3 cursor-pointer text-gray-600"
                  >
                    edit_square
                  </span>
                )}

                {/* Enroll Button */}
                {user &&
                  isAuthenticated &&
                  checkRole(STUDENT_ROLE) &&
                  course.tutorId !== user.id && (
                    <ActionButton
                      onClick={(e) => {
                        e.preventDefault();
                        if (enrolled) {
                          setIsOpenWithdraw(true);
                        } else {
                          handleStudentEnroll();
                        }
                      }}
                      icon={enrolled ? "exit_to_app" : "add"}
                      className="ml-auto"
                      text={enrolled ? "Withdraw" : "Enroll Now"}
                      design={enrolled ? "alert" : "action"}
                    />
                  )}
                {/* Rate Button */}
                {user &&
                  isAuthenticated &&
                  checkRole(STUDENT_ROLE) &&
                  course.tutorId !== user.id &&
                  enrolled && (
                    <ActionButton
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpenRating(true);
                      }}
                      icon={"reviews"}
                      className="ml-4"
                      text={"Rate Course"}
                      design={"neutral"}
                    />
                  )}
                <ConfirmationDialog
                  isOpen={isOpenWithdraw}
                  setIsOpen={setIsOpenWithdraw}
                  title="Withdraw from Course?"
                  message="Are you sure you want to withdraw from this course? All associated data will be removed."
                  confirmText="Withdraw"
                  confirmIcon="exit_to_app"
                  onConfirm={handleStudentUnenroll}
                />

                {/* Meetings Button */}
                {user &&
                  isAuthenticated &&
                  checkRole(TUTOR_ROLE) &&
                  course.tutorId === user.id && (
                    <ActionButton
                      onClick={() => {
                        navigate(
                          `/create-meeting?courseId=${course.courseId}&ref=course`,
                        );
                      }}
                      icon={"add"}
                      className="ml-auto"
                      text={"Create a New Meeting"}
                      design={"action"}
                    />
                  )}
              </div>
              <Tooltip
                anchorSelect=".copy_link_anchor_element"
                place="top"
                openOnClick="true"
              >
                Link copied!
              </Tooltip>

              {/* Tutor Section */}
              <div className="flex items-center text-xl text-gray-800 mt-3">
                <div>
                  <div
                    onClick={() => navigate("/tutor?id=" + course.tutorId)}
                    className="font-semibold cursor-pointer"
                  >
                    By {course.tutorName}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Course in {course.courseCategories[0]?.categoryName}
                  </div>
                </div>
              </div>

              <RatingDialog
                isOpen={isOpenRating}
                setIsOpen={setIsOpenRating}
                user={user}
                courseId={course.courseId}
                refreshRatings={fetchCourseRatings}
              />

              {/* Rating */}
              <Rating
                readOnly={true}
                style={{ maxWidth: 100 }}
                value={course.averageRating}
                itemStyles={ratingStyle}
              />
            </div>
          </div>

          {/* Course Content */}
          <div className="flex mt-5">
            <div className="flex flex-col w-2/3 pr-10">
              {/* Class Description */}
              <div className="text-xl font-semibold text-gray-800">
                Class Description
              </div>
              <div className="mt-1 text-sm text-gray-600">
                <i>
                  <strong>{course.descriptionShort}</strong>
                </i>
                <br /> {course.descriptionLong}
              </div>

              {/* Course Details */}
              <div className="mt-5 p-4 border border-gray-300 bg-gray-200 rounded-xl">
                <div className="text-lg font-semibold">📌 Course Details</div>

                {/* Date & Duration Layout */}
                <div className="flex items-center justify-between bg-gray-900 p-4 rounded-b-md rounded-t-xl mt-2 shadow">
                  {/* Start Date */}
                  <div className="flex-1 text-center">
                    <div className="text-gray-300 text-sm">Start Date</div>
                    <div className="font-semibold text-lg text-blue-400">
                      {new Date(course.startDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-white text-2xl mx-2 mt-4">→</div>

                  {/* Duration */}
                  <div className="flex-1 text-center text-white">
                    <div className="text-gray-300 text-sm">Duration</div>
                    <div className="font-semibold text-lg">
                      {getCourseDuration(course.startDate, course.endDate)}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-white text-2xl mx-2 mt-4">→</div>

                  {/* End Date */}
                  <div className="flex-1 text-center">
                    <div className="text-gray-300 text-sm">End Date</div>
                    <div className="font-semibold text-lg text-red-400">
                      {new Date(course.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <ul className="mt-0.5 text-md text-gray-200 bg-gray-900 py-2 px-6 rounded-t-md rounded-b-xl">
                  <li>
                    <strong>Language:</strong> English
                  </li>
                </ul>
              </div>
            </div>
            {visibleTabs && user && (
              <InfoTabs
                ratings={ratings}
                enrolledStudents={enrolledStudents}
                meetings={meetings}
                bookedMeetings={bookedMeetings}
                fetchStudentBookingStatus={fetchStudentBookingStatus}
                user={user}
                visibleTabs={visibleTabs}
              />
            )}
          </div>

          {/* Related Courses Section */}
          {relatedCourses &&
            relatedCourses.filter((c) => c.courseId !== course.courseId)
              .length > 0 &&
            user.id !== course.tutorId && (
              <div className="mt-10 w-2/3">
                <div className="text-xl font-semibold">
                  🎓 You might also like:
                </div>
                <div className="flex mt-3 space-x-4">
                  {relatedCourses
                    .filter((c) => c.courseId !== course.courseId) // Remove current course
                    .slice(0, 3) // Get first 2 courses
                    .map((related) => (
                      <div
                        key={related.courseId}
                        className="bg-gray-100 p-4 rounded-xl border border-gray-200 w-1/3 cursor-pointer"
                        onClick={() =>
                          navigate(`/course?id=${related.courseId}`)
                        }
                      >
                        <div className="text-lg font-semibold">
                          {related.courseName}
                        </div>
                        <div className="text-sm text-gray-600">
                          By {related.tutorName}
                        </div>
                        <Rating
                          readOnly={true}
                          style={{ maxWidth: 100 }}
                          value={related.averageRating}
                          itemStyles={ratingStyle}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
        </div>
      )}
      {!loading && !course && (
        <div className="mt-[120px] w-full max-w-6xl font-merriweather_sans text-xl">
          <div className="flex flex-col justify-center items-center w-full mt-[12%]">
            <img
              src={error404}
              alt="Course not found"
              className="w-2/5 h-auto"
            />
            <p className={"text-xl mt-4"}>Course not found</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Course;
