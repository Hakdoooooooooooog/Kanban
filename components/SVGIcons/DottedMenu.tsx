import React from "react";

const DottedMenu = ({
  width = "5",
  height = "20",
  className = "",
}: {
  width?: string;
  height?: string;
  className?: string;
}) => {
  return (
    <svg width={width} height={height} className={className}>
      <circle cx="2.30769" cy="2.30769" r="2.30769" fill="#828FA3" />
      <circle cx="2.30769" cy="10.0001" r="2.30769" fill="#828FA3" />
      <circle cx="2.30769" cy="17.6922" r="2.30769" fill="#828FA3" />
    </svg>
  );
};

export default DottedMenu;
