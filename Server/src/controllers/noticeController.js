import { listStudentNotices } from "../services/noticeService.js";

export const getStudentNotices = async (req, res, next) => {
  try {
    const records = await listStudentNotices();
    return res.status(200).json({ records, count: records.length });
  } catch (error) {
    return next(error);
  }
};
