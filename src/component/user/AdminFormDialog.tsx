import React, { useEffect, useState } from "react";
import RootLayout from "../layout/Layout";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { ExInput, Textarea } from "@/extra/Input";
import { useSelector } from "react-redux";
import { isLoading } from "@/utils/allSelector";
import { RootStore, useAppDispatch } from "@/store/store";
import { baseURL } from "@/utils/config";
import male from "@/assets/images/male.png";
import { createAdminUser, getUserProfile, updateAdminUser } from "@/store/userSlice";
import { useRouter } from "next/router";
import Button from "@/extra/Button";
import { closeDialog } from "@/store/dialogSlice";
import PasswordInput from "@/extra/PasswordInput";
import { toast } from "react-toastify";

interface ErrorState {
    name: string;
    email: string;
    password: string;
}

const AdminFormDialog = () => {
  const { userProfile, user } = useSelector((state: RootStore) => state.user);
  const { dialogueData } = useSelector((state: RootStore) => state.dialogue);
  const isEdit = Boolean(dialogueData);
  const userData = (() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem("userData") || "null");
    } catch {
      return null;
    }
  })();
  
  const loader = useSelector(isLoading);
  const { setting } = useSelector((state: RootStore) => state.setting);
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState(dialogueData?.name ?? '');
  const [email, setEmail] = useState(dialogueData?.email ?? '');
  const [password, setPassword] = useState("");

  const [error, setError] = useState({
      name: "",
      email: "",
      password: "",
  });

  const router = useRouter();
  const id: any = router?.query?.id;

  const handleSubmit = async (e: React.FormEvent) => {
          
  
          e.preventDefault();
  
          if (isSubmitting) return;
          setIsSubmitting(true);
  
          try {
              // 1) Front-end validation
              const newError: Partial<ErrorState> = {};
              if (!name) newError.name = "Name is required";
              if (!email) newError.email = "Email is required";
              else if (!email.includes("@"))
                  newError.email = "Email must include '@'";
              if (!dialogueData && !password)
                  newError.password = "Password is required";
  
              if (Object.keys(newError).length) {
                  setError(newError as ErrorState);
                  setIsSubmitting(false);
                  return;
              }
  
              // Clear previous errors
              setError({} as ErrorState);
  
              // 2) Build FormData
              const isEdit = Boolean(dialogueData);
              let user: any | null = null;
  
              if (isEdit) {
                  // Update in backend
                  await dispatch(
                      updateAdminUser({ data: { password: password }, id: dialogueData._id })
                  ).unwrap();
  
              } else {
                  // Create new agency
                  try {
                      await dispatch(createAdminUser({ name, email, password })).unwrap();
                  } catch (createError: any) {
                      // Handle Firebase auth errors during creation
                      if (createError.code) {
                          const fieldError: Partial<ErrorState> = {};
  
                          switch (createError.code) {
                              case "auth/email-already-in-use":
                                  fieldError.email =
                                      "This email is already registered";
                                  break;
                              case "auth/weak-password":
                                  fieldError.password =
                                      "Password should be at least 6 characters long";
                                  break;
                              case "auth/invalid-email":
                                  fieldError.email =
                                      "Please enter a valid email address";
                                  break;
                              default:
                                  toast.error("Failed to create admin1");
                                  return;
                          }
  
                          setError(fieldError as ErrorState);
  
                          // Clean up user if created
                          if (user) {
                              try {
                                  await user.delete();
                              } catch (deleteError) {
                                  // Cleanup failed silently
                              }
                          }
                          return;
                      } else {
                          // Backend error
                          if (user) {
                              try {
                                  await user.delete();
                              } catch (deleteError) {
                                  // Cleanup failed silently
                              }
                          }
                          toast.error("Failed to create admin2");
                          return;
                      }
                  }
              }
  
              dispatch(closeDialog());
          } catch (err: any) {
              toast.error("An unexpected error occurred");
          } finally {
              setIsSubmitting(false);
          }
      };

  useEffect(() => {
    if (!userData?._id) return;
    if (userData?._id === router?.query?.id) {
      dispatch(getUserProfile(userData._id));
    } else {
      dispatch(getUserProfile(id || userData?._id));
    }
  }, [dispatch, userData?._id, id, router?.query?.id]);

  return (
    <div className="dialog">
      <div style={{ width: "1800px" }}>
        <div className="row justify-content-center">
          <div className="col-xl-5 col-md-8 col-11">
            <div
              className="mainDiaogBox"
              style={{ width: "600px" }}
            >
              <div className="row justify-content-between align-items-center formHead">
                <div className="col-8">
                  <h2 className="text-theme fs-26 m0">
                    {dialogueData
                      ? "Edit Admin"
                      : "Create Admin"}
                  </h2>
                </div>
                <div className="col-4">
                  <div
                    className="closeButton"
                    onClick={() => {
                      dispatch(closeDialog());
                    }}
                    style={{ fontSize: "20px" }}
                  >
                    ✖
                  </div>
                </div>
              </div>

              <div className="row formFooter mt-3">
                <div className="col-6">
                  <ExInput
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    label="Name"
                    placeholder="Name"
                    errorMessage={error && error.name}
                    disabled={isEdit}
                    onChange={(e: any) => {
                      setName(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          name: "Name is required",
                        });
                      } else {
                        return setError({
                          ...error,
                          name: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-6">
                  <ExInput
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    label="Email"
                    placeholder="Email"
                    errorMessage={error && error.email}
                    disabled={isEdit}
                    onChange={(e: any) => {
                      const value = e.target.value;
                      setEmail(value);

                      if (!value) {
                        return setError({
                          ...error,
                          email: "Email is required",
                        });
                      } else if (
                        !value.includes("@")
                      ) {
                        return setError({
                          ...error,
                          email: "Email must include '@'",
                        });
                      } else {
                        return setError({
                          ...error,
                          email: "",
                        });
                      }
                    }}
                  />
                </div>

                <div className="col-6">
                  <PasswordInput
                    label="Password"
                    value={password}
                    placeholder="Password"
                    onChange={(e: any) => {
                      setPassword(e.target.value);
                      if (!dialogueData && !e.target.value) {
                        setError({ ...error, password: "Password is required" });
                      } else {
                        setError({ ...error, password: "" });
                      }
                    }}
                    error={error.password}
                  />
                </div>

                <div className="col-12 text-end m0">
                  <Button
                      className={`cancelButton text-white`}
                      text={`Cancel`}
                      type={`button`}
                      onClick={() =>
                          dispatch(closeDialog())
                      }
                      disabled={isSubmitting}
                  />
                  <Button
                      type={`submit`}
                      className={` text-white m10-left submitButton`}
                      text={
                          isSubmitting
                              ? "Processing..."
                              : "Submit"
                      }
                      onClick={(e: any) =>
                          handleSubmit(e)
                      }
                      disabled={isSubmitting}
                  />
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
AdminFormDialog.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default AdminFormDialog;
