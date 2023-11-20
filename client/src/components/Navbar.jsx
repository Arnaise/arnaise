import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SITE_DETAILS, prepareLanguageText } from "../CONSTANT";
import { RiGameLine } from "react-icons/ri";

// const NavbarLink = ({ to, label, isNormal = true }) => {
//   const location = useLocation();
//   const [isActive, setIsActive] = useState(false);

//   useEffect(() => {
//     setIsActive(location.pathname === to);
//   }, [location, to]);

//   return (
//     <Link
//       to={to}
//       className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white ${
//         isActive ? "opacity-50" : ""
//       }`}
//     >
//       {label}
//     </Link>
//   );
// };

const NavbarLink = ({ to, label, isNormal = true }) => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(location.pathname === to);
  }, [location, to]);
  if (label === "Logout" || label === "Déconnexion") {
    return (
      <span
        onClick={to}
        className={`${
          isActive && "opacity-50"
        } cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white`}
      >
        {label}
      </span>
    );
  }
  if (!isNormal) {
    return (
      <Link
        to={to}
        className={`${
          isActive && "opacity-50"
        } block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white`}
      >
        {label}
      </Link>
    );
  }
  return (
    <Link
      to={to}
      className={`${
        isActive && "opacity-50"
      } block pl-10 py-3 text-gray-700 bg-white md:hover:bg-white md:hover:translate-x-0 md:hover:text-gray-500 hover:bg-_accent_1_ hover:text-white hover:translate-x-2 transition-all duration-300 ease-in-out rounded md:bg-transparent md:p-0 md:dark:text-blue-500`}
    >
      {label}
    </Link>
  );
};

export default function Navbar(props) {
  let navigate = useNavigate();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);

  const logout = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("loggedin");
    props?.setSession({
      ...props?.session,
      personal: props?.__init_session.personal,
      isLoggedIn: false,
    });
    navigate("/");
  };

  return (
    <nav className="h-[4rem] w-full bg-white border-gray-200 dark:bg-gray-900 drop-shadow-2xl z-10 relative">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex flex-row items-center">
          <Link to="/" className="flex items-center">
            <img
              src={SITE_DETAILS.logo}
              className="h-8 mr-3 invert-[100]"
              alt="Verbuga"
            />
            {SITE_DETAILS.logo === "" && (
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                {SITE_DETAILS.name}
              </span>
            )}
          </Link>
          <div className="flex items-start space-x-3 relative text-white z-30">
            <span
              className="h-fit"
              onClick={() => {
                props?.setLanguage("en");
              }}
            >
              <img
                src={"/assets/uk.png"}
                alt=""
                className={`${
                  props?.language === "en" ? "" : "grayscale"
                } w-6 h-6  cursor-pointer transition ease-out hover:animate-pulse delay-500 hover:delay-500 `}
              />
            </span>

            <span
              onClick={() => {
                props?.setLanguage("fr");
              }}
            >
              <img
                src={"/assets/fr.png"}
                alt=""
                className={`${
                  props?.language === "fr" ? "" : "grayscale"
                } w-6 h-6 cursor-pointer transition ease-out hover:animate-pulse delay-500 hover:delay-500`}
              />
            </span>
          </div>
        </div>
        <div className="flex items-center relative md:order-2">
          {props?.isLoggedIn ? (
            <>
              <span
                className={`cursor-pointer ${
                  props?.points <= 0
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                } text-sm font-medium flex flex-row items-center mr-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300`}
              >
                {props?.points} Points{" "}
                <RiGameLine
                  size={"16px"}
                  className={`ml-1 ${
                    props?.points <= 0
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                />
              </span>
              <button
                className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                onClick={() => {
                  setIsOpenProfile(!isOpenProfile);
                }}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-8 h-8 rounded-full"
                  src={SITE_DETAILS.empty_profile}
                  alt="user photo"
                />
              </button>
              {/* Dropdown menu */}
              {isOpenProfile && (
                <>
                  <div
                    className="fixed w-screen h-screen inset-0 bg-white opacity-0"
                    onClick={() => {
                      setIsOpenProfile(!isOpenProfile);
                    }}
                  ></div>
                  <div className="z-20 absolute right-0 top-5 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                    <div className="px-4 py-3">
                      <span className="block text-sm text-gray-900 dark:text-white">
                        @{props?.session?.personal?.username}
                      </span>
                      {/* <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                      @{props?.session?.personal?.username}
                      </span> */}
                    </div>
                    <ul className="py-2" aria-labelledby="user-menu-button">
                      <li>
                        <NavbarLink
                          to="/profile"
                          label={prepareLanguageText("Profile", "Mon Profil")}
                          isNormal={false}
                        />
                      </li>
                      <li>
                        <NavbarLink
                          to={() => {
                            logout();
                          }}
                          label={prepareLanguageText("Logout", "Déconnexion")}
                          isNormal={false}
                        />
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="space-x-2 flex-row hidden md:flex">
                <Link to="/login">
                  <span className="cursor-pointer md:border  rounded-lg md:border-black md:px-5 md:py-2 p-0  bg-transparent text-black hover:bg-black hover:text-white transition-all duration-200 ease-in-out">
                    {prepareLanguageText("Login", "Connexion")}
                  </span>
                </Link>
                <Link to="/register">
                  <span className="cursor-pointer md:border  rounded-lg md:border-black md:px-5 md:py-2 p-0 pr-2  bg-transparent text-black hover:bg-black hover:text-white transition-all duration-200 ease-in-out">
                    {prepareLanguageText("Register", "S’inscrire")}
                  </span>
                </Link>
              </div>
            </>
          )}
          <button
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={() => {
              setIsOpenMenu(!isOpenMenu);
            }}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`z-10 items-center justify-between ${
            !isOpenMenu && "hidden"
          } w-full md:flex md:w-auto md:order-1`}
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li className="md:hidden">
              <NavbarLink
                to="/login"
                label={prepareLanguageText("Login", "Connexion")}
              />
            </li>
            <li className="md:hidden">
              <NavbarLink
                to="/register"
                label={prepareLanguageText("Register", "S’inscrire")}
              />
            </li>
            <li>
              <NavbarLink
                to="/"
                label={prepareLanguageText("Home", "Choisir")}
              />
            </li>
            {props?.isLoggedIn && (
              <li>
                <NavbarLink
                  to="/records"
                  label={prepareLanguageText("Records", "Résultats")}
                />
              </li>
            )}
            <li>
              <NavbarLink
                to="/leaderboard"
                label={prepareLanguageText("Leaderboard", "Classement")}
              />
            </li>
            {props?.isLoggedIn && (
              <li>
                <NavbarLink
                  to="/multiplayer"
                  label={prepareLanguageText("Multiplayer", "Multiplayer")}
                />
              </li>
            )}
            {/* ... other links */}
          </ul>
        </div>
      </div>
    </nav>
  );
}
