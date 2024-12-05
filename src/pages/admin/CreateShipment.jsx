import React, { useEffect, useState } from 'react';
import '../../assets/css/createShipmentCSS.css';
import '../../assets/css/toastCSS.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';



const CreateShipment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const user = useSelector(state => state.auth.user)
  const user_id = user.id
  const created_by = user.user_name




  const [shipperDetails, setShipperDetails] = useState({
    name: '',
    email: '',
    unit: '',
    city: '',
    street: '',
    country: '',
    phone: '',
    building: '',
  });
  const [receiverDetails, setReceiverDetails] = useState({
    name: '',
    email: '',
    unit: '',
    city: '',
    street: '',
    country: '',
    phone: '',
    building: '',
  });
  const [shipmentDetails, setShipmentDetails] = useState({
    description: '',
    type: '',
    instructions: '',
    shipment_mode: 'EXPORT', // Default to 'EXPORT'
    terms: '',
    gross_weight: '', // sea(lcl) and air 
    eta: '',
    etd: '',

    // SEA LCL
    packages: '',
    volume: '',

    // SEA FCL
    containers: [],
    total_weight: '',

    //AIR
    dimensions: [],
    chargeable_weight: '',

   
  });

  useEffect(() => {
    console.log("Shipper Details: ", shipperDetails);
  }, [shipperDetails]);
  useEffect(() => {
    console.log("Receiver Details: ", receiverDetails);
  }, [receiverDetails]);
  useEffect(() => {
    console.log("Shipment Details: ", shipmentDetails);
  }, [shipmentDetails]);



  const [errors] = useState({
    shipperDetails: {},
    receiverDetails: {},
    shipmentDetails: {},
  });

  const steps = [
    { title: "Shipment Type", description: "Select the type of shipment" },
    { title: "Shipper Details", description: "Please fill in the shipper's details" },
    { title: "Receiver Details", description: "Please fill in the receiver's details" },
    { title: "Shipment Details", description: "Please provide the shipment's details" },
    { title: "Confirmation", description: "Review and confirm the details" }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleShipmentTypeClick = (type) => {
    setShipmentDetails(prevDetails => ({ ...prevDetails, type }));
    setCurrentStep(1);
  };

  const handleInputChange = (e, setSection) => {
    const { name, value } = e.target;
    setSection(prev => ({ ...prev, [name]: value }));
  };

  const addDimension = (e) => {
    e.preventDefault();
    setShipmentDetails({ ...shipmentDetails, dimensions: [...shipmentDetails.dimensions, ''] });
  }

  const handleDeleteDimension = (index) => {
    const updatedDimensions = shipmentDetails.dimensions.filter((_, i) => i !== index);
    setShipmentDetails({ ...shipmentDetails, dimensions: updatedDimensions });
  };


  const handleDimensionChange = (e, index) => {
    const { value } = e.target
    const dimensions = shipmentDetails.dimensions;
    dimensions[index] = value;
    setShipmentDetails({ ...shipmentDetails, dimensions });
  }

  const addContainer = (e) => {
    e.preventDefault();
    setShipmentDetails({ ...shipmentDetails, containers: [...shipmentDetails.containers, ''] });
  }

  const handleDeleteContainer = (index) => {
    const updatedContainers = shipmentDetails.containers.filter((_, i) => i !== index);
    setShipmentDetails({ ...shipmentDetails, containers: updatedContainers });
  };

  const handleContainerChange = (e, index) => {
    const { value } = e.target
    const containers = shipmentDetails.containers;
    containers[index] = value;
    setShipmentDetails({ ...shipmentDetails, containers });
  }

  const renderFormFields = () => {
    if (currentStep === 0) {
      return (
        <div className="flex flex-col bg-white p-6 gap-8">
          <h3 className="text-blue text-center text-2xl font-semibold">
            Are you Sending Via?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="flex flex-col items-center bg-white p-5 shadow-md rounded-lg cursor-pointer h-[10rem] justify-center group hover:bg-blue"
              onClick={() => handleShipmentTypeClick("SEA")}
            >
              <i className="fas fa-ship text-blue text-[50px] group-hover:text-yellow"></i>
              <span className="text-blue text-xl font-semibold mt-5 group-hover:text-yellow">
                Sea
              </span>
            </div>
            <div
              className="flex flex-col items-center bg-white p-5 shadow-md rounded-lg cursor-pointer h-[10rem] justify-center group hover:bg-blue"
              onClick={() => handleShipmentTypeClick("AIR")}
            >
              <i className="fas fa-plane text-blue text-[50px] group-hover:text-yellow"></i>
              <span className="text-blue text-xl font-semibold mt-5 group-hover:text-yellow">
                Air
              </span>
            </div>
            <div
              className="flex flex-col items-center bg-white p-5 shadow-md rounded-lg cursor-pointer h-[10rem] justify-center group hover:bg-blue"
              onClick={() => handleShipmentTypeClick("BROKERAGE")}
            >
              <i className="fas fa-briefcase text-blue text-[50px] group-hover:text-yellow"></i>
              <span className="text-blue text-xl font-semibold mt-5 group-hover:text-yellow">
                Brokerage
              </span>
            </div>
            <div
              className="flex flex-col items-center bg-white p-5 shadow-md rounded-lg cursor-pointer h-[10rem] justify-center group hover:bg-blue"
              onClick={() => handleShipmentTypeClick("DOMESTIC")}
            >
              <i className="fas fa-truck text-blue text-[50px] group-hover:text-yellow"></i>
              <span className="text-blue text-xl font-semibold mt-5 group-hover:text-yellow">
                Domestic
              </span>
            </div>
          </div>
        </div>
      );
    }

    // SEA SHIPMENT
    if (currentStep === 3 && shipmentDetails.type === "SEA") {
      return (
        <div className="flex flex-wrap -mx-2">
          <div className="md:w-1/2 px-2 mb-4 w-full">
            <label htmlFor="description" className="block text-blue font-semibold">Shipment Description</label>
            <input
              type="text"
              id='description'
              name='description'
              value={shipmentDetails.description}
              className="p-3 border border-gray-300 rounded w-full"
              placeholder="Shipment Description"
              onChange={(e) => handleInputChange(e, setShipmentDetails)}
            />
          </div>
          <div className="md:w-1/2 px-2 mb-4 w-full">
            <label htmlFor="type" className="block text-blue font-semibold">Shipment Type</label>
            <input
              type="text"
              id='type'
              name='type'
              value={shipmentDetails.type}
              className="p-3 border border-gray-300 rounded w-full"
              placeholder="Shipment Type"
              disabled
              onChange={(e) => handleInputChange(e, setShipmentDetails)}
            />
          </div>
          <div className="md:w-1/2 px-2 mb-4 w-full">
            <label htmlFor="instruction" className="block text-blue font-semibold">Shipment Instruction</label>
            <input
              type="text"
              id="instruction"
              name='instructions'
              value={shipmentDetails.instructions}
              className="p-3 border border-gray-300 rounded w-full"
              placeholder="Shipment Instructions"
              onChange={(e) => handleInputChange(e, setShipmentDetails)}
            />
          </div>
          {/* <div className="md:w-1/2 px-2 mb-4 w-full">
            <input
              type="text"
              id="description"
              name="description"
              className="p-3 border border-gray-300 rounded w-full"
              placeholder="PLACEHOLDER1"
              onChange={(e) => handleInputChange(e, setShipmentDetails)}
            />
          </div>
          <div className="md:w-1/2 px-2 mb-4 w-full">
            <input
              type="text"
              id="description"
              name="description"
              className="p-3 border border-gray-300 rounded w-full"
              placeholder="PLACEHOLDER2"
              onChange={(e) => handleInputChange(e, setShipmentDetails)}
            />
          </div>
          <div className="md:w-1/2 px-2 mb-4 w-full">
            <input
              type="text"
              id="description"
              name="description"
              className="p-3 border border-gray-300 rounded w-full"
              placeholder="PLACEHOLDER3"
              onChange={(e) => handleInputChange(e, setShipmentDetails)}
            />
          </div> */}
          <div className='md:w-1/2 px-2 mb-4 w-full'>
            <label htmlFor="shipment_mode" className="block text-blue font-semibold">Shipment Mode</label>
            <select
              className="p-3 border border-gray-300 rounded w-full"
              name='shipment_mode'
              value={shipmentDetails.shipment_mode}
              onChange={(e) =>
                handleInputChange(
                  e,
                  setShipmentDetails
                )
              }
            >
              <option value="EXPORT">EXPORT</option>
              <option value="IMPORT">IMPORT</option>
            </select>
          </div>


          <div className='md:w-1/2 px-2 mb-4 w-full'>
            <label htmlFor="terms" className="block text-blue font-semibold">Shipment Terms</label>
            <select
              id="terms"
              name="terms"
              className="p-3 border border-gray-300 rounded w-full"
              value={shipmentDetails.terms}
              onChange={(e) =>
                handleInputChange(
                  e,
                  setShipmentDetails
                )
              }
            >
              <option value="">Select Terms</option>
              <option value="FCL">Full Container Load (FCL)</option>
              <option value="LCL">Less than Container Load (LCL)</option>
            </select>
          </div>


          {shipmentDetails.terms === "LCL" &&
            <div className='w-full grid grid-cols-2'>
              <div className="px-2 mb-4 w-full">
                <label htmlFor="packages" className="block text-blue font-semibold">Shipment Packages</label>
                <input
                  type="text"
                  id="packages"
                  name="packages"
                  value={shipmentDetails.packages}
                  className="p-3 border border-gray-300 rounded w-full"
                  placeholder="No. of Packages"
                  onChange={(e) => handleInputChange(e, setShipmentDetails)}
                />
              </div>

              <div className="px-2 mb-4 w-full">
                <label htmlFor="gross_weight" className="block text-blue font-semibold">Shipment Gross Weight</label>
                <input
                  type="text"
                  id='gross_weight'
                  name="gross_weight"
                  value={shipmentDetails.gross_weight}
                  className="p-3 border border-gray-300 rounded w-full"
                  placeholder="Shipment Gross Weight"
                  onChange={(e) => handleInputChange(e, setShipmentDetails)}
                />
              </div>


              <div className="px-2 mb-4 w-full">
                <label htmlFor="volume" className="block text-blue font-semibold">Shipment Total Volume</label>
                <input
                  type="text"
                  id="volume"
                  name="volume"
                  value={shipmentDetails.volume}
                  className="p-3 border border-gray-300 rounded w-full"
                  placeholder="Shipment Total Volume"
                  onChange={(e) => handleInputChange(e, setShipmentDetails)}
                />
              </div>


            </div>}

          {shipmentDetails.terms === "FCL" &&
            <div className='w-full grid'>

              <div className='px-2 mb-4 w-full'>
                <button
                  className="bg-blue text-white py-2 px-4 rounded w-full"
                  onClick={addContainer}

                >
                  Add Containers
                </button>
              </div>

              {shipmentDetails.containers.map((item, index) => (
                <div className='px-2 mb-4 w-full flex items-center space-x-5' key={index}>
                  <span className="text-gray-700 font-medium">{index + 1}.</span>
                  <input
                    type="text"
                    name="containerNumber"
                    value={item}
                    className="p-3 border border-gray-300 rounded w-full"
                    placeholder="Add Container Number"
                    onChange={(e) => handleContainerChange(e, index)}
                  />
                  <i
                    className="fa-solid fa-xmark text-red cursor-pointer px-5"
                    onClick={() => handleDeleteContainer(index)}
                  />
                </div>
              ))}


              <div className="px-2 mb-4 w-full">
                <label htmlFor="total_weight" className="block text-blue font-semibold">Shipment Total Weight</label>
                <input
                  type="text"
                  id='total_weight'
                  name="total_weight"
                  value={shipmentDetails.total_weight}
                  className="p-3 border border-gray-300 rounded w-full"
                  placeholder="Shipment Total Weight"
                  onChange={(e) => handleInputChange(e, setShipmentDetails)}
                />
              </div>
            </div>
            }

            <div className='grid grid-cols-2 w-full'>
              <div className="px-2 mb-4">
                <label 
                  htmlFor="etd"
                  className="block text-blue font-semibold"
                >ETD</label>
                <input
                  type="date"
                  id='etd'
                  name="etd"
                  value={shipmentDetails.etd}
                  className="p-3 border border-gray-300 rounded w-full"
                  placeholder="Shipment Total Weight"
                  onChange={(e) => handleInputChange(e, setShipmentDetails)}
                />
              </div>

              <div className="px-2 mb-4">
                <label 
                  htmlFor="eta"
                  className="block text-blue font-semibold"
                  
                >ETA</label>
                <input
                  type="date"
                  id='eta'
                  name="eta"
                  value={shipmentDetails.eta}
                  className="p-3 border border-gray-300 rounded w-full"
                  placeholder="Shipment ETA"
                  onChange={(e) => handleInputChange(e, setShipmentDetails)}
                />
              </div>
            </div>
        </div>

      );
    }

    // AIR SHIPMENT
    if (currentStep === 3 && shipmentDetails.type === "AIR") {
      return (
        <div className="flex flex-wrap -mx-2">
          <div className="md:w-1/2 px-2 mb-4 w-full">
            <label htmlFor="description" className="block text-blue font-semibold">Shipment Description</label>
            <input
              type="text"
              id='description'
              name='description'
              value={shipmentDetails.description}
              className="p-3 border border-gray-300 rounded w-full"
              placeholder="Shipment Description"
              onChange={(e) => handleInputChange(e, setShipmentDetails)}
            />
          </div>
          <div className="md:w-1/2 px-2 mb-4 w-full">
            <label htmlFor="type" className="block text-blue font-semibold">Shipment Type</label>
            <input
              type="text"
              id='type'
              name='type'
              value={shipmentDetails.type}
              className="p-3 border border-gray-300 rounded w-full"
              disabled
              placeholder="Shipment Type"
              onChange={(e) => handleInputChange(e, setShipmentDetails)}
            />
          </div>
          <div className="md:w-1/2 px-2 mb-4 w-full">
            <label htmlFor="instructions" className="block text-blue font-semibold">Shipment Instruction</label>
            <input
              type="text"
              id='instructions'
              name='instructions'
              value={shipmentDetails.instructions}
              className="p-3 border border-gray-300 rounded w-full"
              placeholder="Shipment Instructions"
              onChange={(e) => handleInputChange(e, setShipmentDetails)}
            />
          </div>
          {/* <div className="md:w-1/2 px-2 mb-4 w-full">
            <input
              type="text"
              id="description"
              name="description"
              className="p-3 border border-gray-300 rounded w-full"
              placeholder="PLACEHOLDER1"
              onChange={(e) => handleInputChange(e, setShipmentDetails)}
            />
          </div>
          <div className="md:w-1/2 px-2 mb-4 w-full">
            <input
              type="text"
              id="description"
              name="description"
              className="p-3 border border-gray-300 rounded w-full"
              placeholder="PLACEHOLDER2"
              onChange={(e) => handleInputChange(e, setShipmentDetails)}
            />
          </div>
          <div className="md:w-1/2 px-2 mb-4 w-full">
            <input
              type="text"
              id="description"
              name="description"
              className="p-3 border border-gray-300 rounded w-full"
              placeholder="PLACEHOLDER3"
              onChange={(e) => handleInputChange(e, setShipmentDetails)}
            />
          </div> */}
          <div className='md:w-1/2 px-2 mb-4 w-full'>
            <label htmlFor="shipment_mode" className="block text-blue font-semibold">Shipment Mode</label>
            <select
              className="p-3 border border-gray-300 rounded w-full"
              name='shipment_mode'
              value={shipmentDetails.shipment_mode}
              onChange={(e) =>
                handleInputChange(
                  e,
                  setShipmentDetails
                )
              }
            >
              <option value="EXPORT">EXPORT</option>
              <option value="IMPORT">IMPORT</option>
            </select>
          </div>



          <div className='w-full grid grid-cols-2'>
            <div className="px-2 mb-4 w-full">
              <label htmlFor="gross_weight" className="block text-blue font-semibold">Shipment Gross Weight</label>
              <input
                type="text"
                id='gross_weight'
                name="gross_weight"
                value={shipmentDetails.gross_weight}
                className="p-3 border border-gray-300 rounded w-full"
                placeholder="Shipment Gross Weight"
                onChange={(e) => handleInputChange(e, setShipmentDetails)}
              />
            </div>


            <div className="px-2 mb-4 w-full">
              <label htmlFor="chargeable_weight" className="block text-blue font-semibold">Shipment Chargeable Weight</label>
              <input
                type="text"
                name="chargeable_weight"
                value={shipmentDetails.chargeable_weight}
                className="p-3 border border-gray-300 rounded w-full"
                placeholder="Shipment Chargeable Weight"
                onChange={(e) => handleInputChange(e, setShipmentDetails)}
              />
            </div>


          </div>


          <div className='w-full grid'>

            <div className='px-2 mb-4 w-full'>
              <button
                className="bg-blue text-white py-2 px-4 rounded w-full"
                onClick={addDimension}

              >
                Add Shipment Dimension
              </button>
            </div>

            {shipmentDetails.dimensions.map((item, index) => (
              <div className='px-2 mb-4 w-full flex items-center space-x-5' key={index}>
                <span className="text-gray-700 font-medium">{index + 1}.</span>
                <input
                  type="text"
                  name="dimension"
                  value={item}
                  className="p-3 border border-gray-300 rounded w-full"
                  placeholder="Add Shipment Dimension"
                  onChange={(e) => handleDimensionChange(e, index)}
                />
                <i
                  className="fa-solid fa-xmark text-red cursor-pointer px-5"
                  onClick={() => handleDeleteDimension(index)}
                />
              </div>
            ))}
          </div>

          <div className='grid grid-cols-2 w-full'>
            <div className="px-2 mb-4">
              <label 
                htmlFor="etd"
                className="block text-blue font-semibold"
              >ETD</label>
              <input
                type="date"
                id='etd'
                name="etd"
                value={shipmentDetails.etd}
                className="p-3 border border-gray-300 rounded w-full"
                placeholder="Shipment Total Weight"
                onChange={(e) => handleInputChange(e, setShipmentDetails)}
              />
            </div>

            <div className="px-2 mb-4">
              <label 
                htmlFor="eta"
                className="block text-blue font-semibold"
                
              >ETA</label>
              <input
                type="date"
                id='eta'
                name="eta"
                value={shipmentDetails.eta}
                className="p-3 border border-gray-300 rounded w-full"
                placeholder="Shipment ETA"
                onChange={(e) => handleInputChange(e, setShipmentDetails)}
              />
            </div>
          </div>

        </div>

      );
    }



    if (currentStep === 4)
      return (
        
          <div className="flex flex-col space-y-5">

            {/* SHIPPER CONFIRMATION */}
            <div className="">
              <h4 className="text-blue text-lg font-semibold mb-2">Shipper Details</h4>
              <div className="overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Key</th>
                      <th className="border border-gray-300 px-4 py-2 w-full">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 w-auto">Name</th>
                      <td className="border border-gray-300 px-4 py-2">{shipperDetails.name}</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Email</th>
                      <td className="border border-gray-300 px-4 py-2">{shipperDetails.email}</td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Unit</th>
                      <td className="border border-gray-300 px-4 py-2">{shipperDetails.unit}</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">City</th>
                      <td className="border border-gray-300 px-4 py-2">{shipperDetails.city}</td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Street</th>
                      <td className="border border-gray-300 px-4 py-2">{shipperDetails.street}</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Country</th>
                      <td className="border border-gray-300 px-4 py-2">{shipperDetails.country}</td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-nowrap">Phone Number</th>
                      <td className="border border-gray-300 px-4 py-2">{shipperDetails.phone}</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Building</th>
                      <td className="border border-gray-300 px-4 py-2">{shipperDetails.building}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          {/* RECEIVER CONFIRMATION */}
          <div className="">
              <h4 className="text-blue text-lg font-semibold mb-2">Receiver Details</h4>
              <div className="overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Key</th>
                      <th className="border border-gray-300 px-4 py-2 w-full">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <td className="border border-gray-300 px-4 py-2">{receiverDetails.name}</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 w-auto">Email</th>
                      <td className="border border-gray-300 px-4 py-2">{receiverDetails.email}</td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Unit</th>
                      <td className="border border-gray-300 px-4 py-2">{receiverDetails.unit}</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">City</th>
                      <td className="border border-gray-300 px-4 py-2">{receiverDetails.city}</td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Street</th>
                      <td className="border border-gray-300 px-4 py-2">{receiverDetails.street}</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Country</th>
                      <td className="border border-gray-300 px-4 py-2">{receiverDetails.country}</td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Phone Number</th>
                      <td className="border border-gray-300 px-4 py-2">{receiverDetails.phone}</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Building</th>
                      <td className="border border-gray-300 px-4 py-2">{receiverDetails.building}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
          </div>

          {/* SHIPMENT CONFIRMATION */}
          <div className="">
              <h4 className="text-blue text-lg font-semibold mb-2">Shipment Details</h4>
              <div className="overflow-x-auto w-full">
                <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Key</th>
                      <th className="border border-gray-300 px-4 py-2 w-full">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Type</th>
                      <td className="border border-gray-300 px-4 py-2">{shipmentDetails.type}</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 w-auto">Mode</th>
                      <td className="border border-gray-300 px-4 py-2">{shipmentDetails.shipment_mode}</td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Description</th>
                      <td className="border border-gray-300 px-4 py-2">{shipmentDetails.description}</td>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Instruction</th>
                      <td className="border border-gray-300 px-4 py-2">{shipmentDetails.instructions}</td>
                    </tr>
                    {
                    shipmentDetails.type === "AIR" && 
                    <>
                      <tr>
                        <th className="border border-gray-300 px-4 py-2">Dimension</th>
                        <td className="border border-gray-300 px-4 py-2">
                          <ol className="list-decimal pl-5">
                            {shipmentDetails.dimensions.map((dimension, index) => (
                              <li key={index}>{dimension}</li>
                            ))}
                          </ol>                       
                        </td>
                      </tr>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Gross Weight</th>
                        <td className="border border-gray-300 px-4 py-2">{shipmentDetails.gross_weight}</td>
                      </tr>
                      <tr>
                        <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Chargeable Weight</th>
                        <td className="border border-gray-300 px-4 py-2">{shipmentDetails.chargeable_weight}</td>
                      </tr>
                    </>
                    }

                    {
                    shipmentDetails.type === "SEA" && 
                    <>
                      <tr>
                        <th className="border border-gray-300 px-4 py-2">Terms</th>
                        <td className="border border-gray-300 px-4 py-2">{shipmentDetails.terms}</td>
                      </tr>
                      {
                        shipmentDetails.terms === "FCL" &&
                        <>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">Container</th>
                            <td className="border border-gray-300 px-4 py-2">
                              <ol className="list-decimal pl-5">
                                {shipmentDetails.containers.map((container, index) => (
                                  <li key={index}>{container}</li>
                                ))}
                              </ol>
                            </td>
                          </tr>
                          <tr>
                            <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Total Weight</th>
                            <td className="border border-gray-300 px-4 py-2">{shipmentDetails.total_weight}</td>
                          </tr>
                        </>
                      }
                      {
                        shipmentDetails.terms === "LCL" &&
                        <>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">Packages</th>
                            <td className="border border-gray-300 px-4 py-2">{shipmentDetails.packages}</td>
                          </tr>
                          <tr>
                            <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Gross Weight</th>
                            <td className="border border-gray-300 px-4 py-2">{shipmentDetails.gross_weight}</td>
                          </tr>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Total Volume</th>
                            <td className="border border-gray-300 px-4 py-2">{shipmentDetails.volume}</td>
                          </tr>
                        </>
                      }
                    </>
                    }

                    
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">ETD</th>
                      <td className="border border-gray-300 px-4 py-2">{shipmentDetails.etd}</td>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">ETA</th>
                      <td className="border border-gray-300 px-4 py-2">{shipmentDetails.eta}</td>
                    </tr>
                    
                    
                  </tbody>
                </table>
              </div>
          </div>
        </div>
      );


    const currentDetails =
      currentStep === 1
        ? shipperDetails
        : currentStep === 2
          ? receiverDetails
          : shipmentDetails;
    const currentErrors =
      currentStep === 1
        ? errors.shipperDetails
        : currentStep === 2
          ? errors.receiverDetails
          : errors.shipmentDetails;

    return (
      <div className="flex flex-wrap -mx-2">
        {Object.keys(currentDetails).map((key) => (
          <div key={key} className="md:w-1/2 px-2 mb-4 w-full">
            {
              key === 'terms' ?
                (
                  <div>
                    <label htmlFor="terms" className="block text-blue font-semibold">Shipment Terms</label>
                    <select
                      id="terms"
                      name="terms"
                      className="p-3 border border-gray-300 rounded w-full"
                      value={shipmentDetails.terms}
                      onChange={(e) =>
                        handleInputChange(e, setShipmentDetails)
                      }
                    >
                      <option value="FCL">FCL</option>
                      <option value="LCL">LCL</option>
                    </select>
                    {currentErrors[key] && (
                      <p className="text-red-500 text-sm mt-1">{currentErrors[key]}</p>
                    )}
                  </div>
                )

                :
                key === 'shipment_mode' ?
                  (
                    <div>
                      <label htmlFor="shipment_mode" className="block text-blue font-semibold">Shipment Mode</label>
                      <select
                        id="shipment_mode"
                        name="shipment_mode"
                        className="p-3 border border-gray-300 rounded w-full"
                        value={shipmentDetails.shipment_mode}
                        onChange={(e) => handleInputChange(e,setShipmentDetails)}
                      >
                        <option value="EXPORT">EXPORT</option>
                        <option value="IMPORT">IMPORT</option>
                      </select>
                      {currentErrors[key] && (
                        <p className="text-red-500 text-sm mt-1">{currentErrors[key]}</p>
                      )}
                    </div>
                  )
                  :
                  key === 'eta' || key === 'etd' ?
                    (
                      <div>
                        <label htmlFor={key} className="block text-blue font-semibold">{key.toUpperCase()}</label>
                        <input
                          type="date"
                          id={key}
                          name={key}
                          className="p-3 border border-gray-300 rounded w-full"
                          value={shipmentDetails[key]}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              
                              setShipmentDetails
                            )
                          }
                        />
                        {currentErrors[key] && (
                          <p className="text-red-500 text-sm mt-1">{currentErrors[key]}</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <input
                          type={
                            key.includes("email")
                              ? "email"
                              : key.includes("phone")
                                ? "tel"
                                : "text"
                          }
                          placeholder={`${currentStep === 1
                              ? "Shipper"
                              : currentStep === 2
                                ? "Receiver"
                                : "Shipment"
                            } ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                          name={key}
                          className="p-3 border border-gray-300 rounded w-full"
                          value={currentDetails[key]}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              // currentStep === 1
                              //   ? "shipperDetails"
                              //   : currentStep === 2
                              //     ? "receiverDetails"
                              //     : "shipmentDetails",
                              currentStep === 1
                                ? setShipperDetails
                                : currentStep === 2
                                  ? setReceiverDetails
                                  : setShipmentDetails
                            )
                          }
                        />
                        {currentErrors[key] && (
                          <p className="text-red-500 text-sm mt-1">{currentErrors[key]}</p>
                        )}
                      </div>
                    )
            }
          </div>


        ))}
      </div>
    );
  };

  // const [isSubmitting, setIsSubmitting] = useState(false);
  const submitShipmentToBackend = async () => {
    try {

      console.log("ETA:", shipmentDetails.eta);
      console.log("ETD:", shipmentDetails.etd);
      const response = await fetch('http://localhost:5000/api/create-shipment/create-shipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          created_by,
          shipperDetails,
          receiverDetails,
          shipmentDetails,
          eta: shipmentDetails.eta,  // Ensure these are properly set
          etd: shipmentDetails.etd,

        }),
      });

      const result = await response.json();
      //Hello

      if (response.ok) {
        toast.success('Shipment created successfully!', { position: 'top-right' });
        console.log(result);
      } else {
        toast.error('Error creating shipment: ' + result.message, { position: 'top-right' });
      }
    } catch (error) {
      toast.error('Error creating shipment: ' + error.message, { position: 'top-right' });
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitShipmentToBackend();
  };
  const renderStepper = () => (
    <div className="relative flex justify-between mb-6">
      {/* Progress Line (Blue and Gray) */}
      <div className="absolute top-[25%] left-0 right-0 mx-auto w-[80%] h-[3px] bg-gray-300 z-0">
        <div
          className="absolute top-0 left-0 h-[3px] bg-[#11487C] z-0 transition-all duration-300"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        ></div>
      </div>

      {/* Step Indicators */}
      {steps.map((step, index) => (
        <div
          key={index}
          className={`relative flex-1 text-center ${currentStep === index
              ? "text-blue font-semibold"
              : "text-gray-500"
            }`}
        >
          {/* Step Circle */}
          <div
            className={`rounded-full border-2 w-8 h-8 flex items-center justify-center mx-auto ${currentStep >= index ? "bg-blue text-white" : "bg-white text-gray-500"
              }`}
          >
            {index + 1}
          </div>
          {/* Step Title */}
          <p className="text-sm mt-2">{step.title}</p>
        </div>
      ))}
    </div>
  );


  return (
    <section
      id="create-shipment"
      className="flex flex-col justify-center p-0 font-poppins"
    >
      <div className="flex flex-col justify-center bg-gray-200 min-h-[100vh] p-6 items-center">
        <div className="flex flex-col justify-center mb-4">
          <h1 className="text-blue text-center text-4xl font-semibold">
            Create Shipment
          </h1>
          <p className="text-blue text-center text-sm font-normal">
            Create Your Shipments Here
          </p>
        </div>
        <div className="w-full sm:w-full md:w-full lg:w-[70%] bg-white shadow-lg p-6">
          {renderStepper()}
          <form onSubmit={handleSubmit}>
            <div className="text-center py-4">
              {steps && (
                <>
                  <h2 className="text-blue text-xl font-semibold">
                    {steps[currentStep + 0].title}
                  </h2>
                  <p className="text-sm">
                    {steps[currentStep + 0].description}
                  </p>
                </>
              )}
            </div>
            {renderFormFields()}
            <div className="flex justify-between mt-6">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Back
                </button>
              )}

              {currentStep > 0 &&
                currentStep < 4 && ( // Hide "Next" button on Step 1 (currentStep === 0)
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue text-white py-2 px-4 rounded"
                  >
                    Step {currentStep + 1} of 5
                  </button>
                )}

              {currentStep === 4 && ( // Show "Submit" button only on Step 5 (last step)
                <button
                  type="submit"
                  className="bg-blue text-white py-2 px-4 rounded"
                >
                  Submit
                </button>
              )}


            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default CreateShipment;
