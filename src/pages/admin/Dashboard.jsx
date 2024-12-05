import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ShipmentTable from "../../components/ShipmentTable";
import UpcomingShipment from "../../components/UpcomingShipment";
import TotalShipment from "../../components/TotalShipment";
import CompletedShipment from "../../components/CompletedShipment";


import ProcessStepper from "../../components/ProcessStepper";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import InactiveShipment from "../../components/InactiveShipment";
dayjs.extend(isoWeek);

const Dashboard = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  console.log(user);
  const userId = user.id;
  // const [userId, setUserId] = useState(null);
  const [shipmentCount, setShipmentCount] = useState(0);
  const [upcomingShipmentsCount, setUpcomingShipmentsCount] = useState(0); // New state for upcoming shipments count
  const [activeShipments, setActiveShipmentsCount] = useState(0); // New state for upcoming shipments count
  const [completedShipments, setCompletedShipmentsCount] = useState(0); // New state for completed shipments count

  const [selectedCard, setSelectedCard] = useState("active");

  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState([]);
  


  // Fetch user ID from session storage
  // useEffect(() => {
  //   const storedUserId = sessionStorage.getItem("user_id");
  //   if (storedUserId) {
  //     setUserId(storedUserId);
  //   } else {
  //     console.error('User ID not found in sessionStorage');
  //   }
  // }, []);

  // Fetch shipment count and upcoming shipments count
  
  useEffect(() => {
    if (userId) {
      const fetchDashboardData = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:5000/api/dashboard/dashboard/${userId}`
          );
          const data = await response.json();
  
          if (data.error) {
            console.error(data.error);
            return;
          }
  
          setShipmentCount(data.shipmentCount);
          setUpcomingShipmentsCount(data.upcomingShipmentsCount);
          setActiveShipmentsCount(data.activeShipmentsCount);
          setCompletedShipmentsCount(data.completedShipmentsCount);

          setGraphData(data.graphData);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchDashboardData();
    }
  }, [userId]);
  
  const [searchTerm] = useState("");
  const [selectedShipment, setSelectedShipment] = useState(null);

  const CustomLegend = (value) => (
    <span style={{ marginRight: "25px", fontSize: "14px" }}>{value}</span>
  );

  return (
    <section
      id="dashboard"
      className="flex flex-col justify-center font-poppins"
    >
      <div className="flex flex-col bg-[#ECECEC] justify-center p-[5px] md:p-[30px] gap-[30px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[40px] md:gap-[20px] w-full">
          {/* Shipment Cards */}

          <div
            className="flex flex-col w-full bg-[#ffffff] px-[14px] py-[15px] shadow-xl rounded-lg cursor-pointer hover:bg-[#f5f5f5]"
            onClick={() => setSelectedCard("active")}
          >
            <div className="flex flex-col items-start mb-2">
              <i className="fas fa-shipping-fast text-blue text-[40px] pb-4"></i>
            </div>
            <div className="flex flex-row justify-between items-center w-full">
              <h1 className="font-semibold text-blue text-[24px]">
                {loading ? 
                <div className="loader bg-blue"></div> : activeShipments}{" "}
                {/* Display the count */}
              </h1>
              <h1 className="font-semibold text-yellow text-[18px]">0.0001%</h1>
            </div>
            <h1 className="font-regular text-blue text-[18px]">
              Active Shipments
            </h1>
          </div>

          {/* Upcoming Shipments */}
          <div
            className="flex flex-col w-full bg-[#ffffff] px-[14px] py-[15px] shadow-xl rounded-lg cursor-pointer hover:bg-[#f5f5f5]"
            onClick={() => setSelectedCard("upcoming")}
          >
            <div className="flex flex-col items-start mb-2">
              <i className="fa-solid fa-hourglass-half text-blue text-[40px] pb-4"></i>
            </div>
            <div className="flex flex-row justify-between items-center w-full">
              <h1 className="font-semibold text-blue text-[24px]">
                {loading ? <div className="loader bg-blue"></div> : upcomingShipmentsCount}{" "}
                {/* Display the count */}
              </h1>
              <h1 className="font-semibold text-yellow text-[18px]">0.0001%</h1>
            </div>
            <h1 className="font-regular text-blue text-[18px]">
              Upcoming Shipments
            </h1>
          </div>

          <div
            className="flex flex-col w-full bg-[#ffffff] px-[14px] py-[15px] shadow-xl rounded-lg cursor-pointer hover:bg-[#f5f5f5]"
            onClick={() => setSelectedCard("total")}
          >
            <div className="flex flex-col items-start mb-2">
              <i className="fa-solid fa-chart-simple text-blue text-[40px] pb-4"></i>
            </div>
            <div className="flex flex-row justify-between items-center w-full">
              <h1 className="font-semibold text-blue text-[24px]">
                {loading ? <div className="loader bg-blue"></div> : shipmentCount}
              </h1>
              <h1 className="font-semibold text-yellow text-[18px]">0.0001%</h1>
            </div>
            <h1 className="font-regular text-blue text-[18px]">
              Total Shipments
            </h1>
          </div>

          <div className="flex flex-col w-full bg-[#ffffff] px-[14px] py-[15px] shadow-xl rounded-lg cursor-pointer hover:bg-[#f5f5f5]"
            onClick={() => setSelectedCard("completed")}
>
            <div className="flex flex-col items-start mb-2">
              <i className="fas fa-circle-check text-blue text-[40px] pb-4"></i>
            </div>
            <div className="flex flex-row justify-between items-center w-full">
              <h1 className="font-semibold text-blue text-[24px]">
                {loading ? <div className="loader bg-blue"></div> : completedShipments}
              </h1>
            <h1 className="font-semibold text-yellow text-[18px]">0.0001%</h1>
            </div>
            <h1 className="font-regular text-blue text-[18px]">
              Completed Shipments
            </h1>
          </div>
        </div>

        {/* Active Shipments */}
        <div className="active-shipment-container grid grid-cols-1 lg:grid-cols-5 grid-rows-1 gap-4">
          <div className="active-table col-span-1 lg:col-span-3 row-span-1 p-3 bg-white shadow-md rounded-lg">
            <div className="active-table-container">
              {selectedCard === "active" && (
                <ShipmentTable
                  searchTerm={searchTerm}
                  onRowClick={(shipment) => setSelectedShipment(shipment)}
                  role={"employee"}
                  filterValue={"Owned"}
                />
              )}
              {selectedCard === "upcoming" && (
                <UpcomingShipment
                  searchTerm={searchTerm}
                  onRowClick={(shipment) => setSelectedShipment(shipment)}
                  role={"employee"}
                  filterValue={"Owned"}
                />
              )}
              {selectedCard === "total" && (
                <TotalShipment
                  searchTerm={searchTerm}
                  onRowClick={(shipment) => setSelectedShipment(shipment)}
                  role={"employee"}
                  filterValue={"Owned"}
                />
              )}
              {selectedCard === "completed" && (
                <CompletedShipment
                  searchTerm={searchTerm}
                  onRowClick={(shipment) => setSelectedShipment(shipment)}
                  role={"employee"}
                  filterValue={"Owned"}
                />
              )}
            </div>
          </div>

          {/* Process Stepper */}
          <div className="stepper-container col-span-1 lg:col-start-4 lg:col-end-6 row-span-1">
            <div className="bg-white w-full h-full shadow-md p-4 rounded-lg">
              {selectedShipment ? (
                <ProcessStepper shipment={selectedShipment} />
              ) : (
                <span className="text-gray-400">
                  Select a shipment to view the process.
                </span>
              )}
            </div>
          </div>
        </div>
        

        

        {/* Responsive Bar Chart */}
        <div className="flex flex-col w-full">
          <div className="bg-white p-[30px] shadow-md w-full rounded-lg">
            <h2 className="font-semibold text-blue text-lg mb-4">
              Shipment Summary
            </h2>
            <ResponsiveContainer width="100%" height={200}>
            <BarChart
                data={graphData}
                margin={{ right: 30 }}
                barCategoryGap={20}
                barGap={10}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeframe" />
                <YAxis type="number" />
                <Tooltip />
                <Legend formatter={CustomLegend} />
                <Bar dataKey="total" fill="#0070C0" name="Total Shipments" barSize={20} />
                <Bar
                  dataKey="upcoming"
                  fill="#D6D33C"
                  name="Upcoming Shipments"
                  barSize={20}
                />
                <Bar dataKey="active" fill="#606060" name="Active Shipments" barSize={20} />
              </BarChart>

            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
