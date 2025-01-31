import React from "react";

const ActionButton = ({
  onClick,
  text,
  type = "button",
  design,
  className = "",
  icon = null,
}) => {
  let bgColor;
  switch (design) {
    case "action":
      bgColor = "bg-blue-800";
      break;
    case "neutral":
      bgColor = "bg-gray-300";
      break;
    case "alert":
      bgColor = "bg-red-800";
      break;
    case "positive":
      bgColor = "bg-green-600";
      break;
    default:
      bgColor = "bg-blue-800";
      break;
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${bgColor} ${design === "neutral" ? "text-black" : "text-white"} max-h-12 rounded-full  py-2 px-4 whitespace-nowrap inline-flex items-center hover:scale-[0.97] transition-all ease-in-out duration-200 ${className}`}
    >
      {icon && (
        <span className="material-symbols-rounded text-xl mr-2">{icon}</span>
      )}
      {text}
    </button>
  );
};

export default ActionButton;
