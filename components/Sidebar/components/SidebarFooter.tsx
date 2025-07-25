import React from "react";
import EyeSlash from "../../icons/EyeSlash";

interface SidebarFooterProps {
  onHide?: () => void;
}

const SidebarFooter = ({ onHide }: SidebarFooterProps) => {
  return (
    <div className="w-fit flex items-center gap-4">
      <EyeSlash className="icon" />
      <span
        onClick={onHide || (() => console.log("Hide Sidebar clicked"))}
        className="text-gray-500 dark:text-gray-400 cursor-pointer"
      >
        Hide Sidebar
      </span>
    </div>
  );
};

export default SidebarFooter;
