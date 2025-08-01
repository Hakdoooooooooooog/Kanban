import React from "react";

const LogoKanban = ({
  width = "24",
  height = "25",
  className = "",
  style = {},
}: {
  width?: string;
  height?: string;
  className?: string;
  style?: React.SVGProps<SVGSVGElement>["style"];
}) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      style={style}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Group 15">
        <rect id="Rectangle" width="6" height="25" rx="2" fill="#635FC7" />
        <rect
          id="Rectangle Copy"
          opacity="0.75"
          x="9"
          width="6"
          height="25"
          rx="2"
          fill="#635FC7"
        />
        <rect
          id="Rectangle Copy 2"
          opacity="0.5"
          x="18"
          width="6"
          height="25"
          rx="2"
          fill="#635FC7"
        />
      </g>
    </svg>
  );
};

export default LogoKanban;
