import express from "express";
import { body } from "express-validator";
import User from "../models/User.js";
import { protect } from "../middleware/authmiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

const profileFields = [
  body("name").optional().trim().isLength({ min: 2, max: 120 }),
  body("phone").optional({ nullable: true }).trim().isLength({ max: 30 }),
];

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  studentId: user.studentId,
  phone: user.phone,
  rollNumber: user.rollNumber,
});

router.get("/profile", protect, async (req, res, next) => {
  try {
    res.status(200).json(publicUser(req.user));
  } catch (error) {
    next(error);
  }
});

router.put("/profile", protect, profileFields, validate, async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.phone !== undefined) updates.phone = req.body.phone;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.status(200).json(publicUser(user));
  } catch (error) {
    next(error);
  }
});

export default router;