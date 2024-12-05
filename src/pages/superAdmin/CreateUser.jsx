import React, { useState, useRef } from 'react';
// import bcrypt from 'bcryptjs';
import supabase from '../../../src/supabaseClient';
import {  toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/auth-slice';
const CreateUser = () => {
  const {user} = useSelector(state => state.auth)  
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    userName: '',
    password: '',
    department: '',
    role: '',
    created_by_id: user.id,
    created_by_username: user.user_name
  });

  const departments = ['Brokerage', 'Finance', 'Accounting', 'HR'];
  const roles = ['Superadmin', 'Employee'];
  const departmentRef = useRef(null);
  const passwordRef = useRef(null);
  const roleRef = useRef(null);

  const [loading] = useState(false);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const updatedCredentials = { ...credentials, [name]: value };

    // Generate username based on department
    if (name === 'department') {
      try {
        const departmentPrefix = value.toLowerCase();
        const { data: users, error } = await supabase
          .from('users')
          .select('user_name')
          .ilike('user_name', `${departmentPrefix}%`);

        if (error) throw error;

        const departmentUsers = users || [];
        const lastNumber = departmentUsers
          .map((user) => parseInt(user.user_name.replace(departmentPrefix, ''), 10))
          .filter((num) => !isNaN(num))
          .sort((a, b) => b - a)[0] || 0;

        const newUserName = `${departmentPrefix}${String(lastNumber + 1).padStart(2, '0')}`;
        updatedCredentials.userName = newUserName;
      } catch (err) {
        console.error('Error generating username:', err);
        toast.error('Error generating username. Please try again.');
      }
    }

    setCredentials(updatedCredentials);
  };

 
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(credentials))
      .then((data) => {
        if (data?.payload?.success) {
          toast.success(
            data?.payload?.message,
            {position: 'top-right'}
          )
        } else{
          toast.error(
            data?.payload?.message,
            {position: 'top-right'}
          )
        }
      })
  }

  return (
    <section id="create-user" className="flex flex-col justify-center p-0 font-poppins">
      <div className="flex flex-col justify-center bg-gray-200 min-h-[100vh] p-6 items-center">
        <div className="flex flex-col justify-center mb-4">
          <h1 className="text-blue text-center text-4xl font-semibold">Create User</h1>
          <p className="text-blue text-center text-sm font-normal">Create User Account Here</p>
        </div>
        <div className="w-full sm:w-full md:w-full lg:w-[70%] bg-white shadow-lg p-6">
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
            <div className="w-full sm:w-[48%]">
              <label className="block text-gray-700 font-semibold mb-2">Department</label>
              <select
                name="department"
                value={credentials.department}
                onChange={handleInputChange}
                ref={departmentRef}
                className="p-3 border border-gray-300 rounded w-full"
              >
                <option value="" className="text-gray-500 font-semibold">Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept} className="text-gray-500 font-semibold">
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-[48%]">
              <label className="block text-gray-700 font-semibold mb-2">Role</label>
              <select
                name="role"
                value={credentials.role}
                onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
                ref={roleRef}
                className="p-3 border border-gray-300 rounded w-full"
              >
                <option value="" className="text-gray-500 font-semibold">Select Role</option>
                {roles.map((role, index) => (
                  <option key={index} value={role} className="text-gray-500 font-semibold">
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-[48%]">
              <label className="block text-gray-700 font-semibold mb-2">Username</label>
              <input
                type="text"
                name="userName"
                value={credentials.userName}
                disabled
                className="p-3 border border-gray-300 rounded w-full bg-gray-100"
              />
            </div>
            <div className="w-full sm:w-[48%]">
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                ref={passwordRef}
                placeholder="Enter your password"
                className="p-3 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div className="w-full flex justify-center mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-[20rem] ${loading ? 'bg-gray-400' : 'bg-[#11487C]'} text-yellow text-[16px] font-semibold py-2 rounded-md hover:bg-yellow hover:text-blue`}
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE ACCOUNT'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </section>
  );
};

export default CreateUser;
