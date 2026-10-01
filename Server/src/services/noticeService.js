import Notice from "../models/Notices.js";

export const listStudentNotices = async () => {
  const records = await Notice.find({
    isPublished: true,
    audience: { $in: ["All", "Students"] },
  })
    .select("title message audience createdAt publishedAt")
    .sort({ createdAt: -1 })
    .lean();

  return records;
};
