const express = require('express');
const { 
    fetchEmployees, 
    updateShipment, 
    
} = require('../controllers/activeShipment-controller');
const router = express.Router();


router.get('/employees', fetchEmployees);
router.put('/update-shipment', updateShipment)





module.exports = router;
