const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Import user routes for authentication
const shipmentRoute = require('./routes/shipmentRoutes'); // Import user routes for authentication
const superadminRoutes = require('./routes/superadminRoutes');
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");


const cookieParser = require('cookie-parser');

require('dotenv').config();


const app = express();
const PORT = Number(process.env.PORT);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all common HTTP methods
  allowedHeaders: [
    "Content-Type",
    'Authorization',
    'Cache-Control',
    'Expires',
    'Pragma'
  ],
  credentials: true, // Allow cookies and credentials if you're using them
}));

app.use(cookieParser());
app.use(express.json()); // Built-in express JSON parser (no need for bodyParser)
app.use(bodyParser.json()); // Optional, but this won't hurt

// Routes
app.use('/api/auth', userRoutes); // Use the user routes for authentication
app.use('/api/create-shipment', shipmentRoute); // Use the user routes for authentication
app.use('/api/superadmin', superadminRoutes);
app.use("/api/dashboard", dashboardRoutes); // Use the dashboard routes
app.use("/api/upload", uploadRoutes);

app.use('/api/admin', adminRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
