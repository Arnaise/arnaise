import React from "react";

const UserData = React.createContext({
  session: {
    access_token: "",
    personal: {
      id: "",
      email: "",
      username: "",
      role: "",
    },
    isLoggedIn: false,
  },
  setSession: () => {},
  options: {
    tenses: [],
    subjects: [],
    verbs: [],
  },
});

export default UserData;
