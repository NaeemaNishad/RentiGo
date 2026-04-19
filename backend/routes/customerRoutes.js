const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// This handles: POST http://localhost:3000/api/customers/signup
router.post("/signup", customerController.signup);

// This handles: POST http://localhost:3000/api/customers/login
router.post("/login", customerController.login);

module.exports = router;