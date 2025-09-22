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
import SelectDropdown from "../../select-dropdown";
import {
  SubmitHandler,
  useForm,
  useFieldArray,
  Controller,
} from "react-hook-form";
import CloseIcon from "../../SVGIcons/CloseIcon";
import { toast } from "../../Toast/toast";

// Define the form data type
type FormData = {
  title: string;
  description: string;
  subtasks: { title: string; isCompleted: boolean }[];
  status: string;
};

const AddNewTask = ({ modal }: { modal: ModalState["data"] }) => {
  const boardId =
    (modal as { data?: { boardId?: string } })?.data?.boardId || "";

  const { getColumnById } = useColumnStore(
    useShallow((state) => ({
      getColumnById: state.getColumnById,
    }))
  );

  const columns = getColumnById(boardId) || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      status: columns[0]?.status,
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

  const handleCancel = () => {
    reset();
    closeModal();
  };

  const handleAddSubtask = () => {
    append({ title: "", isCompleted: false });
  };

  const handleDeleteSubtask = (index: number) => {
    remove(index);
  };

  const onSubmitAddTask: SubmitHandler<FormData> = async (data) => {
    // Validate required fields with toasts
    if (!data.title.trim()) {
      toast.error("Title required", "Please enter a task title");
      return;
    }

    if (!data.status) {
      toast.error("Status required", "Please select a status for the task");
      return;
    }

    const selectedColumn = columns.find((col) => col.status === data.status);

    if (!selectedColumn) {
      console.error("No column found for selected status:", data.status);
      return;
    }

    const taskId = generateUUID();

    // Convert form subtasks to proper Subtask format
    const formattedSubtasks: Subtask[] = data.subtasks
      ? data.subtasks.map((subtask) => ({
          id: generateUUID(),
          taskId: taskId,
          title: subtask.title,
          isCompleted: subtask.isCompleted,
        }))
      : [];

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

      // Show success toast
      toast.success(
        "Task created successfully!",
        `"${data.title}" has been added to ${data.status}`
      );

      reset();
      closeModal();
    } catch (error) {
      toast.error(
        "Failed to add task. Please try again.",
        error instanceof Error ? error.message : undefined
      );
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
                className={`Input ${errors.title ? "border-red-500" : ""}`}
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
                          className={`Input ${
                            errors.subtasks?.[index]?.title
                              ? "border-red-500"
                              : ""
                          }`}
                          type="text"
                        />
                        <CloseIcon
                          isError={!!errors.subtasks?.[index]?.title}
                          props={{
                            onClick: () => handleDeleteSubtask(index),
                          }}
                        />
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
                    options={columns.map((col) => col.status)}
                    onSelect={(value) => field.onChange(value)}
                    selected={field.value}
                    error={!!errors.status}
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
