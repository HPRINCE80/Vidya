import express from "express";
import { authorize, protect } from "../middleware/authmiddleware.js";
import { getStudentNotices } from "../controllers/noticeController.js";

const router = express.Router();

router.get("/", protect, authorize("student"), getStudentNotices);

export default router;