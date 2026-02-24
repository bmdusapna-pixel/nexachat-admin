import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RootStore, useAppSelector, useAppDispatch } from "../store/store";
import { logoutApi } from "@/store/adminSlice";

interface AuthCheckProps {
  children: React.ReactNode;
}

// Public routes that don't require authentication
const publicRoutes = ["/", "/Registration", "/ForgotPassword", "/ManagerLogin"];

const AuthCheck: React.FC<AuthCheckProps> = (props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector((state: RootStore) => state.admin.isAuth);
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for redux-persist to rehydrate
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const isPublicRoute = publicRoutes.includes(router.pathname);

    // Valid session = Firebase token (admin) OR isManager flag (manager)
    const hasToken = typeof window !== "undefined" && sessionStorage.getItem("token");
    const isManager = typeof window !== "undefined" && sessionStorage.getItem("isManager") === "true";
    const hasSession = !!(hasToken || isManager);

    // Clear stale redux auth if no session exists
    if (isAuth && !hasSession && !isPublicRoute) {
      dispatch(logoutApi());
      router.push("/");
      return;
    }

    // Guard protected routes
    if (!isAuth && !hasSession && !isPublicRoute) {
      router.push("/");
    }

    // Redirect authenticated users away from public routes to dashboard
    if (hasSession && isPublicRoute) {
      router.push("/dashboard");
    }
  }, [isAuth, router, isHydrated, dispatch]);

  return <>{props.children}</>;
};

export default AuthCheck;