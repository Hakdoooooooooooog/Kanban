"use client";

import React from "react";
import DottedMenu from "../SVGIcons/DottedMenu";
import Button from "../button";

const Header = () => {
  return (
    <div className="w-full max-h-[97px] flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-black dark:text-white">
        Platform Launch
      </h2>
      <div className="flex items-center gap-4">
        <Button onClick={() => console.log("New Task")}>+ Add New Task</Button>

        <DottedMenu />
      </div>
    </div>
  );
};

export default Header;
