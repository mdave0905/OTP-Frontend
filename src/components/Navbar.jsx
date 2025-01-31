import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import * as Auth from "../services/AuthService";
import { useAuth } from "../services/AuthContext";

export default function NavBar({ currentPage }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = Auth.isAuthenticated();

  const roleBasedMenuItems = {
    ROLE_STUDENT: [
      { label: "Messages", path: "/messages" },
      { label: "Student Centre", path: "/student-centre" },
    ],
    ROLE_TUTOR: [
      { label: "Messages", path: "/messages" },
      { label: "Tutor Centre", path: "/tutor-centre" },
    ],
  };

  const getMenuItems = () => {
    if (!user?.roles) return [];

    return Array.from(
      new Set(
        user.roles
          .flatMap((role) => roleBasedMenuItems[role.toUpperCase()] || [])
          .map((item) => JSON.stringify(item)),
      ),
    ).map((item) => JSON.parse(item));
  };

  const menuItems = [{ label: "Home", path: "/" }, ...getMenuItems()];

  return (
    <nav className="flex justify-between items-center w-full bg-white fixed z-50 shadow-md shadow-black/5">
      {/* Logo and Title */}
      <div
        className="flex items-center m-5 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="Logo" className="h-8 w-auto mr-2" />
        <span className="text-xl font-merriweather_sans">THUtorium</span>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-4">
        {menuItems.map(({ label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`px-4 py-2 rounded-md text-sm font-merriweather_sans ${
              currentPage === path ? "bg-gray-300" : "hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Authentication Buttons */}
      <div className="flex items-center px-4">
        {isLoggedIn ? (
          <button
            onClick={() => navigate("/profile")}
            className={`px-4 py-2 text-sm border font-merriweather_sans rounded-full flex items-center transition-all ease-in-out duration-200 ${
              currentPage !== "/profile"
                ? "hover:bg-black hover:text-white border-black"
                : "bg-black text-white"
            }`}
          >
            <span className="material-symbols-rounded mr-2 text-xl">
              person
            </span>
            My Account
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => navigate("/login")}
              className={` text-sm border rounded-full py-2 px-4 font-merriweather_sans ${
                currentPage === "/login"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black hover:bg-black hover:text-white border-black"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className={` text-sm border rounded-full py-2 px-4 font-merriweather_sans ${
                currentPage === "/signup"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black hover:bg-black hover:text-white border-black"
              }`}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
