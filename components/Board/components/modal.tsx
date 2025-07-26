import { Menu, Toggle } from "@base-ui-components/react";
import React from "react";
import DottedMenu from "../../SVGIcons/DottedMenu";
import "./modal.css";

const Modal = () => {
  return (
    // Modal Container
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      {/* Content Container */}
      <div className="flex flex-col gap-4 bg-gray-800 dark:bg-white rounded-md p-8 w-[480px] m-auto">
        <div className="flex items-center justify-between ">
          <h2 className="text-lg font-semibold text-white dark:text-black">
            Modal Title
          </h2>
          <DottedMenu />
        </div>
        <p className="text-sm text-gray-300 dark:text-gray-500">
          Modal Content
        </p>
        <div className="flex flex-col gap-4 mt-2">
          <h3 className="text-sm font-bold text-gray-300 dark:text-gray-500">
            Subtasks (0 of 1)
          </h3>
          {/* Subtasks */}
          <div className="flex items-center gap-3 p-3 bg-gray-900 dark:bg-gray-100 rounded-md">
            <Toggle
              className="toggle"
              render={(props, state) => {
                if (state.pressed) {
                  return (
                    <button type="button" {...props}>
                      <CheckedIcon />
                    </button>
                  );
                }

                return (
                  <button type="button" {...props}>
                    <UncheckedIcon />
                  </button>
                );
              }}
            />
            <p className="text-sm font-bold text-white dark:text-black">
              Research pricing points of various competitors and trial different
              business models
            </p>
          </div>

          <div className="w-full flex flex-col gap-2">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">
              Current Status
            </h3>
            <Menu.Root>
              <Menu.Trigger className="menu-btn">
                TODO <ChevronDownIcon className="inline-block ml-2" />
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner className={"outline-0"} sideOffset={8}>
                  <Menu.Popup className={"popup"}>
                    <Menu.Arrow className={"arrow"}>
                      <ArrowSvg />
                    </Menu.Arrow>
                    <Menu.Item className="menu-item">In Progress</Menu.Item>
                    <Menu.Item className="menu-item">Done</Menu.Item>
                    <Menu.Item className="menu-item">Archived</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowSvg = (props: React.ComponentProps<"svg">) => {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="arrowFill"
      />
    </svg>
  );
};

const ChevronDownIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
      <path d="M1 3.5L5 7.5L9 3.5" stroke="currentcolor" strokeWidth="1.5" />
    </svg>
  );
};

const CheckedIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="16" height="16" rx="2" fill="var(--color-primary)" />
    <path
      d="M4.5 8L7 10.5L11.5 6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UncheckedIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="1"
      y="1"
      width="14"
      height="14"
      rx="2"
      stroke="var(--color-gray-500)"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

export default Modal;
