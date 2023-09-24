import axios from "axios";
import { getConjugation, getAux } from "french-verbs";
import Lefff from "french-verbs-lefff/dist/conjugations.json";
import { CONSTANT } from "./CONSTANT";

export const makeConjugationQuestions = (selection, all = true) => {
  const questions = [];

  selection.verbs.forEach((verb) => {
    selection.subjects.forEach((subject) => {
      selection.tenses.forEach((tense) => {
        if (all) {
          questions.push({
            verb: verb,
            subject: subject,
            tense: tense,
          });
        } else {
          if (
            getConjugationAnswer(
              verb?.value,
              tense?.value,
              parseInt(subject?.value)
            )
          ) {
            questions.push({
              verb: verb,
              subject: subject,
              tense: tense,
            });
          }
        }
      });
    });
  });
  let randomizedQuestions = questions.sort(() => Math.random() - 0.5);
  if (!all) {
    return randomizedQuestions.slice(0, 10);
  }
  return randomizedQuestions;
};

export const formatSelections = (selection, subjects) => {
  return {
    tenses: selection.tenses,
    verbs: [...selection.regularVerbs, ...selection.irregularVerbs],
    subjects: subjects,
  };
};

export const ecm = (type, data) => {
  return JSON.stringify({ type: type.toLowerCase(), data: data });
};
export const dcm = (data) => {
  return JSON.parse(data);
};
export const getConjugationAnswer = (verb, tense, subject) => {
  let answer = null;
  let isAvoir = false;

  try {
    if (getAux(verb) === "AVOIR") {
      isAvoir = true;
    }
  } catch (e) {
    console.log("ERROR: ", e);
  }

  try {
    if (tense === "PASSE_COMPOSE" || tense === "PLUS_QUE_PARFAIT") {
      // 0=je, 1=tu, 2=il/elle, 3=nous, 4=vous, 5=ils/elles.
      let options = {
        agreeNumber: "S",
        agreeGender: "M",
      };
      if (subject?.label === "elle") {
        options = {
          agreeNumber: "S",
          agreeGender: "F",
        };
      } else if (subject?.label === "elles") {
        options = {
          agreeNumber: "P",
          agreeGender: "F",
        };
      } else if (["nous", "vous", "ils"].includes(subject?.label)) {
        options = {
          agreeNumber: "P",
          agreeGender: "M",
        };
      }
      if (isAvoir) {
        options = {};
      }
      // console.log(options);
      answer = getConjugation(Lefff, verb, tense, parseInt(subject?.value), {
        ...options,
      });
    } else {
      answer = getConjugation(Lefff, verb, tense, parseInt(subject?.value));
    }
  } catch (error) {
    // console.log(error);
    // addError(error?.message);
  }

  return answer;
};

const addError = async (error) => {
  try {
    await axios.post(CONSTANT.server + "api/problems", {
      text: error,
    });
  } catch (er) {}
};

// (0=je)
// options["agreeNumber"]: S
// options["agreeGender"]: M

// (1=tu)
// options["agreeNumber"]: S
// options["agreeGender"]: M

// (2=il)
// options["agreeNumber"]: S
// options["agreeGender"]: M

// (2=elle)
// options["agreeNumber"]: S
// options["agreeGender"]: F

// (3=nous)
// options["agreeNumber"]: P
// options["agreeGender"]: M

// (4=vous)
// options["agreeNumber"]: P
// options["agreeGender"]: M

// (5=ils)
// options["agreeNumber"]: P
// options["agreeGender"]: M

// (5=elles)
// options["agreeNumber"]: P
// options["agreeGender"]: F
