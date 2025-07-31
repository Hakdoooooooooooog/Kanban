import { Select } from "@base-ui-components/react";
import { useMemo } from "react";

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

export default Dropdown;
