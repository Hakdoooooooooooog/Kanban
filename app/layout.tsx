import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import Sidebar from "../components/Sidebar";
import ToastContainer from "../components/Toast";

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
    <html suppressHydrationWarning lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getPreferredTheme() {
                  const stored = localStorage.getItem('theme');
                  if (stored === 'light' || stored === 'dark') {
                    return stored;
                  }
                  
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    return 'dark';
                  }
                  
                  return 'light';
                }
                
                const theme = getPreferredTheme();
                document.documentElement.classList.add(theme);
              })();
            `,
          }}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </head>
      <body className={`${plusJakartaSans.variable} font-Jakarta antialiased`}>
        <div className="flex w-full min-h-dvh relative overflow-hidden custom-scrollbar">
          <Sidebar />
          <MainContent>
            <Header />
            {children}
          </MainContent>
        </div>
        <ToastContainer limit={3} />
      </body>
    </html>
  );
}
