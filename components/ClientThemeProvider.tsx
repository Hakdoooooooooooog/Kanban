"use client";

import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";

interface ClientThemeProviderProps {
  children: React.ReactNode;
}

export const ClientThemeProvider: React.FC<ClientThemeProviderProps> = ({
  children,
}) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
