import express from "express";
import mongoose from "mongoose";
import Class from "../models/Class.js";
import Result from "../models/Result.js";
import User from "../models/User.js";
import { authorize, protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin", "teacher"), async (req, res) => {
	try {
		const { studentId, classId, subject, exam, marksObtained, totalMarks } = req.body ?? {};
		const marks = Number(marksObtained);
		const maximumMarks = Number(totalMarks);

		if (
			!mongoose.Types.ObjectId.isValid(studentId) ||
			!mongoose.Types.ObjectId.isValid(classId) ||
			typeof subject !== "string" || !subject.trim() ||
			typeof exam !== "string" || !exam.trim() ||
			marksObtained === "" || marksObtained == null || !Number.isFinite(marks) ||
			totalMarks === "" || totalMarks == null || !Number.isFinite(maximumMarks) ||
			marks < 0 || maximumMarks <= 0 || marks > maximumMarks
		) {
			return res.status(400).json({ message: "Please provide valid result details" });
		}

		const selectedClass = await Class.findById(classId);
		if (!selectedClass) {
			return res.status(404).json({ message: "Class not found" });
		}
		if (req.user.role === "teacher" && String(selectedClass.classTeacher) !== String(req.user._id)) {
			return res.status(403).json({ message: "You can only enter results for your assigned classes" });
		}

		const student = await User.findOne({ _id: studentId, role: "student", classId: selectedClass._id });
		if (!student) {
			return res.status(400).json({ message: "Student must be enrolled in the selected class" });
		}

		const result = await Result.create({
			student: student._id,
			classId: selectedClass._id,
			subject: subject.trim(),
			exam: exam.trim(),
			marksObtained: marks,
			totalMarks: maximumMarks,
			enteredBy: req.user._id,
		});

		res.status(201).json({ message: "Result saved successfully", result });
	} catch (error) {
		if (error.code === 11000) {
			return res.status(409).json({ message: "A result for this student, subject, and exam already exists" });
		}
		res.status(500).json({ message: "Unable to save result" });
	}
});

router.get("/", protect, authorize("admin", "teacher", "student"), async (req, res) => {
	try {
		const { classId, studentId, exam, subject } = req.query;
		const filter = {};

		if (req.user.role === "student") {
			filter.student = req.user._id;
		} else if (studentId) {
			if (!mongoose.Types.ObjectId.isValid(studentId)) {
				return res.status(400).json({ message: "Please provide a valid student ID" });
			}
			filter.student = studentId;
		}

		if (req.user.role === "teacher") {
			const assignedClasses = await Class.find({ classTeacher: req.user._id }).select("_id");
			const assignedClassIds = assignedClasses.map(({ _id }) => String(_id));
			if (classId) {
				if (!mongoose.Types.ObjectId.isValid(classId) || !assignedClassIds.includes(classId)) {
					return res.status(403).json({ message: "You can only view results for your assigned classes" });
				}
				filter.classId = classId;
			} else {
				filter.classId = { $in: assignedClassIds };
			}
		} else if (classId) {
			if (!mongoose.Types.ObjectId.isValid(classId)) {
				return res.status(400).json({ message: "Please provide a valid class ID" });
			}
			filter.classId = classId;
		}

		if (exam) filter.exam = exam;
		if (subject) filter.subject = subject;

		const records = await Result.find(filter)
			.populate("student", "name studentId rollNumber")
			.populate("classId", "name section")
			.populate("enteredBy", "name")
			.sort({ exam: 1, subject: 1 });

		res.status(200).json({ records, count: records.length });
	} catch (error) {
		res.status(500).json({ message: "Unable to load results" });
	}
});

export default router;
