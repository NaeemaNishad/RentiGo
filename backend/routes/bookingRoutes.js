const express = require("express");
const router = express.Router();
const db = require("../db");

// 1️⃣ ROUTE: CONFIRM BOOKING (POST)
router.post("/", (req, res) => {
  const { customer_id, vehicle_id, rental_date, return_date, total_price } = req.body;

  // Generate the BID_X ID by counting current rows
  db.query("SELECT COUNT(*) AS count FROM bookings", (err, rows) => {
    if (err) return res.status(500).json({ error: "ID generation failed" });

    const nextId = rows[0].count + 1;
    const customBookingId = `BID_${nextId}`;

    db.beginTransaction((tErr) => {
      if (tErr) return res.status(500).json({ error: "Transaction failed" });

      // Insert the booking
      const sqlInsert = `INSERT INTO bookings 
        (booking_id, customer_id, vehicle_id, rental_date, return_date, total_price, status) 
        VALUES (?, ?, ?, ?, ?, ?, 'Confirmed')`;

      db.query(sqlInsert, [customBookingId, customer_id, vehicle_id, rental_date, return_date, total_price], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.sqlMessage }));

        // Update vehicle availability to 0 (Unavailable)
        db.query("UPDATE vehicles SET availability = 0 WHERE vehicle_id = ?", [vehicle_id], (vErr) => {
          if (vErr) return db.rollback(() => res.status(500).json({ error: "Vehicle update failed" }));

          db.commit((cErr) => {
            if (cErr) return db.rollback(() => res.status(500).json({ error: "Commit failed" }));
            res.status(201).json({ message: "Booking successful", bookingId: customBookingId });
          });
        });
      });
    });
  });
});

// 2️⃣ ROUTE: GET USER BOOKINGS (GET)
router.get("/:customer_id", (req, res) => {
  const { customer_id } = req.params;
  const sql = "SELECT * FROM bookings WHERE customer_id = ?";

  db.query(sql, [customer_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(Array.isArray(result) ? result : []);
  });
});

// 3️⃣ ROUTE: CANCEL BOOKING (PUT)
router.put("/cancel/:booking_id", (req, res) => {
  const { booking_id } = req.params;
  const { vehicle_id } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Transaction failed" });

    // Update status to Cancelled
    const sqlCancel = "UPDATE bookings SET status = 'Cancelled' WHERE booking_id = ?";
    db.query(sqlCancel, [booking_id], (err, result) => {
      if (err || result.affectedRows === 0) {
        return db.rollback(() => res.status(500).json({ error: "Booking not found" }));
      }

      // Restore vehicle availability to 1 (Available)
      db.query("UPDATE vehicles SET availability = 1 WHERE vehicle_id = ?", [vehicle_id], (vErr) => {
        if (vErr) return db.rollback(() => res.status(500).json({ error: "Vehicle restore failed" }));

        db.commit((cErr) => {
          if (cErr) return db.rollback(() => res.status(500).json({ error: "Commit failed" }));
          res.json({ message: "Booking cancelled successfully" });
        });
      });
    });
  });
});

module.exports = router;