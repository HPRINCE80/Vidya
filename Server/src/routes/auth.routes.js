import express from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/authmiddleware.js";
import { generateStudentId } from "../Utils/generateStudentId.js";
import { authRateLimit } from "../middleware/rateLimitMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { env } from "../config/env.js";

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, env.jwtSecret, { expiresIn: "7d" });
};

const authFields = [
  body("email").trim().isEmail().withMessage("Please provide a valid email address"),
  body("password").isString().isLength({ min: 6, max: 128 }).withMessage("Password must be between 6 and 128 characters"),
];

const registrationFields = [
  body("name").trim().isLength({ min: 2, max: 120 }).withMessage("Name must be between 2 and 120 characters"),
  ...authFields,
];

const roleRegistrationFields = [
  ...registrationFields,
  body("registrationCode").isString().notEmpty().withMessage("Registration code is required"),
];

const publicAccount = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  studentId: user.studentId,
  token: generateToken(user._id),
});

const createAccount = async ({ name, email, password, role, phone, subject, rollNumber }) => {
  const normalizedEmail = email.toLowerCase();
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    const error = new Error("User with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role,
    phone,
    subject,
    rollNumber,
    studentId: role === "student" ? await generateStudentId() : undefined,
  });

  return user;
};

const rejectMissingCode = (code, label) => {
  if (!code) {
    const error = new Error(`${label} registration is not configured on the server`);
    error.statusCode = 503;
    throw error;
  }
};

const registerStudent = async (req, res, next) => {
  try {
    const { name, email, password, phone, subject, rollNumber, role: requestedRole } = req.body;
    if (requestedRole && requestedRole !== "student") {
      return res.status(403).json({ message: "This endpoint only creates student accounts" });
    }
    const user = await createAccount({ name, email, password, role: "student", phone, subject, rollNumber });
    return res.status(201).json(publicAccount(user));
  } catch (error) {
    return next(error);
  }
};

const registerPrivilegedUser = (role, code, label) => async (req, res, next) => {
  try {
    rejectMissingCode(code, label);
    if (req.body.registrationCode !== code) {
      return res.status(403).json({ message: `Invalid ${label.toLowerCase()} registration code` });
    }

    const { name, email, password, phone, subject } = req.body;
    const user = await createAccount({ name, email, password, role, phone, subject });
    return res.status(201).json(publicAccount(user));
  } catch (error) {
    return next(error);
  }
};

// @route   POST /api/auth/register
router.post("/register", authRateLimit, registrationFields, validate, registerStudent);
router.post("/register/student", authRateLimit, registrationFields, validate, registerStudent);
router.post("/register/teacher", authRateLimit, roleRegistrationFields, validate, registerPrivilegedUser("teacher", env.teacherRegistrationCode, "Teacher"));
router.post("/register/admin", authRateLimit, roleRegistrationFields, validate, registerPrivilegedUser("admin", env.adminRegistrationCode, "Admin"));

// @route   POST /api/auth/login
router.post("/login", authRateLimit, authFields, validate, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user || !user.active || !(await user.matchPassword(password))) {
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
    return next(error);
  }
});

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    studentId: req.user.studentId,
    phone: req.user.phone,
    rollNumber: req.user.rollNumber,
  });
});

router.post("/logout", protect, (req, res) => {
  res.status(204).send();
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