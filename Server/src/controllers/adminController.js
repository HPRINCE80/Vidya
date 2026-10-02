import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import Fee from "../models/fees.js";
import Result from "../models/Result.js";
import User from "../models/User.js";
import { createTeacher } from "../services/teacherService.js";

export const addTeacher = async (req, res, next) => {
  try {
    const teacher = await createTeacher(req.body);
    return res.status(201).json({ message: "Teacher account created successfully", teacher });
  } catch (error) {
    return next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({ message: "Please provide a valid student ID" });
    }

    const student = await User.findOne({ _id: studentId, role: "student" }).select("_id");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await Promise.all([
      Attendance.deleteMany({ student: student._id }),
      Fee.deleteMany({ student: student._id }),
      Result.deleteMany({ student: student._id }),
    ]);

    const deletedStudent = await User.findOneAndDelete({ _id: student._id, role: "student" });
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ message: "Student deleted successfully" });
  } catch {
    const error = new Error("Unable to delete student");
    error.statusCode = 500;
    return next(error);
  }
};
