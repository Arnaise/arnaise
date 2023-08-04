import React from "react";

export default function InputBox(props) {
  return (
    <div className="p-[2px] rounded-lg hover:bg-blue-500 focus:bg-blue-500 bg-white transition-all duration-300 ease-in-out">
      <label htmlFor={props?.name} className="sr-only">
        {props?.placeholder}
      </label>
      <input
        className="p-3 w-full bg-white hover:bg-slate-100 focus:bg-slate-100 transition-all duration-300 ease-in-out rounded-lg focus:outline-none outline-none border-none ring-0 focus:ring-0"
        type={props?.type ?? "text"}
        name={props?.name}
        id={props?.name}
        placeholder={props?.placeholder}
        value={props?.value}
        onChange={props?.onChange}
      />
    </div>
  );
}
