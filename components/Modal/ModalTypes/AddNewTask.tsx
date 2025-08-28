import { useState, useEffect } from "react";
import {
  ModalState,
  ModalType,
  useModalStore,
} from "@/kanban/lib/store/useModalStore";
import {
  Subtask,
  Tasks,
  useTasksStore,
} from "@/kanban/lib/store/useTasksStore";
import { generateUUID } from "@/kanban/lib/utils";
import { useShallow } from "zustand/shallow";
import { Field, Fieldset, Form } from "@base-ui-components/react";
import Button from "../../button";
import { useColumnStore } from "@/kanban/lib/store/useColumnStore";
import "./styles.css";
import SelectDropdown from "../../Board/components/Dropdown";

const AddNewTask = ({ modal }: { modal: ModalState["data"] }) => {
  const [status, setStatus] = useState<ModalType | undefined>(undefined);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  const { addTask } = useTasksStore(
    useShallow((state) => ({
      addTask: state.addTask,
    }))
  );

  const { closeModal } = useModalStore(
    useShallow((state) => ({
      closeModal: state.closeModal,
    }))
  );

  const boardId =
    (modal as { data?: { boardId?: string } })?.data?.boardId || "";

  const { getAllColumnStatusByBoardId, getColumnById } = useColumnStore(
    useShallow((state) => ({
      getAllColumnStatusByBoardId: state.getAllColumnStatusByBoardId,
      getColumnById: state.getColumnById,
    }))
  );

  const statusOptions = getAllColumnStatusByBoardId(boardId);
  const columns = getColumnById(boardId) || [];

  // Reset form state when modal opens
  useEffect(() => {
    setStatus(undefined);
    setSubtasks([]);
  }, [modal]);

  // Handle cancel - close modal and reset form
  const handleCancel = () => {
    setStatus(undefined);
    setSubtasks([]);
    closeModal();
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: generateUUID(), taskId: "", title: "" }]);
  };

  const handleSubtaskChange = (index: number, title: string) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].title = title;
    setSubtasks(updatedSubtasks);
  };

  const handleDeleteSubtask = (index: number) => {
    const updatedSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(updatedSubtasks);
  };

  const handleAddTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Convert FormData to object
    const formDataObject = Object.fromEntries(formData.entries());

    // Validate required fields
    if (!formDataObject.title || !status) {
      console.error("Missing required fields");
      return;
    }

    // Find the column ID that matches the selected status
    const selectedColumn = columns.find((col) => col.status === status);
    if (!selectedColumn) {
      console.error("No column found for selected status:", status);
      return;
    }

    const taskId = generateUUID();

    const newTask: Tasks = {
      id: taskId,
      title: formDataObject.title as string,
      description: (formDataObject.description as string) || "",
      boardId: boardId,
      columnId: selectedColumn.id,
      subtasks: subtasks
        .filter((subtask) => subtask.title.trim() !== "")
        .map((subtask) => ({ ...subtask, taskId })),
    };

    try {
      addTask(newTask);

      // Reset form state
      setStatus(undefined);
      setSubtasks([]);

      // Close modal after successful task creation
      closeModal();
    } catch (error) {
      console.error("Error adding task:", error);
      // Don't close modal if there's an error
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Form onSubmit={(e) => handleAddTask(e)} className="Form">
          <Fieldset.Root name="add-new-task" className="Field">
            <Fieldset.Legend className="Legend">Add New Task</Fieldset.Legend>

            {/* Task Title */}
            <Field.Root className="Field">
              <Field.Label className="Label">Task Title</Field.Label>
              <Field.Control
                name="title"
                required
                placeholder="e.g. Design a new logo"
                className="Input"
              />

              <Field.Error className="Error">
                Task title is required.
              </Field.Error>
            </Field.Root>

            {/* Description */}
            <Field.Root className="Field">
              <Field.Label className="Label">Description</Field.Label>
              <textarea
                name="description"
                className="w-full h-24 p-2 border rounded-md"
                placeholder="Add a description for this task..."
              />

              <Field.Error className="Error">
                Description is optional but recommended for clarity.
              </Field.Error>
            </Field.Root>

            {/* Subtasks */}
            <Field.Root className="Field">
              <Field.Label className="Label">Subtasks</Field.Label>
              {subtasks.length > 0 ? (
                <ul className="p-2 w-full flex flex-col gap-2 max-h-40 overflow-y-auto">
                  {subtasks.map((subtask, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Field.Control
                        required
                        placeholder="e.g. Create wireframes, Get feedback from team"
                        className="Input"
                        value={subtask.title}
                        onChange={(e) =>
                          handleSubtaskChange(index, e.target.value)
                        }
                      />
                      <svg
                        className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500 transition-colors duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="none"
                        onClick={() => {
                          handleDeleteSubtask(index);
                        }}
                      >
                        <line
                          x1="4"
                          y1="4"
                          x2="16"
                          y2="16"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <line
                          x1="16"
                          y1="4"
                          x2="4"
                          y2="16"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="w-full flex items-center gap-2">
                  <li className="text-gray-500">No subtasks added yet.</li>
                </ul>
              )}

              <Button
                variant="secondary"
                props={{
                  type: "button",
                  className: "w-full cursor-pointer",
                  onClick: handleAddSubtask,
                }}
              >
                + Add Subtask
              </Button>

              <Field.Error className="Error">
                At least one subtask is required.
              </Field.Error>
            </Field.Root>

            <Field.Root className="Field">
              <Field.Label className="Label">Status</Field.Label>
              <SelectDropdown
                options={statusOptions}
                onSelect={(value) => setStatus(value as ModalType)}
                selected={status ?? "Select Status"}
              />
              {/* Hidden input to capture status value in form data */}
              <input type="hidden" name="status" value={status || ""} />
              <Field.Error>Status is required.</Field.Error>
            </Field.Root>
          </Fieldset.Root>

          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              props={{
                type: "button",
                onClick: handleCancel,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              props={{
                type: "submit",
              }}
            >
              + Add Task
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddNewTask;
