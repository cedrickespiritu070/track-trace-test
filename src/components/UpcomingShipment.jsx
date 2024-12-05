import React, { useState, useEffect } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import { confirmAlert } from "react-confirm-alert";
import { createClient } from "@supabase/supabase-js";
import supabase from "../supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";

const ShipmentTable = ({ onRowClick, role, filterValue }) => {
  const [fetchEmployees, setFetchEmployees] = useState(null);
  const [transferNames, setTransferNames] = useState({});
  const [jobOrder, setjobOrder] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [editableStatus, setEditableStatus] = useState("");
  const [editableTranserTo, setEditableTransferTo] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [waybill, setWayBill] = useState("");


  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false); // Loading state to show spinner
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(filterValue); // State to track checkbox selection
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedShipmentForUpload, setSelectedShipmentForUpload] = useState(null);
  const [file, setFile] = useState(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [actualDepartureDate, setActualDepartureDate] = useState("");
  const [actualArrivalDate, setActualArrivalDate] = useState("");
  const [selectedShipmentForView, setSelectedShipmentForView] = useState(null); // For viewing the selected shipment
  const [viewModalOpen, setViewModalOpen] = useState(false); // Rename the modal state to viewModalOpen
  const [documents, setDocuments] = useState([]); // State to hold documents
  const [activeTab, setActiveTab] = useState("shipper");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const documentsPerPage = 5;

  // Calculate the index of the first and last document on the current page
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const [transitType, setTransitType] = useState(""); // "Arrival" or "Departure"
  const [transitDate, setTransitDate] = useState(""); // Selected date

  // Slice the documents array to show only the documents for the current page
  const currentDocuments = documents.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );
  const editableShipperFields = [
    "Name",
    "Country",
    "City",
    "Building",
    "Email",
    "Phone",
    "Street",
    "Landmark",
  ];
  const editableReceiverFields = [
    "Name",
    "Country",
    "City",
    "Building",
    "Email",
    "Phone",
    "Street",
    "Landmark",
  ];
  const editableShipmentFields = [
    "shipment_weight",
    "shipment_type",
    "shipment_value",
    "shipment_mode",
    "shipment_dimensions",
    "shipment_packages",
    "shipment_instructions",
  ];
  const [message, setMessage] = useState("");

  // Function to handle changes in Shipper fields and save to database
  const handleFieldChange = (section, field, value) => {
    const fieldKey = `${section}_${field.toLowerCase()}`;
  
    // Update local state
    setSelectedShipment((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };
  const handleSaveField = async (section, field, value) => {
    const fieldKey = `${section}_${field.toLowerCase()}`;
  
    // Update the database for each field
    const { data, error } = await supabase
      .from('shipments')
      .update({ [fieldKey]: value })
      .match({ shipment_id: selectedShipment.shipment_id });
  
    if (error) {
      console.error(`Error updating ${fieldKey} field:`, error);
      // Optionally handle field-specific error handling if needed
    } else {
      console.log(`${fieldKey} field updated successfully:`, data);
    }
  };
  
  

  const showToast = (type, text) => {
    if (type === "success") {
      toast.success(text);
    } else if (type === "error") {
      toast.error(text);
    }
  };
  // Handle the next page
  const handleNextPage = () => {
    if (currentDocuments.length === documentsPerPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  function formatDate(dateString) {
    if (!dateString) return "N/A";
  
    const date = new Date(dateString);
  
    // Check if the date is valid
    if (isNaN(date)) return "Invalid Date";
  
    return date.toLocaleDateString("en-US", {
      day: "numeric",   // Day as a number (e.g., 2)
      month: "long",    // Full month name (e.g., December)
      year: "numeric",  // Full year (e.g., 2024)
    });
  }
  

  // Handle the previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  console.log(user);
  const userId = user.id;

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
    fetchEmployeesData();
  }, []);
  const handleTransferChange = async () => {
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/admin/update-shipment",
        {
          shipment_id: selectedShipment.shipment_id,
          new_user_id: editableTranserTo,
          job_order_details: jobOrder,
        }
      );
      setEditableTransferTo(null);
      setjobOrder(null);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchEmployeesData = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/admin/employees?currentEmployeeId=${userId}`
      );
      setFetchEmployees(data.employees);
      console.log(data.employees);
    } catch (error) {
      console.log("Error fetching employees", error);
    }
  };
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
      String(shipment.status).toLowerCase().includes(searchTerm.toLowerCase());

    // Filter based on "Owned" or "Everyone"
    const matchesFilter = filter === "Everyone" || shipment.user_id === userId;
    // Combine all filters
    return (
      matchesSearchTerm &&
      matchesFilter &&
      [
        "order placed",
      ].includes(shipment.status.toLowerCase()) // Ensure "custom clearance" is included
    );
  });

  const openViewDocumentsModal = async (shipment) => {
    setSelectedShipmentForView(shipment);
    setViewModalOpen(true);

    // Fetch documents related to the selected shipment
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("shipment_id", shipment.shipment_id); // Filter documents by shipment_id

    if (error) {
      console.error("Error fetching documents:", error.message);
    } else {
      setDocuments(data); // Set the fetched documents
    }
  };

  // Function to close the view modal
  const closeViewModal = () => {
    setViewModalOpen(false);
  };
  const openModal = (shipment) => {
    setSelectedShipment(shipment);
    setEditableStatus(shipment.status);
    setRemarks("");
  };

  const closeModal = () => {
    setSelectedShipment(null); // Reset selected shipment
    setEditableStatus(""); // Reset editable status
    setRemarks(""); // Reset remarks to empty
  };

  const openUploadModal = (shipment) => {
    setSelectedShipmentForUpload(shipment);
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedShipmentForUpload(null);
    setFile(null); // Reset file input
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file!");
    if (!documentTitle) return toast.error("Please enter a document title!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("shipment_id", selectedShipmentForUpload.shipment_id);
    formData.append("uploaded_by", user.user_name); // Assuming `user.user_name` is available and valid
    formData.append("document_title", documentTitle); // Add document title to the form data

    setLoading2(true); // Start the spinner

    try {
      const response = await fetch("http://localhost:5000/api/upload/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      toast.success("File uploaded successfully!");
      closeUploadModal(); // Close the modal after upload
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading2(false); // Stop the spinner after upload completes
      closeUploadModal(); // Close the modal after upload
    }
  };

  const handleStatusChange = () => {
    if (selectedShipment) {
      const departureDate = actualDepartureDate || null;
      const arrivalDate = actualArrivalDate || null;
      const transitTypeValue = transitType || "N/A";
      const transitDateValue = transitDate || null; // Already in ISO format from the input
  
      const updatedShipments = shipments.map((row) =>
        row.shipment_id === selectedShipment.shipment_id
          ? {
              ...row,
              status: editableStatus,
              remarks,
              actual_departure_date: departureDate,
              actual_arrival_date: arrivalDate,
              transit_type: transitTypeValue,
              transit_date: transitDateValue, // Include transitDate
            }
          : row
      );
  
      setShipments(updatedShipments);
  
      saveShipmentData(selectedShipment, departureDate, arrivalDate, transitDateValue, transitTypeValue);
  
      // Reset fields after saving
      setRemarks("");
      setWayBill("");
      setActualDepartureDate("");
      setTransitType("");
      setTransitDate(""); // Reset input for transit date
      setActualArrivalDate("");
  
      closeModal();
    }
  };

  const saveShipmentData = async (
    shipment,
    actualDepartureDate,
    actualArrivalDate,
    transitDate,
    transitType
  ) => {
    const statusToStep = {
      "Order Placed": 1,
      "In Warehouse": 2,
      "Depart at Origin": 3,
      "In Transit": 4,
      "Arrived at Destination": 5,
      "Custom Clearance": 6,
      Delivered: 7,
    };
  
    const newCurrentStep = statusToStep[editableStatus] || 1;
    const timestamp = new Date().toISOString();
  
    // Retrieve existing remarks from the database
    const { data: existingData, error: fetchError } = await supabase
      .from("shipments")
      .select("remarks")
      .eq("shipment_id", shipment.shipment_id);
  
    if (fetchError) {
      console.error("Error fetching existing remarks:", fetchError);
      return;
    }
  
    const existingRemarks = existingData[0]?.remarks || [];
  
    // Validate and convert transitDate
    const isValidDate = (date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    };
  
    const resolvedTransitDate = isValidDate(transitDate)
      ? new Date(transitDate).toISOString()
      : null;
  
    const newRemarkObject = {
      date: timestamp,
      status: editableStatus,
      remark: remarks || `Updated to ${transitType}`,
      transitType: transitType || "N/A",
      transitDate: resolvedTransitDate,
      atd: actualDepartureDate || null,
      aad: actualArrivalDate || null,
    };
  
    const updatedRemarks = [...existingRemarks, newRemarkObject];
  
    // Update database
    const { error: updateError } = await supabase
      .from("shipments")
      .update({
        status: editableStatus,
        remarks: updatedRemarks,
        currentstep: newCurrentStep,
        status_updated_at: timestamp,
      })
      .eq("shipment_id", shipment.shipment_id);
  
    if (updateError) {
      console.error("Error updating shipment:", updateError);
      return;
    }
  
    // Fetch updated data to refresh the table
    const { data, error: fetchError2 } = await supabase.from("shipments").select("*");
  
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
              {/* <button
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
              </button> */}
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
          Upcoming Shipments
        </div>
        {/* Filters Section */}
        { role === "employee" && <div className="flex items-center gap-4">
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
        </div>}

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
            <Table className="min-w-full table-auto border-collapse border border-gray-300">
              <Thead>
                <Tr className="bg-gray-200 text-left">
                  <Th className="px-8 border-b border-gray-300 text-nowrap">
                    Waybill Number
                  </Th>
                  <Th className="px-8 border-b border-gray-300 text-nowrap">
                    Created By
                  </Th>
                  <Th className="px-8 border-b border-gray-300 text-nowrap">
                    Transferred to
                  </Th>
                  <Th className="px-8 border-b border-gray-300 text-nowrap">
                    Job Order
                  </Th>

                  <Th className="px-8 border-b border-gray-300 text-nowrap">
                    Shipper
                  </Th>
                  <Th className="px-8 border-b border-gray-300 text-nowrap">
                    Receiver
                  </Th>
                  <Th className="px-8 border-b border-gray-300 text-nowrap">
                    Status
                  </Th>
                  <Th className="px-8 border-b border-gray-300 text-nowrap">
                    Expected Delivery
                  </Th>
                  <Th className="px-8 border-b border-gray-300 text-nowrap">
                    Remarks
                  </Th>
                  <Th className="px-8 border-b border-gray-300 text-nowrap">
                    Actual Departure Date
                  </Th>
                  <Th className="px-8 border-b border-gray-300 text-nowrap">
                    Actual Arrival Date
                  </Th>
                  <Th className="p-2 border-b border-gray-300 fixed-col">
                    Action
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredData.map((shipment, index) => (
                  <Tr
                    key={index}
                    className="hover:bg-gray-100"
                    onClick={() => onRowClick(shipment)}
                  >
                    <Td className="px-8 border-b border-gray-300 bg-[#e5e7eb] truncate">
                      {shipment.tracking_no}
                    </Td>
                    <Td className="px-8 border-b border-gray-300 truncate">
                      {shipment.created_by}
                    </Td>
                    <Td className="px-8 border-b border-gray-300 truncate">
                      {shipment.current_user_name
                        ? shipment.current_user_name
                        : "-"}
                    </Td>
                    <Td className="px-8 border-b border-gray-300 truncate">
                      {shipment.job_order ? shipment.job_order : "-"}
                    </Td>
                    <Td className="px-8 border-b border-gray-300 truncate">
                      {shipment.shipper_name}
                    </Td>
                    <Td className="px-8 border-b border-gray-300 truncate">
                      {shipment.receiver_name}
                    </Td>
                    <Td className="px-8 border-b border-gray-300 truncate">
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

                    <Td className="px-8 border-b border-gray-300 truncate">
                      {[
                        "Order Placed",
                        "In Warehouse",
                        "Depart at Origin",
                        "In Transit",
                        "Arrived at Destination",
                        "Custom Clearance",
                      ].includes(shipment.status) ? (
                        <span className="font-bold text-[12px] text-blue">
                          {shipment.remarks?.length > 0
                            ? shipment.remarks[shipment.remarks.length - 1]
                                .remark
                            : "-"}
                        </span>
                      ) : (
                        "-"
                      )}
                    </Td>
                    {/* Display Actual Departure Date */}
                      <Td className="px-8 border-b border-gray-300 truncate">
                        {
                          shipment.remarks?.length > 0 &&
                          shipment.remarks[shipment.remarks.length - 1].atd
                            ? new Date(
                                shipment.remarks[shipment.remarks.length - 1].atd
                              ).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "-"
                        }
                      </Td>
                      {/* Display Actual Arrival Date */}
                      <Td className="px-8 border-b border-gray-300 truncate">
                        {
                          shipment.remarks?.length > 0 &&
                          shipment.remarks[shipment.remarks.length - 1].aad
                            ? new Date(
                                shipment.remarks[shipment.remarks.length - 1].aad
                              ).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "-"
                        }
                      </Td>

                    <Td className="p-2 border-b border-gray-300 fixed-col min-w-[12rem] bg-[#e5e7eb]">
                      <div className="flex gap-1 flex-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(shipment);
                          }}
                          className="bg-blue hover:bg-[#07335c] text-white px-[15px] py-[5px] text-[0.75rem] flex rounded-md gap-[5px] items-center"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>Edit
                        </button>
                        {/* <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(shipment);
                          }}
                          className="bg-[#dc3545] hover:bg-[#af202e] text-white px-[15px] py-[5px] text-[0.75rem] flex rounded-md gap-[5px] items-center"
                        >
                          <i className="fa-solid fa-trash"></i>Delete
                        </button> */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openUploadModal(shipment);
                          }}
                          className="bg-green-500 hover:bg-green-700 text-white px-[15px] py-[5px] text-[0.75rem] flex rounded-md gap-[5px] items-center"
                        >
                          <i className="fa-solid fa-upload"></i>Upload
                        </button>
                        <button
                          onClick={(e) => (
                            e.stopPropagation(),
                            openViewDocumentsModal(shipment)
                          )}
                          className="bg-purple-500 hover:bg-purple-700 text-white px-[15px] py-[5px] text-[0.75rem] flex rounded-md gap-[5px] items-center whitespace-nowrap"
                        >
                          <i className="fa-solid fa-file-alt"></i>View Documents
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        </div>
      )}
      {selectedShipment && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-xl max-h-[65rem] h-[80vh] p-6 rounded-lg shadow-lg relative flex flex-col justify-between">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 text-[30px] hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold text-blue mb-4">
              Edit Shipment Status
            </h2>

            {/* Tab Buttons */}
            <div className="flex space-x-4 mb-6">
              {["shipper", "receiver", "shipment"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded ${
                    activeTab === tab
                      ? "bg-blue text-white"
                      : "bg-gray-200 text-blue"
                  }`}
                >
                  {`${tab.charAt(0).toUpperCase() + tab.slice(1)} Details`}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 overflow-y-auto w-full">
            {activeTab === 'shipper' && (
              <div className="flex flex-col">
                {/* Shipper Details */}
                {['Name', 'Country', 'City', 'Building', 'Email', 'Phone', 'Street', 'Landmark'].map((field) => (
                  <div className="flex flex-row justify-between w-full mb-5" key={field}>
                    <span className="text-gray-500">Shipper {field}</span>
                    {editableShipperFields.includes(field) ? (
                      <input
                        type="text"
                        value={selectedShipment[`shipper_${field.toLowerCase()}`]}
                        onChange={(e) => handleFieldChange('shipper', field, e.target.value)}
                        className="border border-gray-300 p-1 rounded text-blue"
                      />
                    ) : (
                      <span className="text-blue font-bold">{selectedShipment[`shipper_${field.toLowerCase()}`]}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
              {activeTab === 'receiver' && (
                <div className="flex flex-col">
                  {/* Receiver Details */}
                  {['Name', 'Country', 'City', 'Building', 'Email', 'Phone', 'Street', 'Landmark'].map((field) => (
                    <div className="flex flex-row justify-between w-full mb-5" key={field}>
                      <span className="text-gray-500">Receiver {field}</span>
                      {editableReceiverFields.includes(field) ? (
                        <input
                          type="text"
                          value={selectedShipment[`receiver_${field.toLowerCase()}`]}
                          onChange={(e) => handleFieldChange('receiver', field, e.target.value)}
                          className="border border-gray-300 p-1 rounded text-blue"
                        />
                      ) : (
                        <span className="text-blue font-bold">{selectedShipment[`receiver_${field.toLowerCase()}`]}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'shipment' && ( 
                <div className="flex flex-col">
                  {/* Shipment Details */}
                  {[
                    { label: 'Weight', key: 'shipment_weight' },
                    { label: 'Type', key: 'shipment_type' },
                    { label: 'Value', key: 'shipment_value' },
                    { label: 'Mode', key: 'shipment_mode' },
                    { label: 'Dimensions', key: 'shipment_dimensions' },
                    { label: 'Packages', key: 'shipment_packages' },
                    { label: 'Instructions', key: 'shipment_instructions' },
                    { label: 'ETD', key: 'etd', isDate: true },
                    { label: 'ETA', key: 'eta', isDate: true }
                  ].map(({ label, key, isDate }) => (
                    <div className="flex flex-row justify-between w-full mb-5" key={key}>
                      <span className="text-gray-500">Shipment {label}</span>
                      {editableShipmentFields.includes(key) ? (
                        <input
                          type={isDate ? 'date' : 'text'}
                          value={
                            isDate
                              ? selectedShipment[key]
                                ? new Date(selectedShipment[key]).toISOString().split('T')[0] // Format date as YYYY-MM-DD for input
                                : ''
                              : selectedShipment[key]
                          }
                          onChange={(e) =>
                            handleFieldChange(
                              'shipment',
                              key,
                              isDate ? new Date(e.target.value).toISOString() : e.target.value
                            )
                          }
                          className="border border-gray-300 p-1 rounded text-blue"
                        />
                      ) : (
                        <span className="text-blue font-bold">
                          {selectedShipment[key]
                            ? isDate
                              ? new Intl.DateTimeFormat('en-US', {
                                  dateStyle: 'medium',
                                }).format(new Date(selectedShipment[key]))
                              : selectedShipment[key]
                            : 'Not available'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}  

              {/* Always Visible Section */}
              <div>
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Status</span>
                  <select
                    value={editableStatus}
                    onChange={(e) => setEditableStatus(e.target.value)}
                    className="border border-gray-300 p-1 rounded text-blue w-[50%] font-bold"
                  >
                    <option className="text-gray-500" value="">
                      Select status
                    </option>
                    {[
                      "Order Placed",
                      "In Warehouse",
                      "Depart at Origin",
                      "In Transit",
                      "Arrived at Destination",
                      "Custom Clearance",
                      "Delivered",
                    ].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                {editableStatus === "In Transit" && (
                  <div className="flex flex-col w-full mb-5">
                    <div className="flex flex-row justify-between mb-3">
                      <span className="text-gray-500">In Transit</span>
                      <select
                        value={transitType} // State for dropdown selection
                        onChange={(e) => setTransitType(e.target.value)}
                        className="border border-gray-300 py-2 px-3 rounded text-blue"
                      >
                        <option value="">Select Type</option>
                        <option value="Arrival">Arrival</option>
                        <option value="Departure">Departure</option>
                      </select>
                    </div>

                    {transitType && (
                      <div className="flex flex-row justify-between mb-3">
                        <span className="text-gray-500">{`Date ${transitType}`}</span>
                        <input
                          type="datetime-local" // Updated to datetime-local for date and time input
                          value={transitDate} // State for the date-time input
                          onChange={(e) => setTransitDate(e.target.value)}
                          className="border border-gray-300 py-2 px-3 rounded text-blue"
                        />
                      </div>
                    )}

                  </div>
                )}

                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Transfer to</span>
                  <select
                    value={editableTranserTo}
                    onChange={(e) => setEditableTransferTo(e.target.value)}
                    className="border border-gray-300 p-1 rounded text-blue w-[50%] font-bold"
                  >
                    <option className="text-gray-500" value="">
                      Choose employee
                    </option>
                    {fetchEmployees.map((employee) => (
                      <option key={employee.user_id} value={employee.user_id}>
                        {employee.user_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Job Order</span>
                  <input
                    type="text"
                    value={jobOrder}
                    onChange={(e) => setjobOrder(e.target.value)}
                    className="border border-gray-300 py-2 px-3 rounded text-blue"
                    placeholder="Enter job order"
                  />
                </div>
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">WayBill Number</span>
                  <input
                    type="text"
                    value={selectedShipment.tracking_no || ""}
                    onChange={(e) => handleFieldChange("tracking", "no", e.target.value)}
                    onBlur={(e) => handleSaveField("tracking", "no", e.target.value)}
                    className="border border-gray-300 py-2 px-3 rounded text-blue focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter job order"
                  />
                </div>
                {[
                  "Order Placed",
                  "In Warehouse",
                  "Depart at Origin",
                  "In Transit",
                  "Arrived at Destination",
                  "Custom Clearance",
                ].includes(editableStatus) && (
                  <div className="flex flex-col mb-5">
                    <label className="text-gray-500 mb-1">Remarks</label>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="border border-gray-300 py-2 px-3 rounded text-blue"
                      placeholder="Enter remarks here"
                    />
                  </div>
                )}
                {editableStatus === "Depart at Origin" && (
                  <div className="flex flex-row justify-between w-full mb-5">
                    <span className="text-gray-500">Actual Departure Date</span>
                    <input
                      type="date"
                      value={actualDepartureDate}
                      onChange={(e) => setActualDepartureDate(e.target.value)}
                      className="text-blue"
                    />
                  </div>
                )}
                {editableStatus === "Arrived at Destination" && (
                  <div className="flex flex-row justify-between w-full mb-5">
                    <span className="text-gray-500">Actual Arrival Date</span>
                    <input
                      type="date"
                      value={actualArrivalDate}
                      onChange={(e) => setActualArrivalDate(e.target.value)}
                      className="text-blue"
                    />
                  </div>
                )}
                

              </div>
            </div>

            {/* Save Button */}
            <div className="mt-4">
            <button
              onClick={async () => {
                try {
                  // Run all functions sequentially and wait for them to complete
                  await handleStatusChange();
                  if (editableTranserTo && jobOrder) {
                    await handleTransferChange();
                  }

                  // Update fields in the database and show toast notifications
                  for (const field of editableShipperFields) {
                    await handleSaveField('shipper', field, selectedShipment[`shipper_${field.toLowerCase()}`]);
                  }
                  for (const field of editableReceiverFields) {
                    await handleSaveField('receiver', field, selectedShipment[`receiver_${field.toLowerCase()}`]);
                  }
                  for (const field of editableShipmentFields) {
                    await handleSaveField('shipment', field, selectedShipment[`shipment_${field.toLowerCase()}`]);
                  }

                  // Show success toast notification only after successful save
                  toast.success('Fields updated successfully!');
                } catch (error) {
                  console.error('Error updating fields:', error);
                  // Show error toast notification if any error occurs
                  toast.error('Error updating fields.');
                }
              }}
              className="bg-blue text-white px-4 py-2 rounded"
            >
              Save Status
            </button>
            </div>
          </div>
        </div>
      )}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg relative">
            <button
              onClick={closeUploadModal}
              className="absolute top-2 right-2 text-gray-500 text-[30px] hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold text-blue">
              Upload Document for {selectedShipmentForUpload.tracking_no}
            </h2>
            <div className="mt-4">
              {/* Document Title Input */}
              <input
                type="text"
                placeholder="Enter document title"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full mb-4"
              />

              {/* File Input */}
              <input
                type="file"
                onChange={handleFileChange}
                className="border border-gray-300 p-2 rounded w-full mb-4"
              />

              {/* Upload Button */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={closeUploadModal}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={loading2} // Disable button if loading
                  className={`w-1/2 ${
                    loading2
                      ? "bg-gray-300 text-blue"
                      : "bg-blue px-4 py-2 rounded"
                  } text-yellow text-[16px] font-semibold py-2 rounded-md hover:bg-yellow hover:text-blue`}
                >
                  {loading ? (
                    <i className="fas fa-spinner fa-spin"></i> // Display spinner when loading
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {viewModalOpen && selectedShipmentForView && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg relative">
            <button
              onClick={closeViewModal} // Close the modal
              className="absolute top-2 right-2 text-gray-500 text-[30px] hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold text-blue">
              Viewing Documents for{" "}
              {selectedShipmentForView?.tracking_no || "Loading..."}
            </h2>
            <div className="mt-4">
              {/* Document Details */}
              <p className="text-sm text-blue-700 mb-4">
                <strong>Shipment ID:</strong>{" "}
                {selectedShipmentForView?.shipment_id || "Loading..."}
              </p>

              {/* List of documents */}
              {documents.length > 0 ? (
                <div className="document-list">
                  {currentDocuments.map((doc) => (
                    <div key={doc.id} className="document-item mb-2">
                      <p className="text-md text-blue font-medium">
                        <strong>Title:</strong>{" "}
                        {doc.document_title || "No Title Provided"}
                      </p>
                      <p className="text-md text-blue font-medium">
                        <strong>Document Name:</strong>{" "}
                        {doc.document_name || "No Document Name"}
                      </p>
                      <a
                        href={doc.document_url} // Link to the document
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue hover:underline"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No documents available for this shipment.</p>
              )}

              {/* Pagination Controls */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1} // Disable button on the first page
                  className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                >
                  &#8592; Prev
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentDocuments.length < documentsPerPage} // Disable button if on last page
                  className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                >
                  Next &#8594;
                </button>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={closeViewModal} // Close the modal
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ShipmentTable;
