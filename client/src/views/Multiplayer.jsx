import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserData from "../contexts/UserData";
import {
  CONSTANT,
  checkLoginFromNonLogin,
  prepareLanguageText,
} from "../CONSTANT";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import InputBox from "../components/InputBox";
import CustomButton from "../components/CustomButton";
import { VscDebugStart } from "react-icons/vsc";
import { IoIosArrowDown } from "react-icons/io";
import {
  FaPause,
  FaPlay,
  FaCopy,
  FaHourglassEnd,
  FaArchive,
} from "react-icons/fa";

const RoomCard = ({
  room,
  user_id,
  navigate,
  isCopy = true,
  isProgress = false,
  inGame = false,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  function copyText(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Unable to copy text:", error);
      });
  }

  return (
    <div
      key={room?.id}
      onClick={() => {
        navigate(`/join/${room?.code}`);
      }}
      className={`group cursor-pointer ${
        isProgress
          ? "bg-_accent_1_ text-white hover:opacity-75"
          : "bg-white hover:bg-gray-100"
      } relative border border-gray-200 transition-all duration-300 ease-in-out shadow-md p-6 rounded-lg flex flex-col justify-between`}
    >
      <div className="">
        <span className="flex flex-row items-center space-x-2">
          <p className="text-lg font-semibold">Lobby#{room?.code}</p>
          {inGame ? (
            <FaHourglassEnd color="white" />
          ) : isCopy ? (
            <FaPause color="white" />
          ) : (
            <FaArchive color="black" />
          )}
        </span>
        <p>
          <span className={`${isProgress ? "text-gray-200" : "text-gray-500"}`}>
            {prepareLanguageText("Players Count", "Nombre de joueurs")}:
          </span>{" "}
          {room?.count_of_players || 0}
        </p>
        <p>
          <span className={`${isProgress ? "text-gray-200" : "text-gray-500"}`}>
            {prepareLanguageText("Created by", "Créé par")}:
          </span>{" "}
          {parseInt(room?.user_id) === user_id ? "You" : room?.created_by}
        </p>
        <p>
          <span className={`${isProgress ? "text-gray-200" : "text-gray-500"}`}>
            {prepareLanguageText("Created at", "Créé à")}:
          </span>{" "}
          {new Date(room?.timestamp).toLocaleString()}
        </p>
        <div className="py-3"></div>
        {isCopy && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              copyText(`${CONSTANT.client}join/${room?.code}`);
            }}
            className={`${
              isProgress ? "bg-white text-black" : "bg-green-100 text-green-800"
            } flex flex-row items-center group-hover:bg-green-800 group-hover:text-green-100  transition-all duration-300 ease-in-out cursor-pointer absolute bottom-2 right-2  capitalize text-md font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300`}
          >
            {isCopied
              ? prepareLanguageText("Copied", "Copié")
              : prepareLanguageText("Copy Invite", "Copier l'invitation")}{" "}
            <FaCopy className="ml-1 group-hover:bg-green-800 bg-white text-black group-hover:text-green-100" />
          </span>
        )}
      </div>
    </div>
  );
};

const Multiplayer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  let navigate = useNavigate();
  const { session, setToast } = useContext(UserData);
  const [open, setOpen] = useState([]);
  const [progress, setProgress] = useState([]);
  const [expired, setExpired] = useState([]);
  const [openHistory, setOpenHistory] = useState(false);

  useEffect(() => {
    if (searchParams.get("lobby")) {
      setToast({
        open: true,
        success: false,
        message: "No such lobby found!",
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (session.isLoaded && session.isLoggedIn) {
      fetchRooms();
    }
  }, [session]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        CONSTANT.server + `room/rooms/${session?.personal?.id}`
      );
      let rooms = response.data;
      let open_t = [];
      let progress_t = [];
      let expired_t = [];

      rooms.forEach((room) => {
        if (room?.status === "Open") {
          open_t.push(room);
        } else if (room?.status === "Expired") {
          expired_t.push(room);
        } else {
          progress_t.push(room);
        }
      });

      setOpen(open_t);
      setExpired(expired_t);
      setProgress(progress_t);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const [code, setCode] = useState("");

  useEffect(() => {
    if (checkLoginFromNonLogin()) {
      navigate("/login");
    }
  }, [session]);

  return (
    <div className="mt-10 xl:mt-20 mb-10 flex flex-col md:flex-col justify-center items-center">
      <div className="mb-0 xl:mb-5 flex flex-col w-full">
        <h1 className="text-center text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight mb-4">
          Multi
          <span className="leading-tighter tracking-tighter text-_accent_1_">
            player
          </span>
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="px-5 md:px-0 w-full md:w-5/6">
          <section className="mb-10">
            <h2 className="text-xl md:text-3xl font-bold mb-4">
              {prepareLanguageText("Join Lobby", "Rejoindre le Lobby")}
            </h2>
            <div className="w-full flex flex-row space-x-2">
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
          <section className="mb-10">
            <h2 className="text-xl md:text-3xl font-bold mb-4">
              {prepareLanguageText("Current Lobbies", "Lobbies Actuels")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {progress?.map((room, index) => {
                return (
                  <RoomCard
                    key={index}
                    room={room}
                    user_id={parseInt(session?.personal?.id)}
                    navigate={navigate}
                    isProgress={true}
                    inGame={true}
                  />
                );
              })}
              {open?.map((room, index) => {
                return (
                  <RoomCard
                    key={index}
                    room={room}
                    user_id={parseInt(session?.personal?.id)}
                    navigate={navigate}
                    isProgress={true}
                  />
                );
              })}
              {open.length <= 0 && progress.length <= 0 && (
                <span className="">
                  {prepareLanguageText("No lobbies yet", "Pas encore de lobby")}
                  .
                </span>
              )}
            </div>
          </section>
          <section>
            <h2 className="text-xl flex transition-all duration-300 ease-in-out flex-row items-center md:text-3xl font-bold mb-4">
              {prepareLanguageText("History", "Histoire")}{" "}
              <span
                onClick={() => {
                  setOpenHistory(!openHistory);
                }}
                className="ml-1 select-none hover:bg-gray-200 rounded-full p-2 cursor-pointer"
              >
                <IoIosArrowDown
                  color="black"
                  className={`${
                    openHistory && "rotate-180"
                  } text-black transition-all duration-300 ease-in-out`}
                />
              </span>
            </h2>
            <div
              className={`grid grid-cols-1 overflow-hidden transition-all duration-300 ease-in-out md:grid-cols-3 gap-4 ${
                openHistory ? "h-full opacity-100" : "h-0 opacity-0"
              }`}
            >
              {expired?.map((room, index) => {
                return (
                  <RoomCard
                    key={index}
                    room={room}
                    user_id={parseInt(session?.personal?.id)}
                    navigate={navigate}
                    isCopy={false}
                  />
                );
              })}

              {expired.length <= 0 && (
                <span className="">
                  {prepareLanguageText(
                    "No record in history yet.",
                    "Aucun record dans l'histoire pour l'instant."
                  )}
                </span>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Multiplayer;
