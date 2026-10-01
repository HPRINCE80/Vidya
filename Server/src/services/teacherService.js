import User from "../models/User.js";

export const createTeacher = async ({ name, email, password, phone, subject }) => {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail }).select("_id");

  if (existingUser) {
    const error = new Error("A user with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const teacher = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: "teacher",
    phone: phone?.trim() || undefined,
    subject: subject?.trim() || undefined,
    active: true,
  });

  return {
    _id: teacher._id,
    name: teacher.name,
    email: teacher.email,
    role: teacher.role,
    phone: teacher.phone,
    subject: teacher.subject,
    active: teacher.active,
  };
};
