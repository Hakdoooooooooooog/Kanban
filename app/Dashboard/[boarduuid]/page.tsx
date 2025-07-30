import Board from "@/kanban/components/Board";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boarduuid: string }>;
}) {
  const { boarduuid } = await params;
  return <Board boardId={boarduuid} />;
}
