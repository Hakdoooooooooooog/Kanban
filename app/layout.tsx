import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-Jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kanban App",
  description: "A Kanban board application built with Next.js and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${plusJakartaSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
