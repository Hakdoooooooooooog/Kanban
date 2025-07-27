"use client";

import { SidebarProvider } from "../contexts/SidebarContext";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import Board from "../components/Board";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen relative overflow-hidden custom-scrollbar">
        <Sidebar />
        <MainContent>
          <Header />
          <Board />
        </MainContent>
      </div>
    </SidebarProvider>
  );
}
