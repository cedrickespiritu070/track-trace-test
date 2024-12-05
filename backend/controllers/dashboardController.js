// backend/controllers/dashboardController.js
const supabase = require('../config/supabase');

// Function to get the dashboard data for the user
exports.getDashboardData = async (req, res) => {
  const { userId } = req.params; // Get the userId from the request parameters

  try {
    // Fetch the total shipment count for the user
    const { data: shipmentData, error: shipmentError } = await supabase
      .from("users")
      .select("shipment_count")
      .eq("user_id", userId)
      .single();

    if (shipmentError) {
      return res.status(500).json({ error: "Error fetching shipment count" });
    }

    const shipmentCount = shipmentData.shipment_count;

    // Fetch count of upcoming shipments with status "Order Placed"
    const { data: upcomingShipments, error: upcomingShipmentsError } =
      await supabase
        .from("shipments")
        .select("user_id")
        .eq("status", "Order Placed")
        .eq("user_id", userId);

    if (upcomingShipmentsError) {
      return res.status(500).json({ error: "Error fetching upcoming shipments" });
    }

    const upcomingShipmentsCount = upcomingShipments.length;

    // Fetch count of active shipments with multiple statuses
    const { data: activeShipments, error: activeShipmentsError } =
      await supabase
        .from("shipments")
        .select("user_id")
        .in("status", [
          "In Warehouse",
          "Depart at Origin",
          "In Transit",
          "Arrived at Destination",
          "Custom Clearance",
        ])
        .eq("user_id", userId);

    if (activeShipmentsError) {
      return res.status(500).json({ error: "Error fetching active shipments" });
    }

    const activeShipmentsCount = activeShipments.length;


    // Fetch count of completed shipments with multiple statuses
    const { data: completedShipments, error: completedShipmentsError } =
      await supabase
        .from("shipments")
        .select("user_id")
        .in("status", [
         "Delivered"
        ])
        .eq("user_id", userId);

    if (completedShipmentsError) {
      return res.status(500).json({ error: "Error fetching Completed shipments" });
    }

    const completedShipmentsCount = completedShipments.length;

    

    // Fetch all shipments data for graph
    const { data: shipments, error } = await supabase
      .from("shipments")
      .select("date, status");

    if (error) {
      return res.status(500).json({ error: "Error fetching shipment data" });
    }

    // Process the shipment data for graph (summary for Today, This Week, This Month, This Year)
    const summary = filterShipmentsByDate(shipments);

    const graphData = [
      { timeframe: "Today", ...summary.today },
      { timeframe: "This Week", ...summary.thisWeek },
      { timeframe: "This Month", ...summary.thisMonth },
      { timeframe: "This Year", ...summary.thisYear },
    ];

    // Return the dashboard data
    return res.json({
      shipmentCount,
      upcomingShipmentsCount,
      activeShipmentsCount,
      completedShipmentsCount,
      graphData,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).send("Server error");
  }
};

// Helper function to filter and summarize shipment data by date
const filterShipmentsByDate = (shipments) => {
  const now = require("dayjs")();
  const result = {
    today: { active: 0, upcoming: 0, total: 0 },
    thisWeek: { active: 0, upcoming: 0, total: 0 },
    thisMonth: { active: 0, upcoming: 0, total: 0 },
    thisYear: { active: 0, upcoming: 0, total: 0 },
  };

  shipments.forEach((shipment) => {
    const shipmentDate = require("dayjs")(shipment.date);

    const isToday = shipmentDate.isSame(now, "day");
    const isThisWeek = shipmentDate.isSame(now, "week");
    const isThisMonth = shipmentDate.isSame(now, "month");
    const isThisYear = shipmentDate.isSame(now, "year");

    const increment = (period) => {
      result[period].total += 1;

      if (["Order Placed"].includes(shipment.status)) {
        result[period].upcoming += 1;
      } else if (
        ["In Warehouse", "Depart at Origin", "In Transit", "Arrived at Destination", "Custom Clearance"].includes(
          shipment.status
        )
      ) {
        result[period].active += 1;
      }
    };

    if (isToday) increment("today");
    if (isThisWeek) increment("thisWeek");
    if (isThisMonth) increment("thisMonth");
    if (isThisYear) increment("thisYear");
  });

  return result;
};
