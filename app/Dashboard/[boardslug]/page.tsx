export default function BoardPage({
  props,
}: {
  props: Promise<{ boardSlug: string }>;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Main content goes here */}
      </div>
    </div>
  );
}
