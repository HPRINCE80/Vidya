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
        const { classId, studentId, date, startDate, endDate } = req.query;
        let filter = {};
        if (req.user.role === "student") {
            filter.student = req.user._id;
        } else if (req.user.role === "teacher") {
            const assignedClasses = await Class.find({ classTeacher: req.user._id }).select("_id");
            const assignedClassIds = assignedClasses.map(({ _id }) => _id);
            if (classId) {
                if (!mongoose.isValidObjectId(classId)) {
                    return res.status(400).json({ message: "Please provide a valid class ID" });
                }
                const selectedClass = await Class.findById(classId).select("_id");
                if (!selectedClass) {
                    return res.status(404).json({ message: "Class not found" });
                }
                if (!assignedClassIds.some((assignedClassId) => String(assignedClassId) === String(classId))) {
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
                const student = await User.findOne({ _id: studentId, role: "student" }).select("_id classId");
                if (!student) {
                    return res.status(404).json({ message: "Student not found" });
                }
                if (!assignedClassIds.some((assignedClassId) => String(assignedClassId) === String(student.classId))) {
                    return res.status(403).json({ message: "You can only view attendance for students in your assigned classes" });
                }
                if (classId && String(student.classId) !== String(classId)) {
                    return res.status(403).json({ message: "Student is not enrolled in the selected class" });
                }
                filter.student = student._id;
            }
        } else {
            if (studentId) {
                if (!mongoose.isValidObjectId(studentId)) {
                    return res.status(400).json({ message: "Please provide a valid student ID" });
                }
                const student = await User.findOne({ _id: studentId, role: "student" }).select("_id");
                if (!student) {
                    return res.status(404).json({ message: "Student not found" });
                }
                filter.student = student._id;
            }
            if (classId) {
                if (!mongoose.isValidObjectId(classId)) {
                    return res.status(400).json({ message: "Please provide a valid class ID" });
                }
                const selectedClass = await Class.findById(classId).select("_id");
                if (!selectedClass) {
                    return res.status(404).json({ message: "Class not found" });
                }
                filter.classId = selectedClass._id;
            }
        }

        if (date && (startDate || endDate)) {
            return res.status(400).json({ message: "Use either a date or a date range" });
        }
        if (date || startDate || endDate) {
            const rangeStart = startDate || date ? new Date(startDate || date) : null;
            const rangeEnd = endDate || date ? new Date(endDate || date) : null;
            if ((rangeStart && Number.isNaN(rangeStart.getTime())) || (rangeEnd && Number.isNaN(rangeEnd.getTime()))) {
                return res.status(400).json({ message: "Please provide valid attendance dates" });
            }
            if (rangeStart) rangeStart.setUTCHours(0, 0, 0, 0);
            if (rangeEnd) rangeEnd.setUTCHours(0, 0, 0, 0);
            if (rangeStart && rangeEnd && rangeStart > rangeEnd) {
                return res.status(400).json({ message: "Start date must be on or before end date" });
            }
            filter.date = {};
            if (rangeStart) filter.date.$gte = rangeStart;
            if (rangeEnd) {
                rangeEnd.setUTCDate(rangeEnd.getUTCDate() + 1);
                filter.date.$lt = rangeEnd;
            }
        }

        const attendanceRecords = await Attendance.find(filter)
            .populate("classId", "name section")
            .populate("student", "name studentId rollNumber")
            .sort({ date: -1 });

        res.status(200).json({ records: attendanceRecords, count: attendanceRecords.length });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;