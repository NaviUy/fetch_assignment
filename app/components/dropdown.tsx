import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useState, useEffect, useRef, useCallback } from "react";

export default function Dropdown({
  label,
  selectedValue,
  handler,
  options,
  closeDropdownOnClick,
  containerStyles,
}: {
  label: string;
  selectedValue: string | string[];
  handler: (value: string) => void;
  options: string[];
  closeDropdownOnClick?: boolean;
  containerStyles?: string;
}) {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [dropdownDirection, setDropdownDirection] = useState<"up" | "down">("down");
  const dropdownRef = useRef<HTMLButtonElement>(null);

  const findDropDownDirection = useCallback(() => {
    if (openDropdown && dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const estimatedDropdownHeight = 190;
        if (rect.bottom + estimatedDropdownHeight > window.innerHeight) {
          setDropdownDirection("up");
        } else {
          setDropdownDirection("down");
        }
      }
  }, [openDropdown]);

  useEffect(() => {
    findDropDownDirection();
  }, [findDropDownDirection])

  const bgColors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"];

  function getColorForBreed(breed: string): string {
    // Use the first character of the breed (converted to uppercase)
    const firstChar = breed[0].toUpperCase();
    // Get the char code of the first character
    const code = firstChar.charCodeAt(0);
    // Use modulo to select a color from your array
    return bgColors[code % bgColors.length];
  }

  const buttonStyles = typeof selectedValue === "string" ? "" : "max-h-full overflow-auto";
  const buttonDiv = typeof selectedValue === "string" ? "" : "self-start flex flex-wrap gap-2";

  return (
    <div className={classNames(`relative ${containerStyles}`)}>
      <span className="text-black text-xs font-bold">{label}: </span>
      <button
        ref={dropdownRef}
        className={classNames(`w-full text-black font-medium border border-gray-500 flex justify-between items-center px-4 py-2 rounded-md ${buttonStyles}`)}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (e.target instanceof Element && !e.target.classList.contains("remove-button")) {
            setOpenDropdown(!openDropdown);
          }
        }}
      >
        <div className={classNames(`font-bold ${buttonDiv}`)}>
          {typeof selectedValue === "string"
            ? selectedValue
            : selectedValue.length > 0
            ? selectedValue.map((value) => (
                <div key={value} className={classNames(`w-fit h-fit px-2 py-1 ${getColorForBreed(value)}`)}>
                  {value}
                  <span className="ml-2 remove-button" onClick={() => {
                    handler(value);
                    findDropDownDirection();
                    }}>
                    x
                  </span>
                </div>
              ))
            : `${label}`}
        </div>
        <FontAwesomeIcon icon={faChevronDown} className={classNames("transition-all self-start py-1", { "rotate-180": openDropdown })} />
      </button>
      <ul className={classNames("absolute text-black overflow-scroll z-10 bg-gray-100 border-gray-500 mt-2 flex flex-col gap-2 max-h-0 w-full rounded-md", { "max-h-40 border": openDropdown }, {'md:bottom-full': dropdownDirection === 'up', '': dropdownDirection === 'down'})}>
        {options.map((option, index) => {
          return (
            <li
              key={index}
              className={classNames("px-2 py-1 cursor-pointer", { "text-green-500": typeof selectedValue === "string" ? false : selectedValue.some((selectedValue) => selectedValue === option) })}
              onClick={() => {
                if (closeDropdownOnClick) {
                  setOpenDropdown(false);
                }
                handler(option);
                findDropDownDirection();
              }}
            >
              {option}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
