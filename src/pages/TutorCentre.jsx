import React, { useCallback, useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import { BACKEND_URL } from "../config";
import { useAuth } from "../services/AuthContext";
import CourseSearchResultItem from "../components/CourseSearchResultItem";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import emptyReviews from "../assets/empty_reviews.svg";

function TutorCentre() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const fetchTutorCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/user/get-course/${user.id}`);
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching tutor courses:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    if (user) {
      fetchTutorCourses();
    }
  }, [user, fetchTutorCourses]);
  return (
    <div className="flex flex-col items-center w-full bg-white overflow-hidden font-merriweather_sans">
      <NavBar currentPage="/tutor-centre" />
      <div className="w-full max-w-6xl mt-[120px] mb-10">
        {!loading && courses && courses.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="inline-flex items-center w-full">
                  <div className="text-xl">Courses You Offer</div>
                </div>
              </div>
              <div className="flex">
                <ActionButton
                  onClick={() => {
                    navigate("/tutor-meetings");
                  }}
                  text={"View All Meetings"}
                  icon={"calendar_month"}
                  design={"neutral"}
                />
                <ActionButton
                  className={"ml-4"}
                  onClick={() => {
                    navigate("/create-course");
                  }}
                  text={"Create a New Course"}
                  icon={"add"}
                  design={"action"}
                />
              </div>
            </div>
            {courses?.map((result, index) => {
              return <CourseSearchResultItem course={result} key={index} />;
            })}
          </>
        )}
        {!loading && courses && courses.length === 0 && (
          <div className="flex flex-col justify-center items-center w-full mt-[12%]">
            <img
              src={emptyReviews}
              alt="No courses created"
              className="w-2/5 h-auto"
            />
            <p className={"text-xl"}>No courses created</p>
            <ActionButton
              className={"mt-4"}
              onClick={() => {
                navigate("/create-course");
              }}
              text={"Create a New Course"}
              icon={"add"}
              design={"action"}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TutorCentre;
