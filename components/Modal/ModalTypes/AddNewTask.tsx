import { useEffect } from "react";
import { ModalState, useModalStore } from "@/kanban/lib/store/useModalStore";
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
import {
  SubmitHandler,
  useForm,
  useFieldArray,
  Controller,
} from "react-hook-form";

// Define the form data type
type FormData = {
  title: string;
  description: string;
  subtasks: { title: string }[];
  status: string;
};

const AddNewTask = ({ modal }: { modal: ModalState["data"] }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit", // This ensures validation happens on submit
    defaultValues: {
      title: "",
      description: "",
      subtasks: [],
      status: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

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

  const handleCancel = () => {
    reset();
    closeModal();
  };

  const handleAddSubtask = () => {
    append({ title: "" });
  };

  const handleDeleteSubtask = (index: number) => {
    remove(index);
  };

  const onSubmitAddTask: SubmitHandler<FormData> = async (data) => {
    const selectedColumn = columns.find((col) => col.status === data.status);

    if (!selectedColumn) {
      console.error("No column found for selected status:", data.status);
      return;
    }

    const taskId = generateUUID();

    // Convert form subtasks to proper Subtask format
    const formattedSubtasks: Subtask[] = data.subtasks
      .filter((subtask) => subtask.title.trim() !== "")
      .map((subtask) => ({
        id: generateUUID(),
        taskId: taskId,
        title: subtask.title,
        isCompleted: false,
      }));

    const newTask: Tasks = {
      id: taskId,
      title: data.title,
      description: data.description,
      boardId: boardId,
      columnId: selectedColumn.id,
      subtasks: formattedSubtasks,
    };

    try {
      addTask(newTask);

      // Reset form and close modal
      reset();
      closeModal();
    } catch (error) {
      console.error("Error adding task:", error);
      // Don't close modal if there's an error
    }
  };

  // Reset form state when modal opens
  useEffect(() => {
    reset();
  }, [modal, reset]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Form onSubmit={handleSubmit(onSubmitAddTask)} className="Form">
          <Fieldset.Root name="add-new-task" className="Field">
            <Fieldset.Legend className="Legend">Add New Task</Fieldset.Legend>

            {/* Task Title */}
            <Field.Root className="Field">
              <Field.Label className="Label">Task Title</Field.Label>
              <input
                {...register("title", { required: "Task title is required" })}
                placeholder="e.g. Design a new logo"
                className="Input w-full p-2 border rounded-md"
                type="text"
              />
              {errors.title && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </div>
              )}
            </Field.Root>

            {/* Description */}
            <Field.Root className="Field">
              <Field.Label className="Label">Description</Field.Label>
              <textarea
                {...register("description")}
                className="w-full h-24 p-2 border rounded-md"
                placeholder="Add a description for this task..."
              />
            </Field.Root>

            {/* Subtasks */}
            <Field.Root className="Field">
              <Field.Label className="Label">Subtasks</Field.Label>
              {fields.length > 0 ? (
                <ul className="p-2 w-full flex flex-col gap-2 max-h-40 overflow-y-auto">
                  {fields.map((field, index) => (
                    <li key={field.id} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <input
                          {...register(`subtasks.${index}.title` as const, {
                            required: "Subtask title is required",
                            minLength: {
                              value: 1,
                              message: "Subtask title cannot be empty",
                            },
                            validate: (value) => {
                              if (!value || value.trim().length === 0) {
                                return "Subtask cannot be empty";
                              }
                              if (value.trim().length < 3) {
                                return "Subtask must be at least 3 characters";
                              }
                              return true;
                            },
                          })}
                          placeholder="e.g. Create wireframes, Get feedback from team"
                          className="Input flex-1 p-2 border rounded-md"
                          type="text"
                        />
                        <svg
                          className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500 transition-colors duration-200"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="none"
                          onClick={() => handleDeleteSubtask(index)}
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
                      </div>
                      {/* Display individual subtask errors */}
                      {errors.subtasks?.[index]?.title && (
                        <div className="text-red-500 text-sm">
                          {errors.subtasks[index]?.title?.message}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="w-full flex items-center gap-2">
                  <li className="text-gray-500">No subtasks added yet.</li>
                </ul>
              )}

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  props={{
                    type: "button",
                    className: "flex-1 cursor-pointer",
                    onClick: handleAddSubtask,
                  }}
                >
                  + Add Subtask
                </Button>
              </div>
            </Field.Root>

            <Field.Root className="Field">
              <Field.Label className="Label">Status</Field.Label>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <SelectDropdown
                    options={statusOptions}
                    onSelect={(value) => field.onChange(value)}
                    selected={field.value || "Select Status"}
                  />
                )}
              />
              {errors.status && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.status.message}
                </div>
              )}
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
