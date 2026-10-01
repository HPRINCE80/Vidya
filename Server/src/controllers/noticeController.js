import mongoose from "mongoose";
import Notice from "../models/Notices.js";
import { listNoticesForUser } from "../services/noticeService.js";

export const getNotices = async (req, res, next) => {
  try {
    const records = await listNoticesForUser(req.user);
    return res.status(200).json({ records, count: records.length });
  } catch (error) {
    return next(error);
  }
};

export const createNotice = async (req, res, next) => {
  try {
    const notice = await Notice.create({
      title: req.body.title.trim(),
      message: req.body.message.trim(),
      audience: req.body.audience || "All",
      isPublished: Boolean(req.body.isPublished),
      publishedAt: req.body.isPublished ? new Date() : undefined,
      createdBy: req.user._id,
    });
    return res.status(201).json({ notice });
  } catch (error) {
    return next(error);
  }
};

export const updateNotice = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Please provide a valid notice ID" });
    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title.trim();
    if (req.body.message !== undefined) updates.message = req.body.message.trim();
    if (req.body.audience !== undefined) updates.audience = req.body.audience;
    if (req.body.isPublished !== undefined) {
      updates.isPublished = Boolean(req.body.isPublished);
      updates.publishedAt = updates.isPublished ? new Date() : null;
    }
    const notice = await Notice.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    return res.status(200).json({ notice });
  } catch (error) {
    return next(error);
  }
};

export const deleteNotice = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Please provide a valid notice ID" });
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
