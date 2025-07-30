export default function BoardMainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[90%] flex items-center justify-center flex-col gap-4">
      {children}
    </div>
  );
}
