import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  CONSTANT,
  setMessage,
  resetMessage,
  checkLoginFromLogin,
  SITE_DETAILS,
} from "../CONSTANT";
import InputBox from "../components/InputBox";
import CustomButton from "../components/CustomButton";

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (checkLoginFromLogin()) {
      navigate("/");
    }
  }, []);
  const login = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (payload.username !== "") {
      if (payload.password !== "") {
        await axios
          .post(CONSTANT.server + "authentication/validate", payload)
          .then((responce) => {
            if (responce.status === 200) {
              let res = responce.data;
              if (res.message) {
                setMessage(res.message, "red-500");
              } else {
                localStorage.setItem(
                  "loggedin",
                  JSON.stringify({
                    data: res,
                  })
                );
                navigate("/");
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setMessage("Please enter password.", "red-500");
      }
    } else {
      setMessage("Please enter valid username.", "red-500");
    }
    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Log In";
  };

  const init__payload = {
    email: "",
    password: "",
  };
  const [payload, setPayload] = useState(init__payload);
  const changePayload = (e) => {
    setPayload({
      ...payload,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen">
      <div className="px-5 md:px-0 w-full md:w-1/3 backdrop-blur-3xl rounded-3xl bg-white/30 py-10">
        <div className="mb-5 flex justify-center items-center">
          <Link to="/">
            <img src={SITE_DETAILS.logo} className="invert-[100] w-[8rem]" />
          </Link>
        </div>
        <h1 className="text-center text-5xl font-extrabold leading-tight tracking-tight">
          <span className="leading-tighter tracking-tighter bg-clip-text text-black">
            Welcome Back
          </span>
        </h1>
        <div className="flex flex-col space-y-3 mt-5">
          <InputBox
            type="text"
            name="username"
            value={payload.username}
            onChange={changePayload}
            placeholder="Enter your username."
          />
          <InputBox
            type="password"
            name="password"
            value={payload.password}
            onChange={changePayload}
            placeholder="Enter your password."
          />
        </div>
        <div className="mt-5">
          Don't have account?{" "}
          <Link className="text-blue-500 hover:text-blue-400" to={"/register"}>
            Create one
          </Link>
          .
        </div>
        <div className="mt-5" id="error" style={{ display: "none" }}></div>
        <div className="mt-5 text-center">
          <CustomButton label="Login" onClick={login} />
        </div>
      </div>
    </div>
  );
};

export default Login;
