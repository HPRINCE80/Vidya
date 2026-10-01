import { listFeesForUser } from "../services/feeService.js";

export const getFees = async (req, res, next) => {
  try {
    const records = await listFeesForUser({
      user: req.user,
      requestedStudentId: req.query.studentId,
    });

    return res.status(200).json({ records, count: records.length });
  } catch (error) {
    return next(error);
  }
};
