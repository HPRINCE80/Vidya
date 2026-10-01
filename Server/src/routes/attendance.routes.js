import express from "express";
import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import Class from "../models/Class.js";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/authmiddleware.js";
const router = express.Router();

router.post("/mark-attendance", protect, authorize("teacher", "admin"), async (req, res) => {
    try {
        const { classId, date, attendanceList } = req.body;

        if (!mongoose.isValidObjectId(classId) || !date || !Array.isArray(attendanceList) || attendanceList.length === 0) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const dayStart = new Date(date);
        if (Number.isNaN(dayStart.getTime())) {
            return res.status(400).json({ message: "Please provide a valid attendance date" });
        }
        dayStart.setUTCHours(0, 0, 0, 0);

        const selectedClass = await Class.findById(classId);
        if (!selectedClass) {
            return res.status(404).json({ message: "Class not found" });
        }
        if (req.user.role === "teacher" && String(selectedClass.classTeacher) !== String(req.user._id)) {
            return res.status(403).json({ message: "You can only mark attendance for your assigned classes" });
        }

        const studentIds = attendanceList.map(({ studentId }) => String(studentId));
        const validStatuses = ["present", "absent", "Leave"];
        if (new Set(studentIds).size !== studentIds.length || studentIds.some((studentId) => !mongoose.isValidObjectId(studentId)) || attendanceList.some(({ studentId, status }) => !studentId || !validStatuses.includes(status))) {
            return res.status(400).json({ message: "Attendance contains duplicate students or invalid statuses" });
        }
        const enrolledStudents = await User.countDocuments({
            _id: { $in: studentIds },
            classId,
            role: "student",
        });
        if (enrolledStudents !== studentIds.length) {
            return res.status(400).json({ message: "All students must be enrolled in the selected class" });
        }

        const operations = attendanceList.map(({ studentId, status }) => ({
            updateOne: {
                filter: { student: studentId, classId, date: dayStart },
                update: {
                    $set: { status, markedBy: req.user._id },
                    $setOnInsert: { student: studentId, classId, date: dayStart },
                },
                upsert: true,
            },
        }));

        await Attendance.bulkWrite(operations);
        const savedRecords = await Attendance.find({ classId, date: dayStart }).populate("student", "name studentId rollNumber");
        res.status(200).json({ message: "Attendance saved successfully", records: savedRecords, count: savedRecords.length, date: dayStart });

    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Attendance for one or more students on this date has already been marked." });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/get-attendance", protect, authorize("teacher", "admin", "student"), async (req, res) => {
    try {
        const { classId, studentId, date } = req.query;
        let filter = {};
        if (req.user.role === "student") {
            filter.student = req.user._id;
        } else if (req.user.role === "teacher") {
            const assignedClasses = await Class.find({ classTeacher: req.user._id }).select("_id");
            const assignedClassIds = assignedClasses.map(({ _id }) => _id);
            if (classId) {
                if (!mongoose.isValidObjectId(classId) || !assignedClassIds.some((assignedClassId) => String(assignedClassId) === String(classId))) {
                    return res.status(403).json({ message: "You can only view attendance for your assigned classes" });
                }
                filter.classId = classId;
            } else {
                filter.classId = { $in: assignedClassIds };
            }
            if (studentId) {
                if (!mongoose.isValidObjectId(studentId)) {
                    return res.status(400).json({ message: "Please provide a valid student ID" });
                }
                const student = await User.findOne({ _id: studentId, role: "student", classId: { $in: assignedClassIds } }).select("_id");
                if (!student) {
                    return res.status(403).json({ message: "You can only view attendance for students in your assigned classes" });
                }
                filter.student = student._id;
            }
        } else {
            if (studentId) {
                if (!mongoose.isValidObjectId(studentId)) {
                    return res.status(400).json({ message: "Please provide a valid student ID" });
                }
                filter.student = studentId;
            }
            if (classId) {
                if (!mongoose.isValidObjectId(classId)) {
                    return res.status(400).json({ message: "Please provide a valid class ID" });
                }
                filter.classId = classId;
            }
        }

        if (date) {
            const dayStart = new Date(date);
            if (Number.isNaN(dayStart.getTime())) {
                return res.status(400).json({ message: "Please provide a valid attendance date" });
            }
            dayStart.setUTCHours(0, 0, 0, 0);
            const nextDay = new Date(dayStart);
            nextDay.setUTCDate(nextDay.getUTCDate() + 1);
            filter.date = { $gte: dayStart, $lt: nextDay };
        }

        const attendanceRecords = await Attendance.find(filter).populate("classId", "name section").sort({ date: -1 });

        res.status(200).json({ records: attendanceRecords, count: attendanceRecords.length });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;