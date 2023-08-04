import React from "react";

const Shape = ({ className, size, position, shapeType }) => {
  let shapeStyles;
  switch (shapeType) {
    case "circle":
      shapeStyles = "rounded-full";
      break;
    case "square":
      shapeStyles = "rounded-md";
      break;
    case "triangle":
      shapeStyles = "clip-path: polygon(50% 0%, 0% 100%, 100% 100%);";
      break;
    default:
      shapeStyles = "rounded-full";
  }

  return (
    <div
      className={`${size} opacity-30 absolute ${position} ${shapeStyles} blur-3xl ${className}`}
    ></div>
  );
};

export default function BackgroundBlur() {
  return (
    <div className="fixed w-screen h-screen -z-10">
      <Shape
        position={"-bottom-[13rem] -left-[13rem]"}
        size={"w-[30rem] h-[30rem]"}
        className="bg-gradient-to-r from-rose-700 to-pink-600"
        shapeType="circle"
      />
      {/* <Shape
        position={"-top-[7rem] -right-[7rem]"}
        size={"w-[30rem] h-[30rem]"}
        className="bg-gradient-to-r from-rose-100 to-teal-100"
        shapeType="square"
      /> */}
    </div>
  );
}
