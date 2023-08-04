import React from "react";
import MultipleSelect from "../components/MultipleSelect";

export default function Home() {
  return (
    <div className="relative flex flex-col md:flex-row min-h-[calc(100vh-4rem)] justify-center items-center">
      <div className="flex flex-col md:w-1/2 w-full">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
          Learn & Practice
          <div className="my-5"></div>
          <span className="leading-tighter tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-rose-700 to-pink-600">
            Conjugations
          </span>{" "}
          with
          <div className="my-5"></div>
          <span className="flex flex-row leading-tighter tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-rose-700 to-pink-600">
            French.{" "}
            <img
              src="https://pngimg.com/d/france_PNG12.png"
              className="w-[6rem] ml-5"
            />
          </span>
        </h1>
        <img
          src="/assets/eiffel_tower.svg"
          className="absolute bottom-0 left-[25%] w-[30rem]"
        />
      </div>
      <div className="flex flex-col justify-center items-center md:w-1/2 w-full">
        <div className="w-1/2 backdrop-blur-3xl rounded-3xl bg-white/30 p-10">
          <h1 className="text-center text-3xl font-extrabold leading-tight tracking-tight mb-8">
            Choose{" "}
            <span className="leading-tighter tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-rose-700 to-pink-600">
              &
            </span>{" "}
            Start
          </h1>
          <MultipleSelect mainLabel={"tenses"} label="Ex. PASSE_SIMPLE" />
          <MultipleSelect mainLabel={"subjects"} label="Ex. VOUS" />
          <MultipleSelect mainLabel={"verbs"} label="Ex. ALLER" />
        </div>
      </div>
    </div>
  );
}
