import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";
import { baseURL, key } from "./config";
import { setToast } from "./toastServices";
import { createSelector } from "reselect";

const selectStates = (state: any) => state;

export const isLoading = createSelector(selectStates, (state) => {
  const slices = Object.values(state);
  const loading = slices.some((slice: any) => {
    if (
      typeof slice === "object" &&
      slice !== null &&
      slice.isLoading === true
    ) {
      return true;
    }
    return false;
  });
  return loading;
});

interface ApiResponseError {
  message: string | string[];
  code?: string;
}

const getTokenData = (): string | null => {
  if (typeof sessionStorage !== "undefined") {
    return sessionStorage.getItem("token");
  }
  return null;
};

export const apiInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    key,
    "Content-Type": "application/json",

  },
});

const cancelTokenSource = axios.CancelToken.source();
const token: string | null = getTokenData();
apiInstance.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
apiInstance.defaults.headers.common["key"] = key;

apiInstance.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    config.cancelToken = cancelTokenSource.token;
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response: AxiosResponse): any => response.data,
  (error: AxiosError): Promise<void> => {
    const errorData = error.response?.data as any;

    if (!errorData) {
      setToast("error", "An unexpected error occurred.");
      return Promise.reject(error);
    }

    if (!errorData.message) {
      setToast("error", "Something went wrong!");
    }

    // if(errorData.error === "jwt expired"){
    //   window.location.href = "/"
    // }

    if (
      errorData.code === "E_USER_NOT_FOUND" ||
      errorData.code === "E_UNAUTHORIZED"
    ) {
      window && localStorage.clear();
      window.location.reload();
    }

    if (typeof errorData.message === "string") {
      setToast("error", errorData.message);
    } else if (Array.isArray(errorData.message)) {
      errorData.message.forEach((msg: string) => setToast("error", msg));
    }
    return Promise.reject(error);
  }
);

const handleErrors = async (response: Response): Promise<any> => {
  if (!response.ok) {
    let data;
    try {
      data = await response.json();
    } catch {
      data = { message: "Request failed", status: response.status };
    }

    // Only redirect on 401 if NOT on login page and NOT during login request
    if (response.status === 401) {
      const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/";
      const isLoginRequest = response.url.includes("validateAdminLogin");
      
      if (!isLoginPage && !isLoginRequest) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("admin");
        sessionStorage.removeItem("key");
        sessionStorage.removeItem("isAuth");
        window.location.href = "/";
      }
    }
    
    return Promise.reject(data);
  }

  return response.json();
};

const getUidData = (): string | null => {
  if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
    return sessionStorage.getItem("uid");
  }
  return null;
};

const getHeaders = (isFormData = false): { [key: string]: string } => {
  const token = getTokenData();
  const uid = getUidData();
  
  let headers: { [key: string]: string } = {
    key,
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  if (uid) {
    headers["x-admin-uid"] = uid;
  }

  // ✅ Only add "Content-Type" if NOT FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

export const apiInstanceFetch: any = {
  get: (url: string, config?: { headers?: Record<string, string> }) =>
    fetch(`${baseURL}${url}`, {
      method: "GET",
      headers: { ...getHeaders(), ...config?.headers },
    }).then(handleErrors),

  post: (url: string, data: object | FormData, config?: { headers?: Record<string, string> }) =>
    fetch(`${baseURL}${url}`, {
      method: "POST",
      headers: { ...(data instanceof FormData ? getHeaders(true) : getHeaders()), ...config?.headers },
      body: data instanceof FormData ? data : JSON.stringify(data),
    }).then(handleErrors),

  patch: (url: string, data: object | FormData, config?: { headers?: Record<string, string> }) =>
    fetch(`${baseURL}${url}`, {
      method: "PATCH",
      headers: { ...(data instanceof FormData ? getHeaders(true) : getHeaders()), ...config?.headers },
      body: data instanceof FormData ? data : JSON.stringify(data),
    }).then(handleErrors),

  put: (url: string, data: object | FormData, config?: { headers?: Record<string, string> }) =>
    fetch(`${baseURL}${url}`, {
      method: "PUT",
      headers: { ...(data instanceof FormData ? getHeaders(true) : getHeaders()), ...config?.headers },
      body: data instanceof FormData ? data : JSON.stringify(data),
    }).then(handleErrors),

  delete: (url: string, config?: { headers?: Record<string, string> }) =>
    fetch(`${baseURL}${url}`, {
      method: "DELETE",
      headers: { ...getHeaders(), ...config?.headers },
    }).then(handleErrors),
};


