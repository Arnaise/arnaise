import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserData from "../contexts/UserData";
import Navbar from "../components/Navbar";
import { CONSTANT, DEFAULT_LANGUAGE, checkLoginFromNonLogin } from "../CONSTANT";
import BackgroundBlur from "../components/BackgroundBlur";
import { IconContext } from "react-icons";
import axios from "axios";
import ToastAlert from "../components/ToastAlert";
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
    language: localStorage.getItem("language") ?? DEFAULT_LANGUAGE,
  };
  const [session, setSession] = useState(__init_session);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") ?? DEFAULT_LANGUAGE
  );

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

  useEffect(() => {
    localStorage.setItem("language", language);
    setSession((prevSession) => ({
      ...prevSession,
      language: language,
    }));
  }, [language]);

  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (session?.isLoggedIn) {
      setPoints(session?.personal?.points);
    }
  }, [session]);
  let TOAST__INIT__ = {
    open: false,
    success: true,
    message: "",
  };
  const [toast, setToast] = useState(TOAST__INIT__);

  useEffect(() => {
    if (toast.open) {
      setTimeout(() => {
        setToast(TOAST__INIT__);
      }, 3000);
    }
  }, [toast]);

  const value = { session, setSession, options, updatePoints, setToast };
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
            setLanguage={setLanguage}
            language={language}
          />
          {toast.open && (
            <ToastAlert success={toast.success} message={toast.message} />
          )}
          {/* <BackgroundBlur /> */}
          <div className="mx-0 md:mx-10">{props.children}</div>
        </IconContext.Provider>
      </UserData.Provider>
    </>
  );
}
