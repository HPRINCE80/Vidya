import Notice from "../models/Notices.js";

export const listNoticesForUser = async (user) => {
  const filter = user.role === "admin"
    ? {}
    : { isPublished: true, audience: { $in: ["All", user.role === "teacher" ? "Teachers" : "Students"] } };
  const records = await Notice.find(filter)
    .select("title message audience isPublished createdAt publishedAt")
    .sort({ createdAt: -1 })
    .lean();

  return records;
};
