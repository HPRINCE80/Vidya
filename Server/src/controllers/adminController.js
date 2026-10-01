import { createTeacher } from "../services/teacherService.js";

export const addTeacher = async (req, res, next) => {
  try {
    const teacher = await createTeacher(req.body);
    return res.status(201).json({ message: "Teacher account created successfully", teacher });
  } catch (error) {
    return next(error);
  }
};
