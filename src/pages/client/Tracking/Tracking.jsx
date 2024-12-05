import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../../supabaseClient";
import "../../../assets/css/shipment-trackercss.css";

const Tracking = () => {
  const { trackingNumber: paramTrackingNumber } = useParams();
  const [trackingNumber, setTrackingNumber] = useState(
    paramTrackingNumber || ""
  );
  const [trackingDetails, setTrackingDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);



  // Step descriptions mapping
  const stepDescriptions = [
    "Order Placed",
    "In Warehouse",
    "Departure at Origin",
    "In Transit",
    "Arrival at Destination",
    "Custom Clearance",
    "Delivered",
  ];

  // Function to fetch tracking details from Supabase
  const fetchTrackingDetails = async (number) => {
    try {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .eq("tracking_no", number)
        .single();

      if (error || !data) {
        console.error("Error fetching tracking details:", error);
        setTrackingDetails(null);
        setDocuments([]);
        setErrorMessage("Tracking number not found. Please check and try again.");
      } else {
        setTrackingDetails(data);

        // Parse document URLs if available
        if (data.document_urls) {
          const parsedDocs = Array.isArray(data.document_urls)
            ? data.document_urls
            : JSON.parse(data.document_urls); // Parse if stored as JSONB
          setDocuments(parsedDocs);
        } else {
          setDocuments([]);
        }

        setErrorMessage("");
      }
    } catch (err) {
      console.error("Error in fetchTrackingDetails:", err);
      setTrackingDetails(null);
      setDocuments([]);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };
  
  

  useEffect(() => {
    if (paramTrackingNumber) {
      fetchTrackingDetails(paramTrackingNumber);
    }
  }, [paramTrackingNumber]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (trackingNumber) {
      await fetchTrackingDetails(trackingNumber);
      navigate(`/tracking/${trackingNumber}`);
    } else {
      setErrorMessage("Please enter a tracking number.");
    }
  };
  const formatDate = (dateString) => {
    const options = {
      weekday: "short", // "Thurs"
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true, // "4:58 PM"
    };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
    return formattedDate.replace(",", " at"); // Replace comma with " at"
  };

  function formatDate2(date) {
    if (!date) return ''; // Handle null or undefined date
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Use 12-hour format with AM/PM
    }).format(new Date(date));
}

  const getStepIcon = (step) => {
    const icons = {
      1: "fas fa-store",
      2: "fas fa-warehouse",
      3: "fas fa-map-marker-alt",
      4:
        trackingDetails?.shipment_type === "AIR"
          ? "fas fa-plane"
          : trackingDetails?.shipment_type === "SEA"
          ? "fas fa-ship"
          : "fas fa-truck",
      5: "fas fa-flag",
      6: "fas fa-shield-alt",
      7: "fas fa-check",
    };
    return <i className={`${icons[step]} text-[26px]`} />;
  };

  const parseRemarks = () => {
    try {
      return trackingDetails?.remarks || [];
    } catch (error) {
      console.error("Error parsing remarks JSONB:", error);
      return [];
    }
  };

  return (
    <section
      id="tracking_status"
      className="flex flex-col items-center px-4 py-10 min-h-[90vh] max-w-screen-2xl mx-auto"
    >
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 py-5 gap-4">
        <h1 className="font-poppins text-blue text-center text-2xl md:text-4xl font-semibold">
          Order Tracking Page
        </h1>
        <form
          onSubmit={handleSearch}
          className="flex w-full md:max-w-md justify-center"
        >
          <input
            type="text"
            placeholder="Tracking No."
            className="border border-gray-300 p-2 flex-grow rounded-l-md focus:outline-none"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <button
            type="submit"
            className="flex items-center bg-[#d6d33c] p-2 px-5 rounded-r-md text-blue font-normal font-poppins hover:bg-yellow-600 focus:outline-none"
          >
            <i className="fas fa-search mr-2"></i>{" "}
            <span className="hidden md:block">Search</span>
          </button>
        </form>
      </div>

      <div className="w-full max-w-[90%] mx-auto mt-8">
        <h1 className="font-poppins text-3xl/[3rem] font-semibold text-blue text-center mb-4">
          Status:{" "}
          {trackingDetails?.remarks && trackingDetails.remarks.length > 0
            ? trackingDetails.remarks.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
              )[0]?.status || "N/A"
            : "No status available"}
          <br />
          {trackingDetails?.remarks && trackingDetails.remarks.length > 0
            ? `on ${
                new Intl.DateTimeFormat('en-US', {
                  month: 'long',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true, // Use 12-hour format with AM/PM
                }).format(
                  new Date(
                    trackingDetails.remarks
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      [0]?.date
                  )
                )
              }`
            : ""}

        </h1>
      </div>

      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}

      {trackingDetails && (
        <>
          <div className="flex flex-col md:flex-row justify-between bg-[#11487C] gap-4 shadow-lg rounded-xl px-4 md:px-8 lg:px-12 py-6 w-full max-w-[90%] mx-auto">
            {[
               {
                label: "Estimated Delivery Date",
                value: formatDate2(trackingDetails.expected_delivery_date),
            },
            {
                label: "Estimated Time of Departure",
                value: formatDate2(trackingDetails.etd),
            },
            {
                label: "Estimated Time of Arrival",
                value: formatDate2(trackingDetails.eta),
            },
            { label: "Shipment Type", value: trackingDetails.shipment_type },

            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-row justify-between md:flex-col text-center"
              >
                <h3 className="font-poppins text-yellow text-sm md:text-base lg:text-lg font-normal text-left md:text-center">
                  {label}
                </h3>
                <p className="font-poppins text-white text-sm md:text-base lg:text-lg font-normal text-right md:text-center">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col min-w-0 sm:min-w-[600px] sm:flex-row justify-center w-full max-w-[90%] mx-auto] mt-10">
            <div className="relative flex flex-col sm:flex-row items-center w-full stepper stepper-container">
              {/* Desktop Progress Line */}
              <div className="absolute top-[50%] sm:top-[25%] left-0 right-0 mx-auto w-[90%] h-2 bg-gray-300 z-0 line-desktop connecting-lines"></div>

              {/* Mobile Progress Line */}
              <div className="absolute top-[50%] sm:top-[30%] left-0 h-full w-1 bg-gray-300 z-0 line-mobile "></div>

              {/* Blue Progress Bar (Desktop and Mobile) */}
              <div className="absolute top-[50%] sm:top-[25%] left-0 right-0 mx-auto w-[90%] line-desktop connecting-lines">
                <div
                  className="absolute top-[100%] sm:top-[25%] left-0 h-2 bg-[#11487C] z-0 transition-all duration-300 line-desktop connecting-lines"
                  style={{
                    width: `${
                      trackingDetails.currentstep && stepDescriptions.length
                        ? ((trackingDetails.currentstep - 1) /
                            (stepDescriptions.length - 1)) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div
                className="absolute top-0 left-0 w-1 bg-[#11487C] z-0 transition-all duration-300 line-mobile"
                style={{
                  height: `${(trackingDetails.currentstep / 7) * 100}%`,
                }}
              ></div>

              {/* Steps */}
              {stepDescriptions.map((step, index) => {
                // Find the matching remark based on the step description
                const remarkDetail = trackingDetails.remarks?.find(
                  (remark) => remark.status === step
                );

                // Format the date and time if available
                const formattedDate = remarkDetail?.date
                  ? new Intl.DateTimeFormat("en-US", {
                      weekday: "short", // e.g., "Thurs"
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })
                      .format(new Date(remarkDetail.date))
                      .replace(",", " at") // Replace comma with "at"
                  : "No date available";

                return (
                  <div
                    key={index}
                    className="relative z-10 flex flex-row sm:flex-col items-center sm:w-1/4 my-4 sm:my-0 w-full"
                  >
                    <div className="flex flex-col justify-start">
                      <div
                        className={`blue-circle-stepper h-20 w-20 rounded-full border-4 flex items-center justify-center ${
                          index + 1 <= trackingDetails.currentstep
                            ? "bg-[#11487C] text-white border-[#11487C]"
                            : "bg-white text-gray-400 border-gray-300"
                        } transition duration-300`}
                      >
                        {getStepIcon(index + 1)}
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col mx-4 justify-between w-full">
                      <span className="mt-1 text-center text-xs font-poppins font-semibold text-gray-700">
                        {step}
                      </span>
                      <span className="mt-1 text-center text-xs font-poppins font-semibold text-gray-700 sm:hidden flex">
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <>
      {/* Display document download links */}
      <div className="w-full max-w-[90%] mx-auto mt-8">
        <h2 className="font-poppins text-xl font-semibold text-blue text-center mb-4">
          Documents
        </h2>
        {documents.length > 0 ? (
          <div className="flex flex-col items-center">
            {documents.map((doc, index) => (
              <div key={index} className="mb-4">
                <a
                  href={doc.url}
                  download
                  className="text-blue underline hover:underline cursor-pointer"
                >
                  {doc.title}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 text-center">No documents available for download.</p>
        )}
      </div>
    </>

          {/* Travel History Table */}
          <div className="w-full max-w-[90%] mx-auto mt-8">
      <h2 className="font-poppins text-xl font-semibold text-blue text-center mb-4">
        Travel History
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-[33.3%] px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Date Updated
              </th>
              <th className="w-[33.3%] px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="w-[33.3%] px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {parseRemarks()
              .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort in descending order
              .map((remark, index) => (
                <tr key={index}>
                  <td className="w-[33.3%] border px-4 py-2 text-sm text-gray-700">
                    {remark.date ? (
                      new Intl.DateTimeFormat('en-US', {
                        month: 'long',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true, // Show 12-hour format with AM/PM
                      }).format(new Date(remark.date))
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="w-[33.3%] border px-4 py-2 text-sm text-gray-700">
                    {remark.status || "No Status"}
                  </td>
                  <td className="w-[33.3%] border px-4 py-2 text-sm text-gray-700">
                    {remark.status === "Departure at Origin" ? (
                      <>
                        {remark.remark ? (
                          <span>{remark.remark}</span>
                        ) : (
                          "No remarks available"
                        )}
                        <br />
                        <strong>ATD: </strong>
                        {remark.atd
                          ? new Date(remark.atd).toLocaleString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })
                          : "Not set"}
                      </>
                    ) : remark.status === "Arrival at Destination" ? (
                      <>
                        {remark.remark ? (
                          <span>{remark.remark}</span>
                        ) : (
                          "No remarks available"
                        )}
                        <br />
                        <strong>ATA: </strong>
                        {remark.aad
                          ? new Date(remark.aad).toLocaleString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })
                          : "Not set"}
                      </>
                    ) : remark.status === "In Transit" ? (
                      <>
                        {remark.remark ? (
                          <span>{remark.remark}</span>
                        ) : (
                          "No remarks available"
                        )}
                        <br />
                        <strong>Transit Type: </strong>
                        {remark.transitType || "Not set"}
                        <br />
                        <strong>Transit Date: </strong>
                        {remark.transitDate && new Date(remark.transitDate).getTime() !== 0
                          ? new Date(remark.transitDate).toLocaleString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })
                          : "Not set"}
                      </>
                    ) : (
                      // Default case for remarks that are neither "Depart at Origin," "Arrived at Destination," nor "In Transit"
                      remark.remark || "No remarks available"
                    )}
                  </td>
                </tr>
              ))}
            {parseRemarks().length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="border px-4 py-2 text-center text-sm text-gray-700"
                >
                  No travel history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
        </>
      )}
    </section>
  );
};

export default Tracking;
