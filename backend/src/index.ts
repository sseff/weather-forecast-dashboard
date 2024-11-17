import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import weatherRoutes from "./routes/weather";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "", {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error: Error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(express.json());

// Routes will be added here later
app.use("/api/weather", weatherRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
