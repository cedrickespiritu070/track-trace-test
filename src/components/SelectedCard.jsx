import React, { useState }from 'react'
import ShipmentTable from './ShipmentTable'
import UpcomingShipment from './UpcomingShipment'
import TotalShipment from './TotalShipment'
import CompletedShipment from './CompletedShipment'
import ProcessStepper from './ProcessStepper'

const SelectedCard = ({selectedCard}) => {
    const [searchTerm] = useState("");
    const [selectedShipment, setSelectedShipment] = useState(null);

  return (
    <div className="active-shipment-container grid grid-cols-1 lg:grid-cols-5 grid-rows-1 gap-4">
        <div className="active-table col-span-1 lg:col-span-3 row-span-1 p-3 bg-white shadow-md rounded-lg">
            <div className="active-table-container">
                {selectedCard === "active" && (
                <ShipmentTable
                    searchTerm={searchTerm}
                    onRowClick={(shipment) => setSelectedShipment(shipment)}
                    role={"superadmin"}
                    filterValue={"Everyone"}
                />
                )}
                {selectedCard === "upcoming" && (
                <UpcomingShipment
                    searchTerm={searchTerm}
                    onRowClick={(shipment) => setSelectedShipment(shipment)}
                    role={"superadmin"}
                    filterValue={"Everyone"}
                />
                )}
                {selectedCard === "total" && (
                <TotalShipment
                    searchTerm={searchTerm}
                    onRowClick={(shipment) => setSelectedShipment(shipment)}
                    role={"superadmin"}
                    filterValue={"Everyone"}
                />
                )}
                {selectedCard === "completed" && (
                <CompletedShipment
                    searchTerm={searchTerm}
                    onRowClick={(shipment) => setSelectedShipment(shipment)}
                    role={"superadmin"}
                    filterValue={"Everyone"}
                />
                )}
            </div>
        </div>

          {/* Process Stepper */}
        <div className="stepper-container col-span-1 lg:col-start-4 lg:col-end-6 row-span-1">
            <div className="bg-white w-full h-full shadow-md p-4 rounded-lg">
              {selectedShipment ? (
                <ProcessStepper shipment={selectedShipment} />
              ) : (
                <span className="text-gray-400">
                  Select a shipment to view the process.
                </span>
              )}
            </div>
        </div>
    </div>
  )
}

export default SelectedCard
