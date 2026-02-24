import Navigator from "@/extra/Navigator";
import React, { useEffect, useState } from "react";
import logo from "../../../public/nexachatlogo.jpg";
import sideBarLogo from "../../../public/nexachatlogo.jpg";
import { useRouter } from "next/navigation";
import { useRouter as nextUseRouter } from "next/router";
import { warning } from "@/utils/Alert";
import Image from "next/image";
import $ from "jquery";
import { projectName } from "@/utils/config";
import plan from "@/assets/images/plan1.svg";
import User from "@/assets/images/user";
// import Agency from "@/assets/images/Agency";
import withdrawRequest from "@/assets/images/withdrawRequest.svg";

import logout from "@/assets/images/Log Out.svg";
import CommonDialog from "@/utils/CommonDialog";
import { toast } from "react-toastify";
import AgencyWiseHost from "@/pages/Host/AgencyWiseHost";
import Agency from "@/assets/images/Agency";
import Host from "@/assets/images/host";
import HostRequest from "@/assets/images/hostRequest";
import Impression from "@/assets/images/impression";
import GiftCategory from "@/assets/images/giftCategory";
import Gift from "@/assets/images/gift";
import DailyCheckInReward from "@/assets/images/dailyCheckInReward";
import Plan from "@/assets/images/plan";
import Vipplan_benefits from "@/assets/images/vipplan_benefits";
import WithdrawRequest from "@/assets/images/withdrawRequest";
import LogOut from "@/assets/images/LogOut";
import { useSelector } from "react-redux";
import { RootStore } from "@/store/store";

const Sidebar = () => {
  const router = useRouter();
  const nextRouter = nextUseRouter();
  const [showDialog, setShowDialog] = useState(false);
  const { currentRole: roleFromStore } = useSelector((state: RootStore) => state?.admin);

  // Hydrate from sessionStorage on page refresh (manager sessions don't persist in Redux)
  const role =
    roleFromStore ??
    (typeof window !== "undefined" ? sessionStorage.getItem("currentRole") : null);

  const handleLogout = () => {
    setShowDialog(true);
  };

  const handleOnClick = () => {
    window && localStorage.removeItem("dialog");
  };

  const confirmLogout = async () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("admin");
    sessionStorage.removeItem("key");
    sessionStorage.removeItem("isAuth");
    sessionStorage.removeItem("isManager");
    sessionStorage.removeItem("currentRole");
    sessionStorage.removeItem("admin_");
    localStorage.removeItem("persist:admin");
    sessionStorage.setItem("isAgency", "false");
    setTimeout(() => {
      router.push("/");
    }, 1000);
    toast.success("Logout successful");
  };

  const isAdminRoute = (pathname: string) => (
    [
      '/Agency',
      '/Host',
      '/Banner',
      '/HostRequest',
      '/Impression'
    ].includes(pathname)
  )

  useEffect(() => {
    if (role === 'admin' && !isAdminRoute(nextRouter.pathname)) {
      router.push("/Agency");
    }
  }, [nextRouter.pathname, role]);

  const genralMenu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      navSVG: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-border-all"
          viewBox="0 0 16 16"
        >
          <path d="M0 0h16v16H0zm1 1v6.5h6.5V1zm7.5 0v6.5H15V1zM15 8.5H8.5V15H15zM7.5 15V8.5H1V15z" />
        </svg>
      ),
    },
    {
      name: "User",
      path: "/User/User",
      path4: "/User/UserInfoPage",
      path2: "/User/CoinPlanHistoryPage",
      path3: "/PurchaseCoinPlanHistory",
      navSVG: <User />,
      onClick: handleOnClick,
    },
    {
      name: "Manager",
      path: "/User/Manager",
      path4: "/User/UserInfoPage",
      path2: "/User/CoinPlanHistoryPage",
      path3: "/PurchaseCoinPlanHistory",
      navSVG: <User />,
      onClick: handleOnClick,
    },
    {
      name: "Admin",
      path: "/User/Admin",
      path4: "/User/UserInfoPage",
      path2: "/User/CoinPlanHistoryPage",
      path3: "/PurchaseCoinPlanHistory",
      navSVG: <User />,
      onClick: handleOnClick,
    },
    {
      name: "Reseller",
      path: "/User/Reseller",
      path4: "/User/UserInfoPage",
      path2: "/User/CoinPlanHistoryPage",
      path3: "/PurchaseCoinPlanHistory",
      navSVG: <User />,
      onClick: handleOnClick,
    },
  ];

  const managerMenu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      navSVG: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-border-all"
          viewBox="0 0 16 16"
        >
          <path d="M0 0h16v16H0zm1 1v6.5h6.5V1zm7.5 0v6.5H15V1zM15 8.5H8.5V15H15zM7.5 15V8.5H1V15z" />
        </svg>
      ),
    },
    {
      name: "Admin",
      path: "/User/Admin",
      path4: "/User/UserInfoPage",
      path2: "/User/CoinPlanHistoryPage",
      path3: "/PurchaseCoinPlanHistory",
      navSVG: <User />,
      onClick: handleOnClick,
    },
  ];

  const giftAndRewards = [
    {
      name: "Gift Category",
      path: "/GiftCategory",
      navSVG: <GiftCategory />,
      onClick: handleOnClick,
    },

    {
      name: "Gift",
      path: "/GiftPage",
      navSVG: <Gift />,
      onClick: handleOnClick,
    },
    {
      name: "Daily CheckIn",
      path: "/DailyCheckInReward",
      navSVG: <DailyCheckInReward />,
      onClick: handleOnClick,
    },
    {
      name: "Banner",
      path: "/Banner",
      navSVG: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
          <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
        </svg>
      ),
      onClick: handleOnClick,
    },
  ];

  const packages = [
    {
      name: "Plan",
      path: "/Plan",
      navSVG: <Plan />,
      onClick: handleOnClick,
    },

    {
      name: "Vip Plan Benefits",
      path: "/VipPlanPrevilage",
      navSVG: <Vipplan_benefits />,
      onClick: handleOnClick,
    },
  ];

  const finance = [
    {
      name: "Withdrawal",
      path: "/WithdrawRequest",
      navSVG: <WithdrawRequest />,
      onClick: handleOnClick,
    },
  ];

  const setting = [
    {
      name: "Setting",
      path: "/Setting",
      navSVG: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          fill="currentColor"
          className="bi bi-gear"
          viewBox="0 0 16 16"
        >
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
        </svg>
      ),
      onClick: handleOnClick,
    },
    {
      name: "Profile",
      path: "/adminProfile",
      navSVG: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          fill="currentColor"
          className="bi bi-person"
          viewBox="0 0 16 16"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
        </svg>
      ),
      onClick: handleOnClick,
    },
  ];

  const logoutItem = {
    name: "LogOut",
    navSVG: <LogOut />,
    onClick: handleLogout,
  };

  const hostAndAgency = [
    {
      name: "Agency",
      path: "/Agency",
      path2: "/Host/AgencyWiseHost",

      navSVG: <Agency />,
      onClick: handleOnClick,
    },
    {
      name: "Host",
      path: "/Host",
      path2: "/Host/HostInfoPage",
      path3: "/Host/HostHistoryPage",
      navSVG: <Host />,
      onClick: handleOnClick,
    },
    {
      name: "Host Request",
      path: "/HostRequest",
      path2: "/HostProfile",
      navSVG: <HostRequest />,
    },
    {
      name: "Host Tags",
      path: "/Impression",
      navSVG: <Impression />,
      onClick: handleOnClick,
    },
  ];


  return (
    <>
      <CommonDialog
        open={showDialog}
        onCancel={() => setShowDialog(false)}
        onConfirm={confirmLogout}
        text={"LogOut"}
      />
      <div className="mainSidebar">
        <SideMenuJS />
        <div className="sideBar" style={{ marginBottom: "40px", zIndex: 999 }}>
          <div
            style={{
              paddingLeft: "0px",
              backgroundColor: "white",
              position: "sticky",
              top: "0",
              // borderBottom: "1px solid #8F6DFF",
            }}
          >
            <div className="sideBarLogo">
              <div className="logo d-flex " style={{ alignItems: "center" }}>
                {/* <img src={Logo} alt="logo" /> */}
                <div style={{ width: "50px" }}>
                  <img src={sideBarLogo.src} width={40} height={40} alt="logo" style={{ borderRadius: '8px' }} />
                </div>
                <h3
                  className="cursor text-nowrap  "
                  style={{ color: "#535354", fontSize: "1.375rem" }}
                // onClick={() => router("/admin/adminDashboard")}
                >
                  {projectName}
                </h3>
              </div>
              {/* <div className="smallLogo">
            <img src={""} alt="logo" className="smallLogo" />
          </div> */}
              <i className="ri-close-line closeIcon navToggle"></i>
              <div className="blackBox navToggle"></div>
            </div>
          </div>
          {/* ======= Navigation ======= */}
          <div className="navigation side" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 70px)" }}>
            <nav style={{ marginBottom: "30px", flex: 1, overflowY: "auto" }}>
              {/* About */}
              <ul
                className={`mainMenu webMenu`}
                style={{ padding: "10px 0.75rem" }}
              >
                {role !== 'admin' && role !== 'manager' && genralMenu.map((res: any, i: any) => {
                  return (
                    <React.Fragment key={`general-${i}`}>
                      <Navigator
                        name={res?.name}
                        path={res?.path}
                        path2={res?.path2}
                        path3={res?.path3}
                        path4={res?.path4}
                        navIcon={res?.navIcon}
                        navSVG={res?.navSVG}
                        onClick={res?.onClick && res?.onClick}
                      >
                        {res?.subMenu && (
                          <ul className={`subMenu`}>
                            <span className="subhead">{res?.name}</span>
                            {res?.subMenu?.map((subMenu: any) => {
                              return (
                                <Navigator
                                  name={subMenu.subName}
                                  path={subMenu.subPath}
                                  onClick={subMenu.onClick}
                                  key={subMenu.subPath}
                                />
                              );
                            })}
                          </ul>
                        )}
                      </Navigator>
                    </React.Fragment>
                  );
                })}

                {role === 'manager' && managerMenu.map((res: any, i: any) => {
                  return (
                    <React.Fragment key={`general-${i}`}>
                      <Navigator
                        name={res?.name}
                        path={res?.path}
                        path2={res?.path2}
                        path3={res?.path3}
                        path4={res?.path4}
                        navIcon={res?.navIcon}
                        navSVG={res?.navSVG}
                        onClick={res?.onClick && res?.onClick}
                      >
                        {res?.subMenu && (
                          <ul className={`subMenu`}>
                            <span className="subhead">{res?.name}</span>
                            {res?.subMenu?.map((subMenu: any) => {
                              return (
                                <Navigator
                                  name={subMenu.subName}
                                  path={subMenu.subPath}
                                  onClick={subMenu.onClick}
                                  key={subMenu.subPath}
                                />
                              );
                            })}
                          </ul>
                        )}
                      </Navigator>
                    </React.Fragment>
                  );
                })}

                {
                  role === 'admin' || role === 'manager' && (
                    <>
                      <p className="navTitle">Host & Agency</p>

                      {hostAndAgency.map((res: any, i: any) => {
                        return (
                          <React.Fragment key={`host-${i}`}>
                            <Navigator
                              name={res?.name}
                              path={res?.path}
                              path2={res?.path2}
                              path3={res?.path3}
                              path4={res?.path4}
                              navIcon={res?.navIcon}
                              navSVG={res?.navSVG}
                              onClick={res?.onClick && res?.onClick}
                            >
                              {res?.subMenu && (
                                <ul className={`subMenu`}>
                                  <span className="subhead">{res?.name}</span>
                                  {res?.subMenu?.map((subMenu: any) => {
                                    return (
                                      <Navigator
                                        name={subMenu.subName}
                                        path={subMenu.subPath}
                                        onClick={subMenu.onClick}
                                        key={subMenu.subPath}
                                      />
                                    );
                                  })}
                                </ul>
                              )}
                            </Navigator>
                          </React.Fragment>
                        );
                      })}

                    </>
                  )
                }

                {role !== 'admin' && role !== 'manager' && (<>
                  <p className="navTitle">Gift & Rewards</p>

                  {giftAndRewards.map((res: any, i: any) => {
                    return (
                      <React.Fragment key={`gift-${i}`}>
                        <Navigator
                          name={res?.name}
                          path={res?.path}
                          path2={res?.path2}
                          path3={res?.path3}
                          path4={res?.path4}
                          navIcon={res?.navIcon}
                          navSVG={res?.navSVG}
                          onClick={res?.onClick && res?.onClick}
                        >
                          {res?.subMenu && (
                            <ul className={`subMenu`}>
                              <span className="subhead">{res?.name}</span>
                              {res?.subMenu?.map((subMenu: any) => {
                                return (
                                  <Navigator
                                    name={subMenu.subName}
                                    path={subMenu.subPath}
                                    onClick={subMenu.onClick}
                                    key={subMenu.subPath}
                                  />
                                );
                              })}
                            </ul>
                          )}
                        </Navigator>
                      </React.Fragment>
                    );
                  })}

                  <p className="navTitle">Packages</p>

                  {packages.map((res: any, i: any) => {
                    return (
                      <React.Fragment key={`package-${i}`}>
                        <Navigator
                          name={res?.name}
                          path={res?.path}
                          path2={res?.path2}
                          path3={res?.path3}
                          path4={res?.path4}
                          navIcon={res?.navIcon}
                          navSVG={res?.navSVG}
                          onClick={res?.onClick && res?.onClick}
                        >
                          {res?.subMenu && (
                            <ul className={`subMenu`}>
                              <span className="subhead">{res?.name}</span>
                              {res?.subMenu?.map((subMenu: any) => {
                                return (
                                  <Navigator
                                    name={subMenu.subName}
                                    path={subMenu.subPath}
                                    onClick={subMenu.onClick}
                                    key={subMenu.subPath}
                                  />
                                );
                              })}
                            </ul>
                          )}
                        </Navigator>
                      </React.Fragment>
                    );
                  })}

                  <p className="navTitle">Finance</p>

                  {finance.map((res: any, i: any) => {
                    return (
                      <React.Fragment key={`finance-${i}`}>
                        <Navigator
                          name={res?.name}
                          path={res?.path}
                          path2={res?.path2}
                          path3={res?.path3}
                          path4={res?.path4}
                          navIcon={res?.navIcon}
                          navSVG={res?.navSVG}
                          onClick={res?.onClick && res?.onClick}
                        >
                          {res?.subMenu && (
                            <ul className={`subMenu`}>
                              <span className="subhead">{res?.name}</span>
                              {res?.subMenu?.map((subMenu: any) => {
                                return (
                                  <Navigator
                                    name={subMenu.subName}
                                    path={subMenu.subPath}
                                    onClick={subMenu.onClick}
                                    key={subMenu.subPath}
                                  />
                                );
                              })}
                            </ul>
                          )}
                        </Navigator>
                      </React.Fragment>
                    );
                  })}
                  <p className="navTitle">Setting</p>

                  {setting.map((res: any, i: any) => {
                    return (
                      <React.Fragment key={`setting-${i}`}>
                        <Navigator
                          name={res?.name}
                          path={res?.path}
                          navIcon={res?.navIcon}
                          navSVG={res?.navSVG}
                          onClick={res?.onClick && res?.onClick}
                        >
                          {res?.subMenu && (
                            <ul className={`subMenu`}>
                              <span className="subhead">{res?.name}</span>
                              {res?.subMenu?.map((subMenu: any) => {
                                return (
                                  <Navigator
                                    name={subMenu.subName}
                                    path={subMenu.subPath}
                                    onClick={subMenu.onClick}
                                    key={subMenu.subPath}
                                  />
                                );
                              })}
                            </ul>
                          )}
                        </Navigator>
                      </React.Fragment>
                    );
                  })}

                </>)}
              </ul>
            </nav>

            {/* Logout Button - Fixed at Bottom */}
            <div
              style={{
                position: "sticky",
                bottom: 0,
                backgroundColor: "#ffffff",
                padding: "12px 0.75rem",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <ul className="mainMenu webMenu" style={{ padding: 0, margin: 0 }}>
                <li onClick={logoutItem.onClick}>
                  <a
                    className="betBox cursor"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      color: "#dc2626",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {logoutItem.navSVG}
                      <span className="text-capitalize ms-3 my-auto subtext" style={{ color: "#dc2626" }}>
                        {logoutItem.name}
                      </span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

export const SideMenuJS = () => {
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    $(".subMenu").hide();

    // ============== sidemenu toggle ==================
    const handleNav = (event: any) => {
      const target = event.currentTarget;
      $(".subMenu").not($(target).next(".subMenu")).slideUp();
      $(".mainMenu i").not($(target).children("i")).removeClass("rotate90");
      $(target).next(".subMenu").slideToggle();
      $(target).children("i").toggleClass("rotate90");
    };
    $(".mainMenu.webMenu > li > a").on("click", handleNav);

    // ============== sidebar toggle ==================
    const handleSidebar = () => {
      // Sidemenu Off In Mobile Menu
      $(".subMenu").slideUp();
      $(".mainMenu i").removeClass("rotate90");
      // Mobile Menu Class
      $(".mainAdminGrid").toggleClass("webAdminGrid");
      $(".mainMenu").toggleClass("mobMenu webMenu");
      setMenu(menu ? false : true);
    };
    $(".navToggle").on("click", handleSidebar);

    return () => {
      $(".mainMenu > li > a").off("click", handleNav);
      $(".navToggle").off("click", handleSidebar);
    };
  }, [menu]);
  return null;
};
