const db = require("../db");

exports.createBooking = (req, res) => {
  const { customer_id, vehicle_id, rental_date, return_date } = req.body;

  // Added logic to ensure IDs are treated as strings
  const sql = "INSERT INTO bookings (customer_id, vehicle_id, rental_date, return_date) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [customer_id, vehicle_id, rental_date, return_date],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Booking created successfully", bookingId: result.insertId });
    }
  );
};

exports.getBookings = (req, res) => {
  const { customer_id } = req.params;

  db.query(
    "SELECT * FROM bookings WHERE customer_id=?",
    [customer_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      // Always return an array, even if it is empty []
      res.json(Array.isArray(result) ? result : []);
    }
  );
};