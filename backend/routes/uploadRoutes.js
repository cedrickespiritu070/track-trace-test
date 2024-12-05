const express = require("express");
const multer = require("multer");
const uploadController = require("../controllers/uploadController");

const router = express.Router();
const upload = multer(); // Using memory storage for Multer

// Define the route for /api/upload/
router.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    // Pass the request to the controller for processing
    await uploadController.uploadFile(req, res);
  } catch (error) {
    // Pass any error to the error-handling middleware
    next(error);
  }
});

module.exports = router;
