import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { openDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import NotificationDialog from "../user/NotificationDialogue";
import { adminProfileGet, getAdminById, logoutApi } from "@/store/adminSlice";
import { getDefaultCurrency, getSetting } from "@/store/settingSlice";
import { baseURL } from "@/utils/config";
import notification from "@/assets/images/notification.svg";
import Image from "next/image";
import male from "@/assets/images/user.png";
import { toast } from "react-toastify";

const Navbar = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { admin } = useSelector((state: RootStore) => state?.admin);

  const dispatch = useAppDispatch();

  const { dialogue, dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );

  useEffect(() => {
    dispatch(adminProfileGet());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAdminById({ id: admin._id }))
  }, [admin])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotify = (id: any) => {
    dispatch(
      openDialog({ type: "notification", data: { id, type: "Alluser" } })
    );
  };

  const enterFullscreen = () => {
    document.body.requestFullscreen();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("admin");
    sessionStorage.removeItem("key");
    sessionStorage.removeItem("isAuth");
    dispatch(logoutApi());
    toast.success("Logout successful");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="mainNavbar">
      <div className="navBar">
        <div className="innerNavbar betBox" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          {dialogueType == "notification" && <NotificationDialog />}
          <div className="leftNav d-flex">
            <i
              className={`${`ri-bar-chart-horizontal-line display`} cursor-pointer fs-20 navToggle`}
            ></i>
            <a onClick={enterFullscreen} className="ms-4 text-white cursor">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9F5AFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-maximize"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            </a>
          </div>

          <div className="rightNav">
            <div className="adminProfile betBox cursor-pointer" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                className="text-white fs-25"
                onClick={() => handleNotify(admin?._id)}
                style={{ background: "transparent", padding: "8px" }}
              >
                <img
                  src={notification.src}
                  width={20}
                  height={25}
                  alt="Notifications"
                />
              </button>

              {/* Avatar Dropdown */}
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    backgroundColor: showDropdown ? "#f3f4f6" : "transparent",
                    transition: "background-color 0.2s",
                  }}
                >
                  <img
                    src={admin?.image ? baseURL + admin?.image : male.src}
                    alt="Admin"
                    width={36}
                    height={36}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937" }}>
                      {admin?.name || "Admin"}
                    </span>
                    <span style={{ fontSize: "11px", color: "#6b7280" }}>
                      {admin?.email || "admin@nexachat.com"}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                      minWidth: "200px",
                      zIndex: 1000,
                      overflow: "hidden",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937", margin: 0 }}>
                        {admin?.name || "Admin"}
                      </p>
                      <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>
                        {admin?.email || "admin@nexachat.com"}
                      </p>
                    </div>

                    <div style={{ padding: "8px 0" }}>
                      <Link
                        href="/adminProfile"
                        onClick={() => setShowDropdown(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 16px",
                          color: "#374151",
                          textDecoration: "none",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span style={{ fontSize: "14px" }}>My Profile</span>
                      </Link>

                      <Link
                        href="/Setting"
                        onClick={() => setShowDropdown(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 16px",
                          color: "#374151",
                          textDecoration: "none",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="3"></circle>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        <span style={{ fontSize: "14px" }}>Settings</span>
                      </Link>
                    </div>

                    <div style={{ borderTop: "1px solid #e5e7eb", padding: "8px 0" }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 16px",
                          color: "#dc2626",
                          background: "transparent",
                          border: "none",
                          width: "100%",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span style={{ fontSize: "14px" }}>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
