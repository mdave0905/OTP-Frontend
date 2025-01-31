import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import CapitalizeFirstLetter from "../helpers/CapitalizeFirstLetter";
import { useAuth } from "../services/AuthContext";
import apiClient from "../services/AxiosConfig";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL, STUDENT_ROLE, TUTOR_ROLE } from "../config";
import ConfirmationDialog from "../components/ConfirmationDialog";
import ActionButton from "../components/ActionButton";
import SelectField from "../components/SelectField";
import InputField from "../components/InputField";
import TextareaField from "../components/TextareaField";
import { Tooltip } from "react-tooltip";

function Profile() {
  const { user, logout, checkRole } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [initials, setInitials] = useState(null);
  const [coursesCountTutor, setCoursesCountTutor] = useState(0);
  const [coursesCountStudent, setCoursesCountStudent] = useState(0);
  const [meetings, setMeetings] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [shortDescriptionLength, setShortDescriptionLength] = useState(0);
  const MAX_SHORT_DESC = 100;
  const [universities, setUniversities] = useState(null);
  const affiliationTypes = ["STUDENT", "PROFESSOR", "EXTERNAL"];
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [affiliationTypeError, setAffiliationTypeError] = useState(false);
  const [universityNameError, setUniversityNameError] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: "",
    lastName: "",
    description: "",
    email: "",
    affiliation: {
      affiliationType: affiliationTypes[0],
      universityName: "",
    },
  });

  useEffect(() => {
    const getUniversityName = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/user/get-addresses`);
        if (res.status === 200) {
          const data = await res.json();

          const uniqueUniversities = Array.from(
            new Set(data.map((item) => item.university.universityName)),
          );
          setUniversities(uniqueUniversities);
        }
      } catch (err) {
        console.log("Error fetching addresses:", err);
      }
    };

    getUniversityName();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data } = await apiClient.get(`/user/get-user/${user.id}`);
        setRoles(user.roles);
        setProfile(data);
        setInitials(getInitials(data.fullName));
        setEditedProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          description: data.description || "",
          email: data.email || "",
          affiliation: data.affiliation || {
            affiliationType: affiliationTypes[0],
            universityName: "",
          },
        });
      } catch (err) {
        setError("Failed to fetch profile data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        if (checkRole(TUTOR_ROLE)) {
          const { data } = await apiClient.get(`/user/get-course/${user.id}`);
          setCoursesCountTutor(data.length);
        }

        if (checkRole(STUDENT_ROLE)) {
          const { data } = await apiClient.get(`/student/enrolled-courses`);
          setCoursesCountStudent(data.length);
        }

        const { data: meetingsData } = await apiClient.get(
          `/user/get-meetings/${user.id}`,
        );
        setMeetings(meetingsData || []);
      } catch (err) {
        setError("Failed to fetch additional profile data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile]);

  useEffect(() => {
    setShortDescriptionLength(editedProfile.description?.length || 0);
  }, [editedProfile]);

  const getInitials = (name) =>
    name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "description") {
      if (value.length <= MAX_SHORT_DESC) {
        setShortDescriptionLength(value.length);
        setEditedProfile((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === "universityName" || name === "affiliationType") {
      // Ensure affiliation exists before updating
      setEditedProfile((prev) => ({
        ...prev,
        affiliation: {
          ...prev.affiliation,
          [name]: value,
        },
      }));
    } else {
      setEditedProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    const firstNameInvalid =
      !editedProfile.firstName || editedProfile.firstName.length === 0;
    const lastNameInvalid =
      !editedProfile.lastName || editedProfile.lastName.length === 0;
    const affiliationTypeInvalid = !editedProfile.affiliation.affiliationType;
    const universityNameInvalid = !editedProfile.affiliation.universityName;

    setFirstNameError(firstNameInvalid);
    setLastNameError(lastNameInvalid);
    setAffiliationTypeError(affiliationTypeInvalid);
    setUniversityNameError(universityNameInvalid);

    if (
      firstNameInvalid ||
      lastNameInvalid ||
      affiliationTypeInvalid ||
      universityNameInvalid
    )
      return;

    try {
      await apiClient.put(`/user/update-user/${user.id}`, editedProfile);

      setProfile((prev) => ({
        ...prev,
        firstName: editedProfile.firstName,
        lastName: editedProfile.lastName,
        description: editedProfile.description,
        email: editedProfile.email,
        affiliation: {
          affiliationType: editedProfile.affiliation?.affiliationType || "",
          universityName: editedProfile.affiliation?.universityName || "",
        },
      }));
      setInitials(
        getInitials(editedProfile.firstName + " " + editedProfile.lastName),
      );

      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile.");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/user/delete-my-account`);
      logout();
      navigate("/login");
    } catch (err) {
      setError("Failed to delete account.");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  if (error)
    return <div className="text-red-600 text-center mt-10">{error}</div>;

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <NavBar currentPage="/profile" />
      <div className="flex flex-col w-full max-w-5xl font-merriweather_sans mt-[150px] bg-gray-50 p-8 rounded-2xl border border-gray-300">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-800 text-3xl">
            {initials}
          </div>
          <div className={"w-full"}>
            {isEditing && editedProfile ? (
              <div>
                <Tooltip
                  anchorSelect=".first_name_anchor_element"
                  place="left"
                  isOpen={firstNameError}
                >
                  Enter your first name
                </Tooltip>
                <Tooltip
                  anchorSelect=".last_name_anchor_element"
                  place="left"
                  isOpen={lastNameError}
                >
                  Enter your last name
                </Tooltip>
                <Tooltip
                  anchorSelect=".affiliation_type_anchor_element"
                  place="left"
                  isOpen={affiliationTypeError}
                >
                  Choose an affiliation type
                </Tooltip>
                <Tooltip
                  anchorSelect=".university_name_anchor_element"
                  place="left"
                  isOpen={universityNameError}
                >
                  Choose your university
                </Tooltip>
                <InputField
                  className={"first_name_anchor_element"}
                  label="First Name *"
                  placeholder={profile.firstName}
                  name="firstName"
                  value={editedProfile.firstName || ""}
                  onChange={(e) => {
                    handleInputChange(e);
                    setFirstNameError(false);
                  }}
                  required={true}
                />
                <InputField
                  className={"last_name_anchor_element"}
                  label="Last Name *"
                  placeholder={profile.lastName}
                  name="lastName"
                  value={editedProfile.lastName || ""}
                  onChange={(e) => {
                    handleInputChange(e);
                    setLastNameError(false);
                  }}
                  required={true}
                />
                <TextareaField
                  className={"mt-4"}
                  label="Short Description *"
                  placeholder="Enter a short description"
                  name="description"
                  value={editedProfile.description || ""}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  rows={1}
                  maxLength={MAX_SHORT_DESC}
                  hint={`Max ${MAX_SHORT_DESC} characters.`}
                  required={true}
                />
                <p
                  className={`text-xs mb-4 ${
                    shortDescriptionLength === MAX_SHORT_DESC
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {shortDescriptionLength}/{MAX_SHORT_DESC}
                </p>

                <SelectField
                  className={"university_name_anchor_element"}
                  label={"University Name *"}
                  name={"universityName"}
                  value={editedProfile.affiliation?.universityName || ""}
                  options={universities}
                  onChange={(e) => {
                    handleInputChange(e);
                    setAffiliationTypeError(false);
                  }}
                />
                <div className="mt-4"></div>
                <SelectField
                  className={"affiliation_type_anchor_element"}
                  label={"Affiliation Type *"}
                  name={"affiliationType"}
                  value={
                    editedProfile.affiliation?.affiliationType ||
                    affiliationTypes[0]
                  }
                  options={affiliationTypes}
                  onChange={(e) => {
                    handleInputChange(e);
                    setUniversityNameError(false);
                  }}
                />
              </div>
            ) : (
              <>
                <h1 className="text-black text-3xl font-semibold">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-gray-600 text-sm">{profile.email}</p>
                <p className="text-gray-500 mt-2">
                  {profile.description || "No description added yet"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* User Roles */}
        <div className="flex flex-wrap gap-2 mt-4">
          {roles.map((role, index) => (
            <span
              key={index}
              className="px-6 py-1 bg-blue-800 text-white rounded-full text-sm"
            >
              {CapitalizeFirstLetter(role.split("_")[1].toLowerCase())}
            </span>
          ))}
        </div>

        {/* Affiliation Section */}
        <div className="mt-6 bg-gray-300 border-dashed border-gray-500 border-2 rounded-lg p-4 w-full max-w-md shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Affiliation</h2>
          <p className="text-gray-600 mt-1">
            <span className="font-semibold">Type:</span>{" "}
            {profile.affiliation?.affiliationType
              ? CapitalizeFirstLetter(
                  profile.affiliation.affiliationType.toLowerCase(),
                )
              : "Not specified"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">University:</span>{" "}
            {profile.affiliation?.universityName || "Not specified"}
          </p>
        </div>

        {/* Quick Stats */}

        <div
          className={`grid gap-20 bg-gray-900 p-4 rounded-xl mt-6 text-center grid-cols-3`}
        >
          {checkRole(TUTOR_ROLE) && (
            <div
              className="cursor-pointer hover:bg-gray-800 rounded-md py-2"
              onClick={() => navigate("/tutor-centre")}
            >
              <p className=" text-2xl font-bold text-blue-300">
                {coursesCountTutor}
              </p>
              <p className="text-sm text-gray-300">Courses Offered</p>
            </div>
          )}
          {checkRole(STUDENT_ROLE) && (
            <div
              className="cursor-pointer hover:bg-gray-800 rounded-md py-2"
              onClick={() => navigate("/my-courses")}
            >
              <p className=" text-2xl font-bold text-blue-300">
                {coursesCountStudent}
              </p>
              <p className="text-sm text-gray-300">Courses Enrolled</p>
            </div>
          )}
          {meetings && (
            <div className="py-2">
              <p className="text-2xl font-bold text-blue-300">
                {meetings.length}
              </p>
              <p className="text-sm text-gray-300">Upcoming Meetings</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col md:flex-row gap-3">
          {isEditing ? (
            <>
              <ActionButton
                onClick={handleEditToggle}
                text={"Cancel"}
                icon={"close"}
                design={"neutral"}
              />
              <ActionButton
                onClick={handleSave}
                text={"Update"}
                icon={"sync"}
                design={"action"}
              />
            </>
          ) : (
            <ActionButton
              onClick={handleEditToggle}
              text={"Edit Profile"}
              icon={"edit"}
              design={"neutral"}
            />
          )}
          {user && checkRole(TUTOR_ROLE) && (
            <ActionButton
              onClick={() => {
                navigate("/tutor?id=" + user.id);
              }}
              text={"My Tutor Profile"}
              design={"action"}
              icon={"school"}
            />
          )}
          <ActionButton
            onClick={logout}
            text={"Log out"}
            design={"alert"}
            icon={"logout"}
          />
          <ActionButton
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}
            text={"Delete Account"}
            icon={"delete_forever"}
            design={"alert"}
          />
          <ConfirmationDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Delete Account?"
            message="Are you sure you want to delete your account? All associated data will be removed."
            confirmText="Delete Forever"
            confirmIcon={"delete_forever"}
            onConfirm={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
