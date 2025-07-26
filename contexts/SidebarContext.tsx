import React, { createContext, JSX, useContext, useState } from "react";

interface SidebarContextType {
  isSidebarHidden: boolean;
  setSidebarHidden: (hidden: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}): JSX.Element => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const setSidebarHidden = (hidden: boolean) => {
    setIsSidebarHidden(hidden);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarHidden, setSidebarHidden }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
