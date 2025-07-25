import React from "react";
import LogoKanban from "../../SVGIcons/LogoKanban";

const SidebarHeader = () => {
  return (
    <div className="flex items-center gap-4 p-4">
      <LogoKanban className="icon" />
      <h1 className="text-xl font-bold text-gray-100 dark:text-black">
        Kanban
      </h1>
    </div>
  );
};

export default SidebarHeader;
