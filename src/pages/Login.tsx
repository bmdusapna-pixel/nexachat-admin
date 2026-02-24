"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Input, { ExInput } from "../extra/Input";
import PasswordInput from "../extra/PasswordInput";
import Logo from "../../public/nexachatlogo.jpg";
import Image from "next/image";
import Button from "../extra/Button";
import { useAppDispatch } from "@/store/store";
import { useRouter } from "next/router";
import { login, setLoading } from "@/store/adminSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../component/lib/firebaseConfig";
import { DangerRight, Success } from "@/api/toastServices";
const loginImageUrl = "https://plus.unsplash.com/premium_photo-1681487916420-8f50a06eb60e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
import { projectName } from "@/utils/config";

interface RootState {
  admin: {
    isAuth: boolean;
    admin: Object;
    isLoading: boolean;
  };
}

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuth, admin, isLoading } = useSelector(
    (state: RootState) => state.admin
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    dispatch(setLoading(true));
    setLoginLoading(true);
    if (!email || !password) {
      let errorObj: any = {};
      if (!email) errorObj.email = "Email Is Required!";
      if (!password) errorObj.password = "Password is required!";
      dispatch(setLoading(false));
      setLoginLoading(false);
      return setError(errorObj);
    }

    const token = await loginUser(email, password);

    let payload: any = {
      email,
      password,
    };

    if (token) {
      dispatch(login(payload));
    }
    dispatch(setLoading(false));
    setLoginLoading(false);
  };

  const loginUser = async (email: string, password: string) => {
    try {
      // Sign in user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential)
      const uid = userCredential?.user?.uid; // ✅ Fix: Declare uid

      if (!userCredential.user) {
        return null;
      }

      // Get Firebase Auth Token
      const token = await userCredential?.user?.getIdToken(true); // ✅ Force refresh
      // Store token in localStorage or sessionStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("uid", uid);

      return token;
    } catch (error: any) {
      DangerRight("Invalid credentials. Please check your email and password.");
      return null;
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="image-section">
          <img
            src={loginImageUrl}
            alt="Login Visual"
            className="login-visual"
          />
        </div>

        <div className="form-section d-flex flex-column align-items-center justify-content-center w-50 login-custom-form">
          <div className="">
            <div className="logologin">
              <img src={Logo.src} width={80} height={80} alt="logo" style={{ borderRadius: '16px' }} />
            </div>

            <h2 className="title">Login to your account</h2>
            <p className="subtitle">
              Let&apos;s connect, chat, and spark real connections. Enter your
              credentials to continue your journey on {projectName}.
            </p>

            <form className="login-form">
              <div className="form-group">
                <label>Enter your Email</label>
                <input
                  type="text"
                  value={email}
                  placeholder="Enter your email"
                  onKeyDown={handleKeyPress}
                  onChange={(e: any) => {
                    setEmail(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        email: `email Id is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        email: "",
                      });
                    }
                  }}
                />
                <span className="text-danger" style={{ fontSize: "12px" }}>
                  {error.email}
                </span>
              </div>

              <PasswordInput
                label="Enter your Password"
                value={password}
                placeholder="Enter your password"
                onChange={(e: any) => {
                  setPassword(e.target.value);
                  if (!e.target.value) {
                    setError({ ...error, password: "Password is Required" });
                  } else {
                    setError({ ...error, password: "" });
                  }
                }}
                onKeyDown={handleKeyPress}
                error={error.password}
              />

              <div className="form-actions">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="login-btn"
                >
                  {loginLoading ? "Loading..." : "Log In"}
                </button>
              </div>

              <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#666" }}>
                Are you a Manager?{" "}
                <a
                  href="/ManagerLogin"
                  style={{ color: "#8F6DFF", textDecoration: "underline", cursor: "pointer" }}
                >
                  Manager Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
