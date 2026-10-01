import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/authmiddleware.js";
import { generateStudentId } from "../Utils/generateStudentId.js";

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, subject, rollNumber } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please provide name, email, password and role" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
let studentId;
 if(role === "student") {
    studentId = await generateStudentId();
 }
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      subject,
      rollNumber,
      studentId,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/admin-dashboard", protect, authorize("admin"), (req, res) => {
  res.json({ message: `Welcome, Admin ${req.user.name}!` });
});


router.get("/teacher-dashboard", protect, authorize("teacher"), (req, res) => {
  res.json({ message: `Welcome, Teacher ${req.user.name}!` });
});

router.get("/student-dashboard", protect, authorize("student"), (req, res) => {
  res.json({ message: `Welcome, Student ${req.user.name}!` });
});

export default router;