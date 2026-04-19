const db = require("../db");

exports.getVehicles = (req, res) => {
  db.query("SELECT * FROM vehicles", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};