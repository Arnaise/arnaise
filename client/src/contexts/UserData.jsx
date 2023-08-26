import React from "react";

const UserData = React.createContext({
  session: {
    access_token: "",
    personal: {
      id: "",
      email: "",
      fullName: "",
      points: "",
      timestamp: "",
    },
    isLoggedIn: false,
    isLoaded: false,
  },
  setSession: () => {},
  options: {
    tenses: [],
    subjects: [],
    verbs: [],
  },
  updatePoints: () => {},
});

export default UserData;
