import React from "react";

const ProcessStepper = ({ shipment }) => {
  // Define the steps and their corresponding status
  const steps = [
    { label: "Order Placed", isActive: shipment.currentstep >= 1 },
    { label: "In Warehouse", isActive: shipment.currentstep >= 2 },
    { label: "Departure at Origin", isActive: shipment.currentstep >= 3 },
    { label: "In Transit", isActive: shipment.currentstep >= 4 },
    { label: "Arrival at Destination", isActive: shipment.currentstep >= 5 },
    { label: "Custom Clearance", isActive: shipment.currentstep >= 6 },
    { label: "Delivered", isActive: shipment.currentstep >= 7 },
  ];

  // Extract the date for each step from the remarks
  const getStepDate = (stepLabel) => {
    const remark = shipment.remarks.find((remark) => remark.status === stepLabel);
    return remark ? remark.date : null; // Return the date or null if not found
  };
  const getStepRemark = (stepLabel) => {
    const remark = shipment.remarks.find((remark) => remark.status === stepLabel);
    return remark ? remark.remark : null; // Return the remark or null if not found
  };

  // Calculate the height for the fill line based on the current step progress
  const fillHeight =
    shipment.currentstep === 1
      ? 0
      : ((shipment.currentstep - 1) / (steps.length - 1)) * 100;
      function formatDateTime(dateString) {
        if (!dateString) return "N/A";
      
        const date = new Date(dateString);
      
        // Check if the date is valid
        if (isNaN(date)) return "Invalid Date";
      
        return new Intl.DateTimeFormat("en-US", {
          year: "2-digit",     // Two-digit year (e.g., 24)
          month: "numeric",    // Numeric month (e.g., 12)
          day: "numeric",      // Numeric day (e.g., 2)
          hour: "numeric",     // Hour with AM/PM (e.g., 3 PM)
          minute: "numeric",   // Minutes (e.g., 30)
          second: "numeric",   // Seconds (e.g., 45)
          hour12: true,        // 12-hour clock format
        }).format(date);
      }
      
      

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full w-full">
      <h2 className="text-blue-600 text-center text-2xl text-blue font-semibold mb-4">
        Shipment Overview
      </h2>

      <div className="flex items-center flex-wrap justify-between bg-gray-100 p-4 rounded-md mb-6">
        <div>
          <div className="text-[10px] sm:text-sm font-bold text-blue">
            {shipment.shipment_id}
          </div>
          <div className="text-[10px] sm:text-sm text-blue">
            {shipment.shipper_name}
          </div>
        </div>
        <div className="bg-blue-200 text-yellow text-[10px] sm:text-[10px] sm:text-sm px-3 py-1 bg-blue rounded-full">
          {shipment.status}
        </div>
      </div>

      <div className="h-96 overflow-y-auto">
        {/* Stepper */}
        <div className="relative flex flex-col ml-0 h-full justify-between">
          {/* Progress Background Line */}
          <div className="absolute left-[15px] h-full w-1 bg-gray-300 z-0"></div>
          {/* Progress Fill Line */}
          <div
            className="absolute left-[15px] w-1 bg-[#11487C] z-0 transition-all duration-300"
            style={{ height: `${fillHeight}%` }}
          ></div>

          {steps.map((step, index) => {
            const stepDate = getStepDate(step.label); // Define stepDate here
            const stepRemark = getStepRemark(step.label); // Define stepRemark here
            return (
              <div key={index} className="relative flex items-center">
                {/* Icon */}
                <div
                  className={`flex items-center justify-center py-4 w-10 h-6 rounded-full border-2 ${
                    step.isActive
                      ? "border-yellow bg-blue"
                      : "border-gray-400 bg-gray-100"
                  }`}
                >
                  {step.isActive ? (
                    <i className="fas fa-check text-white text-xs"></i>
                  ) : (
                    <i className="fas fa-circle text-gray-400 text-xs"></i>
                  )}
                </div>

                {/* Step Information */}
                <div className="flex ml-0 flex-col xl:flex-row lg:ml-4 justify-between items-center space-x-0 w-full">
                  <div className="font-semibold text-blue">{step.label}</div>
                  <div className="text-[10px] sm:text-sm text-blue">
                    {step.location}
                  </div>
                  <div className="text-[10px] sm:text-sm text-blue">
                    {stepDate ? new Intl.DateTimeFormat("en-US", {
                      month: 'long',
                      day: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true, // AM/PM format  // 12-hour clock format
                    }).format(new Date(stepDate)) : "N/A"}
                  </div>
                </div>
              </div>
              
            );
          })}
        </div>
        <div className="remarks-container"></div>
      </div>
    </div>
  );
};

export default ProcessStepper;
