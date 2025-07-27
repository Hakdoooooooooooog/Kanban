"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import useSidebarStore from "../lib/store/useSidebarStore";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent = ({ children }: MainContentProps) => {
  const { isSidebarHidden } = useSidebarStore();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Animate content area when sidebar state changes
    gsap.to(contentRef.current, {
      width: isSidebarHidden ? "100%" : "calc(100vw - 300px)",
      marginLeft: isSidebarHidden ? 0 : 300,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        contentRef.current!.style.overflow = isSidebarHidden
          ? "hidden"
          : "auto";
      },
    });
  }, [isSidebarHidden]);

  return (
    <main
      ref={contentRef}
      className={`"flex-1 transition-all duration-400 ease-in-out" ${
        isSidebarHidden ? "ml-0 w-full" : "ml-[300px] w-[calc(100vw-300px)]"
      }`}
    >
      {children}
    </main>
  );
};

export default MainContent;
