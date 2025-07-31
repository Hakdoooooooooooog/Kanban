import { useModalStore, ModalType } from "@/kanban/lib/store/useModalStore";
import { Tasks } from "@/kanban/lib/store/useTasksStore";
import { useShallow } from "zustand/shallow";

const BoardCard = ({
  id: taskId,
  title,
  description,
  subtasks,
  boardId,
}: Tasks & { boardId: string }) => {
  const { openModal } = useModalStore(
    useShallow((state) => ({
      openModal: state.openModal,
    }))
  );

  const onOpenModal = () => {
    openModal(ModalType.EDIT_TASK, {
      taskId,
      boardId,
    });
  };

  const handleSubtaskCompletion = () => {
    const totalCompletedSubtasks = subtasks?.reduce(
      (acc, subtask) => acc + (subtask.isCompleted ? 1 : 0),
      0
    );

    if (totalCompletedSubtasks === undefined) {
      return 0;
    }

    return totalCompletedSubtasks;
  };

  return (
    <>
      <div
        onClick={onOpenModal}
        className="w-full p-4 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg shadow-sm cursor-pointer"
      >
        <h4 className="text-md text-black dark:text-white font-semibold">
          {title}
        </h4>
        {description && <p className="text-sm text-gray-600">{description}</p>}
        {subtasks && (
          <p className="text-sm text-gray-500 mt-2">
            {handleSubtaskCompletion()} out of {subtasks.length} subtasks
            completed
          </p>
        )}
      </div>
    </>
  );
};

export default BoardCard;
