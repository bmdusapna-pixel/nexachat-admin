import RootLayout from "@/component/layout/Layout";
import Analytics from "@/extra/Analytic";
import Table from "@/extra/Table";
import Title from "@/extra/Title";
import {
  getChartData,
  getChartDataOfHost,
  getDashboardData,
} from "@/store/dashboardSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Male from "../assets/images/male.png";
import { isLoading } from "@/utils/allSelector";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import GetNewUser from "./GetNewUser";
import TopPerformingHost from "./TopPerformingHost";
import { userTypes } from "@/utils/extra";
import TopPerformingAgency from "./TopPerformingAgency";
import TopSpenders from "./TopSpenders";
import total_user from "@/assets/images/total_user.svg";
import total_block_user from "@/assets/images/total_block_user.svg";
import total_vip_user from "@/assets/images/total_vip_user.svg";
import total_agency from "@/assets/images/total_agency.png";
import total_pending_host from "@/assets/images/total_pending_host.png";
import total_host from "@/assets/images/total_host.svg";
import total_impression from "@/assets/images/total_impression.svg";
import total_current_live_host from "@/assets/images/total_live_host.svg";
import { routerChange } from "@/utils/Common";


const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState([]);
  const { dialogueType } = useSelector((state: RootStore) => state.dialogue);

  const [startDate, setStartDate] = useState("All");
  const [endDate, setEndDate] = useState("All");
  const loader = useSelector<any>(isLoading);
  const { loading } = useSelector((state: RootStore) => state.dashboard);
  const [type, setType] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedType = localStorage.getItem("dashType") || "Recent Users";
    if (storedType) setType(storedType);
  }, []);

  useEffect(() => {
    if (type) {
      localStorage.setItem("dashType", type);
      routerChange("/dashboard", "dashType", router);
    }
  }, [type, router]);

  useEffect(() => {
    // Only fetch data if user has token (is authenticated)
    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
    if (!token) return;
    
    let payload: any = {
      startDate,
      endDate,
    };
    dispatch(getDashboardData(payload));
    dispatch(getChartData(payload));
    dispatch(getChartDataOfHost(payload));
  }, [dispatch, startDate, endDate]);

  const dashboard: any = useSelector((state: RootStore) => state.dashboard);

  function ListItem({ loading, children }: any) {
    return (
      <div className="list-item">
        {loading ? <Skeleton style={{ height: "45px" }} /> : children}
      </div>
    );
  }

  const dashboardCards = [
    {
      title: "Total Users",
      icon: total_user.src,
      amount: dashboard?.dashboardData?.totalUsers,
      link: "/User/User",
    },
    {
      title: "Total Block User",
      icon: total_block_user.src,
      amount: dashboard?.dashboardData?.totalBlockedUsers,
      link: "/User/User",
    },
    {
      title: "Total Vip User",
      icon: total_vip_user.src,
      amount: dashboard?.dashboardData?.totalVipUsers,
      link: "/User/User",
    },
    {
      title: "Total Agency",
      icon: total_agency.src,
      amount: dashboard?.dashboardData?.totalAgency,
      link: "/Agency",
    },
    {
      title: "Total Pending Host",
      icon: total_pending_host.src,
      amount: dashboard?.dashboardData?.totalPendingHosts,
      link: "/HostRequest",
    },
    {
      title: "Total Host",
      icon: total_host.src,
      amount: dashboard?.dashboardData?.totalHosts,
      link: "/Host",
    },
    {
      title: "Total Current Live Host",
      icon: total_current_live_host.src,
      amount: dashboard?.dashboardData?.totalCurrentLiveHosts,
      link: "/Host",
    },
    {
      title: "Total Impression",
      icon: total_impression.src,
      amount: dashboard?.dashboardData?.totalImpressions,
      link: "/Impression",
    },
  ];

  return (
    <div className="mainDashboard">
      <div className="dashBoardHead">
        <h3
          className="text-start"
          style={{ fontWeight: "500", marginBottom: "0px" }}
        >
          Welcome Admin!
        </h3>
        <div className="row mb-0">
          <div className="col-12 col-md-3 col-sm-3 mb-0 d-flex align-items-center">
            <Title
              name="Dashboard"
              className="textcommonclass"
              display={"none"}
              bottom={"0"}
              style={{ color: "#404040" }}
            />
          </div>

          <div className="col-md-9 col-12 mb-0 d-flex justify-content-end">
            <Analytics
              analyticsStartDate={startDate}
              analyticsStartEnd={endDate}
              analyticsStartDateSet={setStartDate}
              analyticsStartEndSet={setEndDate}
              direction={"end"}
            />
          </div>
        </div>
      </div>
      <div className="mainDashbox">
        <div
          className="row"
          style={{
            rowGap: "25px",
          }}
        >
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="col-lg-6 col-xl-3 col-md-6 col-sm-6 col-12" style={{ padding: "8px" }}
            >
              {loading.dashboardData ? (
                <SkeletonTheme baseColor="#e2e5e7" >
                  <div className="row">
                    <div className="col-5">
                      <Skeleton
                        height={100}
                        width={310}
                        style={{
                          height: "380px",
                          width: "500px",
                          objectFit: "cover",
                          boxSizing: "border-box",
                          borderRadius: "5px",
                          // borderTopLeftRadius: "30px",
                          // borderBottomLeftRadius: "30px",
                          border: "1px solid #e2e5e7",
                        }}
                      />
                    </div>
                    {/* <div className="col-7 mt-2">
                      <Skeleton width={100} height={12} />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center", // 👈 vertical centering
                          // height: "100%", // 👈 make sure parent has height
                          paddingLeft: "10px",
                        }}
                      >
                        <Skeleton width={45} height={45} className="" />
                      </div>
                    </div> */}
                  </div>
                </SkeletonTheme>
              ) : (
                <DashBox
                  title={card.title}
                  dashSVG={<img src={card.icon} width={28} height={28} alt={card.title} style={{ filter: "brightness(0) invert(1)" }} />}
                  amount={card.amount?.toFixed()}
                  onClick={() => router.push({ pathname: card.link })}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <h4
        className="textcommonclass"
        style={{
          marginTop: "14px",
          marginBottom: "15px",
          fontSize: "26px",
          fontWeight: 400,
        }}
      >
        Data Analysis
      </h4>
      <div
        className="m20-top apexChart tsBox"
        style={{ border: `${loader ? "1px solid #e2e5e7" : ""}` }}
      >
        {loading.chartDataHost ? (
          <>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Skeleton height={20} width={350} />
            </div>
            <div style={{ padding: "20px" }}>
              <ListItem loading={loading.chartDataHost}>List Item 1</ListItem>
              <ListItem loading={loading.chartDataHost}>List Item 2</ListItem>
              <ListItem loading={loading.chartDataHost}>List Item 3</ListItem>
              <ListItem loading={loading.chartDataHost}>List Item 3</ListItem>
              <ListItem loading={loading.chartDataHost}>List Item 3</ListItem>
              <ListItem loading={loading.chartDataHost}>List Item 3</ListItem>
            </div>
          </>
        ) : (
          <ApexChart startDate={startDate} endDate={endDate} />
        )}
      </div>

      <h4
        className="textcommonclass"
        style={{
          marginTop: "25px",
          marginBottom: "10px",
          fontSize: "26px",
          fontWeight: 400,
        }}
      >
        All Data Analysis
      </h4>

      <div
        className={`userTable ${
          dialogueType === "doctor" ? "d-none" : "d-block"
        }`}
        style={{ marginTop: "15px" }}
      >
        <div className="my-2 user1_width mt-2">
          {userTypes.map((item, index) => (
            <button
              key={index}
              type="button"
              className={`${
                type === item.value ? "activeBtn" : "disabledBtn"
              } ${index !== 0 ? "ms-1" : ""}`}
              onClick={() => setType(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {type === "Recent Users" && (
          <GetNewUser startDate={startDate} endDate={endDate} type={type} />
        )}
        {type === "top_perfoming_host" && (
          <TopPerformingHost
            startDate={startDate}
            endDate={endDate}
            type={type}
          />
        )}
        {type === "top_perfoming_agency" && (
          <TopPerformingAgency
            startDate={startDate}
            endDate={endDate}
            type={type}
          />
        )}

        {type === "top_spenders" && (
          <TopSpenders startDate={startDate} endDate={endDate} type={type} />
        )}
      </div>
    </div>
  );
};
Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Dashboard;

const DashBox = ({ dashIcon, dashSVG, title, amount, onClick }: any) => {
  return (
    <div
      className="dashBox cursor"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "18px 16px",
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        border: "1px solid #e8e0ff",
        transition: "all 0.2s ease",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(143, 109, 255, 0.2)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "#9F5AFF";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "#e8e0ff";
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "12px",
          background: "#9f5aff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {dashIcon ? <i className={`${dashIcon}`} style={{ color: "#ffffff" }}></i> : dashSVG}
      </div>

      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: "12px",
            color: "#6b7280",
            marginBottom: "2px",
            fontWeight: "400",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#1f2937",
            margin: 0,
          }}
        >
          {amount}
        </p>
      </div>
    </div>
  );
};

const ChartChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const ApexChart = ({ startDate, endDate }: any) => {
  const [chart, setChart] = useState<any>();
  const dispatch = useAppDispatch();
  const { chartData, chartDataHost } = useSelector(
    (state: RootStore) => state.dashboard
  );

  let label: any = [];
  let dataAmount: any = [];
  let dataCount: any = [];

  const allDatesSet = new Set([
    ...chartData.map((item: any) => item._id),
    ...chartDataHost.map((item: any) => item._id),
  ]);

  label = Array.from(allDatesSet).sort(); // your x-axis categories

  // Step 2: Map user and host data to the label list
  dataAmount = label.map((date: any) => {
    const found: any = chartData.find((item: any) => item._id === date);
    return found ? found.count : 0;
  });

  dataCount = label.map((date: any) => {
    const found: any = chartDataHost.find((item: any) => item._id === date);
    return found ? found.count : 0;
  });

  const totalSeries = {
    dataSet: [
      {
        name: "Total User",
        data: dataAmount,
      },
      {
        name: "Total Host",
        data: dataCount,
        markers: {
          size: 5,
          strokeColors: "#092C1C",
        },
      },
    ],
  };
  const optionsTotal: any = {
    chart: {
      type: "area",
      stacked: false,
      height: 500,
      background: "#fff",
      toolbar: {
        show: false,
      },
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
      colors: ["#8544FF", "transparent"], // Set second series fill to transparent
    },
    grid: {
      padding: {
        right: 20,
        left: 20,
      },
    },

    yaxis: {
      show: false,
    },
    xaxis: {
      categories: label,
      labels: {
        offsetX: 5,
        style: {
          fontSize: "12px",
          colors: "#333",
        },
      },
      tickPlacement: "on",
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      forceNiceScale: true,
    },

    tooltip: {
      shared: true,
    },
    title: {
      text: "User and Host Data",
      style: {
        color: "#1C2B20",
        marginTop: "50px",
        fontWeight: "500",
      },
      align: "center",
      offsetX: 20,
      cssClass: "mt-5",
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      offsetY: -10,
      offsetX: -100,
      markers: {
        width: 24,
        height: 24,
        radius: 6, // Rounded square
        fillColors: ["#8A4DFF", "#1C0B2B"], // Custom legend colors
      },
      itemMargin: {
        horizontal: 20,
        vertical: 0,
      },
      labels: {
        colors: "#000000",
        useSeriesColors: false,
      },
    },
    colors: ["#8544FF", "#2A1138"],
  };

  return (
    <div id="chart">
      <ChartChart
        options={optionsTotal}
        series={totalSeries?.dataSet}
        type="area"
        height={400}
      />
    </div>
  );
};
