import axios from "axios";
import { getConjugation } from "french-verbs";
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
  try {
    if (tense === "PASSE_COMPOSE" || tense === "PLUS_QUE_PARFAIT") {
      answer = getConjugation(Lefff, verb, tense, subject, {
        aux: "ETRE",
        agreeGender: "M",
      });
    } else {
      answer = getConjugation(Lefff, verb, tense, subject);
    }
  } catch (error) {
    addError(error?.message);
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
