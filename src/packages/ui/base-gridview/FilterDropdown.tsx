import React, { useEffect, useState } from "react";
import DropDown from "../dropdown/DropDownDiv";

export default function FilterDropdown({
  buttonTemplate,
  genFilterFunction,
}: {
  buttonTemplate: any;
  genFilterFunction: any;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const close = () => {
    setDropdownOpen(false);
  };

  return (
    <>
      <DropDown
        closeWhenClickOutside={false}
        isOpen={dropdownOpen}
        onChange={(open: any) => setDropdownOpen(open)}
        className="pr-2"
        menuContainerTag="div"
        buttonTemplate={
          <span className="filterContainer cursor-pointer">
            {buttonTemplate}
          </span>
        }
        menuTemplate={<div>{genFilterFunction}</div>}
      />
    </>
  );
}
