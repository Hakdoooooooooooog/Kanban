export default async function BoardPage({
  props,
}: {
  props: Promise<{ boarduuid: string }>;
}) {
  const { boarduuid } = await props;
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Main content goes here */}
      </div>
    </div>
  );
}
