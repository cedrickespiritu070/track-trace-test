const express = require('express');
const { 
    changePassword, 
    deleteUser,
    overallTotalShipments,
    activeShipments,
    activeEmployees,
    upcomingShipments,
    completedShipments
} = require('../controllers/superadmin-controller');
const router = express.Router();


router.post('/change-password', changePassword);
router.post('/delete-employee', deleteUser)
router.get('/overall-shipments', overallTotalShipments)
router.get('/active-shipments', activeShipments)
router.get('/upcoming-shipments', upcomingShipments)
router.get('/active-employees', activeEmployees)
router.get('/completed-shipments', completedShipments)

module.exports = router;