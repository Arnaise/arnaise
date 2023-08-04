import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";

const options = [
  { label: "Grapes 🍇", value: "grapes" },
  { label: "Mango 🥭", value: "mango" },
  { label: "Strawberry 🍓", value: "strawberry" },
];

const SETTINGS = {
  allItemsAreSelected: "All items are selected.",
  clearSearch: "Clear Search",
  clearSelected: "Clear Selected",
  noOptions: "No options",
  search: "Search",
  selectAll: "Select All",
  selectAllFiltered: "Select All (Filtered)",
  selectSomeItems: "Select...",
  create: "Create",
};

const MultipleSelect = (props) => {
  const [selected, setSelected] = useState([]);

  return (
    <div className="mt-8">
      <span className="capitalize text-base font-semibold text-slate-500 tracking-tighter leading-relaxed">
        {props?.mainLabel}
      </span>
      <MultiSelect
        options={options}
        overrideStrings={{
          ...SETTINGS,
          selectSomeItems: props?.label,
          allItemsAreSelected:`All ${props?.mainLabel} are selected.`
        }}
        value={selected}
        shouldToggleOnHover={true}
        onChange={setSelected}
        labelledBy={props?.label}
        className="__MULTI_SELECT__"
      />
    </div>
  );
};

export default MultipleSelect;
