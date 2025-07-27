"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useSidebar } from "../../contexts/SidebarContext";
import SidebarHeader from "./components/SidebarHeader";
import BoardsList from "./components/BoardsList";
import ThemeToggle from "../ThemeToggle";
import SidebarFooter from "./components/SidebarFooter";

const Sidebar = () => {
  const { setSidebarHidden } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const showButtonRef = useRef<HTMLButtonElement>(null);

  const handleAddBoard = () => {
    console.log("Add New Board clicked");
  };

  const handleHideSidebar = () => {
    if (!sidebarRef.current || !showButtonRef.current) return;

    setSidebarHidden(true);

    const tl = gsap.timeline();

    // Animate sidebar out
    tl.to(sidebarRef.current, {
      x: -300,
      duration: 0.4,
      ease: "power2.inOut",
    }).fromTo(
      showButtonRef.current,
      {
        x: -60,
        opacity: 0,
        scale: 0.8,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)",
      }
    );
  };

  const handleShowSidebar = () => {
    if (!sidebarRef.current || !showButtonRef.current) return;

    const tl = gsap.timeline();

    tl.to(showButtonRef.current, {
      x: -60,
      opacity: 0,
      scale: 0.8,
      duration: 0.2,
      ease: "power2.in",
    }).to(sidebarRef.current, {
      x: 0,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => setSidebarHidden(false),
    });
  };

  useEffect(() => {
    if (showButtonRef.current) {
      gsap.set(showButtonRef.current, { x: -60, opacity: 0, scale: 0.8 });
    }
  }, []);

  return (
    <>
      {/* Main Sidebar */}
      <nav
        ref={sidebarRef}
        className="absolute left-0 top-0 w-[300px] h-full bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 border-r border-r-gray-200 dark:border-r-gray-50 z-10"
        style={{ transform: "translateX(0px)" }}
      >
        <SidebarHeader />

        <BoardsList onAddBoard={handleAddBoard} />

        <div className="w-3/4 flex flex-col gap-4 justify-between pb-16 mx-auto">
          <ThemeToggle />
          <SidebarFooter onHide={handleHideSidebar} />
        </div>
      </nav>

      {/* Show Sidebar Button - appears when sidebar is hidden */}
      <button
        ref={showButtonRef}
        onClick={handleShowSidebar}
        className="fixed w-16 left-0 bottom-16 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white p-3 rounded-r-full shadow-lg z-20 transition-colors duration-200"
        aria-label="Show Sidebar"
        style={{
          transform: "translateX(-60px) scale(0.8)",
          opacity: 0,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="mx-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
};

export default Sidebar;
