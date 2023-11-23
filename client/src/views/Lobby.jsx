import React, { useState, useEffect, useContext } from "react";
import UserLeaderCard from "../components/UserLeaderCard";
import ordinal from "ordinal";
import UserData from "../contexts/UserData";
import axios from "axios";
import { CONSTANT, SITE_DETAILS, prepareLanguageText } from "../CONSTANT";
import { useParams, useNavigate } from "react-router-dom";
import { ecm } from "../UTILS";
import { VscDebugStart } from "react-icons/vsc";
import CustomButton from "../components/CustomButton";
import Assessment from "./Room/Assessment";
import ModalWrapper from "../components/ModalWrapper";
import InputBox from "../components/InputBox";
import { generateUsername } from "unique-username-generator";
import { MdOutlineChangeCircle } from "react-icons/md";
import QRCode from "react-qr-code";
import { FaCopy } from "react-icons/fa";
import { RWebShare } from "react-web-share";
import { IoShareSocial } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
const RenderBadge = (props) => {
  return (
    <span
      className={`${
        props?.isRed ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
      } cursor-pointer w-fit text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300`}
    >
      {props?.label}: {props?.value}
    </span>
  );
};

const ShareRoom = ({ code, setToast }) => {
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
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-4">
        {prepareLanguageText("Share", "Partager")}
      </h2>
      <div className="flex flex-col space-y-5">
        <div className="w-full">
          <QRCode
            value={`${CONSTANT.client}join/${code}`}
            className="md:w-fit w-full"
          />
        </div>
        <CustomButton
          label={prepareLanguageText("Copy Invite", "Copier l'invitation")}
          icon={<FaCopy color="white" />}
          width="w-fit"
          onClick={(e) => {
            e.stopPropagation();
            copyText(`${CONSTANT.client}join/${code}`);
            setToast({
              open: true,
              success: true,
              message: "Invite copied successfully!",
            });
          }}
        />
        <div className="flex flex-row flex-wrap space-x-3">
          <RWebShare
            data={{
              text: prepareLanguageText(
                "Hey! Join me in a multiplayer lobby to practice French conjugation questions! 🇫🇷📚✨",
                "Salut ! Rejoins-moi dans un salon multijoueur pour pratiquer les conjugaisons françaises ensemble! 🇫🇷📚✨"
              ),
              url: `${CONSTANT.client}join/${code}`,
              title: prepareLanguageText(
                "Practice French Conjugations - Join Now!",
                "Pratique des Conjugaisons en Français - Rejoins-nous!"
              ),
            }}
            onClick={() => console.log("Shared successfully!")}
          >
            <CustomButton
              label={prepareLanguageText("Invite via Social Apps", "Partager")}
              icon={<IoShareSocial color="white" />}
              width="w-fit"
            />
          </RWebShare>
        </div>
      </div>
    </div>
  );
};

const RoomDetails = ({ room, readyState, count }) => {
  const [openDetails, setOpenDetails] = useState(false);
  return (
    <div className="w-full">
      <h2 className="text-3xl flex transition-all duration-300 ease-in-out flex-row items-center md:text-3xl font-bold mb-4">
        {prepareLanguageText("Details", "Détails")}
        <span
          onClick={() => {
            setOpenDetails(!openDetails);
          }}
          className="ml-1 select-none hover:bg-gray-200 rounded-full p-2 cursor-pointer"
        >
          <IoIosArrowDown
            color="black"
            className={`${
              openDetails && "rotate-180"
            } text-black transition-all duration-300 ease-in-out`}
          />
        </span>
      </h2>
      <div
        className={`${openDetails ? "h-full opacity-100" : "h-0 opacity-0"}`}
      >
        <span className="flex md:flex-row flex-col space-y-3 md:space-y-0 mb-2">
          <RenderBadge
            label={prepareLanguageText("Created by", "Créé par")}
            value={room?.created_by}
          />
          <RenderBadge
            label={prepareLanguageText("Created at", "Créé à")}
            value={new Date(room?.timestamp).toLocaleString()}
          />
          <RenderBadge
            label={prepareLanguageText("Players Count", "Nombre de joueurs")}
            value={count || room?.count_of_players}
          />
        </span>
        <div className="flex md:flex-row flex-col space-y-3 md:space-y-0 mt-3">
          <span
            className={`${
              room?.status === "Expired"
                ? "bg-red-100 text-red-800"
                : "bg-emerald-100 text-emerald-800"
            } cursor-pointer w-fit text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300`}
          >
            {prepareLanguageText("Lobby Status", "Statut du lobby")}:{" "}
            <span className="font-bold">{room?.status}</span>
          </span>
          {readyState ? (
            <span
              className={`${
                readyState === 0
                  ? "bg-blue-100 text-blue-800"
                  : readyState === 1
                  ? "bg-emerald-100 text-emerald-800"
                  : readyState === 2
                  ? "bg-blue-100 text-blue-800"
                  : readyState === 3
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              } w-fit cursor-pointer text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300`}
            >
              {prepareLanguageText("Server Status", "Statut du serveur")}:{" "}
              <span className="font-bold">
                {readyState === 0
                  ? "Connecting"
                  : readyState === 1
                  ? "Connected"
                  : readyState === 2
                  ? "Closing"
                  : readyState === 3
                  ? "Closed"
                  : ""}
              </span>
            </span>
          ) : (
            <span
              className={`bg-blue-100 text-blue-800 w-fit cursor-pointer text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300`}
            >
              {prepareLanguageText("Server Status", "Statut du serveur")}:{" "}
              <span className="font-bold">Connecting</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const UserComponent = ({
  user,
  online,
  creator,
  isExpired,
  isGuest,
  index,
}) => {
  return (
    <div
      className={`flex items-center m-1 py-2 p-2 border border-gray-300 rounded-lg ${
        online ? "" : "text-gray-500"
      }`}
    >
      <img
        src={SITE_DETAILS.empty_profile}
        className="h-10 w-10 rounded-full bg-gray-300"
      />{" "}
      {/* Placeholder for avatar */}
      <div className="ml-2">
        <p className="flex flex-row justify-start items-center text-black">
          {user.username}
          {online && (
            <span className="ml-1 block bg-green-500 w-2 h-2 rounded-full"></span>
          )}
        </p>
        {isExpired && <p className="">Score: {user.roomScore}</p>}
        {isExpired && (
          <p className="">
            {prepareLanguageText("Attempts", "Tentatives")}: {user.attempt}
          </p>
        )}
        {isExpired && <p className="">Position: {ordinal(index + 1)}</p>}
        <span className="flex flex-row space-x-1 mt-1">
          <p className="text-xs bg-blue-100 text-blue-800 w-fit px-2 rounded-lg">
            {creator === user.username
              ? prepareLanguageText("Creator", "Créateur")
              : prepareLanguageText("Player", "Joueur")}
          </p>
          {isGuest && (
            <p className="text-xs bg-emerald-100 text-emebg-emerald-800 w-fit px-2 rounded-lg">
              {prepareLanguageText("Guest", "Invité")}
            </p>
          )}
          {index === 0 && isExpired && (
            <p className="text-xs bg-emerald-100 text-emerald-800 w-fit px-2 rounded-lg">
              {prepareLanguageText("Winner", "Gagnant")}
            </p>
          )}
        </span>
      </div>
    </div>
  );
};

const PlayersTab = ({ players, online, label, creator, isExpired = false }) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-bold mb-4 capitalize">{`${label}`}</h2>
      <div className="flex flex-row items-center flex-wrap">
        {players.map((player, index) => (
          <UserComponent
            key={player.username}
            user={player}
            online={online}
            creator={creator}
            isExpired={isExpired}
            isGuest={player?.isGuest}
            index={index}
          />
        ))}
        {players.length <= 0 && (
          <span>
            {prepareLanguageText("No players yet", "Pas encore de joueurs")}.
          </span>
        )}
      </div>
    </div>
  );
};

export default function Lobby() {
  const { session, setToast } = useContext(UserData);
  const { code: code } = useParams();
  const [room, setRoom] = useState(null);
  const [isGuest, setIsGuest] = useState({
    yes: false,
    username: "",
  });
  const [online, setOnline] = useState([]);
  let navigate = useNavigate();

  const [socket, setSocket] = useState(null);

  const setupWebSocket = () => {
    const newSocket = new WebSocket(CONSTANT.socket + `ws/room/${code}/`);
    newSocket.onopen = () => {
      setSocket(newSocket);
      console.log(`Connected to server.`);
    };
    newSocket.onclose = (e) => {
      console.log(
        "Connection is closed. Reconnect will be attempted in 1 second.",
        e.reason
      );
      // setTimeout(function () {
      //   setupWebSocket();
      // }, 1000);
    };
    newSocket.onerror = function (err) {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );
      newSocket.close();
    };
    newSocket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      // console.log(`Received data:`, data);

      if (data.type === "update.players") {
        setOnline(data.players);
      } else if (
        data.type === "update.status" ||
        data.type === "update.expire"
      ) {
        setRoom((old) => {
          return {
            ...old,
            status: data?.status,
          };
        });
      }
    };
  };

  useEffect(() => {
    setupWebSocket();

    // setInterval(() => {
    //   if (!socket) {
    //     setupWebSocket();
    //   }
    // }, 10 * 1000);
  }, []);

  const fetchRoom = async () => {
    await axios
      .post(CONSTANT.server + `room/rooms`, {
        code: code,
      })
      .then((responce) => {
        if (responce?.data?.error) {
          navigate(`/multiplayer?lobby=unknown`);
        } else {
          setRoom(responce.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (session.isLoaded) {
      fetchRoom();
    }
  }, [session]);

  useEffect(() => {
    if (
      session?.isLoaded &&
      session?.isLoggedIn &&
      socket &&
      socket?.readyState === 1
    ) {
      socket?.send(
        ecm("join", {
          user_id: session?.personal?.id,
        })
      );
    } else if (
      session?.isLoaded &&
      !session?.isLoggedIn &&
      socket &&
      socket?.readyState === 1 &&
      room &&
      room?.status !== "Expired" &&
      !isGuest.yes
    ) {
      socket?.send(ecm("get_status", ""));
      setModal({
        ...modal,
        open: true,
      });
    } else if (session?.isLoaded && socket && socket?.readyState === 1) {
      socket?.send(ecm("get_status", ""));
    }
  }, [socket, session, room]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket?.close();
      }
    };
  }, [socket]);

  const stopGame = () => {
    socket.send(ecm("end", ""));
  };

  const updateProgress = (points = 0) => {
    socket.send(
      ecm("progress", {
        points: parseInt(points),
      })
    );
  };

  const [modal, setModal] = useState({
    username: `${generateUsername("", 0, 15)}`,
    open: false,
  });

  if (room?.status === "Progress") {
    return (
      <>
        <ModalWrapper big isOpen={modal.open} onClose={() => {}}>
          <div>
            <h1 className="text-left flex flex-col text-xl font-extrabold leading-tight tracking-tight">
              <span className="leading-tighter tracking-tighter bg-clip-text text-black">
                {prepareLanguageText(
                  "Welcome, you're joining",
                  "Bienvenue, vous rejoignez"
                )}
              </span>
              <span className="leading-tighter tracking-tighter bg-clip-text text-black">
                <span className="text-_accent_1_">Lobby#{code}</span>{" "}
                {prepareLanguageText("as Guest", "en tant qu'invité")}
              </span>
              <span className="leading-tighter tracking-tighter bg-clip-text text-black">
                {prepareLanguageText(
                  "Please choose your username.",
                  "Veuillez choisir votre nom d'utilisateur."
                )}
              </span>
            </h1>
            <div className="flex flex-row w-full space-x-3 mt-5">
              <div className="relative w-full">
                <InputBox
                  type="text"
                  value={modal.username}
                  onChange={(e) => {
                    setModal({
                      ...modal,
                      username: e.target.value?.replace(" ", ""),
                    });
                  }}
                  className="w-full"
                  placeholder={prepareLanguageText(
                    "Please choose your username.",
                    "Veuillez choisir votre nom d'utilisateur."
                  )}
                />
                <span
                  onClick={() => {
                    setModal({
                      ...modal,
                      username: generateUsername("", 0, 15),
                    });
                  }}
                  className="absolute right-[10px] top-[8px] select-none hover:bg-gray-200 rounded-full p-1 cursor-pointer transition-all duration-300 ease-in-out"
                >
                  <MdOutlineChangeCircle color="black" size={"30px"} />
                </span>
              </div>
              <CustomButton
                label={prepareLanguageText("Join", "Joindre")}
                padding="px-5"
                width="w-fit"
                onClick={() => {
                  socket.send(
                    ecm("guest", {
                      username: modal.username,
                    })
                  );
                  setIsGuest({
                    yes: true,
                    username: modal.username,
                  });
                  setModal({
                    open: false,
                    username: "",
                  });
                }}
                disabled={modal.username === ""}
              />
            </div>
            <div className="mt-2" id="error" style={{ display: "none" }}></div>
          </div>
        </ModalWrapper>
        <Assessment
          code={code}
          questions={
            room?.questions_json ? JSON.parse(room?.questions_json) : []
          }
          session={session}
          isGuest={isGuest}
          players={online || []}
          stopGame={stopGame}
          updateProgress={updateProgress}
        />
      </>
    );
  }

  return (
    <>
      <ModalWrapper big isOpen={modal.open} onClose={() => {}}>
        <div className="">
          <h1 className="text-left flex flex-col text-xl font-extrabold leading-tight tracking-tight">
            <span className="leading-tighter tracking-tighter bg-clip-text text-black">
              {prepareLanguageText(
                "Welcome, you're joining",
                "Bienvenue, vous rejoignez"
              )}
            </span>
            <span className="leading-tighter tracking-tighter bg-clip-text text-black">
              <span className="text-_accent_1_">Lobby#{code}</span>{" "}
              {prepareLanguageText("as Guest", "en tant qu'invité")}
            </span>
            <span className="leading-tighter tracking-tighter bg-clip-text text-black">
              {prepareLanguageText(
                "Please choose your username.",
                "Veuillez choisir votre nom d'utilisateur."
              )}
            </span>
          </h1>
          <div className="flex flex-row w-full space-x-3 mt-5">
            <div className="relative w-full">
              <InputBox
                type="text"
                value={modal.username}
                onChange={(e) => {
                  setModal({
                    ...modal,
                    username: e.target.value?.replace(" ", ""),
                  });
                }}
                className="w-full"
                placeholder={prepareLanguageText(
                  "Please choose your username.",
                  "Veuillez choisir votre nom d'utilisateur."
                )}
              />
              <span
                onClick={() => {
                  setModal({
                    ...modal,
                    username: generateUsername("", 0, 15),
                  });
                }}
                className="absolute right-[10px] top-[8px] select-none hover:bg-gray-200 rounded-full p-1 cursor-pointer transition-all duration-300 ease-in-out"
              >
                <MdOutlineChangeCircle color="black" size={"30px"} />
              </span>
            </div>
            <CustomButton
              label={prepareLanguageText("Join", "Joindre")}
              padding="px-5"
              width="w-fit"
              onClick={() => {
                socket.send(
                  ecm("guest", {
                    username: modal.username,
                  })
                );
                setIsGuest({
                  yes: true,
                  username: modal.username,
                });
                setModal({
                  open: false,
                  username: "",
                });
              }}
              disabled={modal.username === ""}
            />
          </div>
          <div className="mt-2" id="error" style={{ display: "none" }}></div>
        </div>
      </ModalWrapper>
      <div className="mt-10 xl:mt-20 mb-10 flex flex-col md:flex-col justify-center items-center">
        <div className="mb-0 xl:mb-5 flex flex-col w-full">
          <h1 className="flex flex-col md:flex-row items-center justify-center text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">
            {prepareLanguageText("Code for the", "Code pour le")}
            <span className="leading-tighter tracking-tighter ml-2 text-_accent_1_">
              Lobby
            </span>
          </h1>
          <h1 className="flex flex-col md:flex-row items-center justify-center text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">
            <span className="leading-tighter tracking-normal text-_accent_1_">
              {code}
            </span>
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center w-full">
          <div className="px-5 md:px-0 w-full md:w-2/3 flex justify-center">
            {room && (
              <div className="w-full flex md:flex-row flex-col-reverse items-start space-x-2">
                <div className="w-full md:w-2/3 flex flex-col md:flex-col justify-center">
                  {/* Render Room Details tab */}
                  <RoomDetails
                    room={room}
                    readyState={socket?.readyState}
                    count={online?.length}
                  />

                  {room?.status === "Open" &&
                    session.isLoaded &&
                    session.isLoggedIn &&
                    parseInt(session?.personal?.id) ===
                      parseInt(room?.user_id) &&
                    socket && (
                      <div className="w-fit mt-5">
                        <CustomButton
                          label={prepareLanguageText("Start Game", "Commencez")}
                          icon={<VscDebugStart color="white" />}
                          onClick={() => {
                            socket.send(ecm("start", ""));
                          }}
                          disabled={socket.readyState !== 1}
                        />
                      </div>
                    )}
                  {room?.status === "Open" && (
                    <>
                      <div className="w-full flex flex-row mt-10">
                        <PlayersTab
                          players={online?.filter((a, b) => {
                            return a?.isInLobby;
                          })}
                          online={true}
                          creator={room?.created_by}
                          label={prepareLanguageText(
                            "Online Players",
                            "Joueurs en ligne"
                          )}
                        />
                      </div>
                      <div className="w-full flex flex-row mt-10">
                        <PlayersTab
                          players={online?.filter((a, b) => {
                            return !a?.isInLobby;
                          })}
                          online={false}
                          creator={room?.created_by}
                          label={prepareLanguageText(
                            "Offline Players",
                            "Joueurs Hors ligne"
                          )}
                        />
                      </div>
                    </>
                  )}
                  {room?.status === "Expired" && (
                    <>
                      <div className="w-full flex flex-row mt-10">
                        <PlayersTab
                          players={online}
                          online={false}
                          creator={room?.created_by}
                          label={prepareLanguageText("Players", "Joueurs")}
                          isExpired={true}
                        />
                      </div>
                    </>
                  )}
                </div>
                {room?.status !== "Expired" && (
                  <div className="w-full md:w-1/3 mb-7 md:mb-0">
                    {/* Render Share tab */}
                    <ShareRoom code={code} setToast={setToast} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
