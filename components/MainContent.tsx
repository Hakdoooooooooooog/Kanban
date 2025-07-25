"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useSidebar } from "../contexts/SidebarContext";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent = ({ children }: MainContentProps) => {
  const { isSidebarHidden } = useSidebar();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Animate content area when sidebar state changes
    gsap.to(contentRef.current, {
      width: isSidebarHidden ? "100%" : "calc(100% - 300px)",
      marginLeft: isSidebarHidden ? 0 : 300,
      duration: 0.4,
      ease: "power2.inOut",
    });
  }, [isSidebarHidden]);

  return (
    <div
      ref={contentRef}
      className="flex-1 transition-all duration-400 ease-in-out"
      style={{
        width: isSidebarHidden ? "100%" : "calc(100% - 300px)",
        marginLeft: isSidebarHidden ? "0px" : "300px",
      }}
    >
      {children}
    </div>
  );
};

export default MainContent;
