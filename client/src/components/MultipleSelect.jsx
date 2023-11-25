import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { prepareLanguageText } from "../CONSTANT";

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
    <div className="mt-3 w-full md:w-1/4">
      <span className="capitalize text-base font-semibold text-slate-500 tracking-tighter leading-relaxed">
        {props?.mainLabel}
      </span>
      <MultiSelect
        options={props?.options ?? []}
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
        className={`__MULTI_SELECT__ ${props?.className}`}
      />
    </div>
  );
};

export default MultipleSelect;
