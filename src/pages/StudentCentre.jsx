import React, { useCallback, useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import CourseSearchResultItem from "../components/CourseSearchResultItem";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/AxiosConfig";
import { useAuth } from "../services/AuthContext";
import ActionButton from "../components/ActionButton";
import emptyReviews from "../assets/empty_reviews.svg";

function StudentCentre() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchStudentCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/student/enrolled-courses");
      if (res.status === 200) {
        setCourses(res.data);
      }
    } catch (error) {
      console.error("Error fetching student courses:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchStudentCourses();
    }
  }, [user, fetchStudentCourses]);

  return (
    <div className="flex flex-col items-center w-full bg-white overflow-hidden font-merriweather_sans">
      <NavBar currentPage="/student-centre" />
      <div className="w-full max-w-6xl mt-[120px] mb-10">
        {!loading && courses && courses.length > 0 && (
          <div>
            <div className="flex items-center justify-between">
              <div className="text-xl">Enrolled Courses</div>
              <ActionButton
                onClick={() => {
                  navigate("/student-meetings");
                }}
                text={"View All Meetings"}
                icon={"calendar_month"}
                design={"neutral"}
              />
            </div>
            {courses &&
              courses.map((result, index) => {
                return <CourseSearchResultItem course={result} key={index} />;
              })}
          </div>
        )}
        {!loading && courses && courses.length === 0 && (
          <div className="flex flex-col justify-center items-center w-full mt-[12%]">
            <img
              src={emptyReviews}
              alt="No courses enrolled"
              className="w-2/5 h-auto"
            />
            <p className={"text-xl"}>No courses enrolled</p>
            <ActionButton
              className={"mt-4"}
              onClick={() => {
                navigate("/");
              }}
              text={"Explore Courses"}
              icon={"search"}
              design={"action"}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentCentre;
