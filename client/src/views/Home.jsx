import React, { useState, useEffect, useContext } from "react";
import MultipleSelect from "../components/MultipleSelect";
import CustomButton from "../components/CustomButton";
import UserData from "../contexts/UserData";
import { CONSTANT, capitalizeFirstLetter } from "../CONSTANT";
import Assessment from "./Assessment";
import { formatSelections, makeConjugationQuestions } from "../UTILS";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  let navigate = useNavigate();
  const { session, setSession, options, updatePoints } = useContext(UserData);
  // min-h-[calc(100vh-4rem)]

  const [isAssessment, setIsAssessment] = useState(false);

  const __init__ = {
    tenses: [],
    regularVerbs: [],
    irregularVerbs: [],
  };
  const [selection, setSelection] = useState(__init__);

  const clearSelection = () => {
    setSelection(__init__);
  };

  const changeSelection = (name, value) => {
    setSelection({
      ...selection,
      [name]: value,
    });
  };

  if (isAssessment) {
    return (
      <Assessment
        selection={selection}
        subjects={options?.subjects}
        session={session}
        setIsAssessment={setIsAssessment}
        clearSelection={clearSelection}
        updatePoints={updatePoints}
      />
    );
  }

  const createRoom = async () => {
    let questions = makeConjugationQuestions(
      formatSelections(selection, options?.subjects),
      false
    );
    await axios
      .post(CONSTANT.server + "room/create", {
        creator: session?.personal?.id,
        questions_json: JSON.stringify(questions),
      })
      .then((responce) => {
        if (responce.status === 201) {
          navigate("/rooms");
        } else {
          console.log("Error creating room:", responce.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="mt-20 mb-10 flex flex-col md:flex-col justify-center items-center">
      <div className="mb-5 flex flex-col w-full">
        <h1 className="text-center text-3xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
          Master
          <div className="my-5"></div>
          <span className="leading-tighter tracking-tighter text-_accent_1_">
            French Conjugations
          </span>
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="px-5 md:px-0 w-full md:w-1/2">
          <MultipleSelect
            mainLabel={"tenses"}
            label="Ex. Imparfait"
            options={options.tenses.map((tense, index) => {
              return {
                label: capitalizeFirstLetter(tense.label),
                value: tense.value,
                id: tense.id,
                points: tense.points,
              };
            })}
            value={selection.tenses}
            onChange={changeSelection}
            name="tenses"
          />
          <MultipleSelect
            mainLabel={"regular verbs"}
            label="Ex. Coûter"
            options={options.verbs
              .filter((verb, index) => {
                return verb.isRegular;
              })
              .map((verb, index) => {
                return {
                  label: capitalizeFirstLetter(verb.value),
                  value: verb.value,
                  id: verb.id,
                  isRegular: verb.isRegular,
                };
              })}
            value={selection.regularVerbs}
            onChange={changeSelection}
            name="regularVerbs"
          />
          <MultipleSelect
            mainLabel={"irregular verbs"}
            label="Ex. S'asseoir"
            options={options.verbs
              .filter((verb, index) => {
                return !verb.isRegular;
              })
              .map((verb, index) => {
                return {
                  label: capitalizeFirstLetter(verb.value),
                  value: verb.value,
                  id: verb.id,
                };
              })}
            value={selection.irregularVerbs}
            onChange={changeSelection}
            name="irregularVerbs"
          />
          <div className="mt-10 flex justify-center items-center space-x-5">
            <CustomButton
              label="Start"
              onClick={() => {
                setIsAssessment(true);
              }}
              disabled={
                selection.tenses.length <= 0 ||
                (selection.regularVerbs.length <= 0 &&
                  selection.irregularVerbs.length <= 0)
              }
            />
            {session?.isLoggedIn && (
              <CustomButton
                label="Create Room"
                onClick={createRoom}
                disabled={
                  selection.tenses.length <= 0 ||
                  (selection.regularVerbs.length <= 0 &&
                    selection.irregularVerbs.length <= 0)
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
