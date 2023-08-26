import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SITE_DETAILS } from "../CONSTANT";

const renderLink = (to, label, isNormal = true) => {
  if (label === "Logout") {
    return (
      <span
        onClick={to}
        className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
      >
        {label}
      </span>
    );
  }
  if (!isNormal) {
    return (
      <Link
        to={to}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
      >
        {label}
      </Link>
    );
  }
  return (
    <Link
      to={to}
      className="block pl-10 py-3 text-gray-700 bg-white md:hover:bg-white md:hover:translate-x-0 md:hover:text-gray-500 hover:bg-_accent_1_ hover:text-white hover:translate-x-2 transition-all duration-300 ease-in-out rounded md:bg-transparent md:p-0 md:dark:text-blue-500"
    >
      {label}
    </Link>
  );
};

export default function Navbar(props) {
  let navigate = useNavigate();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);

  const logout = async (nav) => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("loggedin");
    props?.setSession({
      ...props?.session,
      personal: props?.__init_session.personal,
      isLoggedIn: false,
    });
    nav("/");
  };

  return (
    <nav className="h-[4rem] w-full bg-white border-gray-200 dark:bg-gray-900 drop-shadow-2xl z-10">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
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
        <div className="flex items-center relative md:order-2">
          {props?.isLoggedIn ? (
            <>
              <span
                className={`cursor-pointer ${
                  props?.points <= 0
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                } text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300`}
              >
                {props?.points} Points
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
                        {props?.session?.personal?.fullName}
                      </span>
                      <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                        {props?.session?.personal?.email}
                      </span>
                    </div>
                    <ul className="py-2" aria-labelledby="user-menu-button">
                      <li>{renderLink("/profile", "Profile", false)}</li>
                      <li>
                        {renderLink(
                          () => {
                            logout(navigate);
                          },
                          "Logout",
                          false
                        )}
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="space-x-2 flex flex-row">
                <Link to="/login">
                  <span className="cursor-pointer border rounded-lg border-black px-5 py-2 bg-transparent text-black hover:bg-black hover:text-white transition-all duration-200 ease-in-out">
                    Login
                  </span>
                </Link>
                <Link to="/register">
                  <span className="cursor-pointer border rounded-lg border-black px-5 py-2 bg-transparent text-black hover:bg-black hover:text-white transition-all duration-200 ease-in-out">
                    Register
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
            <li>{renderLink("/", "Home")}</li>
            {props?.isLoggedIn && <li>{renderLink("/records", "Records")}</li>}
            <li>{renderLink("/leaderboard", "Leaderboard")}</li>
            {props?.isLoggedIn && <li>{renderLink("/rooms", "Rooms")}</li>}
            {/* <li>{renderLink("/", "Mistakes")}</li>
            <li>{renderLink("/", "Conjugation")}</li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
}
