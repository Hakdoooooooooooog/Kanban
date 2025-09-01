import React from "react";

const CloseIcon = ({
  isError,
  props,
}: {
  isError: boolean;
  props: React.SVGProps<SVGSVGElement>;
}) => {
  return (
    <svg
      className={`w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500 transition-colors duration-200 ${
        isError ? "text-red-500" : ""
      }`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <line
        x1="4"
        y1="4"
        x2="16"
        y2="16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="4"
        x2="4"
        y2="16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CloseIcon;
