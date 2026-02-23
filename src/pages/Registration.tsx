/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
// import { useSelector } from "react-redux";
import { Textarea } from "../extra/Input";
import PasswordInput from "../extra/PasswordInput";
// import Logo from "../assets/images/logo.png";
// import Image from "next/image";
// import Button from "../extra/Button";
import { useAppDispatch } from "@/store/store";
// import { useRouter } from "next/router";
import { signUpAdmin } from "@/store/adminSlice";
const loginImageUrl = "https://plus.unsplash.com/premium_photo-1681487916420-8f50a06eb60e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { auth } from "@/component/lib/firebaseConfig";
import { setToast } from "@/utils/toastServices";

import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Link from "next/link";

type ErrorState = {
  email: string;
  password: string;
  newPassword: string;
  code: string;
  privateKey: string;
};
type RegisterPayload = {
  email: string;
  password: string;
  code: string;
  uid: string;
  token: string;
  privateKey: unknown;
};

export default function Registration() {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState("");
  const [privateKeyInput, setPrivateKeyInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<ErrorState>({
    email: "",
    password: "",
    newPassword: "",
    code: "",
    privateKey: "",
  });

  // const getFirebaseErrorMessage = (errorCode: string) => {
  //   switch (errorCode) {
  //     case "auth/email-already-in-use":
  //       return "An account with this email already exists. Please use a different email or try logging in.";
  //     case "auth/weak-password":
  //       return "Password is too weak. Please use at least 6 characters with a mix of letters, numbers, and symbols.";
  //     case "auth/invalid-email":
  //       return "Please enter a valid email address.";
  //     case "auth/operation-not-allowed":
  //       return "Email/password accounts are not enabled. Please contact support.";
  //     case "auth/too-many-requests":
  //       return "Too many unsuccessful attempts. Please try again later.";
  //     case "auth/network-request-failed":
  //       return "Network error. Please check your internet connection and try again.";
  //     default:
  //       return "Registration failed. Please try again or contact support if the problem persists.";
  //   }
  // };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrivateKeyInput(value);

    if (!value.trim()) {
      setJsonError("Firebase JSON key is required!");
      return;
    }

    try {
      JSON.parse(value);
      setJsonError(""); // clear error if valid
    } catch {
      setJsonError("Invalid JSON format!");
    }
  };

  // ✅ Validate all fields before submit (enhanced)
  const validateForm = () => {
    const errorObj: Partial<ErrorState> = {};

    if (!email) {
      errorObj.email = "Email is required!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorObj.email = "Please enter a valid email address!";
    }

    if (!password) {
      errorObj.password = "Password is required!";
    } else if (password.length < 6) {
      errorObj.password = "Password must be at least 6 characters long!";
    }

    if (!newPassword) {
      errorObj.newPassword = "Confirm password is required!";
    } else if (newPassword !== password) {
      errorObj.newPassword = "Passwords do not match!";
    }

    if (!code) {
      errorObj.code = "Purchase code is required!";
    } else if (code.trim().length < 3) {
      errorObj.code = "Please enter a valid purchase code!";
    }

    if (!privateKeyInput) {
      errorObj.privateKey = "Private key JSON is required!";
    } else {
      try {
        JSON.parse(privateKeyInput);
      } catch {
        errorObj.privateKey = "Invalid JSON format!";
      }
    }

    setError({
      email: errorObj.email || "",
      password: errorObj.password || "",
      newPassword: errorObj.newPassword || "",
      code: errorObj.code || "",
      privateKey: errorObj.privateKey || "",
    });
    return Object.keys(errorObj).length === 0;
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setError({
      email: "",
      password: "",
      newPassword: "",
      code: "",
      privateKey: "",
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const parsedKey = JSON.parse(privateKeyInput);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      const token = await userCredential.user.getIdToken(true);

      const payload: RegisterPayload = {
        email,
        password,
        code:"0a900584-4e38-44e0-80f2-e337857eaae0",
        uid,
        token,
        privateKey: parsedKey,
      };
      try {
        await dispatch(signUpAdmin(payload));
      } catch (error) {
        await deleteUser(userCredential.user);
      }
      setTimeout(() => {
        window.location.reload();
        setLoading(false);
      }, 2000);
    } catch (firebaseError: unknown) {

      const errorWithCode = firebaseError as { code?: string };
      if (errorWithCode?.code) {
        // const userFriendlyMessage = getFirebaseErrorMessage(errorWithCode.code);
        // setToast("error", userFriendlyMessage);

        switch (errorWithCode.code) {
          case "auth/email-already-in-use":
            setError((prev) => ({
              ...prev,
              email: "This email is already registered.",
            }));
            break;
          case "auth/weak-password":
            setError((prev) => ({
              ...prev,
              password: "Password is too weak.",
            }));
            break;
          case "auth/invalid-email":
            setError((prev) => ({ ...prev, email: "Invalid email format." }));
            break;
        }
      } else {
        setToast(
          "error",
          "An unexpected error occurred. Please try again later."
        );
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="image-section">
          <img
            src={loginImageUrl}
            alt="Registration Visual"
            className="login-visual"
          />
        </div>

        <div className="form-section d-flex flex-column align-items-center w-50 login-custom-form" style={{ overflowY: "auto", maxHeight: "100vh", paddingTop: "40px", paddingBottom: "40px" }}>
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <div className="logologin">
              <img src="/nexachatlogo.jpg" alt="logo" className="w-100 h-100" style={{ borderRadius: '16px' }} />
            </div>

            <h2 className="title">SignUp</h2>
            <p className="subtitle">
              Welcome back! Please enter your email,password and purchasecode to
              register your account.
            </p>

            <form className="login-form">
              <div className="form-group">
                <label>Enter your Email</label>
                <input
                  type="text"
                  value={email}
                  placeholder="Enter your email"
                  className="custom-input"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                <p className="text-danger">{error.email && error.email}</p>
              </div>

              <PasswordInput
                label="Enter your Password"
                value={password}
                placeholder="Type your password here"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const passwordValue = e.target.value;
                  setPassword(passwordValue);

                  if (!passwordValue) {
                    setError({
                      ...error,
                      password: "Password is required",
                      newPassword:
                        newPassword && newPassword !== passwordValue
                          ? "Passwords do not match!"
                          : error.newPassword,
                    });
                  } else if (passwordValue.length < 6) {
                    setError({
                      ...error,
                      password: "Password must be at least 6 characters long!",
                      newPassword:
                        newPassword && newPassword !== passwordValue
                          ? "Passwords do not match!"
                          : error.newPassword,
                    });
                  } else {
                    setError({
                      ...error,
                      password: "",
                      newPassword:
                        newPassword && newPassword !== passwordValue
                          ? "Passwords do not match!"
                          : "",
                    });
                  }
                }}
                error={error.password}
              />

              <PasswordInput
                label="Enter your Confirm Password"
                value={newPassword}
                placeholder="Type your password here"
                name="confirmPassword"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const confirmPasswordValue = e.target.value;
                  setNewPassword(confirmPasswordValue);

                  if (!confirmPasswordValue) {
                    setError({
                      ...error,
                      newPassword: "Confirm password is required",
                    });
                  } else if (confirmPasswordValue !== password) {
                    setError({
                      ...error,
                      newPassword: "Passwords do not match!",
                    });
                  } else {
                    setError({
                      ...error,
                      newPassword: "",
                    });
                  }
                }}
                error={error.newPassword}
              />

              {/* <div className="form-group">
                <label>Enter your Purchase Code</label>
                <input
                  type="text"
                  value={code}
                  placeholder="Enter your purchase code"
                  className="custom-input"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCode(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        code: `Purchase code is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        code: "",
                      });
                    }
                  }}
                />
                <p className="text-danger">{error.code && error.code}</p>
              </div> */}

              <div className="form-group">
                <label
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  Private Key JSON
                  <Tooltip
                    title="Firebase Notification Settings: Configure Firebase Cloud Messaging (FCM) to send push notifications. For detailed instructions, see Admin Panel / Setup Notification (FCM)."
                    placement="right"
                    arrow
                  >
                    <Link
                      href="https://docs.codderlab.com/Figgy/"
                      target="_blank"
                    >
                      <InfoOutlinedIcon
                        sx={{ color: "#6c757d", cursor: "pointer" }}
                      />
                    </Link>
                  </Tooltip>
                </label>
                <Textarea
                  rows={6}
                  value={privateKeyInput}
                  placeholder="Paste your Firebase private key JSON here"
                  onChange={handleJsonChange}
                  style={{ border: "1px solid gray" }}
                />
                <p className="text-danger">{jsonError || error.privateKey}</p>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="demo-login-btn mt-3"
                  disabled={loading}
                  style={{
                    opacity: loading ? 0.5 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
