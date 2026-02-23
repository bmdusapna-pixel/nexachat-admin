import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RootStore, useAppSelector, useAppDispatch } from "../store/store";
import { logoutApi } from "@/store/adminSlice";

interface AuthCheckProps {
  children: React.ReactNode;
}

// Public routes that don't require authentication
const publicRoutes = ["/", "/Registration", "/ForgotPassword"];

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
    // Don't redirect until hydration is complete
    if (!isHydrated) return;

    const isPublicRoute = publicRoutes.includes(router.pathname);

    // Check sessionStorage for token
    const hasToken = typeof window !== "undefined" && sessionStorage.getItem("token");
    
    // If redux says authenticated but no token exists, clear the stale auth state
    if (isAuth && !hasToken && !isPublicRoute) {
      dispatch(logoutApi());
      router.push("/");
      return;
    }

    // If not authenticated and not on public route, redirect to login
    if (!isAuth && !hasToken && !isPublicRoute) {
      router.push("/");
    }

    // If authenticated (has token) and on login page, redirect to dashboard
    if (hasToken && router.pathname === "/") {
      router.push("/dashboard");
    }
  }, [isAuth, router, isHydrated, dispatch]);

  return <>{props.children}</>;
};

export default AuthCheck;