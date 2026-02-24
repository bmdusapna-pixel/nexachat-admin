"use client";

import { apiInstance, apiInstanceFetch } from "@/utils/ApiInstance";
import { jwtDecode } from "jwt-decode";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setToast } from "@/utils/toastServices";
import { SetDevKey, setToken } from "@/utils/setAuthAxios";
import { key } from "@/utils/config";
import axios from "axios";
import { DangerRight } from "@/api/toastServices";
import CryptoJS from "crypto-js";


interface UserState {
  isAuth: boolean;
  admin: any;
  countryData: any[];
  isLoading: boolean;
  currentRole?: string | null;
}
const flag: any =
  typeof window !== "undefined" && sessionStorage.getItem("admin_");
const initialState: UserState = {
  isAuth: false,
  admin: {},
  isLoading: false,
  countryData: [],
  currentRole: null
};

interface AllUsersPayload {
  adminId: string;
  start?: number;
  limit?: number;
  startDate?: string;
  data: any;
  endDate?: string;
  payload?: any;
  type?: string;
}

// Helper function to get token dynamically
const getToken = () => typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
const getUid = () => typeof window !== "undefined" ? sessionStorage.getItem("uid") : null;

export const signUpAdmin = createAsyncThunk(
  "admin/admin/registerAdmin",
  async (payload: any) => {
    try {
      return apiInstanceFetch.post("api/admin/admin/registerAdmin", payload);
    } catch (error) {
      throw error
    }
  }
);



export const login = createAsyncThunk(
  "api/admin/admin/validateAdminLogin",
  async (payload: any) => {
    const token = getToken();
    const uid = getUid();

    return apiInstanceFetch.post("api/admin/admin/validateAdminLogin", payload,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "x-admin-uid": uid || "",
        },
      }
    );
  }
);

export const loginManager = createAsyncThunk(
  "api/admin/manager/validateManagerLogin",
  async (payload: any) => {
    return apiInstanceFetch.post("api/admin/manager/validateManagerLogin", payload);
  }
);


export const sendEmailandForgotPassword = createAsyncThunk(
  "api/admin/admin/sendPasswordResetRequest",
  async (email: any) => {

    return axios.post(`api/admin/admin/sendPasswordResetRequest?email=${email}`,
    );
  }
);

export const getAdminById: any = createAsyncThunk(
  "api/admin/sub-admin/getById",
  async ({ id }: { id: string }) => {
    return axios.get(
      `api/admin/sub-admin/getById/${id}`
    )
  }
)

export const adminProfileGet = createAsyncThunk(
  "api/admin/admin/retrieveAdminProfile",
  async (payload: AllUsersPayload | undefined) => {
    const token = getToken();
    const uid = getUid();
    const response = await axios.get(`api/admin/admin/retrieveAdminProfile`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "x-admin-uid": uid || "",
      },
    });
    return response.data;
  }
);

export const adminProfileUpdate: any = createAsyncThunk(
  "api/admin/admin/modifyAdminProfile",
  async (payload: AllUsersPayload | undefined) => {
    const token = getToken();
    const uid = getUid();
    const response = await axios.patch(`api/admin/admin/modifyAdminProfile`, payload, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "x-admin-uid": uid || "",
      },
    });
    return response.data;
  }
);

export const updateAdminPassword: any = createAsyncThunk(
  "api/admin/admin/modifyPassword",
  async (payload: AllUsersPayload | undefined) => {
    const token = getToken();
    const uid = getUid();
    const response = await axios.patch(`api/admin/admin/modifyPassword`, payload, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "x-admin-uid": uid || "",
      },
    });
    return response.data;
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logoutApi(state: any) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("admin");
      sessionStorage.removeItem("key");
      sessionStorage.removeItem("isAuth");
      sessionStorage.removeItem("isManager");
      sessionStorage.removeItem("currentRole");
      sessionStorage.removeItem("admin_");
      // Clear persisted Redux state so next login starts fresh
      if (typeof window !== "undefined") {
        localStorage.removeItem("persist:admin");
      }
      state.admin = {};
      state.isAuth = false;
      state.currentRole = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    }
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      signUpAdmin.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      signUpAdmin.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload.status) {
          setToast("success", "Admin Sign Up Successfully");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
          // window.location.href = "/";
        } else {
          setToast("error", action.payload.message);
        }
      }
    );
    builder.addCase(
      signUpAdmin.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload.message);
      }
    );

    builder.addCase(login.pending, (state: any, action: PayloadAction<any>) => {
      state.isLoading = true;
    });
    builder.addCase(
      login.fulfilled,
      (state: any, action: any) => {

        if (action.payload && action?.payload?.status !== false) {
          const token: any = sessionStorage.getItem("token");
          setToast("success", "Login Successfully");
          // const token = action.payload.data.data;
          const decodedToken: any = jwtDecode(token);


          state.isAuth = true;
          sessionStorage.setItem("isAuth", state.isAuth);
          state.admin = decodedToken;
          setToken(action.payload.data);
          SetDevKey(key);
          sessionStorage.setItem("admin_", JSON.stringify(decodedToken));
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 500)
          state.isLoading = false;
        } else {
          DangerRight(action.payload?.data?.message || action?.payload?.message);
        }
      }
    );

    // ── Manager Login ──────────────────────────────────────────────
    builder.addCase(loginManager.pending, (state: any) => {
      state.isLoading = true;
    });
    builder.addCase(loginManager.fulfilled, (state: any, action: any) => {
      state.isLoading = false;
      if (action.payload?.status === true) {
        const manager = action.payload.manager;
        setToast("success", "Login Successfully");

        state.isAuth = true;
        state.currentRole = "manager";
        state.admin = manager;

        sessionStorage.setItem("isAuth", "true");
        sessionStorage.setItem("isManager", "true");
        sessionStorage.setItem("currentRole", "manager");
        sessionStorage.setItem("admin_", JSON.stringify(manager));
        SetDevKey(key);

        // ── Directly write manager state to localStorage persist key ──
        // This ensures PersistGate rehydrates manager data (not stale admin
        // data) when the page reloads after window.location.href redirect.
        if (typeof window !== "undefined") {
          const persistPayload = {
            isAuth: JSON.stringify(true),
            admin: JSON.stringify(manager),
            currentRole: JSON.stringify("manager"),
            _persist: JSON.stringify({ version: -1, rehydrated: true }),
          };
          localStorage.setItem("persist:admin", JSON.stringify(persistPayload));
        }

        setTimeout(() => { window.location.href = "/dashboard"; }, 500);
      } else {
        DangerRight(action.payload?.message || "Login failed.");
      }
    });
    builder.addCase(loginManager.rejected, (state: any) => {
      state.isLoading = false;
      setToast("error", "Manager login failed.");
    });
    // ──────────────────────────────────────────────────────────────

    builder.addCase(
      login.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      sendEmailandForgotPassword.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      sendEmailandForgotPassword.fulfilled,
      (state: any, action: PayloadAction<any>) => {

        state.isLoading = false;
        if (action.payload?.data?.status === true) {
          setToast("success", action?.payload?.data?.message);
        } else if (action?.payload?.data?.status === false) {

          DangerRight(action?.payload?.data?.message || action?.payload?.message)
        }
      }
    );
    builder.addCase(
      sendEmailandForgotPassword.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      adminProfileGet.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isSkeleton = true;
      }
    );
    builder.addCase(
      adminProfileGet.fulfilled,
      (state: any, action: PayloadAction<any>) => {

        state.isSkeleton = false;
        state.admin = {
          ...state.admin,
          _id: action.payload?.data?._id,
          flag: action.payload?.data?.flag,
          name: action.payload?.data?.name,
          email: action.payload?.data?.email,
          image: action.payload?.data?.image,
          password: action.payload?.data?.password,
        };
      }
    );
    builder.addCase(
      adminProfileGet.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isSkeleton = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(getAdminById.pending, (state: any, action: PayloadAction<any>) => {
      state.isSkeleton = true;
    });
    builder.addCase(
      getAdminById.fulfilled,
      (state: any, action: PayloadAction<any>) => {

        state.isSkeleton = false;
        state.currentRole = action.payload?.data?.admin?.role;
      }
    );
    builder.addCase(getAdminById.rejected, (state: any) => {
      state.isSkeleton = false;
    });

    builder.addCase(
      adminProfileUpdate.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      adminProfileUpdate.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload?.status === true) {
          const prevEmail = state.admin?.email;
          const updatedEmail = action.payload.data.email;

          state.admin = action.payload.data;
          setToast("success", "Admin Profile Update Successful");
          if (prevEmail && updatedEmail && prevEmail !== updatedEmail) {
            setTimeout(() => {
              window.location.href = "/";
            }, 1000); // Add delay for user to see toast message
          }
        } else {
          setToast("error", action.payload?.message);
        }
      }
    );


    builder.addCase(
      adminProfileUpdate.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      updateAdminPassword.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      updateAdminPassword.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload?.status === true) {
          state.admin = action.payload?.data;
          setToast("success", "Admin Password Update Successful");

          window.location.href = "/";
        } else {
          setToast("error", action.payload?.message);
        }
      }
    );
    builder.addCase(
      updateAdminPassword.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );
  },
});

export const { logoutApi, setLoading } = adminSlice.actions;
export default adminSlice.reducer;
