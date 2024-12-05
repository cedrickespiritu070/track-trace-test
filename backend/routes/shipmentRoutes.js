const express = require('express');
const router = express.Router();
const { createShipment } = require('../controllers/shipmentController');

// Route for creating shipment
router.post('/create-shipment', createShipment);

module.exports = router;
