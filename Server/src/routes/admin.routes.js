import express from "express";
import { body } from "express-validator";
import { authorize, protect } from "../middleware/authmiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { addTeacher, deleteStudent } from "../controllers/adminController.js";

const router = express.Router();

const teacherFields = [
  body("name").trim().isLength({ min: 2, max: 120 }).withMessage("Name must be between 2 and 120 characters"),
  body("email").trim().isEmail().withMessage("Please provide a valid email address"),
  body("password").isString().isLength({ min: 6, max: 128 }).withMessage("Password must be between 6 and 128 characters"),
  body("phone").optional({ nullable: true }).trim().isLength({ max: 30 }).withMessage("Phone is too long"),
  body("subject").optional({ nullable: true }).trim().isLength({ max: 120 }).withMessage("Subject is too long"),
];

router.post("/teachers", protect, authorize("admin"), teacherFields, validate, addTeacher);
router.delete("/students/:studentId", protect, authorize("admin"), deleteStudent);

export default router;
