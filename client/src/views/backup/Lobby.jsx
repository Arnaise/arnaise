import React, { useState, useEffect, useContext } from "react";
import UserLeaderCard from "../components/UserLeaderCard";
import ordinal from "ordinal";
import UserData from "../contexts/UserData";
import axios from "axios";
import { CONSTANT, SITE_DETAILS } from "../CONSTANT";
import { useParams, useNavigate } from "react-router-dom";
import { ecm } from "../UTILS";
import CustomButton from "../components/CustomButton";
import Assessment from "./Room/Assessment";

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

const RoomDetails = ({ room, readyState, count }) => {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-4">Details</h2>
      <span className="flex md:flex-row flex-col space-y-3 md:space-y-0 mb-2">
        <RenderBadge label="Created by" value={room?.created_by} />
        <RenderBadge
          label="Created at"
          value={new Date(room?.timestamp).toLocaleString()}
        />
        <RenderBadge
          label="Total Players"
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
          Room Status: <span className="font-bold">{room?.status}</span>
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
            Room Server:{" "}
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
            Room Server: <span className="font-bold">Connecting</span>
          </span>
        )}
      </div>
    </div>
  );
};

const UserComponent = ({ user, online, creator, isExpired, index }) => {
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
        {isExpired && <p className="">Attempts: {user.attempt}</p>}
        {isExpired && <p className="">Position: {ordinal(index + 1)}</p>}
        <span className="flex flex-row space-x-1 mt-1">
          <p className="text-xs bg-blue-100 text-blue-800 w-fit px-2 rounded-lg">
            {creator === user.username ? "Creator" : "Player"}
          </p>
          {index === 0 && isExpired && (
            <p className="text-xs bg-emerald-100 text-emerald-800 w-fit px-2 rounded-lg">
              Winner
            </p>
          )}
        </span>
      </div>
    </div>
  );
};

const PlayersTab = ({ players, online, label, creator }) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-bold mb-4 capitalize">
        {`${label} Players`}
      </h2>
      <div className="flex flex-row items-center flex-wrap">
        {players.map((player, index) => (
          <UserComponent
            key={player.id}
            user={player}
            online={online}
            creator={creator}
            isExpired={label === ""}
            index={index}
          />
        ))}
        {players.length <= 0 && <span>No players yet.</span>}
      </div>
    </div>
  );
};

export default function Lobby() {
  const { session } = useContext(UserData);
  const { code: code } = useParams();
  const [room, setRoom] = useState(null);
  const [online, setOnline] = useState([]);

  const [socket, setSocket] = useState(null);

  const setupWebSocket = () => {
    const newSocket = new WebSocket(CONSTANT.socket + `ws/room/${code}/`);
    newSocket.onopen = () => {
      setSocket(newSocket);
      console.log(`Connected to server.`);
    };
    newSocket.onclose = () => {
      console.log(`Connection closed...`);
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
  }, []);

  const fetchRoom = async () => {
    await axios
      .post(CONSTANT.server + `room/rooms`, {
        code: code,
      })
      .then((responce) => {
        setRoom(responce.data);
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
      session.isLoaded &&
      session.isLoggedIn &&
      socket &&
      socket.readyState === 1
    ) {
      socket.send(
        ecm("join", {
          user_id: session?.personal?.id,
        })
      );
    }

    return () => {
      if (socket) {
        socket?.close();
      }
    };
  }, [socket, session]);

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

  if (room?.status === "Progress") {
    return (
      <Assessment
        code={code}
        questions={room?.questions_json ? JSON.parse(room?.questions_json) : []}
        session={session}
        players={online || []}
        stopGame={stopGame}
        updateProgress={updateProgress}
      />
    );
  }

  return (
    <div className="mt-20 mb-10 flex flex-col md:flex-col justify-center items-center">
      <div className="mb-5 flex flex-col w-full">
        <h1 className="flex flex-col md:flex-row items-center justify-center text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">
          Room
          <span className="leading-tighter tracking-tighter text-_accent_1_">
            #{code}
          </span>
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="px-5 md:px-0 w-full md:w-2/3 flex justify-center">
          {room && (
            <div className="w-full flex flex-col md:flex-col justify-center items-center">
              {/* Render Room Details tab */}
              <RoomDetails
                room={room}
                readyState={socket?.readyState}
                count={online?.length}
              />

              {room?.status === "Open" &&
                session.isLoaded &&
                session.isLoggedIn &&
                parseInt(session?.personal?.id) === parseInt(room?.user_id) &&
                socket && (
                  <div className="w-full mt-10">
                    <CustomButton
                      label="Start Game"
                      onClick={() => {
                        socket.send(ecm("start", ""));
                      }}
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
                      creator={session?.personal?.username}
                      label={"Online"}
                    />
                  </div>
                  <div className="w-full flex flex-row mt-10">
                    <PlayersTab
                      players={online?.filter((a, b) => {
                        return !a?.isInLobby;
                      })}
                      online={false}
                      creator={session?.personal?.username}
                      label={"Offline"}
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
                      creator={session?.personal?.username}
                      label={""}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
