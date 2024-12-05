import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import salesData from "../../data/salesData.json";
import supabase from '../../../src/supabaseClient';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import InactiveShipment from '../../components/InactiveShipment';
import SelectedCard from '../../components/SelectedCard';
const SuperDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [totalShipment, setTotalShipment] = useState('');
  const [upcomingShipments, setUpcomingShipments] = useState(null);
  const [activeShipments, setActiveShipments] = useState(null);
  const [activeEmployees, setActiveEmployees] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [shipmentStatuses, setShipmentStatuses] = useState({});
  const [completedShipments, setCompletedShipments] = useState(null);
  const [selectedCard, setSelectedCard] = useState('active')



  useEffect(() => {
    fetchOverallTotalShipment();
    fetchActiveShipments();
    fetchActiveEmployees();
    fetchUpcomingShipments();
    fetchNotifications();
    fetchShipmentStatus();
    fetchCompletedShipments();
  }, []);

  useEffect(() => {
    console.log("Updated shipment statuses:", shipmentStatuses);
  }, [shipmentStatuses]);

  const fetchOverallTotalShipment = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/superadmin/overall-shipments');
      setTotalShipment(data.overallTotalShipments)
    } catch (error) {
      console.error('Error fetching total shipments:', error);

    }
  }
  const fetchActiveShipments = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/superadmin/active-shipments');
      setActiveShipments(data.activeShipments)
      console.log("Fetch active shipments: ", data);
      
    } catch (error) {
      console.log('Error fetching active shipments:', error);
    }
  }


  const fetchUpcomingShipments = async () => {
    try{
      const {data} = await axios.get('http://localhost:5000/api/superadmin/upcoming-shipments');
      setUpcomingShipments(data.upcomingShipments)
    }catch (error) {
      console.log('Error fetching upcoming shipments:', error);
    }
    
  }
  const fetchActiveEmployees = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/superadmin/active-employees');
      setActiveEmployees(data.activeEmployees)
    } catch (error) {
      console.log('Error fetching active employees:', error);
    }
  };

  const fetchCompletedShipments = async () => {
    try {
      const { data } = await axios('http://localhost:5000/api/superadmin/completed-shipments');
      setCompletedShipments(data.completedShipments);
    } catch (error) {
      console.log('Error fetching completed shipments:', error);
    }
  }



  const fetchShipmentStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("shipments")
        .select(`
          status,
          expected_delivery_date
        `);

      if (error) {
        console.error("Error fetching shipment status:", error);
        return;
      }

      console.log("Fetched shipment data:", data);

      // Transform the data to calculate shipment trends
      const shipmentTrendData = data.reduce((acc, item) => {
        const status = item.status;
        const deliveryDate = item.expected_delivery_date;
        const year = new Date(deliveryDate).getFullYear();

        // Ensure valid year
        if (isNaN(year)) return acc;

        // Find or initialize the entry for this status
        let statusEntry = acc.find((entry) => entry.category === status);
        if (!statusEntry) {
          statusEntry = { category: status, 2022: 0, 2023: 0, 2024: 0 };
          acc.push(statusEntry);
        }

        // Increment the count for the relevant year
        if (statusEntry[year] !== undefined) {
          statusEntry[year] += 1;
        } else {
          statusEntry[year] = 1; // In case of a new year not in the initial keys
        }

        return acc;
      }, []);

      // Calculate total shipments per year
      const totalShipments = { category: "Total Shipments", 2022: 0, 2023: 0, 2024: 0 };
      shipmentTrendData.forEach((entry) => {
        totalShipments[2022] += entry[2022] || 0;
        totalShipments[2023] += entry[2023] || 0;
        totalShipments[2024] += entry[2024] || 0;
      });

      // Add total shipments to the trend data
      shipmentTrendData.unshift(totalShipments);

      // Update state with the transformed data
      setShipmentStatuses(shipmentTrendData);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };








  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notification')
      .select('*')
      // .eq('user_id', userID) // palitan base sa user_id ng nakalogin
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notification:', error);
    } else {
      console.log('Fetched notification:', data);
      setNotifications(data);
    }
  } 

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const timeDifference = Math.abs(now - notificationDate);

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    if (days >= 1) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    }

    if (hours >= 1) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }

    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  };



  const CustomLegend = (value) => <span style={{ marginRight: '25px', fontSize: '14px' }}>{value}</span>;

  return (
    <>
      <section id="dashboard" className="flex flex-col justify-center font-poppins">
        <div className="flex flex-col bg-[#ECECEC] justify-center p-[5px] md:p-[30px] gap-[30px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[40px] md:gap-[20px] w-full">
            {/* Shipment Cards */}

            {/* Active Shipments */}

            <div 
              className='flex flex-col w-full bg-[#ffffff] px-[14px] py-[15px] shadow-xl rounded-lg hover:bg-[#f5f5f5] cursor-pointer'
              onClick={() => setSelectedCard("active")}
              
            >
              <div className="flex flex-col items-start mb-2">
                <i className="fas fa-shipping-fast text-blue text-[40px] pb-4"></i>
              </div>
              <div className="flex flex-row justify-between w-full mb-2">
                <h1 className="font-semibold text-blue text-[24px]">{activeShipments}</h1>
                <h1 className="font-semibold text-yellow text-[18px]">0.0001%</h1>
              </div>
              <h1 className="font-regular text-blue text-[18px]">Active Shipments</h1>

            </div>

            {/* Upcoming Shipments */}

            <div 
              className='flex flex-col w-full bg-[#ffffff] px-[14px] py-[15px] shadow-xl rounded-lg hover:bg-[#f5f5f5] cursor-pointer'
              onClick={() => setSelectedCard("upcoming")} 
            >
              <div className="flex flex-col items-start mb-2">
                <i className="fa-solid fa-hourglass-half text-blue text-[40px] pb-4"></i>
              </div>
              <div className="flex flex-row justify-between w-full mb-2">
                <h1 className="font-semibold text-blue text-[24px]">{upcomingShipments}</h1>
                <h1 className="font-semibold text-yellow text-[18px]">0.0001%</h1>
              </div>
              <h1 className="font-regular text-blue text-[18px]">Upcoming Shipments</h1>
            </div>

            {/* Total Shipments */}

            <div 
              className="flex flex-col w-full bg-[#ffffff] px-[14px] py-[15px] shadow-xl rounded-lg hover:bg-[#f5f5f5] cursor-pointer"
              onClick={() => setSelectedCard("total")}
            >
              <div className="flex flex-col items-start mb-2">
                <i className="fa-solid fa-chart-simple text-blue text-[40px] pb-4"></i>
              </div>
              <div className="flex flex-row justify-between w-full mb-2">
                <h1 className="font-semibold text-blue text-[24px]">{totalShipment}</h1>
                <h1 className="font-semibold text-yellow text-[18px]">0.0001%</h1>
              </div>
              <h1 className="font-regular text-blue text-[18px]">Total Shipments</h1>

            </div>

            {/* Completed Shipments */}

            <div 
              className='flex flex-col w-full bg-[#ffffff] px-[14px] py-[15px] shadow-xl rounded-lg hover:bg-[#f5f5f5] cursor-pointer'
              onClick={() => setSelectedCard("completed")}
            >
              <div className="flex flex-col items-start mb-2">
                <i className="fas fa-circle-check text-blue text-[40px] pb-4"></i>
              </div>
              <div className="flex flex-row justify-between w-full mb-2">
                <h1 className="font-semibold text-blue text-[24px]">{completedShipments}</h1>
                <h1 className="font-semibold text-yellow text-[18px]">0.0001%</h1>
              </div>
              <h1 className="font-regular text-blue text-[18px]">Completed Shipments</h1>
            </div>

            

            
          </div>

          <SelectedCard selectedCard={selectedCard}/>

          {/* Active Shipments */}
          <div className="flex flex-wrap md:flex-nowrap w-full gap-4 font-poppins text-blue">
            <div className="flex flex-col w-full md:w-[100%] h-auto shadow-xl p-6 rounded-lg bg-white items-center">
              <h2 className="text-center text-2xl font-semibold text-blue-600 mb-4">Shipment Trend Data</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={shipmentStatuses}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} /> {/* Adjust font size for X Axis */}
                  <YAxis tick={{ fontSize: 12 }} /> {/* Adjust font size for Y Axis */}
                  <Tooltip contentStyle={{ fontSize: "12px" }} /> {/* Adjust font size for Tooltip */}
                  <Legend wrapperStyle={{ fontSize: "16px" }} /> {/* Adjust font size for Legend */}
                  <Line
                    type="monotone"
                    dataKey="2022"
                    stroke="#8884d8"
                    fillOpacity={0.3}
                    fill="#8884d8"
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="2023"
                    stroke="#82ca9d"
                    fillOpacity={0.3}
                    fill="#82ca9d"
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="2024"
                    stroke="#ffc658"
                    fillOpacity={0.3}
                    fill="#ffc658"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>


          <div className="flex flex-wrap md:flex-nowrap w-full gap-4 font-poppins text-blue md:max-h-[50%]">
            {/* Employee */}
            <div className="bg-white w-full md:w-[50%] max-h-[400px] overflow-y-auto shadow-xl p-6 rounded-lg"> {/* Adjust max height here */}
              <h2 className="text-center text-2xl font-semibold text-blue-600 mb-4">Active Employees</h2>
              <div className="space-y-4">
                {activeEmployees && activeEmployees.map((employee, index) => {

                  return (
                    <div key={index} className="flex items-center">
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-blue-600 text-xl"></i>
                      </div>
                      {/* Employee Info */}
                      <div className="ml-4 flex-1">
                        <h3 className="text-blue-600 font-semibold">{employee.user_name}</h3>
                        <p className="text-gray-500 text-sm">{employee.department}</p>
                      </div>
                      {/* Shipment Count */}
                      <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {employee.shipments?.length} Shipments
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Notifications */}
            <div className="bg-white p-6 shadow-xl rounded-lg w-full md:w-[50%] max-h-[400px] overflow-y-auto">
              <h2 className="text-center text-2xl font-semibold text-blue-600 mb-4">Notifications</h2>
              <div className="space-y-4">
                {notifications && notifications.map((notification, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-lg shadow-sm">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 text-xl">
                    <i
                        className={`fas ${
                          notification.type === "shipment"
                            ? "fa-shipping-fast"
                            : notification.type === "user add"
                            ? "fa-user-plus"
                            : notification.type === "user minus"
                            ? "fa-user-minus"
                            : notification.type === "edit password"
                            ? "fa-user-pen"
                            : ""
                        }`}
                    ></i>
                    </div>
                    {/* Notification Text */}
                    <div className="ml-4 flex-1">
                      <h3 className="text-blue-600 font-semibold">{notification.message}</h3>
                    </div>
                    {/* Timestamp */}
                    <div className='flex flex-col items-end'>    
                      <div className="text-gray-400 text-md">
                        {formatTimeAgo(notification.created_at)}
                      </div>
                      <div className='text-gray-400 text-sm'>
                        {notification.user_name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inactive Status Alert */}
        <div className="flex flex-col ">
          <div className="bg-white p-[30px] shadow-md w-full rounded-lg">
          <h2 className="text-center text-2xl font-semibold text-blue mb-4">
              Inactive Shipment Tracker
            </h2>
            <div>
              <InactiveShipment/>
            </div>
          </div>
        </div>
        
          {/* Responsive Bar Chart */}
          <div className="flex flex-col w-full">
            {/* First Chart */}
            <div className="bg-white p-[30px] shadow-xl w-full rounded-lg">
              <h2 className="font-semibold text-blue text-2xl mb-4">Revenue Overview</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={salesData}
                  margin={{ right: 30 }}
                  barCategoryGap={20}  // Gap between categories
                  barGap={10}          // Gap between bars within a category
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis type="number" />
                  <Tooltip />
                  <Legend formatter={CustomLegend} wrapperStyle={{ fontSize: '20px' }} />

                  <Bar dataKey="totalSales" fill="#0070C0" name="Total Sales" barSize={20} />
                  <Bar dataKey="profit" fill="#D6D33C" name="Profit" barSize={20} />
                  <Bar dataKey="expenses" fill="#606060" name="Expenses" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SuperDashboard;
