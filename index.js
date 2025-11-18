import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import dataEntryRoutes from "./routes/dataRoutes.js";
const app = express();

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api", dataEntryRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Medi3Buddy Backend Server running on port ${process.env.PORT || 5000}`
  );
});
