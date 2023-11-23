import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CONSTANT, prepareLanguageText } from "../CONSTANT";
import UserData from "../contexts/UserData";

const JUMP = 10;

export default function Records() {
  const { session, setSession, options } = useContext(UserData);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  const fetchData = async () => {
    await axios
      .get(CONSTANT.server + `api/logs/${session?.personal?.id}`)
      .then((responce) => {
        setData([...responce.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (session.isLoggedIn) {
      fetchData();
    }
  }, [session]);

  const startIndex = page * JUMP;
  const endIndex = startIndex + JUMP;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div className="mt-10 xl:mt-20 mb-10 flex flex-col md:flex-col justify-center items-center">
      <div className="mb-0 xl:mb-0 xl:mb-5 flex flex-col w-full">
        <h1 className="text-center text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight mb-4">
          {prepareLanguageText("Recent", "Résultats")}
          <span className="mx-2"></span>
          <span className="leading-tighter tracking-tighter text-_accent_1_">
            {prepareLanguageText("Records", "Récents")}
          </span>
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="px-5 md:px-0 w-full md:w-2/3">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    {prepareLanguageText("Your answer", "votre réponse")}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {prepareLanguageText("Correct answer", "réponse correcte")}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {prepareLanguageText("Verb", "verbe")}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {prepareLanguageText("Subject", "sujet")}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {prepareLanguageText("Tense", "temps")}
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    {prepareLanguageText("Points", "Points")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((one, index) => {
                  return (
                    <tr
                      key={index}
                      className={`border-b ${
                        one?.isCorrect
                          ? "bg-emerald-50 hover:bg-emerald-200"
                          : "bg-red-50 hover:bg-red-200"
                      } transition-all duration-300 ease-in-out cursor-pointer`}
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {one?.answer}
                      </th>
                      <td className="px-6 py-4">{one?.correctAnswer}</td>
                      <td className="px-6 py-4 capitalize">
                        {one?.verb?.value}
                      </td>
                      <td className="px-6 py-4 capitalize">
                        {one?.subject?.label}
                      </td>
                      <td className="px-6 py-4 capitalize">
                        {one?.tense?.label}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {one?.isCorrect ? `+${one?.points}` : "0"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <nav
            className="flex items-center justify-between pt-4"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {prepareLanguageText("Showing", "Montrant")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {startIndex + 1}-{Math.min(endIndex, data.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {data.length}
              </span>
            </span>
            <ul className="inline-flex -space-x-px text-sm h-8">
              <li>
                <button
                  onClick={() => setPage(Math.max(page - 1, 0))}
                  className={`flex items-center justify-center px-3 h-8 ml-0 leading-tight ${
                    page === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  }`}
                  disabled={page === 0}
                >
                  {prepareLanguageText("Previous", "Précédent")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPage(page + 1)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight ${
                    endIndex >= data.length
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  }`}
                  disabled={endIndex >= data.length}
                >
                  {prepareLanguageText("Next", "Suivante")}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
