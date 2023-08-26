import React from "react";

const Help = (props) => {
  return (
    <>
      {props?.isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-white opacity-70"
            onClick={props?.onClose}
          ></div>

          {/* Modal Content */}
          <div className="bg-white p-8 border-2 shadow-2xl z-10 md:w-2/5 w-full">
            {props?.children}
          </div>
        </div>
      ) : null}
    </>
  );
};
export default Help;
