import Header from "@/kanban/components/Header";

export default function BoardMainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
        {children}
      </main>
    </div>
  );
}
