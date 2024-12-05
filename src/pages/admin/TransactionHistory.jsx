import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import ReactPaginate from 'react-paginate';
import '../../assets/css/table-mobile-responsiveness.css';
import jsPDF from 'jspdf';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import supabase from '../../supabaseClient';

const TransactionHistory = () => {
  const [initialData, setInitialData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editableStatus, setEditableStatus] = useState('');
  const [loading, setLoading] = useState(true);

  
   // Fetch delivered transactions from Supabase
   useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('status', 'Delivered')
      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        setInitialData(data); 
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  //Delete Transaction
  const deleteTransaction = async (id) => {
    const { error } = await supabase.from('shipments').delete().eq('shipment_id', id);
    if (error) {
      console.error('Error deleting post:', error);
    } else {
      setInitialData(initialData.filter(row => row.id !== id));
    }
  };


  const filteredData = initialData
    .filter((row) =>
      String(row.shipment_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(row.tracking_no).toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.receiver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.shipment_type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((row) => (statusFilter === '' ? true : row.status === statusFilter));

  const handlePageClick = (data) => setCurrentPage(data.selected);

  const paginatedData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setEditableStatus(transaction.status);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
  };

  const handleStatusChange = () => {
    console.log('Status changed to:', editableStatus);
    closeModal();
  };
  const downloadTransactionPDF = () => {
    if (selectedTransaction) { // Check if a transaction is selected
      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.text(`Transaction Details for Transaction ID: ${selectedTransaction.shipment_id}`, 10, 10);
      
      pdf.setFontSize(12);
      pdf.text(`Transaction ID: ${selectedTransaction.shipment_id}`, 10, 20);
      pdf.text(`Transaction No: ${selectedTransaction.tracking_no}`, 10, 30);
      pdf.text(`Date: ${selectedTransaction.date}`, 10, 40);
      pdf.text(`Client Name: ${selectedTransaction.receiver_name}`, 10, 50);
      pdf.text(`Transaction Type: ${selectedTransaction.shipment_type}`, 10, 60);
      pdf.text(`Amount: $${selectedTransaction.amount}`, 10, 70);
      pdf.text(`Status: ${selectedTransaction.status}`, 10, 80);
  
      // Save the PDF with the transaction ID in the filename
      pdf.save(`transaction-${selectedTransaction.shipment_id}.pdf`);
    } else {
      console.error("No transaction selected for download.");
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
            <p className='mt-2'>Are you sure you want to delete shipment ID: {row.shipment_id}?</p>
            <div className="mt-4">
              <div className="flex justify-between mt-6">
                <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button> 
                <button
                  onClick={() => {
                    console.log(`Deleted shipment with ID: ${row.shipment_id}`);
                    deleteTransaction(row.shipment_id);
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
      )
    });
  }

  return (
    <div className="transaction-history-container p-4">
      <h2 className="text-2xl font-semibold text-center mt-4 text-blue">Transaction History</h2>
      <h6 className="text-md font-base text-center mb-4 text-blue">View and manage transactions here</h6>

      {/* Search and Filter */}
      <div className="search-filter-container max-w-[1400px] justify-end mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 my-4 justify-between mx-[2rem]">
          {/* Search Input */}
          <div className="relative w-full lg:w-1/3 shadow-sm rounded-lg">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              placeholder="Search by ID, Transaction No, Client Name, etc."
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
                <option value="">All Statuses</option>
                <option value="Delivered">Delivered</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Pagination Select */}
            <div className="w-full lg:w-[5rem] shadow-sm rounded-lg">
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
              <Th className="px-8 border-b border-gray-300">Transaction No.</Th>
                <Th className="px-8 border-b border-gray-300">Transaction ID</Th>
                <Th className="px-8 border-b border-gray-300">Date</Th>
                <Th className="px-8 border-b border-gray-300">Client Name</Th>
                <Th className="px-8 border-b border-gray-300">Transaction Type</Th>
                <Th className="px-8 border-b border-gray-300">Amount</Th>
                <Th className="px-8 border-b border-gray-300">Status</Th>
                <Th className="p-2 border border-gray-300 fixed-col bg-[#e5e7eb] hidden">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((row, index) => (
                <Tr key={index} className="hover:bg-gray-100">
                  <Td className="px-8 border-b border-gray-300 bg-[#e5e7eb]">{row.tracking_no}</Td>
                  <Td className="px-8 border-b border-gray-300">{row.shipment_id}</Td>
                  <Td className="px-8 border-b border-gray-300">{row.date}</Td>
                  <Td className="px-8 border-b border-gray-300">{row.receiver_name}</Td>
                  <Td className="px-8 border-b border-gray-300">{row.shipment_type}</Td>
                  <Td className="px-8 border-b border-gray-300">${row.amount}</Td>
                  <Td className="px-8 border-b border-gray-300">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-semibold ${row.status === 'Delivered' ? 'bg-green-600' : 'bg-yellow'}`}
                    >
                      {row.status}
                    </span>
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
                <Th className="p-2 border border-gray-300 fixed-col bg-[#e5e7eb]">Actions </Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((row, index) => (
                <Tr key={index} className="hover:bg-gray-100">
                  <Td className="px-8 border-b border-gray-300 fixed-col bg-[#e5e7eb]">
                    <div className="flex gap-1">
                      <button onClick={() => openModal(row)} className="bg-blue hover:bg-[#07335c] text-white px-[15px] py-[5px] text-[0.75rem] flex rounded-md gap-[5px] items-center">
                      <i className="fa-solid fa-eye"></i>View
                      </button>
                      <button onClick={() =>  handleDelete(row)} className="bg-red hover:bg-[#af202e] text-white px-[15px] py-[5px] text-[0.75rem] flex rounded-md gap-[5px] items-center">
                      <i className="fa-solid fa-trash"></i>Delete
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

      {/* Modal */}
      {selectedTransaction && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-xl p-6 rounded-lg shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 text-[30px] hover:text-gray-700"
            >
              &times;
            </button>
    
            <h2 className="text-lg font-semibold text-blue">Transaction Details</h2>
    
            <div className="mt-4">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="text-blue font-bold">{selectedTransaction.shipment_id}</span>
                </div>
    
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Transaction No</span>
                  <span className="text-blue font-bold">{selectedTransaction.tracking_no}</span>
                </div>
    
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Date</span>
                  <span className="text-blue font-bold">{selectedTransaction.date}</span>
                </div>
    
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Client Name</span>
                  <span className="text-blue font-bold">{selectedTransaction.receiver_name}</span>
                </div>
    
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Transaction Type</span>
                  <span className="text-blue font-bold">{selectedTransaction.shipment_type}</span>
                </div>
    
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Amount</span>
                  <span className="text-blue font-bold">${selectedTransaction.amount}</span>
                </div>
    
                <div className="flex flex-row justify-between w-full mb-5">
                  <span className="text-gray-500">Status</span>
                  <span className="text-blue font-bold">{selectedTransaction.status}</span>
                </div>
              </div>
    
              <div className="flex justify-between mt-6">
                <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded hover:text-blue hover:bg-yellow">Close</button>
                <button onClick={downloadTransactionPDF} className="bg-blue text-white px-4 py-2 rounded hover:text-blue hover:bg-yellow">Download</button>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
