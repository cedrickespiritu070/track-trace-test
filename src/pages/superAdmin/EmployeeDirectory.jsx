import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import ReactPaginate from 'react-paginate';
import '../../assets/css/table-mobile-responsiveness.css';
import '../../assets/css/react-confirmation-style.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import supabase from '../../supabaseClient'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
const EmployeeDirectory = () => {

  const user = useSelector((state) => state.auth.user);
  const deleted_by = user.id;
  const edited_by = user.id;  
  const edited_by_username = user.user_name
  const deleted_by_username = user.user_name

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('user_id, user_name, department, role');
      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        setUsers(data);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (user_id, deleted_by, deleted_by_username ) => {
    try {
      const response = await axios.post('http://localhost:5000/api/superadmin/delete-employee', {
        user_id, 
        deleted_by,
        deleted_by_username
      });
      toast.success(response.data.message, {position: 'top-right'});
    } catch (error) {
      console.error('Error deleting user:', error.response ? error.response.data : error.message);
      toast.error("Error deleting user", {position: 'top-right'});
    }
  }





  function handleDelete(row) {
    console.log("Delete clicked for row:", row); // Debugging
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="bg-white p-6 rounded-lg shadow-lg relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 text-[30px] hover:text-gray-700">
            &times;
          </button>
          <h2 className="text-lg font-semibold text-blue">Confirm Delete</h2>
          <p className="mt-2">Are you sure you want to delete employee {row.user_name}?</p>
          <div className="mt-4 flex justify-between">
            <button
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDeleteUser(row.user_id, deleted_by, deleted_by_username)
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

  const openModal = (user) => {
    setSelectedUser(user);
    console.log(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const filteredData = users
    .filter(row =>
      (row.user_id && row.user_id.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.user_name && row.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.department && row.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.role && row.role.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(row => (statusFilter === '' ? true : row.department === statusFilter));


  const handlePageClick = (data) => setCurrentPage(data.selected);

  const paginatedData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const handleSubmit = async (e, edited_by) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill out both password fields.", { position: 'top-right' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Password does not match!", { position: 'top-right' });
      return
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long!", { position: 'top-right' });
      return
    }

    try {
      const user_id = selectedUser.user_id;
      const response = await axios.post('http://localhost:5000/api/superadmin/change-password', {
        user_id,  
        newPassword,
        edited_by,
        edited_by_username
      });
      toast.success(response.data.message, { position: 'top-right' });
      closeModal();
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error("Error resetting password", { position: 'top-right' });
    }

  }
  return (
    <div className="shipment-management-container p-4">
      <h2 className="text-2xl font-semibold text-center mt-4 text-blue">Employee Directory</h2>
      <h6 className="text-md font-base text-center mb-4 text-blue">Manage your employees here</h6>

      <div className="search-filter-container max-w-[1500px] justify-end mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 my-4 justify-between mx-[2rem]">
          {/* Search Input with Icon */}
          <div className="relative w-full lg:w-1/3 shadow-sm rounded-lg">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              placeholder="Search Employee ID, Username, Department, and Role"
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
                <option value="">Filter Department</option>
                <option value="Brokerage">Brokerage</option>
                <option value="Accounting">Accounting</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
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
                  <Th className="p-2 border-b border-gray-300">Employee ID</Th>
                  <Th className="p-2 border-b border-gray-300">Employee</Th>
                  <Th className="p-2 border-b border-gray-300">Department</Th>
                  <Th className="p-2 border-b border-gray-300">Role</Th>
                  <Th className="p-2 border border-gray-300 fixed-col hidden">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedData.map((row, index) => (
                  <Tr key={index} className="hover:bg-gray-100">
                    <Td className="p-2 border-b border-gray-300 bg-[#e5e7eb]">{row.user_id}</Td>
                    <Td className="p-2 border-b border-gray-300">{row.user_name}</Td>
                    <Td className="p-2 border-b border-gray-300">{row.department}</Td>
                    <Td className="p-2 border-b border-gray-300">{row.role}</Td>

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
                    <Td className="p-2 border-b border-gray-300 fixed-col bg-[#e5e7eb]">
                      <div className="flex gap-1 flex-wrap">
                        <button
                          onClick={() => openModal(row)}
                          className="bg-blue hover:bg-[#07335c] text-white px-[15px] py-[5px] text-[0.75rem] flex rounded-md gap-[5px] items-center">
                          <i className="fa-regular fa-eye"></i>Edit
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

      {/* Modal for user password change */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-xl p-6 rounded-lg shadow-lg relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 text-[30px] hover:text-gray-700">
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-blue text-center">{`Create New Password for ${selectedUser.user_name}`}</h2>
            <h3 className="text-lg text-gray-500 text-center">Enter your new password below to complete the reset process</h3>
            <form
              className="mt-4"
              onSubmit={(e) =>handleSubmit(e, edited_by)}
            >

              <label
                htmlFor='password'
                className="text-gray-500 "
              >
                Password
              </label>
              <input
                type="text"
                id='password'
                className="p-3 border border-gray-300 rounded w-full mb-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />


              <label
                htmlFor='password'
                className="text-gray-500"
              >
                Confirm Password
              </label>
              <input
                type="text"
                id='password'
                className="p-3 border border-gray-300 rounded w-full mb-9"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type='submit'
                className="bg-blue hover:bg-[#07335c] text-yellow px-4 py-4 w-full rounded"
              >
                Reset Password
              </button>

            </form>
          </div>
        </div>
      )}
      {/* <ToastContainer /> */}
    </div>
  )
}

export default EmployeeDirectory
