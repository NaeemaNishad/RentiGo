const db = require("../db");

exports.signup = (req, res) => {
  const { name, phone, license_no, password } = req.body;

  // 1. Generate the next ID by counting existing rows
  db.query("SELECT COUNT(*) AS count FROM customers", (err, rows) => {
    if (err) return res.status(500).json({ message: "ID generation failed" });

    const nextIdNumber = rows[0].count + 1;
    const customId = `cust_${nextIdNumber}`; // Creates "cust_1"

    // 2. Insert with the string ID
    const sql = "INSERT INTO customers (customer_id, name, phone, license_no, password) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [customId, name, phone, license_no, password], (insertErr) => {
      if (insertErr) {
        console.error(insertErr);
        return res.status(500).json({ message: "Registration failed" });
      }
      
      res.status(201).json({ 
        user: { customer_id: customId, name, phone, license_no } 
      });
    });
  });
};

exports.login = (req, res) => {
  // Use 'customer_id' as a string (e.g., "cust_1")
  const { customer_id, password } = req.body;
  const sql = "SELECT * FROM customers WHERE customer_id=? AND password=?";

  db.query(sql, [customer_id, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result.length > 0) {
      res.json({ success: true, user: result[0] });
    } else {
      res.status(401).json({ message: "Invalid ID or Password" });
    }
  });
};