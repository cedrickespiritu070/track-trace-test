import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import ReactPaginate from 'react-paginate';
import '../../assets/css/table-mobile-responsiveness.css';
import '../../assets/css/react-confirmation-style.css';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import supabase from '../../supabaseClient'
import logo from '../../assets/RCS-Logo-Blue.png'; // Import the logo image

const SuperShipmentManagement = () => {
    const [shipments, setShipments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('shipments')
          .select('*');
        if (error) {
          console.error('Error fetching data:', error.message);
        } else {
          setShipments(data);
        }
        setLoading(false);
      };
  
      fetchData();
    }, []);
  
    const downloadShipmentPDF = () => {
      if (selectedShipment) {
        const pdf = new jsPDF();
    
        // Add the logo (the imported logo)
        const logoX = 10; // X position for the logo
        const logoY = 10; // Y position for the logo
        const logoWidth = 40; // Width of the logo
        const logoHeight = 40; // Height of the logo
        pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
    
        // Set the title
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.text("Shipment Details", 10, logoY + logoHeight + 5); // Position the title below the logo
    
        // Prepare data for the table
        const tableData = [
          { description: "Shipment ID", details: selectedShipment.shipment_id },
          { description: "Shipper", details: selectedShipment.shipper_name },
          { description: "Receiver", details: selectedShipment.receiver_name },
          { description: "Shipment Type", details: selectedShipment.shipment_type },
          { description: "Origin", details: selectedShipment.shipper_city },
          { description: "Destination", details: selectedShipment.receiver_city },
          { description: "Status", details: selectedShipment.status },
          { description: "Created By", details: selectedShipment.created_by },
        ];
    
        // Define the columns (header and key-value pairs)
        const columns = [
          { header: "Description", dataKey: "description" },
          { header: "Details", dataKey: "details" },
        ];
    
        // Update the head to be an array of headers
        const head = columns.map(col => col.header); // Extract only the header values
    
        // Add the table to the PDF using autoTable
        pdf.autoTable({
          startY: logoY + logoHeight + 10, // Start the table below the title
          head: [head], // Use the array of headers
          body: tableData.map((row) => [row.description, row.details]),
          margin: { top: 10 },
          theme: "grid",
        });
    
        // Add remarks if available
        if (selectedShipment.remarks && selectedShipment.remarks.length > 0) {
          const remarksStartY = pdf.lastAutoTable.finalY + 10; // Start position for remarks section
          pdf.setFontSize(12);
          pdf.text("Remarks:", 10, remarksStartY);
    
          // Loop through remarks and add them to the PDF
          let currentY = remarksStartY + 10;
          selectedShipment.remarks.forEach((remark, index) => {
            pdf.setFont("helvetica", "normal");
    
            // Format the timestamp to a more user-friendly format
            const formattedDate = new Date(remark.date).toLocaleString('en-US', {
              weekday: 'long', // "Monday"
              year: 'numeric', // "2024"
              month: 'long', // "November"
              day: 'numeric', // "21"
              hour: 'numeric', // "5"
              minute: 'numeric', // "03"
              second: 'numeric', // "23"
              hour12: true, // 12-hour clock with AM/PM
            });
    
            // Print the status and date normally
            const statusDateText = `${formattedDate} - ${remark.status}: `;
            pdf.setFont("helvetica", "normal");
            pdf.text(statusDateText, 10, currentY);
    
            // Now print the remark in the color #11487C
            const remarkText = remark.remark ? remark.remark : 'No remarks';
            pdf.text(remarkText, 10 + pdf.getTextWidth(statusDateText), currentY); // Add the remark after the status and date
            currentY += 10; // Adjust vertical position for next remark
          });
        }
    
        // Save the PDF
        pdf.save(`shipment-${selectedShipment.tracking_no}.pdf`);
      } else {
        console.error("No shipment selected for download.");
      }
    };
    
    
     
    
    
    
    
    
    function handleDelete(row) {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 text-[30px] hover:text-gray-700">
              &times;
            </button>
            <h2 className="text-lg font-semibold text-blue">Confirm Delete</h2> 
            <p className="mt-2">Are you sure you want to delete shipment ID: {row.shipment_id}?</p>
            <div className="mt-4 flex justify-between">
              <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button> 
              <button
                onClick={() => {
                  console.log(`Deleted shipment with ID: ${row.shipment_id}`);
                  onClose();
                }}
                style={{ backgroundColor: "#dc3545", color: "white" }}
                className="px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )
      });
    }
  
    const filteredData = shipments
    .filter(row =>
      (row.shipmentId && row.shipmentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.tracking_no && row.tracking_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.shipper_name && row.shipper_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.receiver_name && row.receiver_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.shipper_city && row.shipper_city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.user_name && row.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.receiver_city && row.receiver_city.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(row => (statusFilter === '' ? true : row.status === statusFilter));
  
  
    const handlePageClick = (data) => setCurrentPage(data.selected);
  
    const paginatedData = filteredData.slice(
      currentPage * rowsPerPage,
      (currentPage + 1) * rowsPerPage
    );
  
    const openModal = (shipment) => {
      setSelectedShipment(shipment);
    };
    
    const closeModal = () => {
      setSelectedShipment(null);
    };
  
    const getStatusClass = (status) => {
      switch (status) {
        case 'Order Placed':
          return 'bg-[#fff8e1] text-yellow-800';
        case 'In Warehouse':
          return 'bg-[#f5f5f5] text-gray-800';
        case 'In Transit':
          return 'bg-[#e3f2fd] text-blue-800';
        case 'Delivered':
          return 'bg-[#e8f5e9] text-green-800';
        default:
          return 'bg-[#faf3e0] text-black';
      }
    };
  
    const getShipmentTypeClass = (type) => {
      switch (type) {
        case 'Air':
          return 'bg-[#95d8eb] text-[#0076be] px-4 rounded-lg font-semibold';
        case 'Sea':
          return 'bg-[#8bd9c7] text-[#01673f] px-4 rounded-lg font-semibold';
        default:
          return 'text-black';
      }
    };
  
    return (
      <div className="shipment-management-container p-4">
        <h2 className="text-2xl font-semibold text-center mt-4 text-blue">Shipment Management</h2>
        <h6 className="text-md font-base text-center mb-4 text-blue">View all shipments here</h6>
  
        <div className="search-filter-container max-w-[1500px] justify-end mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 my-4 justify-between mx-[2rem]">
            {/* Search Input with Icon */}
            <div className="relative w-full lg:w-1/3 shadow-sm rounded-lg">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search by ID, Tracking No, Shipper, Receiver, etc."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="placeholder-gray-600 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
  
            <div className="flex gap-4">
              <div className="relative w-full shadow-sm rounded-lg">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i className="bi bi-filter"></i>
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="In Warehouse">In Warehouse</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
  
              {/* Pagination Select */}
              <div className="w-40 lg:w-[5rem] shadow-sm rounded-lg">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(0);
                  }}
                  className="w-full lg:w-auto pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="h-[40vh]">
            <div className="loader mx-auto my-auto mt-[20vh] bg-blue"></div>
          </div>
        ) : (
          <div className="table-container inline sm:flex max-w-[1500px] justify-center mx-auto overflow-x-hidden">
          <div className="scroller overflow-x-auto w-[65vw] mx-auto sm:mx-0">
            <Table className="min-w-full table-auto border-collapse border border-gray-300">
              <Thead>
                <Tr className="bg-gray-200 text-left">
                  <Th className="px-8 border-b border-gray-300">Tracking No</Th>
                  <Th className="px-8 border-b border-gray-300">Shipment ID</Th>
                  <Th className="px-8 border-b border-gray-300">Created By</Th>
                  <Th className="px-8 border-b border-gray-300">Shipper</Th>
                  <Th className="px-8 border-b border-gray-300">Receiver</Th>
                  <Th className="px-8 border-b border-gray-300">Shipment Type</Th>
                  <Th className="px-8 border-b border-gray-300">Origin</Th>
                  <Th className="px-8 border-b border-gray-300">Destination</Th>
                  <Th className="px-8 border-b border-gray-300">Status</Th>
                  <Th className="px-8 border-b border-gray-300">Remarks</Th>
                  <Th className="p-2 border border-gray-300 fixed-col hidden">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedData.map((row, index) => (
                  <Tr key={index} className="hover:bg-gray-100">
                    <Td className="px-8 border-b border-gray-300 bg-[#e5e7eb]">{row.tracking_no}</Td>
                    <Td className="px-8 border-b border-gray-300">{row.shipment_id}</Td>
                    <Td className="px-8 border-b border-gray-300">{row.created_by}</Td>
                    <Td className="px-8 border-b border-gray-300">{row.shipper_name}</Td>
                    <Td className="px-8 border-b border-gray-300">{row.receiver_name}</Td>
                    <Td className={`px-8 border-b border-gray-300 rounded`}>
                      <span className={`${getShipmentTypeClass(row.shipment_type)}`}>{row.shipment_type}</span>
                    </Td>
                    <Td className="px-8 border-b border-gray-300">{row.shipper_city}</Td>
                    <Td className="px-8 border-b border-gray-300">{row.receiver_city}</Td>
                    <Td className={`px-8 border-b border-gray-300 rounded ${getStatusClass(row.status)}`}>
                      {row.status}
                    </Td>
                    <Td className="px-8 border-b border-gray-300">
                    {
                      ["Order Placed", "In Warehouse", "Depart at Origin", "In Transit", "Arrived at Destination", "Custom Clearance", "Delivered"].includes(row.status) &&
                      row.remarks &&
                      row.remarks.length > 0 ? (
                        (() => {
                          const latestRemark = row.remarks.reduce((latest, current) =>
                            new Date(latest.date) > new Date(current.date) ? latest : current
                          );
                          return (
                            <div>
                              <strong>{new Date(latestRemark.date).toLocaleString()}:</strong>{" "}
                              {latestRemark.remark || "No remark available"}
                            </div>
                          );
                        })()
                      ) : (
                        "-"
                      )
                    }
                    </Td>
  
                    <Td className="px-8 border-b border-gray-300 fixed-col bg-[#e5e7eb] h-auto hidden">
                      <div className="flex gap-1 flex-wrap">
                        <button onClick={() => openModal(row)} className="bg-blue hover:bg-[#07335c] text-white px-[15px] py-[5px] text-[0.75rem] flex rounded-md gap-[5px] items-center">
                        <i className="fa-regular fa-eye"></i>View
                        </button>
                        <button 
                          onClick={() => handleDelete(row)} 
                          className="bg-red hover:bg-[#af202e] text-white px-[15px] py-[5px] text-[0.75rem] flex rounded-md gap-[5px] items-center">
                          <i className="fa-solid fa-trash"></i> Delete
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
          
          <div className="hidden sm:block">
          <Table className="">
              <Thead>
                <Tr className="bg-gray-200 text-left">
                  <Th className="p-2 border border-gray-300 fixed-col min-w-[12rem] bg-[#e5e7eb]">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedData.map((row, index) => (
                  <Tr key={index} className="hover:bg-gray-100">
                    <Td className="px-8 border-b border-gray-300 fixed-col bg-[#e5e7eb]">
                      <div className="flex gap-1 flex-wrap">
                        <button onClick={() => openModal(row)} className="bg-blue hover:bg-[#07335c] text-white px-[15px] py-[5px] text-[0.75rem] flex rounded-md gap-[5px] items-center">
                        <i className="fa-regular fa-eye"></i>View
                        </button>
                        <button 
                          onClick={() => handleDelete(row)} 
                          className="bg-red hover:bg-[#af202e] text-white px-[15px] py-[5px] text-[0.75rem] flex rounded-md gap-[5px] items-center">
                          <i className="fa-solid fa-trash"></i> Delete
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
        
  
        {/* Pagination */}
        <div className="pagination-container mt-4">
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={Math.ceil(filteredData.length / rowsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination flex flex-wrap justify-center items-center gap-4'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link text-gray-700 p-2 border rounded hover:bg-gray-200'}
            previousLinkClassName={'previous-link p-2 border rounded'}
            nextLinkClassName={'next-link p-2 border rounded'}
            breakClassName={'break-me'}
            activeClassName={'active bg-blue-500 text-white'}
          />
        </div>
  
        {/* Modal for editing shipment status */}
        {selectedShipment && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-xl p-6 rounded-lg shadow-lg relative">
              <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 text-[30px] hover:text-gray-700">
                &times;
              </button>
              <h2 className="text-lg font-semibold text-blue">View Shipment Details</h2>
              <div className="mt-4">
                <div className="flex flex-col">
                  <div className="flex flex-row justify-between w-full mb-5">
                    <span className="text-gray-500">Tracking Number</span>
                    <span className="text-blue font-bold">{selectedShipment.tracking_no}</span>
                  </div>
                  <div className="flex flex-row justify-between w-full mb-5">
                    <span className="text-gray-500">Created By</span>
                    <span className="text-blue font-bold">{selectedShipment.created_by}</span>
                  </div>
                  <div className="flex flex-row justify-between w-full  mb-5">
                    <span className="text-gray-500">Expected Delivery</span>
                    <span className="text-blue font-bold">{selectedShipment.expected_delivery_date}</span>
                  </div>
                  <div className="flex flex-row justify-between w-full  mb-5">
                    <span className="text-gray-500">Client Name</span>
                    <span className="text-blue font-bold">{selectedShipment.shipper_name}</span>
                  </div>
                  <div className="flex flex-row justify-between w-full  mb-5">
                    <span className="text-gray-500">Shipment Type</span>
                    <span className="text-blue font-bold">{selectedShipment.shipment_type}</span>
                  </div>
                  <div className="flex flex-row justify-between w-full  mb-5">
                    <span className="text-gray-500">Origin</span>
                    <span className="text-blue font-bold">{selectedShipment.shipper_city}</span>
                  </div>
                  <div className="flex flex-row justify-between w-full  mb-5">
                    <span className="text-gray-500">Destination</span>
                    <span className="text-blue font-bold">{selectedShipment.receiver_city}</span>
                  </div>
                  <div className="flex flex-row justify-between w-full mb-5">
                    <span className="text-gray-500">Status</span>
                    <span className="text-blue font-bold">Status Placeholder</span>
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded">Go Back</button>
                  <button onClick={downloadShipmentPDF} className="bg-blue text-white px-4 py-2 rounded">Download</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

export default SuperShipmentManagement
