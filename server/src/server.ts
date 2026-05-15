import app from "./app.js";
import { env } from "./config/env.js";
import { initializeDatabase } from "./config/database.js";

initializeDatabase();

app.listen(env.port, () => {
  console.log(`Server is running on http://localhost:${env.port}`);
});
