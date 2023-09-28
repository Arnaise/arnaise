import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import { TbHelpSquareRoundedFilled } from "react-icons/tb";
import { setMessage, resetMessage, CONSTANT } from "../CONSTANT";
import axios from "axios";
import { MdArrowBackIosNew } from "react-icons/md";
import { getConjugationAnswer } from "../UTILS";

const renderBadge = (value) => {
  if (!value) {
    return (
      <span className="bg-green-100 flex w-fit justify-center items-center capitalize text-green-800 text-md font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
        {LOADING_HTML()}
      </span>
    );
  }
  return (
    <span className="bg-green-100 capitalize text-green-800 text-md font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
      {value}
    </span>
  );
};

const LOADING_HTML = () => {
  return (
    <svg
      aria-hidden="true"
      className="inline w-4 h-4 text-gray-500 animate-spin fill-black"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  );
};

export default function QuestionTab(props) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (props?.subject && props?.verb && props?.tense) {
      setReady(true);
    }
  }, []);

  // Testing Start

  useEffect(() => {
    if (props?.subject && props?.verb && props?.tense) {
      let trueValue = getConjugationAnswer(
        props?.verb?.value,
        props?.tense?.value,
        props?.subject
      );
      // console.log(trueValue);
      if (!trueValue) {
        props?.chooseRandomQuestion();
      }
    }
  }, [props]);

  // Testing End

  const checkAnswer = (e) => {
    e.preventDefault();
    setReady(false);
    resetMessage();
    let trueValue = getConjugationAnswer(
      props?.verb?.value,
      props?.tense?.value,
      props?.subject
    );
    let isCorrect = true;
    if (trueValue.toLowerCase() === answer.toLowerCase()) {
      addLog(trueValue, true);
      setMessage("Correct!", "green-500");
    } else {
      isCorrect = false;
      addLog(trueValue, false);
      setMessage("Wrong!", "red-500");
    }
    setTimeout(() => {
      resetMessage();
      if (isCorrect) {
        setAnswer("");
        props?.setLoading(true);
        props?.chooseRandomQuestion();
        props?.setLoading(false);
      }
      setReady(true);
    }, 2000);
  };
  const addLog = async (trueValue, isCorrect) => {
    if (props?.isLoggedIn) {
      await axios
        .post(CONSTANT.server + "api/logs", {
          tense: props?.tense?.id,
          subject: props?.subject?.id,
          verb: props?.verb?.id,
          correctAnswer: trueValue,
          answer: answer,
          isCorrect: isCorrect,
          user: props?.userId,
        })
        .then((responce) => {
          let finalPoints = parseInt(props?.tense?.points);
          if (props?.verb?.isRegular) {
            finalPoints += 2;
          } else {
            finalPoints += 5;
          }
          props?.updatePoints(finalPoints);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const [answer, setAnswer] = useState("");

  return (
    <div className="relative py-[4rem] px-5 md:px-[10rem] bg-white shadow-2xl rounded-lg">
      <div
        onClick={props?.backToHome}
        className="cursor-pointer absolute top-[10px] left-[10px] hover:bg-gray-200 rounded-full p-3"
      >
        <MdArrowBackIosNew className="text-black h-[25px] w-[25px]" />
      </div>
      <div className="flex flex-row justify-evenly space-x-3 mb-10">
        <div className="flex flex-row space-x-2 justify-center items-center">
          <span className="text-gray-500">Verb:</span>{" "}
          <span className="">{renderBadge(props?.verb?.value)}</span>
        </div>
        <div className="flex flex-row space-x-2 justify-center items-center">
          <span className="text-gray-500">Tense:</span>{" "}
          <span className="">{renderBadge(props?.tense?.label)}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between space-x-3">
          <div className="py-2 px-3 rounded-lg bg-green-100 capitalize text-green-800 text-base font-medium">
            {props?.subject?.label || (
              <span className="bg-green-100 flex w-fit justify-center items-center capitalize text-green-800 text-md font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                {LOADING_HTML()}
              </span>
            )}
          </div>
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                className="border text-base rounded-lg w-full py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-300"
                placeholder={`Enter the correct form.`}
                // placeholder={`Enter the correct form of the verb for ${props?.verb?.value}.`}
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && answer !== "" && ready) {
                    checkAnswer(e);
                  }
                }}
              />
              {/* <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                <TbHelpSquareRoundedFilled
                  size={"2rem"}
                  onClick={() => {
                    alert("help required");
                  }}
                />
              </div> */}
            </div>
          </div>
          <div className="">
            <CustomButton
              label="Next"
              onClick={checkAnswer}
              disabled={answer === "" || !ready}
            />
          </div>
        </div>
      </div>

      {/* <div className="mb-4">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {props?.progress() || 0}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${props?.progress() || 0}%` }}
              className="transition-all duration-300 ease-in-out shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
            ></div>
          </div>
        </div>
      </div> */}
      <div className="text-center mt-10 text-2xl" id="error"></div>
    </div>
  );
}
