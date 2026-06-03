require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db");

// 1. CORS Configuration
// This allows your frontend (port 5173) to talk to this backend
app.use(cors({
  origin: ["http://localhost:5173", "https://tourmaline-sorbet-fe482d.netlify.app"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 2. Middleware
app.use(express.json());

// 3. Health Check Routes
// Test this in browser: http://localhost:3000/api/test
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is reachable!" });
});

// Test database: http://localhost:3000/api/health
app.get("/api/health", (req, res) => {
  db.query("SELECT 1", (err) => {
    if (err) {
      return res.status(500).json({ status: "Database Offline", error: err.message });
    }
    res.json({ status: "Server & Database Online" });
  });
});

// 4. API Routes
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));

// 5. Global Error Handler
// Catch-all for any server errors so the app doesn't just hang
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

// 6. Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`----------------------------------------`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Health Check: http://localhost:${PORT}/api/health`);
  console.log(`----------------------------------------`);
});