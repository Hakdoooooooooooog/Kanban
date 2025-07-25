"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useSidebar } from "../contexts/SidebarContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isSidebarHidden } = useSidebar();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Animate content area width when sidebar state changes
    gsap.to(contentRef.current, {
      marginLeft: isSidebarHidden ? 0 : 300,
      duration: 0.4,
      ease: "power2.inOut",
    });
  }, [isSidebarHidden]);

  return (
    <div className="flex min-h-screen relative">
      {children}
      {/* Content area that adjusts based on sidebar state */}
      <div
        ref={contentRef}
        className="flex-1 transition-all duration-400 ease-in-out"
        style={{ marginLeft: isSidebarHidden ? '0px' : '300px' }}
      >
        {/* This div will contain your main content */}
      </div>
    </div>
  );
};

export default Layout;
