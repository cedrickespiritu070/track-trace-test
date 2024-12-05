const supabase = require('../config/supabase');

const generateTrackingNumber = (shipmentType, shipmentMode) => {
  const length = 8; // Length of the unique part of the tracking number
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let uniqueKey = '';

  for (let i = 0; i < length; i++) {
    uniqueKey += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const shipmentInitial = shipmentType.charAt(0).toUpperCase();
  const shipmentModeInitial = shipmentMode.charAt(0).toUpperCase();

  return `${shipmentInitial}${shipmentModeInitial}${uniqueKey}`;
};

const createShipment = async (req, res) => {
  const {
    user_id,
    created_by,
    shipperDetails = {}, // Default to an empty object
    receiverDetails = {}, // Default to an empty object
    shipmentDetails = {}, // Default to an empty object
    eta, // Expected Arrival Date
    etd, // Expected Departure Date
  } = req.body;

  try {
    const tracking_no = generateTrackingNumber(
      shipmentDetails.type || "U", // Default to "U" for unknown type
      shipmentDetails.shipment_mode || "U" // Default to "U" for unknown mode
    );

    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 30);
    const expectedDeliveryDateString = expectedDeliveryDate.toISOString().split("T")[0];

    const etaDate = eta ? new Date(eta).toISOString().split("T")[0] : null;
    const etdDate = etd ? new Date(etd).toISOString().split("T")[0] : null;

    // Prepare remarks
    const remarks = [
      {
        date: new Date().toISOString(),
        remark: null, // Initial remark is null
        status: "Order Placed",
      },
    ];

    // Insert shipment data
    const { data: shipmentData, error: shipmentError } = await supabase
      .from("shipments")
      .insert([
        {
          tracking_no,
          user_id,
          created_by,
          //SHIPPER
          shipper_name: shipperDetails.name || null,
          shipper_email: shipperDetails.email || null,
          shipper_country: shipperDetails.country || null,
          shipper_phone: shipperDetails.phone || null,
          shipper_city: shipperDetails.city || null,
          shipper_street: shipperDetails.street || null,
          shipper_building: shipperDetails.building || null,
          shipper_unit: shipperDetails.unit || null,

          //RECEIVER
          receiver_name: receiverDetails.name || null,
          receiver_email: receiverDetails.email || null,
          receiver_country: receiverDetails.country || null,
          receiver_phone: receiverDetails.phone || null,
          receiver_city: receiverDetails.city || null,
          receiver_street: receiverDetails.street || null,
          receiver_building: receiverDetails.building || null,
          receiver_unit: receiverDetails.unit || null,

          //SHIPMENT
          shipment_description: shipmentDetails.description || null,
          shipment_type: shipmentDetails.type || null,
          shipment_instructions: shipmentDetails.instructions || null,
          shipment_mode: shipmentDetails.shipment_mode || null,

          // sea
          shipment_terms: shipmentDetails.terms || null,
          //sea lcl
          shipment_packages: shipmentDetails.packages || null,
          shipment_volume: shipmentDetails.volume || null,
          //sea fcl
          shipment_containers: shipmentDetails.containers || null,
          shipment_weight: shipmentDetails.total_weight || null,

          //air
          shipment_dimensions: shipmentDetails.dimensions || null,
          shipment_chargeableweight: shipmentDetails.chargeable_weight || null, //air
          //sea lcl and air
          shipment_grossweight: shipmentDetails.gross_weight || null,


          //unused
          shipment_value: shipmentDetails.value || null,

          // other details
          status: "Order Placed",
          currentstep: 0,
          expected_delivery_date: expectedDeliveryDateString,
          eta: etaDate,
          etd: etdDate,
          remarks: remarks,
          status_updated_at: new Date().toISOString(),
          current_user_name: created_by,
        },
      ]);

    if (shipmentError) throw shipmentError;

    // Update shipment count for the user
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("shipment_count")
      .eq("user_id", user_id)
      .single();

    if (userError) throw userError;

    const currentShipmentCount = userData ? userData.shipment_count : 0;
    const { error: updateError } = await supabase
      .from("users")
      .update({ shipment_count: currentShipmentCount + 1 })
      .eq("user_id", user_id);

    if (updateError) throw updateError;

    // Update the current step for the shipment
    const { error: stepError } = await supabase
      .from("shipments")
      .update({ currentstep: 1 })
      .eq("tracking_no", tracking_no);

    if (stepError) throw stepError;

    // Send a notification
    const notificationMessage = `Shipment number: ${tracking_no} has been created.`;
    const { error: notificationError } = await supabase
      .from("notification")
      .insert([
        {
          user_id: user_id,
          user_name: created_by,
          message: notificationMessage,
          created_at: new Date().toISOString(),
          type: "shipment",
        },
      ]);

    if (notificationError) throw notificationError;

    res.status(200).json({ message: "Shipment created successfully!", shipmentData });
  } catch (error) {
    console.error("Error creating shipment:", error);
    res.status(500).json({ message: "Error creating shipment", error: error.message });
  }
};



module.exports = { createShipment };
