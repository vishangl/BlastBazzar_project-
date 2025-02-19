const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error signing up" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, secure: false });
    res.json({ message: "Login successful", user: { name: user.name, email: user.email } });

  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});


router.get("/me", authMiddleware, (req, res) => {
    res.json({ user: req.user });
  });

  router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  });
  

module.exports = router;
