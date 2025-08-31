export default function BoardMainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-[calc(100dvh-73px)] flex items-center justify-center flex-col gap-4">
      {children}
    </div>
  );
}
