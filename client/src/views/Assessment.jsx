import React, { useEffect, useState } from "react";
import QuestionTab from "../components/QuestionTab";
import CustomButton from "../components/CustomButton";
import { formatSelections, makeConjugationQuestions } from "../UTILS.js";
import { prepareLanguageText } from "../CONSTANT.jsx";

export default function Assessment(props) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (props?.selection) {
      setQuestions(
        makeConjugationQuestions(
          formatSelections(props?.selection, props?.subjects)
        )
      );
      setLoading(false);
    }
  }, []);

  const chooseRandomQuestion = (total = questions.length) => {
    setIndex(Math.floor(Math.random() * total));
  };
  const backToHome = () => {
    props?.clearSelection();
    props?.setIsAssessment(false);
  };

  const LOADING_HTML = () => {
    return (
      <div className="py-[4rem] bg-white shadow-2xl rounded-lg flex justify-center items-center">
        <svg
          aria-hidden="true"
          className="inline w-10 h-10 text-gray-500 animate-spin fill-black"
          viewBox="0 0 100 101"
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
      </div>
    );
  };
  return (
    <div className="mt-10 xl:mt-20 mb-10 flex flex-col md:flex-col justify-center items-center">
      <div className="mb-0 xl:mb-5 flex flex-col w-full">
        <h1 className="text-center text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight mb-4">
          {prepareLanguageText("Conjugations", "Conjugaisons")}
          <div className="my-5"></div>
          <span className="leading-tighter tracking-tighter text-_accent_1_">
            {prepareLanguageText("Assessment", "Évaluation")}
          </span>
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="px-5 md:px-0 w-full md:w-2/3">
          {loading ? (
            <LOADING_HTML />
          ) : (
            <QuestionTab
              subject={questions[index].subject}
              verb={questions[index].verb}
              tense={questions[index].tense}
              chooseRandomQuestion={chooseRandomQuestion}
              setLoading={setLoading}
              isLoggedIn={props?.session?.isLoggedIn}
              userId={props?.session?.personal?.id}
              updatePoints={props?.updatePoints}
              backToHome={backToHome}
            />
          )}
        </div>
      </div>
    </div>
  );
}
