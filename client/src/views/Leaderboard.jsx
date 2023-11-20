import React, { useState, useEffect, useContext } from "react";
import UserLeaderCard from "../components/UserLeaderCard";
import ordinal from "ordinal";
import UserData from "../contexts/UserData";
import axios from "axios";
import { CONSTANT, prepareLanguageText } from "../CONSTANT";

export default function Leaderboard() {
  const { session } = useContext(UserData);
  const [top10Users, setTop10Users] = useState([]);
  const [mine, setMine] = useState(null);

  const fetchData = async () => {
    await axios
      .get(CONSTANT.server + `api/leaderboard`)
      .then((responce) => {
        setTop10Users(responce.data);
        // console.log(responce.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchMine = async () => {
    await axios
      .post(CONSTANT.server + `api/leaderboard`, {
        user_id: session?.personal?.id,
      })
      .then((responce) => {
        setMine(responce.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (session.isLoaded) {
      fetchData();
    }
    if (session?.isLoggedIn) {
      fetchMine();
    }
  }, [session]);

  return (
    <div className="mt-20 mb-10 flex flex-col md:flex-col justify-center items-center">
      <div className="mb-5 flex flex-col w-full">
        <h1 className="text-center text-3xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
          {prepareLanguageText("Leader", "Classe")}
          <span className="leading-tighter tracking-tighter text-_accent_1_">
            {prepareLanguageText("board", "ment")}
          </span>
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="px-5 md:px-0 w-full md:w-2/3 flex justify-center">
          <div className="flex flex-col md:w-1/2 space-y-4 mt-10">
            {session?.isLoggedIn && mine && (
              <UserLeaderCard
                index={-1}
                data={mine}
                position={ordinal(mine?.position)}
                className="mb-14"
              />
            )}
            {top10Users.map((data, index) => {
              return (
                <UserLeaderCard
                  index={index + 1}
                  data={data}
                  position={ordinal(data?.position)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
