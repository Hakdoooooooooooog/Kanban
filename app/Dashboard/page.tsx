import Board from "@/kanban/components/Board";
import Header from "@/kanban/components/Header";
import MainContent from "@/kanban/components/MainContent";
import Sidebar from "@/kanban/components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen relative overflow-hidden custom-scrollbar">
      <Sidebar />
      <MainContent>
        <Header />
        <Board />
      </MainContent>
    </div>
  );
}
