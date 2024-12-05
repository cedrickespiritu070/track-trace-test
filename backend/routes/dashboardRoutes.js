// backend/routes/dashboardRoutes.js

const express = require("express");
const { getDashboardData } = require("../controllers/dashboardController");
const router = express.Router();

router.get("/dashboard/:userId", getDashboardData); // Pass userId as parameter

module.exports = router;
