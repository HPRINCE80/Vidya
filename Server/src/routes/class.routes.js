import express from "express";
import Class from "../models/Class.js";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/authmiddleware.js";
import { generateStudentId } from "../Utils/generateStudentId.js";

const router = express.Router();

router.get("/", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const filter = req.user.role === "teacher" ? { classTeacher: req.user._id } : {};
    const classes = await Class.find(filter).populate("classTeacher", "name email").sort({ name: 1, section: 1 });
    res.status(200).json({ classes });
  } catch (error) {
    res.status(500).json({ message: "Unable to load classes" });
  }
});

router.get("/unassigned-students", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const students = await User.find({ role: "student", classId: null })
      .select("name email studentId rollNumber")
      .sort({ name: 1 });
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: "Unable to load unassigned students" });
  }
});

router.get("/teachers", protect, authorize("admin"), async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("name email").sort({ name: 1 });
    res.status(200).json({ teachers });
  } catch (error) {
    res.status(500).json({ message: "Unable to load teachers" });
  }
});

router.get("/students", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const filter = { role: "student" };
    if (req.query.classId) {
      const selectedClass = await Class.findById(req.query.classId);
      if (!selectedClass) {
        return res.status(404).json({ message: "Class not found" });
      }
      if (req.user.role === "teacher" && String(selectedClass.classTeacher) !== String(req.user._id)) {
        return res.status(403).json({ message: "You can only view students in your assigned classes" });
      }
      filter.classId = selectedClass._id;
    }
    const students = await User.find(filter)
      .select("name email studentId rollNumber classId")
      .populate("classId", "name section")
      .sort({ name: 1 });
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: "Unable to load students" });
  }
});

router.put("/:classId/students/:studentId", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const selectedClass = await Class.findById(req.params.classId);
    if (!selectedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    if (req.user.role === "teacher" && String(selectedClass.classTeacher) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only enroll students in your assigned classes" });
    }

    const student = await User.findOneAndUpdate(
      { _id: req.params.studentId, role: "student", classId: null },
      { $set: { classId: selectedClass._id } },
      { new: true }
    ).select("name email studentId rollNumber classId");
    if (!student) {
      return res.status(404).json({ message: "Student not found or already assigned to a class" });
    }
    res.status(200).json({ message: "Student enrolled in class", student });
  } catch (error) {
    res.status(500).json({ message: "Unable to enroll student" });
  }
});

router.post("/create-class", protect, authorize("admin"), async (req, res) => {
  try {
    const { name, section, classTeacher } = req.body;

    if (!name || !section) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newClass = new Class({
      name,
      section,
      classTeacher,
    });

    const savedClass = await newClass.save();

    res.status(201).json({
      message: "Class created successfully",
      data: savedClass,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "This class and section already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/:classId/students", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const { name, email, password, rollNumber } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res.status(400).json({ message: "Name, email, and a password of at least 6 characters are required" });
    }

    const selectedClass = await Class.findById(req.params.classId);
    if (!selectedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    if (req.user.role === "teacher" && String(selectedClass.classTeacher) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only add students to your assigned classes" });
    }
    if (await User.exists({ email: email.trim().toLowerCase() })) {
      return res.status(409).json({ message: "A user with this email already exists" });
    }

    const student = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: "student",
      studentId: await generateStudentId(),
      classId: selectedClass._id,
      rollNumber: rollNumber?.trim() || undefined,
    });

    res.status(201).json({
      message: "Student added to class",
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        rollNumber: student.rollNumber,
        classId: student.classId,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "A user with this email or student ID already exists" });
    }
    res.status(500).json({ message: "Unable to add student" });
  }
});

export default router;