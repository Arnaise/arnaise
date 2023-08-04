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

const Register = () => {
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
    if (
      payload.email !== "" &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(payload.email)
    ) {
      if (payload.password !== "") {
        await axios
          .post(CONSTANT.server + "validate/", payload)
          .then((responce) => {
            if (responce.status === 200) {
              let res = responce.data;
              if (res.message) {
                setMessage(res.message, "red-500");
              } else {
                sessionStorage.setItem(
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
        setMessage("Please Enter Password", "red-500");
      }
    } else {
      setMessage("Please Enter Valid Email", "red-500");
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
      <div className="w-1/3 backdrop-blur-3xl rounded-3xl bg-white/30 px-20 py-10">
        <div className="mb-5 flex justify-center items-center">
          <Link to="/">
            <img src={SITE_DETAILS.logo} className="invert-[100] w-[8rem]" />
          </Link>
        </div>
        <h1 className="text-start text-5xl font-extrabold leading-tight tracking-tight">
          <span className="leading-tighter tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-rose-700 to-pink-600">
            Welcome Back.
          </span>
        </h1>
        <div className="flex flex-col space-y-3 mt-5">
          <InputBox
            type="email"
            name="email"
            value={payload.email}
            onChange={changePayload}
            placeholder="Enter your email."
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
        <div className="mt-5">
          <CustomButton />
        </div>
      </div>
    </div>
  );
};

export default Register;
