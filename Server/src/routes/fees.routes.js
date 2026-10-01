import express from "express";
import Fee from "../models/fees.js";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/authmiddleware.js";

const router = express.Router();

// @route   POST /api/fees/add-fees
// @access  Admin
router.post("/add-fees", protect, authorize("admin"), async (req, res) => {
  try {
    const { studentId, amount, dueDate } = req.body;

    if (!studentId || !amount || !dueDate) {
      return res.status(400).json({ message: "Please provide studentId, amount and dueDate" });
    }

    const student = await User.findOne({ _id: studentId, role: "student" });
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }

    const newFee = new Fee({
      student: studentId,
      amount,
      dueDate,
    });

    const savedFee = await newFee.save();

    res.status(201).json({
      message: "Fees added successfully",
      data: savedFee,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route   GET /api/fees/view
// @desc    Student sees own fees; Admin sees all (or filter by studentId)
// @access  Private
router.get("/view", protect, async (req, res) => {
  try {
    const { studentId } = req.query;
    let filter = {};

    if (req.user.role === "student") {
      filter.student = req.user._id;
    } else if (studentId) {
      filter.student = studentId;
    }

    const records = await Fee.find(filter)
      .populate("student", "name email studentId")
      .sort({ dueDate: 1 });

    res.status(200).json({ records, count: records.length });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// @route   PUT /api/fees/:id/pay
// @desc    Mark a fee record as paid
// @access  Admin
router.put("/:id/pay", protect, authorize("admin"), async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    fee.status = "Paid";
    fee.paidOn = new Date();
    if (req.body.paymentMethod) {
      fee.paymentMethod = req.body.paymentMethod;
    }

    const updatedFee = await fee.save();

    res.status(200).json({
      message: "Fee marked as paid",
      data: updatedFee,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;