"use client";
import { Providers } from "@/Provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/scss/custom/custom.css";
import "../assets/scss/default/default.css";
import "../assets/scss/style/style.css";
import "../assets/scss/dateRange.css";
import axios from "axios";
import { baseURL, key, projectName } from "@/utils/config";
import AuthCheck from "./AuthCheck";
import Head from "next/head";
import { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';





// Set up axios interceptor to dynamically add token on each request
axios.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
    const uid = typeof window !== "undefined" ? sessionStorage.getItem("uid") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (uid) {
      config.headers["x-admin-uid"] = uid;
    }
    config.headers["key"] = key;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/";
      const isLoginRequest = error.config?.url?.includes("validateAdminLogin");
      // Skip session wipe for manager sessions — admin-only endpoints always
      // return 401 for managers, but their session is valid via isManager flag
      const isManagerSession = typeof window !== "undefined" && sessionStorage.getItem("isManager") === "true";

      if (!isLoginPage && !isLoginRequest && !isManagerSession) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("uid");
        sessionStorage.removeItem("admin");
        sessionStorage.removeItem("isAuth");
        sessionStorage.removeItem("admin_");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);


export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  axios.defaults.baseURL = baseURL;

  return getLayout(
    <Providers>
      <Head>
        <title>{projectName}</title>
      </Head>
      <AuthCheck>
        <ToastContainer />
        <SkeletonTheme baseColor="#e2e5e7" highlightColor="#fff">
          <Component {...pageProps} />
        </SkeletonTheme>
        {/* <Loader /> */}
      </AuthCheck>
    </Providers>
  );
}
