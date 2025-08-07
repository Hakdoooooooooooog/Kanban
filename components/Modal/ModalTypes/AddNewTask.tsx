import { useEffect, useMemo, useState } from "react";
import { ModalState } from "@/kanban/lib/store/useModalStore";
import {
  Subtask,
  Tasks,
  useTasksStore,
} from "@/kanban/lib/store/useTasksStore";
import { generateUUID } from "@/kanban/lib/utils";
import { useShallow } from "zustand/shallow";
import { Field, Fieldset, Form, Select } from "@base-ui-components/react";
import Button from "../../button";
import { useColumnStore } from "@/kanban/lib/store/useColumnStore";
import "./styles.css";

const AddNewTask = ({ modal }: { modal: ModalState["data"] }) => {
  const [status, setStatus] = useState<string>("");
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

  const handleSelectedStatus = (value: string) => {
    setStatus(value);
  };

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

  useEffect(() => {
    if (statusOptions.length > 0) {
      setStatus(statusOptions[0]); // Set default status to the first option
    }
  }, [statusOptions]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Form onSubmit={handleAddTask} className="Form">
          <Fieldset.Root name="add-new-task" className="Field">
            <Fieldset.Legend className="Legend">Add New Task</Fieldset.Legend>
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
            <Field.Root className="Field">
              <Field.Label className="Label">Description</Field.Label>
              <textarea className="w-full h-24 p-2 border rounded-md" />

              <Field.Error className="Error">
                Description is optional but recommended for clarity.
              </Field.Error>
            </Field.Root>

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
                      {/* Add a Delete SVG Icon */}

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
                variant="tertiary"
                props={{
                  type: "button",
                  className: "w-full",
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
              <Dropdown
                options={statusOptions}
                onSelect={handleSelectedStatus}
                selected={status}
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

const Dropdown = ({
  options,
  onSelect,
  selected,
}: {
  options: string[];
  onSelect: (value: string) => void;
  selected: string;
}) => {
  const selectItems = useMemo(() => {
    return options.map((option) => ({
      value: option,
      label: option.charAt(0).toUpperCase() + option.slice(1),
    }));
  }, [options]);

  return (
    <Select.Root items={selectItems}>
      <Select.Trigger className="Select">
        <Select.Value render={<span>{selected}</span>} />
        <Select.Icon className="SelectIcon">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="Positioner" sideOffset={8}>
          <Select.ScrollUpArrow className="ScrollArrow" />
          <Select.Popup className="Popup">
            {selectItems.map((item, index) => (
              <Select.Item
                key={index}
                value={item.value}
                className="Item"
                onClick={() => onSelect(item.value)}
              >
                <Select.ItemIndicator className="ItemIndicator">
                  <CheckIcon className="ItemIndicatorIcon" />
                </Select.ItemIndicator>
                <Select.ItemText className="ItemText">
                  {item.label}
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
          <Select.ScrollDownArrow className="ScrollArrow" />
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
};

const ChevronDownIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
      <path d="M1 3.5L5 7.5L9 3.5" stroke="currentcolor" strokeWidth="1.5" />
    </svg>
  );
};

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="currentcolor"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      {...props}
    >
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  );
}

export default AddNewTask;
