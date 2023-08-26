import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserData from "../contexts/UserData";
import { CONSTANT } from "../CONSTANT";
import { Link, useNavigate } from "react-router-dom";

const RoomCard = ({
  room,
  user_id,
  navigate,
  isCopy = true,
  isProgress = false,
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
        navigate(`/room/${room?.code}`);
      }}
      className={`cursor-pointer ${
        isProgress ? "bg-_accent_1_ text-white hover:opacity-75" : "bg-white hover:bg-gray-100"
      } relative  transition-all duration-300 ease-in-out shadow-md p-6 rounded-lg flex flex-col justify-between`}
    >
      <div className="">
        <p className="text-lg font-semibold">Room#{room?.code}</p>
        <p>
          Created by:{" "}
          {parseInt(room?.user_id) === user_id ? "You" : room?.created_by}
        </p>
        <p>Players Count: {room?.count_of_players || 0}</p>
        {isCopy && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              copyText(`${CONSTANT.client}room/${room?.code}`);
            }}
            className={`${isProgress ? "bg-white text-black":"bg-green-100 text-green-800"} cursor-pointer absolute bottom-2 right-2  capitalize text-md font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300`}
          >
            {isCopied ? "Copied" : "Copy Invite"}
          </span>
        )}
      </div>
    </div>
  );
};

const Rooms = () => {
  let navigate = useNavigate();
  const { session } = useContext(UserData);
  const [open, setOpen] = useState([]);
  const [progress, setProgress] = useState([]);
  const [expired, setExpired] = useState([]);

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
  return (
    <div className="mt-20 mb-10 flex flex-col md:flex-col justify-center items-center">
      <div className="mb-5 flex flex-col w-full">
        <h1 className="text-center text-3xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
          Ro
          <span className="leading-tighter tracking-tighter text-_accent_1_">
            oms
          </span>
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="px-5 md:px-0 w-full md:w-5/6">
          {progress?.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl md:text-3xl font-bold mb-4">
                In-Progress Rooms
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
                    />
                  );
                })}
                {progress.length <= 0 && (
                  <span className="">No rooms yet.</span>
                )}
              </div>
            </section>
          )}
          <section className="mb-10">
            <h2 className="text-xl md:text-3xl font-bold mb-4">Open Rooms</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {open?.map((room, index) => {
                return (
                  <RoomCard
                    key={index}
                    room={room}
                    user_id={parseInt(session?.personal?.id)}
                    navigate={navigate}
                  />
                );
              })}
              {open.length <= 0 && <span className="">No rooms yet.</span>}
            </div>
          </section>
          <section>
            <h2 className="text-xl md:text-3xl font-bold mb-4">
              Expired Rooms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {expired.length <= 0 && <span className="">No rooms yet.</span>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
