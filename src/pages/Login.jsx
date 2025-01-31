import NavBar from "../components/Navbar";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useAuth } from "../services/AuthContext";
import apiClient from "../services/AxiosConfig";
import ActionButton from "../components/ActionButton";

function Login() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [authFailedError, setAuthFailedError] = useState(false);
  const { login } = useAuth();

  const toggleVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginClick = async () => {
    const emailValid = validateEmail(email);

    setEmailError(!emailValid);
    setAuthFailedError(false);

    if (!emailValid) {
      return;
    }
    try {
      const { data } = await apiClient.post("/auth/login", {
        email,
        password,
      });
      login(data.token);
      navigate("/profile");
    } catch (error) {
      if (error.response?.status === 500) {
        setAuthFailedError(true);
      } else {
        console.error("Login failed", error);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <NavBar currentPage={"/login"} />
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center w-full px-4">
        <div className="flex flex-col justify-center w-full max-w-xl bg-gray-100 p-10 rounded-2xl font-merriweather_sans">
          <div className="flex items-center justify-center text-2xl">
            Welcome back! 👋
          </div>
          <label className="text-sm font-medium mt-7 text-black">Email</label>
          <div className="relative mt-1">
            <span className="material-symbols-rounded absolute inset-y-0 left-3 flex items-center text-gray-800">
              email
            </span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
              placeholder="username@thu.de"
              className={`pl-11 pr-4 py-2 rounded-md w-full border border-gray-300 focus:ring-1 focus:ring-gray-950 focus:outline-none email_anchor_element`}
            />
          </div>
          <Tooltip
            anchorSelect=".email_anchor_element"
            place="right"
            isOpen={emailError}
          >
            Enter a valid email
          </Tooltip>

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
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="• • • • • • • •"
              className={`pl-11 pr-4 py-2 rounded-md w-full border border-gray-300 focus:ring-1 focus:ring-gray-950 focus:outline-none password_anchor_element`}
            />
            <span
              className="cursor-pointer material-symbols-rounded absolute inset-y-0 right-3 flex items-center text-gray-800"
              onClick={toggleVisibility}
            >
              {passwordVisible ? "visibility" : "visibility_off"}
            </span>
          </div>

          <div
            className="inline-flex mt-2 justify-end text-blue-900 cursor-pointer self-end w-auto"
            onClick={() => {
              alert("Too bad :(");
            }}
          >
            Forgot password?
          </div>
          {authFailedError && (
            <p className="text-red-500 mt-2">
              Incorrect email or password, try again.
            </p>
          )}
          <ActionButton
            className={"items-center justify-center mt-4"}
            onClick={handleLoginClick}
            text={"Log In"}
            design={"action"}
          />
          <div
            className="inline-flex items-center justify-center text-sm mt-3 cursor-pointer w-fit mx-auto"
            onClick={() => navigate("/signup")}
          >
            Not a member yet?
            <span className="ml-1">
              <b>Register now</b>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
