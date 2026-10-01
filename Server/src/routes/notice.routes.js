import express from "express";
import { body } from "express-validator";
import { authorize, protect } from "../middleware/authmiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { createNotice, deleteNotice, getNotices, updateNotice } from "../controllers/noticeController.js";

const router = express.Router();

const noticeFields = [
	body("title").trim().isLength({ min: 2, max: 160 }).withMessage("Title must be between 2 and 160 characters"),
	body("message").trim().isLength({ min: 2, max: 5000 }).withMessage("Message must be between 2 and 5000 characters"),
	body("audience").optional().isIn(["All", "Students", "Teachers"]).withMessage("Invalid notice audience"),
	body("isPublished").optional().isBoolean().withMessage("isPublished must be boolean"),
];

router.get("/", protect, authorize("admin", "teacher", "student"), getNotices);
router.post("/", protect, authorize("admin"), noticeFields, validate, createNotice);
router.put("/:id", protect, authorize("admin"), noticeFields, validate, updateNotice);
router.delete("/:id", protect, authorize("admin"), deleteNotice);

export default router;