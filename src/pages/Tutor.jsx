import NavBar from "../components/Navbar";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import calculateAverageRating from "../helpers/CalculateAverageRating";
import CourseSearchResultItem from "../components/CourseSearchResultItem";
import { Rating, StickerStar } from "@smastrom/react-rating";
import { useAuth } from "../services/AuthContext";
import { BACKEND_URL, STUDENT_ROLE } from "../config";
import ActionButton from "../components/ActionButton";
import apiClient from "../services/AxiosConfig";
import RatingDialog from "../components/RatingDialog";
import InfoTabs from "../components/InfoTabs";
import error404 from "../assets/error404.svg";

const ratingStyle = {
  itemShapes: StickerStar,
  activeFillColor: "#1e40af",
  inactiveFillColor: "#bcbcbc",
};

function Tutor() {
  const { isAuthenticated, user, checkRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");
  const [tutor, setTutor] = useState(false);
  const [coursesTutor, setCoursesTutor] = useState([]);
  const [ratings, setRatings] = useState(null);
  const [coursesStudent, setCoursesStudent] = useState(null);
  const [isOpenRating, setIsOpenRating] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkEnrollment = useCallback(() => {
    if (coursesStudent && coursesTutor) {
      console.log("courses tutor: " + coursesTutor);
      console.log("courses student: " + coursesStudent);
      const enrolled = coursesStudent.some((studentCourse) =>
        coursesTutor.some(
          (tutorCourse) => tutorCourse.courseId === studentCourse.courseId,
        ),
      );
      console.log("enrolled", enrolled);
      setIsEnrolled(enrolled);
    }
  }, [coursesStudent, coursesTutor]);

  useEffect(() => {
    checkEnrollment();
  }, [coursesStudent, coursesTutor, checkEnrollment]);

  const fetchStudentCourses = useCallback(async () => {
    try {
      const res = await apiClient.get("/student/enrolled-courses");
      if (res.status === 200) {
        setCoursesStudent(res.data);
      }
    } catch (error) {
      console.error("Error fetching student courses:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchStudentCourses();
    }
  }, [user, fetchStudentCourses]);

  const fetchTutorDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/user/tutor?id=${id}`);
      const data = await res.json();
      setTutor(data);
    } catch (error) {
      console.error("Error fetching tutor details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchTutorCourses = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/user/get-course/${tutor.userId}`);
      const data = await res.json();
      setCoursesTutor(data);
    } catch (error) {
      console.error("Error fetching tutor courses:", error);
    }
  }, [tutor]);

  const fetchTutorRatings = useCallback(async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/user/get-tutor-ratings/${tutor.userId}`,
      );
      const data = await res.json();
      setRatings(data);
    } catch (error) {
      console.error("Error fetching tutor courses:", error);
    }
  }, [tutor, id]);

  useEffect(() => {
    if (id) {
      fetchTutorDetails();
    }
  }, [id, fetchTutorDetails]);

  useEffect(() => {
    if (tutor) {
      fetchTutorRatings();
    }
  }, [tutor, fetchTutorRatings]);

  useEffect(() => {
    if (tutor) {
      fetchTutorCourses();
    }
  }, [tutor, fetchTutorCourses]);

  return (
    <div className="flex flex-col items-center font-merriweather_sans w-full bg-white overflow-hidden">
      <NavBar currentPage="/" />
      {!loading && tutor && (
        <div className="mt-[120px] w-full max-w-6xl mb-10">
          <div className="flex items-center">
            <div className="flex flex-col w-5/6">
              <div className="inline-flex items-center w-full mt-5">
                <div className="text-4xl">
                  {tutor.firstName} {tutor.lastName}
                </div>
                <span
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="copy_link_anchor_element material-symbols-rounded text-3xl ml-3 cursor-pointer text-blue-600"
                >
                  link
                </span>
              </div>
              {/* Rating */}
              <Rating
                readOnly={true}
                style={{ maxWidth: 100 }}
                value={ratings ? calculateAverageRating(ratings).toFixed(1) : 0}
                itemStyles={ratingStyle}
              />
              <Tooltip
                anchorSelect=".copy_link_anchor_element"
                place="top"
                openOnClick="true"
              >
                Link copied!
              </Tooltip>
            </div>

            {user &&
              isAuthenticated &&
              checkRole(STUDENT_ROLE) &&
              isEnrolled && (
                <>
                  <ActionButton
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpenRating(true);
                    }}
                    text={"Rate Tutor"}
                    icon={"reviews"}
                    design={"neutral"}
                  />
                  <RatingDialog
                    isOpen={isOpenRating}
                    setIsOpen={setIsOpenRating}
                    user={user}
                    tutorId={tutor.userId}
                    refreshRatings={fetchTutorRatings}
                  />
                </>
              )}

            {tutor.userId !== user.id && (
              <ActionButton
                className={
                  isAuthenticated ? "ml-4" : "message_anchor_element ml-4"
                }
                onClick={() => {
                  if (isAuthenticated) {
                    navigate("/messages?userId=" + id);
                  }
                }}
                text={"Message"}
                icon={"message"}
                design={"action"}
              />
            )}

            <Tooltip
              anchorSelect=".message_anchor_element"
              place="top"
              openOnClick={true}
            >
              Log in first!
            </Tooltip>
          </div>
          <div className="flex">
            <div className="flex flex-col w-2/3 mr-10">
              <div className="mt-5 text-xl text-gray-800">About Me</div>
              <div className="mt-1 text-sm text-gray-600 italic">
                {tutor.description || "No description set"}
              </div>

              <div className="mt-10 text-2xl text-gray-800">
                Courses ({coursesTutor.length})
              </div>
              {coursesTutor?.map((result, index) => {
                return <CourseSearchResultItem course={result} key={index} />;
              })}
            </div>
            {user && (
              <InfoTabs
                ratings={ratings}
                user={user}
                visibleTabs={["reviews"]}
              />
            )}
          </div>
        </div>
      )}
      {!loading && !tutor && (
        <div className="mt-[120px] w-full max-w-6xl font-merriweather_sans text-xl">
          <div className="flex flex-col justify-center items-center w-full mt-[12%]">
            <img src={error404} alt="No tutor found" className="w-2/5 h-auto" />
            <p className={"text-xl"}>No tutor found</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tutor;
