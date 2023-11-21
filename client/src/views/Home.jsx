import React, { useState, useEffect, useContext } from "react";
import MultipleSelect from "../components/MultipleSelect";
import CustomButton from "../components/CustomButton";
import ModalWrapper from "../components/ModalWrapper";
import UserData from "../contexts/UserData";
import {
  CONSTANT,
  capitalizeFirstLetter,
  resetMessage,
  setMessage,
  prepareLanguageText,
} from "../CONSTANT";
import Assessment from "./Assessment";
import { formatSelections, makeConjugationQuestions } from "../UTILS";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { VscDebugStart } from "react-icons/vsc";
import { SlOptionsVertical } from "react-icons/sl";
import { GiThreeFriends } from "react-icons/gi";
import { TfiSave } from "react-icons/tfi";
import { RiDeleteBin2Line } from "react-icons/ri";

import InputBox from "../components/InputBox";

export default function Home() {
  let navigate = useNavigate();
  const { session, setSession, options, updatePoints, setToast } =
    useContext(UserData);
  // min-h-[calc(100vh-4rem)]

  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  const [isAssessment, setIsAssessment] = useState(false);

  const __init__ = {
    tenses: [],
    regularVerbs: [],
    irregularVerbs: [],
    customPreset: "",
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

  // Preset

  const [customPresets, setCustomPresets] = useState([]);

  const fetchCustomPresets = async (post_select = null) => {
    await axios
      .get(
        CONSTANT.server + `api/custom_presets?user_id=${session?.personal?.id}`
      )
      .then((responce) => {
        setCustomPresets(responce.data);
        setModal({
          ...modal,
          presetName: `Custom Preset ${responce.data?.length + 1}`,
          open: false,
        });
        if (post_select) {
          let preset_object = responce?.data?.find((a, b) => {
            return a?.name === post_select;
          });
          setSelection({
            ...selection,
            customPreset: preset_object?.id,
          });
        } else {
          setSelection({
            ...selection,
            customPreset: "",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addCustomPresets = async () => {
    let finalData = {
      user: session?.personal?.id,
      name: modal?.presetName,
      tenses: selection?.tenses?.map((a, b) => {
        return a?.id;
      }),
      regularVerbs: selection?.regularVerbs?.map((a, b) => {
        return a?.id;
      }),
      irregularVerbs: selection?.irregularVerbs?.map((a, b) => {
        return a?.id;
      }),
    };
    resetMessage();
    await axios
      .post(CONSTANT.server + `api/custom_presets`, finalData)
      .then((responce) => {
        if (responce?.data?.message) {
          setMessage(responce?.data?.message, "red-500");
        } else {
          fetchCustomPresets(modal?.presetName);
          setModal({
            ...modal,
            open: false,
          });
          setIsStartMenuOpen(false);
          setToast({
            open: true,
            success: true,
            message: "Preset added successfully!",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateCustomPresets = async () => {
    let finalData = {
      user: session?.personal?.id,
      name: modal?.presetName,
      tenses: selection?.tenses?.map((a, b) => {
        return a?.id;
      }),
      regularVerbs: selection?.regularVerbs?.map((a, b) => {
        return a?.id;
      }),
      irregularVerbs: selection?.irregularVerbs?.map((a, b) => {
        return a?.id;
      }),
    };
    resetMessage();
    await axios
      .put(
        CONSTANT.server + `api/custom_preset_detail/${selection?.customPreset}`,
        finalData
      )
      .then((responce) => {
        if (responce?.data?.message) {
          setMessage(responce?.data?.message, "red-500");
        } else {
          fetchCustomPresets(modal?.presetName);
          setModal({
            ...modal,
            open: false,
          });
          setIsStartMenuOpen(false);
          setToast({
            open: true,
            success: true,
            message: "Preset updated successfully!",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteCustomPreset = async () => {
    await axios
      .delete(
        CONSTANT.server + `api/custom_preset_detail/${selection?.customPreset}`
      )
      .then((responce) => {
        fetchCustomPresets();
        setIsStartMenuOpen(false);
        setToast({
          open: true,
          success: true,
          message: "Preset deleted successfully!",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (session?.isLoaded && session?.isLoggedIn) {
      fetchCustomPresets();
    }
  }, [session]);
  const [code, setCode] = useState("");

  const changeSelectionViaPreset = (preset_id) => {
    if (preset_id === "") {
      clearSelection();
      return;
    }
    let customPreset = customPresets?.find((a, b) => {
      return parseInt(preset_id) === a?.id;
    });
    if (customPreset) {
      let final = {
        ...selection,
        tenses: customPreset?.tenses?.map((a, b) => {
          return options?.tenses?.find((e, i) => {
            return parseInt(a) === e?.id;
          });
        }),
        regularVerbs: customPreset?.regularVerbs?.map((a, b) => {
          let temp = options?.verbs?.find((e, i) => {
            return parseInt(a) === e?.id;
          });
          return {
            ...temp,
            label: capitalizeFirstLetter(temp.value),
          };
        }),
        irregularVerbs: customPreset?.irregularVerbs?.map((a, b) => {
          let temp = options?.verbs?.find((e, i) => {
            return parseInt(a) === e?.id;
          });
          return {
            ...temp,
            label: capitalizeFirstLetter(temp.value),
          };
        }),
        customPreset: preset_id,
      };
      setSelection(final);
    }
  };

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
        if (responce.status === 200) {
          navigate(`/join/${responce?.data?.code}`);
        } else {
          console.log("Error creating room:", responce.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [modal, setModal] = useState({
    presetName: "",
    update: false,
    open: false,
  });

  // End of Functions

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

  return (
    <>
      <ModalWrapper
        isOpen={modal.open}
        onClose={() => {
          setModal({
            ...modal,
            open: false,
            presetName: `Custom Preset ${customPresets?.length + 1}`,
          });
          setIsStartMenuOpen(false);
        }}
      >
        <div>
          <h1 className="text-left text-xl font-extrabold leading-tight tracking-tight">
            <span className="leading-tighter tracking-tighter bg-clip-text text-black">
              {modal.update
                ? prepareLanguageText("Confirm", "Confirmer")
                : prepareLanguageText("Enter", "Entrer")}{" "}
              {prepareLanguageText("preset name", "nom du préréglage")}
            </span>
          </h1>
          <div className="flex flex-row w-full space-x-3 mt-5">
            <InputBox
              type="text"
              value={modal.presetName}
              onChange={(e) => {
                setModal({
                  ...modal,
                  presetName: e.target.value,
                });
              }}
              className="w-full"
              placeholder={`${modal.update ? "Confirm" : "Enter"} preset name.`}
            />
            <CustomButton
              label={
                modal.update
                  ? prepareLanguageText("Update", "Sauvegarder")
                  : prepareLanguageText("Save", "Sauvegarder")
              }
              padding="px-5"
              width="w-fit"
              onClick={() => {
                if (!modal.update) {
                  addCustomPresets();
                } else {
                  updateCustomPresets();
                }
              }}
              disabled={modal.presetName === ""}
            />
          </div>
          <div className="mt-2" id="error" style={{ display: "none" }}></div>
        </div>
      </ModalWrapper>
      <div className="mt-20 mb-10 flex flex-col md:flex-col justify-center items-center">
        <div className="mb-5 flex flex-col w-full">
          <h1 className="text-center text-3xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            {prepareLanguageText("Master", "Pratiquez les")}
            <div className="my-5"></div>
            <span className="leading-tighter tracking-tighter text-_accent_1_">
              {prepareLanguageText(
                "French Conjugations",
                "conjugaisons françaises"
              )}
            </span>
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center w-full">
          <div className="px-5 md:px-0 md:w-full lg:w-2/3 xl:w-2/3 w-full flex flex-col md:flex-row md:space-x-10">
            <MultipleSelect
              mainLabel={prepareLanguageText("tenses", "Temps")}
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
              mainLabel={prepareLanguageText(
                "regular verbs",
                "Verbes réguliers"
              )}
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
              mainLabel={prepareLanguageText(
                "irregular verbs",
                "Verbes irréguliers"
              )}
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
            {session?.isLoggedIn && (
              <div className={`mt-3 w-full`}>
                <span className="capitalize text-base font-semibold text-slate-500 tracking-tighter leading-relaxed">
                  {prepareLanguageText(
                    "Custom Presets",
                    "Préléglases"
                  )}
                </span>
                <select
                  placeholder={prepareLanguageText(
                    "Select custom preset",
                    "Sélectionnez un préréglage personnalisé"
                  )}
                  value={selection?.customPreset}
                  onChange={(e) => {
                    changeSelectionViaPreset(e.target.value);
                  }}
                  className={`${
                    !selection?.customPreset ? "text-[#aaa]" : "text-black"
                  } w-full bg-white transition-all duration-300 ease-in-out rounded-[4px] focus:outline-none outline-none border border-[#aaa] ring-0 focus:ring-0`}
                >
                  {
                    <option className="text-black" value={""} selected>
                      {prepareLanguageText(
                        "Select custom preset",
                        "Sélectionnez un préréglage personnalisé"
                      )}
                    </option>
                  }
                  {customPresets.length > 1 &&
                    customPresets.map((a, b) => {
                      return (
                        <option className="text-black" key={b} value={a.id}>
                          {a.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            )}
          </div>{" "}
          <div className="mt-10 relative flex justify-center items-center space-x-5">
            <div className="flex flex-row">
              <CustomButton
                label={prepareLanguageText("Start", "Commencez")}
                icon={<VscDebugStart color="white" />}
                onClick={() => {
                  setIsAssessment(true);
                }}
                radius="rounded-l-lg"
                disabled={
                  selection.tenses.length <= 0 ||
                  (selection.regularVerbs.length <= 0 &&
                    selection.irregularVerbs.length <= 0)
                }
              />
              <CustomButton
                label=""
                icon={<SlOptionsVertical color="white" />}
                onClick={() => {
                  setIsStartMenuOpen(!isStartMenuOpen);
                }}
                radius="rounded-r-lg"
                padding="px-2.5"
                disabled={
                  selection.tenses.length <= 0 ||
                  (selection.regularVerbs.length <= 0 &&
                    selection.irregularVerbs.length <= 0)
                }
              />
            </div>
            <div
              className={`z-10 ${
                !isStartMenuOpen && "hidden"
              } bg-white absolute top-10 -left-14 divide-y divide-gray-100 rounded-lg shadow w-60 dark:bg-gray-700 dark:divide-gray-600`}
            >
              <div
                className="fixed inset-0 opacity-70 z-0"
                onClick={() => {
                  setIsStartMenuOpen(false);
                }}
              ></div>
              <ul className="p-3 space-y-1 text-sm text-gray-700 z-10 relative dark:text-gray-200">
                {!selection?.customPreset ? (
                  <li
                    onClick={() => {
                      setModal({
                        ...modal,
                        open: true,
                      });
                    }}
                  >
                    <div className="cursor-pointer flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <div className="flex items-center h-5 pr-2">
                        <TfiSave color="black" />
                      </div>
                      <div className="ms-2 text-sm">
                        <span className="font-medium text-gray-900 dark:text-gray-300">
                          <div>
                            {prepareLanguageText(
                              "Save Preset",
                              "Enregistrer le préréglage"
                            )}
                          </div>
                          <p className="text-xs font-normal text-gray-500 dark:text-gray-300">
                            {prepareLanguageText(
                              "Store the selected preset to use it later without selecting again!",
                              "Enregistrez le préréglage sélectionné pour l'utiliser plus tard sans avoir à le sélectionner à nouveau !"
                            )}
                          </p>
                        </span>
                      </div>
                    </div>
                  </li>
                ) : (
                  <>
                    <li
                      onClick={() => {
                        setModal({
                          ...modal,
                          open: true,
                          update: true,
                          presetName: customPresets?.find((a, b) => {
                            return parseInt(selection?.customPreset) === a?.id;
                          })?.name,
                        });
                      }}
                    >
                      <div className="cursor-pointer flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div className="flex items-center h-5 pr-2">
                          <TfiSave color="black" />
                        </div>
                        <div className="ms-2 text-sm">
                          <span className="font-medium text-gray-900 dark:text-gray-300">
                            <div>
                              {prepareLanguageText(
                                "Update Preset",
                                "Mettre à jour le préréglage"
                              )}
                            </div>
                            <p className="text-xs font-normal text-gray-500 dark:text-gray-300">
                              {prepareLanguageText(
                                "Update the preset with current selection of tenses and verbs!",
                                "Mettez à jour le préréglage avec la sélection actuelle de temps et de verbes!"
                              )}
                            </p>
                          </span>
                        </div>
                      </div>
                    </li>
                    <li
                      onClick={() => {
                        deleteCustomPreset();
                      }}
                    >
                      <div className="cursor-pointer flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div className="flex items-center h-5 pr-2">
                          <RiDeleteBin2Line color="red" />
                        </div>
                        <div className="ms-2 text-sm">
                          <span className="font-medium text-gray-900 dark:text-gray-300">
                            <div>
                              {prepareLanguageText(
                                "Delete Preset",
                                "Supprimer le préréglage"
                              )}
                            </div>
                            <p className="text-xs font-normal text-gray-500 dark:text-gray-300">
                              {prepareLanguageText(
                                "Remove this preset from list permanently!",
                                "Supprimez définitivement ce préréglage de la liste!"
                              )}
                            </p>
                          </span>
                        </div>
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </div>
            {session?.isLoggedIn && (
              <CustomButton
                label="Multiplayer"
                icon={<GiThreeFriends color="white" />}
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
        <hr class="md:w-2/4 w-full h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700" />
        <section className="mb-10 w-full">
          <h1 className="text-center text-3xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            {prepareLanguageText("Join", "Rejoindre le")}
            <span className="leading-tighter ml-2 tracking-tighter text-_accent_1_">
              Lobby
            </span>
          </h1>
          <div className="w-full flex flex-row space-x-2 mt-10 justify-center">
            <InputBox
              type="number"
              value={code}
              onChange={(e) => {
                if (e.target.value?.length <= 6) {
                  setCode(e.target.value);
                }
              }}
              className="w-[15rem]"
              placeholder={prepareLanguageText(
                "Enter 6-digit code.",
                "Entrez le code à 6 chiffres."
              )}
            />
            <CustomButton
              label={prepareLanguageText("Join", "Joindre")}
              padding="px-3"
              width="w-fit"
              icon={<VscDebugStart color="white" />}
              onClick={() => {
                navigate(`/join/${code}`);
              }}
              disabled={code.length <= 5}
            />
          </div>
        </section>
      </div>
    </>
  );
}
