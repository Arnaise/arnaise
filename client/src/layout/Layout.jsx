import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserData from "../contexts/UserData";
import Navbar from "../components/Navbar";
import { CONSTANT, checkLoginFromNonLogin } from "../CONSTANT";
import BackgroundBlur from "../components/BackgroundBlur";
import { IconContext } from "react-icons";
import axios from "axios";
export default function Layout(props) {
  let navigate = useNavigate();
  // ------------------
  // SESSION - END
  // ------------------
  let __init_session = {
    personal: {
      id: "",
      username: "",
      points: "",
      timestamp: "",
    },
    isLoggedIn: false,
    isLoaded: false,
  };
  const [session, setSession] = useState(__init_session);

  useEffect(() => {
    let sessionData = JSON.parse(localStorage.getItem("loggedin"));
    if (sessionData) {
      setSession({
        ...__init_session,
        personal: sessionData.data,
        isLoggedIn: true,
        isLoaded: true,
      });
    } else {
      setSession({
        ...__init_session,
        isLoaded: true,
      });
    }
    fetchOptions();
  }, []);

  const [options, setOptions] = useState({
    tenses: [],
    subjects: [],
    verbs: [],
  });

  const fetchOptions = async () => {
    await axios
      .get(CONSTANT.server + "api/options")
      .then((responce) => {
        setOptions(responce.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updatePoints = (point) => {
    let update = {
      ...session?.personal,
      points: points + parseInt(point),
    };
    setPoints(update.points);
    localStorage.setItem(
      "loggedin",
      JSON.stringify({
        data: update,
      })
    );
  };

  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (session?.isLoggedIn) {
      setPoints(session?.personal?.points);
    }
  }, [session]);

  const value = { session, setSession, options, updatePoints };
  // ------------------
  // SESSION - END
  // ------------------
  useEffect(() => {
    if (checkLoginFromNonLogin() && props?.login) {
      navigate("/login");
    }
  }, [session]);

  return (
    <>
      <UserData.Provider value={value}>
        <IconContext.Provider
          value={{
            className:
              "text-_accent_1_ hover:opacity-60 transition-all duration-300 ease-in-out",
          }}
        >
          <Navbar
            isLoggedIn={session.isLoggedIn}
            __init_session={__init_session}
            setSession={setSession}
            session={session}
            points={points}
          />
          {/* <BackgroundBlur /> */}
          <div className="mx-0 md:mx-10">{props.children}</div>
        </IconContext.Provider>
      </UserData.Provider>
    </>
  );
}
