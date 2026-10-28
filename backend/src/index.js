import dotenv from "dotenv";
import app from "./app.js";
import "dotenv/config";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(` Server running on http://localhost:${PORT}`);
});