import { useState } from "react";
import { ModalState, ModalType } from "@/kanban/lib/store/useModalStore";
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

  const boardId =
    (modal as { data?: { boardId?: string } })?.data?.boardId || "";

  const { getAllColumnStatusByBoardId } = useColumnStore(
    useShallow((state) => ({
      getAllColumnStatusByBoardId: state.getAllColumnStatusByBoardId,
    }))
  );

  const statusOptions = getAllColumnStatusByBoardId(boardId);

  const handleAddSubtask = () => {
    // Logic to add a subtask
    console.log("Add subtask clicked");
  };

  const handleAddTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    console.log("Form Data:", Object.fromEntries(formData.entries()));
    // Logic to add a new task

    // addTask({
    //   ...(Object.fromEntries(formData.entries()) as unknown as Tasks),
    //   id: generateUUID(),
    //   boardId: newTaskModalData.data?.boardId || "",
    //   columnId: "TODO", // Default to TODO or based on your logic
    //   subtasks: subtasks,
    // });
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <Form onSubmit={handleAddTask} className="Form">
          <Fieldset.Root name="add-new-task" className="Field">
            <Fieldset.Legend className="Legend">Add New Task</Fieldset.Legend>

            {/* Task Title */}
            <Field.Root className="Field">
              <Field.Label className="Label">Task Title</Field.Label>
              <Field.Control
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
              <textarea className="w-full h-24 p-2 border rounded-md" />

              <Field.Error className="Error">
                Description is optional but recommended for clarity.
              </Field.Error>
            </Field.Root>

            {/* Subtasks */}
            <Field.Root className="Field">
              <Field.Label className="Label">Subtasks</Field.Label>
              {subtasks.length > 0 ? (
                <ul className="w-full flex flex-col gap-2">
                  {subtasks.map((subtask, index) => (
                    <li key={index}>
                      <Field.Control
                        required
                        placeholder="e.g. Create wireframes, Get feedback from team"
                        className="Input"
                      />
                      <svg
                        className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500 transition-colors duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="none"
                        onClick={() => {
                          // Logic to delete the subtask
                          console.log("Delete subtask clicked");
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
              <Field.Error>Status is required.</Field.Error>
            </Field.Root>
          </Fieldset.Root>

          <Button
            variant="primary"
            props={{
              type: "submit",
            }}
          >
            + Add Task
          </Button>
        </Form>
      </div>
    </>
  );
};

export default AddNewTask;
