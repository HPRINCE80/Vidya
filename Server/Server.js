import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { assertRequiredEnv, env } from "./src/config/env.js";

const startServer = async () => {
  assertRequiredEnv();
  await connectDB();

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error(`Unable to start server: ${error.message}`);
  process.exit(1);
});
