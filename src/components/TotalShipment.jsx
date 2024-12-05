import React, { useState, useEffect } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import { confirmAlert } from "react-confirm-alert";
import { createClient } from "@supabase/supabase-js";
import supabase from "../supabaseClient";
import { useDispatch, useSelector } from "react-redux";


const ShipmentTable = ({ onRowClick, role, filterValue }) => {
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  const userId = user.id;


  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [editableStatus, setEditableStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(filterValue); // State to track checkbox selection
  


  // Fetch data from Supabase on component mount
  useEffect(() => {
    const fetchShipments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("shipments") // Replace 'shipments' with your table name in Supabase
        .select("*");

      if (error) {
        console.error("Error fetching shipments:", error);
      } else {
        setShipments(data);
      }
      setLoading(false);
    };

    fetchShipments();
  }, []);

  const filteredData = shipments.filter((shipment) => {
    // Filter based on search term
    const matchesSearchTerm =
      String(shipment.shipment_id)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(shipment.created_by)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(shipment.tracking_no)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(shipment.shipper_name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(shipment.receiver_name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(shipment.origin)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(shipment.destination)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(shipment.status)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
  
    // Filter based on "Owned" or "Everyone"
    const matchesFilter =
      filter === "Everyone" || shipment.created_by === user.user_name;
      console.log(matchesFilter);
  
    // Combine all filters
    return (
      matchesSearchTerm &&
      matchesFilter &&
      [
        "order placed",
        "in warehouse",
        "depart at origin",
        "in transit",
        "arrived at destination",
        "custom clearance",
        "delivered",
      ].includes(shipment.status.toLowerCase()) // Ensure "custom clearance" is included
    );
  });

  const openModal = (shipment) => {
    setSelectedShipment(shipment);
    setEditableStatus(shipment.status);
    setRemarks(shipment.status === "In Transit" ? shipment.remarks || "" : "");
  };

  const closeModal = () => {
    setSelectedShipment(null);
    setEditableStatus("");
    setRemarks("");
  };

  const handleStatusChange = () => {
    if (selectedShipment) {
      const updatedShipments = shipments.map((row) =>
        row.shipment_id === selectedShipment.shipment_id
          ? { ...row, status: editableStatus, remarks }
          : row
      );
      setShipments(updatedShipments);
      saveShipmentData(selectedShipment);
      closeModal();
    }
  };

  const saveShipmentData = async (shipment) => {
    const statusToStep = {
      "Order Placed": 1,
      "In Warehouse": 2,
      "Depart at Origin": 3,
      "In Transit": 4,
      "Arrived at Destination": 5,
      "Custom Clearance": 6,
      "Delivered": 7,
    };
  
    const newCurrentStep = statusToStep[editableStatus] || 1; // Default to 1 if status is not found
    const timestamp = new Date().toISOString(); // Timestamp for when the status was updated
    const newRemarkObject = {
      date: timestamp,
      status: editableStatus,
      remark: remarks, // Directly use the input for remarks
    };
  
    // Retrieve existing remarks from the database
    const { data: existingData, error: fetchError } = await supabase
      .from("shipments")
      .select("remarks")
      .eq("shipment_id", shipment.shipment_id);
  
    if (fetchError) {
      console.error("Error fetching existing remarks:", fetchError);
      return;
    }
  
    // Add the new remark to the existing remarks array
    const existingRemarks = existingData[0]?.remarks || [];
    const updatedRemarks = [...existingRemarks, newRemarkObject]; // Append the new remark
  
    // Update the shipment status and remarks in the database
    const { error: updateError } = await supabase
      .from("shipments")
      .update({
        status: editableStatus,
        remarks: updatedRemarks, // Store the updated remarks array
        currentstep: newCurrentStep, // Update the current step
      })
      .eq("shipment_id", shipment.shipment_id);
  
    if (updateError) {
      console.error("Error updating shipment:", updateError);
      return;
    }
  
    // Fetch the updated data to refresh the table
    const { data, error: fetchError2 } = await supabase
      .from("shipments")
      .select("*");
  
    if (fetchError2) {
      console.error("Error fetching shipments:", fetchError2);
    } else {
      const updatedShipments = data.map((shipment) => {
        shipment.latestRemark = shipment.remarks?.length
          ? shipment.remarks[shipment.remarks.length - 1].remark
          : null;
        return shipment;
      });
  
      setShipments(updatedShipments);
    }
  };

  function handleDelete(row) {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="bg-white p-6 rounded-lg shadow-lg relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 text-[30px] hover:text-gray-700"
          >
            &times;
          </button>
          <h2 className="text-lg font-semibold text-blue">Confirm Delete</h2>
          <p className="mt-2">
            Are you sure you want to delete shipment ID: {row.shipment_id}?
          </p>
          <div className="mt-4">
            <div className="flex justify-between mt-6">
              <button
                onClick={onClose}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const { error } = await supabase
                    .from("shipments")
                    .delete()
                    .eq("shipmentId", row.shipment_id);

                  if (!error) {
                    setShipments(
                      shipments.filter(
                        (shipment) => shipment.shipment_id !== row.shipment_id
                      )
                    );
                    console.log(`Deleted shipment with ID: ${row.shipment_id}`);
                  }
                  onClose();
                }}
                style={{ backgroundColor: "#dc3545", color: "white" }}
                className="px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ),
    });
  }

  return (
    <div className="shipment-table-container">
      <div className="flex flex-wrap justify-between items-center p-4">
        <div className="active-shipment-title text-blue text-2xl font-bold">
          Total Shipments
        </div>
         {/* Filters Section */}
      { role === 'employee' && <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Owned"
              checked={filter === "Owned"}
              onChange={() => setFilter("Owned")}
            />
            My Shipments
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Everyone"
              checked={filter === "Everyone"}
              onChange={() => setFilter("Everyone")}
            />
            All Shipments
          </label>
        </div>
        </div> }
        <div className="relative w-72 max-w-sm">
          <input
            type="search"
            id="default-search"
            className="block w-full p-2 ps-10 text-sm text-gray-900 focus:outline-none border border-1 border-gray-500 rounded-lg"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m-1.45 0A7.5 7.5 0 1114 6.5a7.5 7.5 0 011.25 10.15L21 21z"
              />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-auto flex w-full">
          <div className="loader mx-auto bg-blue"></div>
        </div>
      ) : (
        <div className="w-full h-[32rem] overflow-y-auto overflow-x-auto">
          <div className="max-w-[1500px] md:min-w-[1000px]">
            <Table className="min-w-full table-auto border-collapse border border-gray-300 ">
              <Thead>
                <Tr className="bg-gray-200 text-left">
                  <Th className="p-2 border-b border-gray-300">Tracking No</Th>
                  <Th className="p-2 border-b border-gray-300">Created By</Th>
                  <Th className="p-2 border-b border-gray-300">Shipper</Th>
                  <Th className="p-2 border-b border-gray-300">Receiver</Th>
                  <Th className="p-2 border-b border-gray-300">Status</Th>
                  <Th className="p-2 border-b border-gray-300">
                    Expected Delivery
                  </Th>
                  <Th className="p-2 border-b border-gray-300">Remarks</Th>
                  
                </Tr>
              </Thead>
              <Tbody>
                {filteredData.map((shipment, index) => (
                  <Tr
                    key={index}
                    className="hover:bg-gray-100"
                    onClick={() => onRowClick(shipment)}
                  >
                    <Td className="p-2 border-b border-gray-300 bg-[#e5e7eb]">
                      {shipment.tracking_no}
                    </Td>
                    <Td className="p-2 border-b border-gray-300">
                      {shipment.created_by}
                    </Td>
                    <Td className="p-2 border-b border-gray-300">
                      {shipment.shipper_name}
                    </Td>
                    <Td className="p-2 border-b border-gray-300">
                      {shipment.receiver_name}
                    </Td>
                    <Td className="p-2 border-b border-gray-300">
                      {shipment.status}
                    </Td>
                    <Td className="pb-2 sm:px-8 border-b border-gray-300 truncate">
                      {shipment.expected_delivery_date
                        ? new Intl.DateTimeFormat("en-US", {
                          month: 'long',
                          day: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true, // AM/PM format
                          }).format(new Date(shipment.expected_delivery_date))
                        : "N/A"}
                    </Td>

                    <Td className="p-2 border-b border-gray-300">
                    {["Order Placed", "In Warehouse", "Depart at Origin", "In Transit", "Arrived at Destination", "Custom Clearance"].includes(shipment.status) ? (
                        // Get the latest remark from the remarks array and display only the "remark" value
                        <span className="font-bold text-[12px] text-blue">
                          {shipment.remarks?.length > 0 ? shipment.remarks[shipment.remarks.length - 1].remark : "-"}
                        </span>
                      ) : (
                        "-"
                      )}
                    </Td>
                    
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        </div>
      )}

      {/* Modal for editing status */}
      {selectedShipment && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-xl p-6 rounded-lg shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 text-[30px] hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold text-blue">
              Edit Shipment Status
            </h2>
            <div className="mt-4">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Tracking Number</span>
                  <span className="text-blue font-bold">
                    {selectedShipment.tracking_no}
                  </span>
                </div>
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Expected Delivery</span>
                  <span className="text-blue font-bold">
                    {selectedShipment.date}
                  </span>
                </div>
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Client Name</span>
                  <span className="text-blue font-bold">
                    {selectedShipment.shipper_name}
                  </span>
                </div>
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Shipment Type</span>
                  <span className="text-blue font-bold">
                    {selectedShipment.shipment_type}
                  </span>
                </div>
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Origin</span>
                  <span className="text-blue font-bold">
                    {selectedShipment.shipper_city}
                  </span>
                </div>
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Destination</span>
                  <span className="text-blue font-bold text-end">
                    {selectedShipment.receiver_city}
                  </span>
                </div>
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Status</span>
                  <select
                    value={editableStatus}
                    onChange={(e) => setEditableStatus(e.target.value)}
                    className="border border-gray-300 p-1 rounded text-blue w-[50%] font-bold"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="In Warehouse">In Warehouse</option>
                    <option value="Depart at Origin">Depart at Origin</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Arrived at Destination">
                      Arrived at Destination
                    </option>
                    <option value="Custom Clearance">Custom Clearance</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                {["Order Placed", "In Warehouse", "Depart at Origin", "In Transit", "Arrived at Destination", "Custom Clearance"].includes(editableStatus) && (
                  <div className="flex flex-col mb-5">
                    <label className="text-gray-500 mb-1">Remarks</label>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="border border-gray-300 p-1 rounded text-blue"
                      placeholder="Enter remarks here"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Go Back
                </button>
                <button
                  onClick={handleStatusChange}
                  className="bg-blue text-white px-4 py-2 rounded"
                >
                  Save Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentTable;
