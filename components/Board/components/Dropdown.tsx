import { Menu } from "@base-ui-components/react";

type DropdownOption =
  | {
      label: string;
      value: string;
    }
  | string;

const Dropdown = ({
  options,
  selected,
  onSelect,
}: {
  options: DropdownOption[];
  selected: string;
  onSelect: (value: string) => void;
}) => {
  // Helper function to get the display label
  const getLabel = (option: DropdownOption) => {
    return typeof option === "string" ? option : option.label;
  };

  // Helper function to get the value
  const getValue = (option: DropdownOption) => {
    return typeof option === "string" ? option : option.value;
  };

  // Get the display label for the selected value
  const getSelectedLabel = () => {
    const selectedOption = options.find(
      (option) => getValue(option) === selected
    );
    return selectedOption ? getLabel(selectedOption) : selected;
  };

  return (
    <Menu.Root>
      <Menu.Trigger className="menu-btn">
        {getSelectedLabel()} <ChevronDownIcon className="inline-block ml-2" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className={"outline-0"} sideOffset={8}>
          <Menu.Popup className={"popup"}>
            <Menu.Arrow className={"arrow"}>
              <ArrowSvg />
            </Menu.Arrow>
            {options.map((option, index) => (
              <Menu.Item
                key={getValue(option) || index}
                className="menu-item"
                onClick={() => onSelect(getValue(option))}
              >
                {getLabel(option)}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
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

export default Dropdown;
