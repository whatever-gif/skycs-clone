import React, { useEffect, useRef, useState } from "react";

export interface DropdownProps {
  isOpen: boolean;
  size?: string;
  buttonTemplate: any;
  menuTemplate: any;
  className?: string;
  menuContainerTag?: string;
  closeWhenClickOutside?: boolean;
  onChange?: Function;
}
export default function DropDown({
  isOpen = false,
  size = "md",
  buttonTemplate,
  menuTemplate,
  className,
  menuContainerTag = "div",
  closeWhenClickOutside = true,
  onChange,
}: DropdownProps) {
  const dropdownRef = useRef<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(isOpen);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event: any) => {
    if (!closeWhenClickOutside) return;
    if (
      dropdownRef &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange(dropdownOpen);
    }
  }, [dropdownOpen]);

  useEffect(() => {
    setDropdownOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, false);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, false);
    };
  });

  return (
    <span ref={dropdownRef} className="relative">
      <a onClick={toggleDropdown}>{buttonTemplate}</a>

      {dropdownOpen ? (
        <div className="absolute z-10 top-5">{menuTemplate}</div>
      ) : null}
    </span>
  );
}
