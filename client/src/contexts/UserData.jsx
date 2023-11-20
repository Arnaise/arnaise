import React from "react";

const UserData = React.createContext({
  session: {
    access_token: "",
    personal: {
      id: "",
      username: "",
      points: "",
      timestamp: "",
    },
    isLoggedIn: false,
    isLoaded: false,
    language: localStorage.getItem("language") ?? "en",
  },
  setSession: () => {},
  options: {
    tenses: [],
    subjects: [],
    verbs: [],
  },
  updatePoints: () => {},
  setToast: () => {},
});

export default UserData;
