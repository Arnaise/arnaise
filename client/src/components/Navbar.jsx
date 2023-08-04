import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SITE_DETAILS } from "../CONSTANT";

const renderLink = (to, label, isNormal = true) => {
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
      className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
    >
      {label}
    </Link>
  );
};

export default function Navbar() {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  return (
    <nav className="h-[4rem] fles justify-center items-center w-full bg-white/40 backdrop-blur-md border-gray-200 dark:bg-gray-900">
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
            <div className="z-50 absolute right-0 top-5 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  Bonnie Green
                </span>
                <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                  name@flowbite.com
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>{renderLink("/", "Profile", false)}</li>
                <li>{renderLink("/", "Logout", false)}</li>
              </ul>
            </div>
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
          className={`items-center justify-between ${
            !isOpenMenu && "hidden"
          } w-full md:flex md:w-auto md:order-1`}
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>{renderLink("/", "Home")}</li>
            <li>{renderLink("/", "About")}</li>
            <li>{renderLink("/", "Mistakes")}</li>
            <li>{renderLink("/", "Conjugation")}</li>
            <li>{renderLink("/", "Results")}</li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
