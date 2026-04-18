import dotenv from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/db.js";
import { seedDemoDataIfNeeded } from "./utils/seedDemoData.js";

dotenv.config();

const port = Number(process.env.PORT || 4000);

async function startServer() {
  await connectDatabase();
  await seedDemoDataIfNeeded();

  app.listen(port, "0.0.0.0", () => {
    console.log(`Backend server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start backend:", error);
  process.exit(1);
});
