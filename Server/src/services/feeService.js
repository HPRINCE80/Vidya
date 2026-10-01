import Class from "../models/Class.js";
import Fee from "../models/fees.js";
import User from "../models/User.js";

const getEffectiveStatus = ({ amount, paidAmount, dueDate, status }) => {
  const outstanding = Math.max(Number(amount) - Number(paidAmount), 0);
  if (outstanding === 0) return "Paid";
  if (new Date(dueDate) < new Date()) return "Overdue";
  if (Number(paidAmount) > 0) return "Partial";
  return status === "Overdue" ? "Overdue" : "Pending";
};

const serializeFee = (fee) => {
  const amount = Number(fee.amount);
  const paidAmount = Number.isFinite(Number(fee.paidAmount))
    ? Number(fee.paidAmount)
    : fee.paid
      ? amount
      : 0;
  const dueAmount = Math.max(amount - paidAmount, 0);

  return {
    ...fee,
    amount,
    paidAmount,
    dueAmount,
    status: getEffectiveStatus({ ...fee, amount, paidAmount }),
  };
};

export const listFeesForUser = async ({ user, requestedStudentId }) => {
  const filter = {};

  if (user.role === "student") {
    if (requestedStudentId) {
      const error = new Error("Students can only view their own fees");
      error.statusCode = 403;
      throw error;
    }
    filter.student = user._id;
  } else if (user.role === "teacher") {
    const assignedClasses = await Class.find({ classTeacher: user._id }).select("_id").lean();
    const assignedClassIds = assignedClasses.map(({ _id }) => _id);
    const students = await User.find({ role: "student", classId: { $in: assignedClassIds } }).select("_id").lean();
    const assignedStudentIds = students.map(({ _id }) => _id);

    if (requestedStudentId) {
      if (!assignedStudentIds.some((studentId) => String(studentId) === String(requestedStudentId))) {
        const error = new Error("You can only view fees for students in your assigned classes");
        error.statusCode = 403;
        throw error;
      }
      filter.student = requestedStudentId;
    } else {
      filter.student = { $in: assignedStudentIds };
    }
  } else if (requestedStudentId) {
    filter.student = requestedStudentId;
  }

  const records = await Fee.find(filter)
    .populate("student", "name email studentId")
    .sort({ dueDate: 1, createdAt: 1 })
    .lean();

  return records.map(serializeFee);
};
