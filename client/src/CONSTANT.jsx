import axios from "axios";

export const CONSTANT = {
  server: "http://rehansathio.pythonanywhere.com/", // CHANGE WITH YOUR BACKEND LINK (/ is MUST IN END)
  socket: "wss://rehansathio.pythonanywhere.com/", // CHANGE WITH YOUR BACKEND LINK (/ is MUST IN END)
  admin: "http://rehansathio.pythonanywhere.com/admin", // CHANGE WITH YOUR BACKEND LINK (/ is MUST IN END)
  client: "http://rehansathio.pythonanywhere.com/", // CHANGE WITH YOUR FRONTEND LINK (/ is MUST IN END)
};

// export const CONSTANT = {
//   server: "https://auth-db.rfrsh.io/", // CHANGE WITH YOUR BACKEND LINK (/ is MUST IN END)
//   socket: "wss://auth-db.rfrsh.io/", // CHANGE WITH YOUR BACKEND LINK (/ is MUST IN END)
//   admin: "https://auth-db.rfrsh.io/admin", // CHANGE WITH YOUR BACKEND LINK (/ is MUST IN END)
//   client: "https://auth-db.rfrsh.io/", // CHANGE WITH YOUR FRONTEND LINK (/ is MUST IN END)
// };

// export const CONSTANT = {
//   server: "http://127.0.0.1:8000/", // CHANGE WITH YOUR BACKEND LINK (/ is MUST IN END)
//   socket: "ws://127.0.0.1:8000/", // CHANGE WITH YOUR BACKEND LINK (/ is MUST IN END)
//   admin: "http://127.0.0.1:8000/admin", // CHANGE WITH YOUR BACKEND LINK (/ is MUST IN END)
//   client: "http://localhost:5173/", // CHANGE WITH YOUR FRONTEND LINK (/ is MUST IN END)
// };

export const SITE_DETAILS = {
  name: "Verbuga",
  logo: "https://www.ncl.com/sites/default/files/french_fr_horz_white.png",
  empty_profile:
    "https://media.istockphoto.com/id/1164822188/vector/male-avatar-profile-picture.jpg?s=612x612&w=0&k=20&c=KPsLgVIwEGdDvf4_kiynCXw96p_PhBjIGdU68qkpbuI=",
};

export const BG_COLORS = [
  "bg-gray-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-fuchsia-500",
  "bg-lime-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-maroon-500",
  "bg-sky-500",
  "bg-rose-500",
  "bg-crimson-500",
];

export const checkLoginFromLogin = () => {
  return localStorage.getItem("loggedin") &&
    JSON.parse(localStorage.getItem("loggedin")).data
    ? true
    : false;
};

export const checkLoginFromNonLogin = () => {
  return localStorage.getItem("loggedin") &&
    JSON.parse(localStorage.getItem("loggedin")).data
    ? false
    : true;
};

export const getUserData = () => {
  if (
    localStorage.getItem("loggedin") &&
    JSON.parse(localStorage.getItem("loggedin")).data
  ) {
    // request data
    axios
      .post(CONSTANT.server + "user/", {
        id: JSON.parse(localStorage.getItem("loggedin")).data.id,
      })
      .then((responce) => {
        if (responce.status === 200) {
          let res = responce.data;
          localStorage.setItem(
            "loggedin",
            JSON.stringify({
              data: res,
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    JSON.parse(localStorage.getItem("loggedin")).data ?? {
      id: "",
      email: "",
      setGoal: 0,
      first_name: "",
      last_name: "",
      isInterestedInNumbers: false,
      isInterestedInCounting: false,
      isInterestedInSum: false,
      isInterestedInMultiplication: false,
      isInterestedInDance: false,
    }
  );
};

export const Loader = (extra = "") => {
  return (
    <div className={`spinner-grow ${extra}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export const setMessage = (text, color) => {
  let error = document.getElementById("error");
  error.innerHTML = text;
  error.classList.add("text-" + color);
  error.style.display = "block";
};

export const resetMessage = () => {
  let error = document.getElementById("error");
  error.innerText = "";
  error.style.display = "none";
  error.classList.remove("text-red-500");
  error.classList.remove("text-green-500");
};

export const isMessage = () => {
  let error = document.getElementById("error");
  if (error.style.display === "none") {
    return false;
  }
  return true;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Set a Cookie
export function setCookie(cName, cValue, expDays) {
  let date = new Date();
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

export function getCookie(cName) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split("; ");
  let res;
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  });
  return res;
}
