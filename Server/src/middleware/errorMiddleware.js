export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}`, errors: [] });
};

export const errorHandler = (error, req, res, next) => {
  const status = error.statusCode || (error.name === "ValidationError" ? 400 : 500);
  const message = status >= 500 && process.env.NODE_ENV === "production" ? "Internal server error" : error.message || "Internal server error";

  if (res.headersSent) return next(error);
  res.status(status).json({ success: false, message, errors: error.errors || [] });
};
