import React, { useCallback, useEffect, useState } from "react";
import InputField from "../components/InputField";
import TextareaField from "../components/TextareaField";
import SelectField from "../components/SelectField";
import { useAuth } from "../services/AuthContext";
import apiClient from "../services/AxiosConfig";
import NavBar from "../components/Navbar";
import { BACKEND_URL } from "../config";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConfirmationDialog from "../components/ConfirmationDialog";
import ActionButton from "../components/ActionButton";
import { Tooltip } from "react-tooltip";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState({});
  const { user } = useAuth();
  const [dateValidationError, setDateValidationError] = useState(false);
  const [courseNameLength, setCourseNameLength] = useState(0);
  const [shortDescriptionLength, setShortDescriptionLength] = useState(0);
  const [longDescriptionLength, setLongDescriptionLength] = useState(0);
  const [course, setCourse] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [courseNameError, setCourseNameError] = useState(false);
  const [shortDescriptionError, setShortDescriptionError] = useState(false);
  const [longDescriptionError, setLongDescriptionError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);

  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const editParam = searchParams.get("edit");
  const isEditMode = editParam ? editParam === "true" : false;
  const courseId = searchParams.get("courseId");

  const fetchCategories = async () => {
    const response = await fetch(`${BACKEND_URL}/search/categories`);
    const data = await response.json();
    setCategories(data);
  };

  const handleDelete = async () => {
    if (
      isEditMode &&
      courseId &&
      course &&
      user &&
      course?.tutorId === user?.id
    ) {
      try {
        const res = await apiClient.delete(`/tutor/delete-course/${courseId}`);
        if (res.status === 204) {
          setIsOpen(false);
          navigate("/tutor-centre");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsOpen(false);
      navigate("/course?id=" + courseId);
    }
  };

  const fetchCourseDetails = useCallback(async () => {
    if (!courseId || !user) return;
    try {
      const res = await fetch(`${BACKEND_URL}/search/get-course/${courseId}`);
      const data = await res.json();
      if (data.tutorId === user.id) {
        setCourse(data);
        setCourseDetails({
          courseName: data.courseName || "",
          shortDescription: data.descriptionShort || "",
          longDescription: data.descriptionLong || "",
          category: data.courseCategories?.[0]?.categoryName || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
        });
      } else {
        navigate("/course?id=" + courseId);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  }, [courseId, user]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user && courseId) {
      fetchCourseDetails();
    }
  }, [courseId, user]);

  useEffect(() => {
    if (isEditMode && course) {
      setCourseDetails({
        courseName: course.courseName || "",
        shortDescription: course.descriptionShort || "",
        longDescription: course.descriptionLong || "",
        category: course.courseCategories?.[0]?.categoryName || "",
        startDate: course.startDate || "",
        endDate: course.endDate || "",
      });
    }
  }, [course, isEditMode]);

  useEffect(() => {
    setCourseNameLength(courseDetails.courseName?.length || 0);
    setShortDescriptionLength(courseDetails.shortDescription?.length || 0);
    setLongDescriptionLength(courseDetails.longDescription?.length || 0);
  }, [courseDetails]);

  const MAX_COURSE_NAME = 50;
  const MAX_SHORT_DESC = 150;
  const MAX_LONG_DESC = 2000;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "shortDescription") {
      if (value.length <= MAX_SHORT_DESC) {
        setShortDescriptionLength(value.length);
        setCourseDetails({ ...courseDetails, [name]: value });
      }
    } else if (name === "longDescription") {
      if (value.length <= MAX_LONG_DESC) {
        setLongDescriptionLength(value.length);
        setCourseDetails({ ...courseDetails, [name]: value });
      }
    } else if (name === "courseName") {
      if (value.length <= MAX_COURSE_NAME) {
        setCourseNameLength(value.length);
        setCourseDetails({ ...courseDetails, [name]: value });
      }
    } else {
      setCourseDetails({ ...courseDetails, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDateValidationError(false);
    const courseNameInvalid =
      !courseDetails.courseName ||
      courseDetails.courseName.length > MAX_COURSE_NAME;
    const shortDescriptionInvalid =
      !courseDetails.shortDescription ||
      courseDetails.shortDescription.length > MAX_SHORT_DESC;
    const longDescriptionInvalid =
      !courseDetails.shortDescription ||
      courseDetails.longDescription.length > MAX_LONG_DESC;
    const categoryInvalid = !courseDetails.category;
    const startDateInvalid = !courseDetails.startDate;
    const endDateInvalid = !courseDetails.endDate;

    setCourseNameError(courseNameInvalid);
    setShortDescriptionError(shortDescriptionInvalid);
    setLongDescriptionError(longDescriptionInvalid);
    setCategoryError(categoryInvalid);
    setStartDateError(startDateInvalid);
    setEndDateError(endDateInvalid);

    if (
      courseNameInvalid ||
      shortDescriptionInvalid ||
      longDescriptionInvalid ||
      categoryInvalid ||
      startDateInvalid ||
      endDateInvalid
    )
      return;

    const startDate = new Date(courseDetails.startDate);
    const endDate = new Date(courseDetails.endDate);

    if (startDate >= endDate) {
      setDateValidationError(true);
      return;
    }

    const requestBody = {
      courseName: courseDetails.courseName,
      tutorId: user?.id,
      descriptionShort: courseDetails.shortDescription,
      descriptionLong: courseDetails.longDescription,
      startDate: courseDetails.startDate,
      endDate: courseDetails.endDate,
      averageRating: course?.averageRating || 0,
      courseCategories: [
        {
          categoryId:
            categories.find(
              (category) => category.name === courseDetails.category,
            )?.id || 0,
          categoryName: courseDetails.category,
        },
      ],
    };

    try {
      if (isEditMode && courseId) {
        await apiClient.put(`/tutor/update-course/${courseId}`, requestBody);
      } else {
        await apiClient.post("/tutor/course/create", requestBody);
      }

      navigate("/tutor-centre");
    } catch (error) {
      if (error.response?.status === 409) {
        alert("A course with similar details already exists.");
      } else {
        console.error("Error submitting data:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full bg-white overflow-hidden font-merriweather_sans">
      <NavBar currentPage="/tutor-centre" />
      <div className="mb-6 mt-[120px]">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          {isEditMode ? "Edit Your Course" : "Create a New Course"}
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-4xl">
        <Tooltip
          anchorSelect=".course_name_anchor_element"
          place="left"
          isOpen={courseNameError}
        >
          Enter a course name
        </Tooltip>
        <Tooltip
          anchorSelect=".short_description_anchor_element"
          place="left"
          isOpen={shortDescriptionError}
        >
          Enter a short description
        </Tooltip>
        <Tooltip
          anchorSelect=".long_description_anchor_element"
          place="left"
          isOpen={longDescriptionError}
        >
          Enter a long description
        </Tooltip>
        <Tooltip
          anchorSelect=".category_anchor_element"
          place="left"
          isOpen={categoryError}
        >
          Choose a category
        </Tooltip>
        <Tooltip
          anchorSelect=".start_date_anchor_element"
          place="left"
          isOpen={startDateError}
        >
          Choose a starting date
        </Tooltip>
        <Tooltip
          anchorSelect=".end_date_anchor_element"
          place="left"
          isOpen={endDateError}
        >
          Choose an ending date
        </Tooltip>

        <Tooltip
          anchorSelect=".date_validation_anchor_element"
          place="left"
          isOpen={dateValidationError}
        >
          End date must be after start date
        </Tooltip>

        <InputField
          className={"course_name_anchor_element"}
          label="Course Name *"
          placeholder="Software Engineering"
          name="courseName"
          value={courseDetails.courseName || ""}
          onChange={(e) => {
            handleChange(e);
            setCourseNameError(false);
          }}
          required={true}
        />
        <p
          className={`text-xs mb-4 ${
            courseNameLength === MAX_COURSE_NAME ? "text-red-500" : ""
          }`}
        >
          {courseNameLength}/{MAX_COURSE_NAME}
        </p>

        <TextareaField
          className={"short_description_anchor_element"}
          label="Short Description *"
          placeholder="Enter a short description"
          name="shortDescription"
          value={courseDetails.shortDescription || ""}
          onChange={(e) => {
            handleChange(e);
            setShortDescriptionError(false);
          }}
          rows={2}
          maxLength={MAX_SHORT_DESC}
          hint={`Max ${MAX_SHORT_DESC} characters.`}
          required={true}
        />
        <p
          className={`text-xs mb-4 ${
            shortDescriptionLength === MAX_SHORT_DESC ? "text-red-500" : ""
          }`}
        >
          {shortDescriptionLength}/{MAX_SHORT_DESC}
        </p>

        <TextareaField
          className={"long_description_anchor_element"}
          label="Long Description *"
          placeholder="Enter a detailed description"
          name="longDescription"
          rows={6}
          value={courseDetails.longDescription || ""}
          onChange={(e) => {
            handleChange(e);
            setLongDescriptionError(false);
          }}
          maxLength={MAX_LONG_DESC}
          hint={`Max ${MAX_LONG_DESC} characters.`}
          required={true}
        />
        <p
          className={`text-xs mb-4 ${
            longDescriptionLength === MAX_LONG_DESC ? "text-red-500" : ""
          }`}
        >
          {longDescriptionLength}/{MAX_LONG_DESC}
        </p>

        <SelectField
          className={"category_anchor_element"}
          label="Category *"
          name="category"
          value={courseDetails.category || ""}
          onChange={(e) => {
            handleChange(e);
            setCategoryError(false);
          }}
          options={categories}
          required={true}
        />

        <InputField
          className={"start_date_anchor_element"}
          label="Start Date *"
          type="date"
          name="startDate"
          value={courseDetails.startDate || ""}
          onChange={(e) => {
            handleChange(e);
            setStartDateError(false);
            setDateValidationError(false);
          }}
          required={true}
        />

        <InputField
          className={"end_date_anchor_element date_validation_anchor_element"}
          label="End Date *"
          type="date"
          name="endDate"
          value={courseDetails.endDate || ""}
          onChange={(e) => {
            handleChange(e);
            setEndDateError(false);
            setDateValidationError(false);
          }}
          required={true}
        />
        <ActionButton
          type={"submit"}
          onClick={() => {}}
          icon={isEditMode ? "sync" : "add_circle"}
          className="my-4"
          text={isEditMode ? "Update Course" : "Create Course"}
          design={"action"}
        />
        {isEditMode && course && courseId && user && (
          <ActionButton
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}
            icon={"delete"}
            className="ml-4"
            text={"Delete Course"}
            design={"alert"}
          />
        )}
      </form>
      <ConfirmationDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Delete Course?"
        message="Are you sure you want to delete this course? All associated data will be removed."
        confirmText="Delete"
        confirmIcon={"delete"}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CreateCourse;
