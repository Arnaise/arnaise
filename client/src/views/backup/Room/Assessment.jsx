import React, { useEffect, useState } from "react";
import QuestionTab from "../../components/Room/QuestionTab";
import { BG_COLORS } from "../../CONSTANT";

export default function Assessment(props) {
  const [questions, setQuestions] = useState(props?.questions);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (props?.players?.length > 0) {
      let current = props?.players?.find((a, b) => {
        return parseInt(a?.id) === parseInt(props?.session?.personal?.id);
      })?.attempt;
      if (current >= 10) {
        current = questions.length - 1;
      }
      setIndex(current);
    }
    setLoading(false);
  }, [props]);

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

  const PROGRESS_LINE = ({
    index = 0,
    width = 90,
    name = "",
    isMe = false,
  }) => {
    // let distance = `translateY(${(index+1)*10}px)`
    width = parseInt(width);
    let distance = `translateY(15px)`;
    return (
      <div className="absolute top-0 h-2 w-full" key={index}>
        <div
          style={{ width: `${width}%` }}
          className={`${
            isMe ? "bg-blue-500" : BG_COLORS[index]
          } h-2 transition-all duration-300 rounded ease-in-out shadow-none whitespace-nowrap flex flex-col`}
        >
          {width !== 0 && (
            <span
              className={`text-right ${
                isMe ? "text-blue-500 font-semibold" : "text-black"
              }`}
              style={{
                transform: distance,
              }}
            >
              {isMe ? "You" : name.split(" ")[0]}
            </span>
          )}
        </div>
      </div>
    );
  };

  const evaluateProgress = (count) => {
    return count * 10;
  };

  return (
    <div className="mt-10 xl:mt-20 mb-10 flex flex-col md:flex-col justify-center items-center">
      <div className="mb-0 xl:mb-5 flex flex-col w-full">
        <h1 className="text-center text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">
          Conjugations{" "}
          <span className="leading-tighter tracking-tighter text-_accent_1_">
            Competition
          </span>
        </h1>
        <span className="text-center text-2xl text-gray-500">
        Lobby#{props?.code}
        </span>
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="px-5 md:px-0 w-full md:w-2/3">
          {loading ? (
            <LOADING_HTML />
          ) : (
            <>
              <QuestionTab
                subject={questions[index].subject}
                verb={questions[index].verb}
                tense={questions[index].tense}
                setLoading={setLoading}
                setIndex={setIndex}
                isLast={index === questions.length - 1}
                isLoggedIn={props?.session?.isLoggedIn}
                userId={props?.session?.personal?.id}
                index={index}
                total={questions?.length}
                stopGame={props?.stopGame}
                updateProgress={props?.updateProgress}
              />
              <div className="mt-10 py-10 px-4 md:px-10 bg-white shadow-2xl rounded-lg">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {`${evaluateProgress(
                          props?.players?.find((a, b) => {
                            return (
                              parseInt(a?.id) ===
                              parseInt(props?.session?.personal?.id)
                            );
                          })?.attempt || 0
                        )}%`}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-2 mb-4 text-xs flex rounded bg-blue-200">
                    {props?.players
                      ?.filter((a, b) => {
                        return a?.isInLobby;
                      })
                      ?.map((play, index) => {
                        return (
                          <PROGRESS_LINE
                            key={play?.id}
                            name={play?.username}
                            width={evaluateProgress(play?.attempt)}
                            index={index}
                            isMe={
                              parseInt(play?.id) ===
                              parseInt(props?.session?.personal?.id)
                            }
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
