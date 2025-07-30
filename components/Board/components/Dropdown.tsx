import { Menu } from "@base-ui-components/react";
import { useMemo } from "react";

const Dropdown = ({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) => {
  const getSelectedValue = useMemo(() => {
    const selectedOption = options.find((option) => option === selected);
    return selectedOption ? selectedOption : options[0];
  }, [options, selected]);

  return (
    <Menu.Root>
      <Menu.Trigger className="menu-btn">
        {getSelectedValue} <ChevronDownIcon className="inline-block ml-2" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className={"outline-0"} sideOffset={8}>
          <Menu.Popup className={"popup"}>
            <Menu.Arrow className={"arrow"}>
              <ArrowSvg />
            </Menu.Arrow>
            {options.map((option, index) => (
              <Menu.Item
                key={index}
                className="menu-item"
                onClick={() => onSelect(option)}
              >
                {option}
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
