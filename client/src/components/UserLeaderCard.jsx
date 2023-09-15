import React from "react";

const UserLeaderCard = (props) => {
  const decideColor = () => {
    if (props?.index === 1) {
      return "bg-amber-50 hover:bg-amber-200";
    }
    if (props?.index === 2) {
      return "bg-blue-50 hover:bg-blue-200";
    }
    if (props?.index === 3) {
      return "bg-orange-50 hover:bg-orange-200";
    }
    return null;
  };
  return (
    <div
      className={`${decideColor() || "bg-white hover:bg-gray-100"} ${
        props?.className
      } cursor-pointer relative transition-all duration-300 ease-in-out rounded-lg shadow-2xl py-4 flex items-center px-10`}
    >
      {props?.index === 1 && (
        <div className="absolute -top-7 -right-9">
          <img src="/assets/gold.png" className="h-14 rotate-[35deg]" />
        </div>
      )}
      {props?.index === 2 && (
        <div className="absolute -top-7 -right-9">
          <img src="/assets/silver.png" className="h-14 rotate-[35deg]" />
        </div>
      )}
      {props?.index === 3 && (
        <div className="absolute -top-7 -right-9">
          <img src="/assets/bronze.png" className="h-14 rotate-[35deg]" />
        </div>
      )}
      <div className="w-full">
        <p className="font-bold text-lg">@{props?.data?.username}</p>
        <div className="flex justify-between items-center">
          <div className="flex flex-col flex-1">
            <p className="text-base text-gray-600 mt-1">
              Points: <span className="font-bold">{props?.data?.points}</span>
            </p>
            <p className="text-base text-gray-600 mt-1">
              Correct: <span className="font-bold">{props?.data?.correct}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-600 mr-5">
        {props?.position}
      </div>
    </div>
  );
};

export default UserLeaderCard;
