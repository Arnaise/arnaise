import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { prepareLanguageText } from "../CONSTANT";

const options = [
  { label: "Grapes 🍇", value: "grapes" },
  { label: "Mango 🥭", value: "mango" },
  { label: "Strawberry 🍓", value: "strawberry" },
];

const SETTINGS = {
  allItemsAreSelected: prepareLanguageText(
    "All items are selected.",
    "Tous les éléments sont sélectionnés."
  ),
  clearSearch: "Clear Search",
  clearSelected: "Clear Selected",
  noOptions: "No options",
  search: prepareLanguageText("Search", "Recherchez"),
  selectAll: prepareLanguageText("Select All", "Sélectionnez tous"),
  selectAllFiltered: "Select All (Filtered)",
  selectSomeItems: "Select...",
  create: "Create",
};

const MultipleSelect = (props) => {
  const [selected, setSelected] = useState([]);

  return (
    <div className="mt-3 w-full">
      <span className="capitalize text-base font-semibold text-slate-500 tracking-tighter leading-relaxed">
        {props?.mainLabel}
      </span>
      <MultiSelect
        options={props?.options ?? options}
        overrideStrings={{
          ...SETTINGS,
          selectSomeItems: props?.label,
          allItemsAreSelected: prepareLanguageText(
            "All selected.",
            "Tous sélectionnés."
          ),
        }}
        value={props?.value}
        shouldToggleOnHover={false}
        onChange={(val) => {
          props?.onChange(props?.name, val);
        }}
        labelledBy={props?.label}
        className="__MULTI_SELECT__"
      />
    </div>
  );
};

export default MultipleSelect;
