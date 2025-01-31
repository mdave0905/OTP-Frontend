import NavBar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import apiClient from "../services/AxiosConfig";
import { useAuth } from "../services/AuthContext";
import { Tooltip } from "react-tooltip";
import ActionButton from "../components/ActionButton";

function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "STUDENT", // Default role
  });
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [conflictError, setConflictError] = useState(false);

  const toggleVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegisterClick = async () => {
    const emailValid = validateEmail(formData.email);
    const passwordValid = formData.password.length >= 8;
    const firstNameValid = formData.firstName.length > 0;
    const lastNameValid = formData.lastName.length > 0;

    setEmailError(!emailValid);
    setPasswordError(!passwordValid);
    setFirstNameError(!firstNameValid);
    setLastNameError(!lastNameValid);
    setConflictError(false);

    if (!emailValid || !passwordValid || !firstNameValid || !lastNameValid) {
      return;
    }
    try {
      const { data } = await apiClient.post("/auth/register", formData);
      login(data.token);
      navigate("/profile");
    } catch (error) {
      if (error.response?.status === 409) {
        setConflictError(true);
      } else {
        console.error("Registration failed", error);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <NavBar currentPage={"/signup"} />
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center w-full px-4">
        <div className="flex flex-col justify-center w-full max-w-xl bg-gray-100 p-10 rounded-2xl font-merriweather_sans">
          <div className="flex items-center justify-center text-2xl">
            Come join us! 🤝
          </div>
          {/* Error Tooltips */}
          <Tooltip
            anchorSelect=".email_anchor_element"
            place="right"
            isOpen={emailError}
          >
            Enter a valid email
          </Tooltip>
          <Tooltip
            anchorSelect=".password_anchor_element"
            place="right"
            isOpen={passwordError}
          >
            Enter at least 8 characters
          </Tooltip>
          <Tooltip
            anchorSelect=".firstName_anchor_element"
            place="left"
            isOpen={firstNameError}
          >
            Enter your first name
          </Tooltip>
          <Tooltip
            anchorSelect=".lastName_anchor_element"
            place="right"
            isOpen={lastNameError}
          >
            Enter your last name
          </Tooltip>

          {/* Form Fields */}
          <div className="flex justify-between">
            <label className="text-sm font-medium mt-7 w-full text-black">
              First Name
            </label>
            <label className="text-sm font-medium mt-7 w-full ml-2 text-black">
              Last Name
            </label>
          </div>
          <div className="flex justify-center">
            <div className="relative mt-1">
              <span className="material-symbols-rounded absolute inset-y-0 left-3 flex items-center text-gray-800">
                id_card
              </span>
              <input
                type="text"
                name="first_name"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
                  setFirstNameError(false);
                }}
                className="firstName_anchor_element pl-11 mr-1 pr-4 py-2 rounded-md w-full border border-gray-300 focus:ring-1 focus:ring-gray-950 focus:outline-none"
              />
            </div>
            <div className="relative mt-1">
              <span className="material-symbols-rounded absolute inset-y-0 left-3 flex items-center text-gray-800">
                id_card
              </span>
              <input
                type="text"
                name="last_name"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value });
                  setLastNameError(false);
                }}
                className="lastName_anchor_element pl-11 ml-1 pr-4 py-2 rounded-md w-full border border-gray-300 focus:ring-1 focus:ring-gray-950 focus:outline-none"
              />
            </div>
          </div>
          <label className="text-sm font-medium mt-4 text-black">Email</label>
          <div className="relative mt-1">
            <span className="material-symbols-rounded absolute inset-y-0 left-3 flex items-center text-gray-800">
              email
            </span>
            <input
              type="email"
              name="email"
              placeholder="username@thu.de"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setEmailError(false);
              }}
              className="email_anchor_element pl-11 pr-4 py-2 rounded-md w-full border border-gray-300 focus:ring-1 focus:ring-gray-950 focus:outline-none"
            />
          </div>
          <label className="text-sm font-medium mt-4 text-black">
            Password
          </label>
          <div className="relative mt-1">
            <span className="material-symbols-rounded absolute inset-y-0 left-3 flex items-center text-gray-800">
              lock
            </span>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Enter at least 8 characters"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setPasswordError(false);
              }}
              className="password_anchor_element pl-11 pr-4 py-2 rounded-md w-full border border-gray-300 focus:ring-1 focus:ring-gray-950 focus:outline-none"
            />
            <span
              className="cursor-pointer material-symbols-rounded absolute inset-y-0 right-3 flex items-center text-gray-800"
              onClick={toggleVisibility}
            >
              {passwordVisible ? "visibility" : "visibility_off"}
            </span>
          </div>
          {/* Role Selection */}
          <div className="mt-4">
            <label className="text-sm font-medium text-black">Role</label>
            <div className="flex items-center mt-2">
              <label className="flex items-center cursor-pointer mr-4">
                <input
                  type="radio"
                  name="role"
                  value="STUDENT"
                  checked={formData.role === "STUDENT"}
                  onChange={() => setFormData({ ...formData, role: "STUDENT" })}
                  className="mr-2"
                />
                Student
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="TUTOR"
                  checked={formData.role === "TUTOR"}
                  onChange={() => setFormData({ ...formData, role: "TUTOR" })}
                  className="mr-2"
                />
                Tutor
              </label>
            </div>
          </div>
          {conflictError && (
            <p className="text-red-500 mt-2">
              Email is already registered with this role.
            </p>
          )}

          <ActionButton
            className={"items-center justify-center mt-4"}
            onClick={handleRegisterClick}
            text={"Sign Up"}
            design={"action"}
          />
          <div
            className="inline-flex items-center justify-center text-sm mt-3 cursor-pointer w-fit mx-auto"
            onClick={() => navigate("/login")}
          >
            Already a member?
            <span className="ml-1">
              <b>Log in now</b>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
