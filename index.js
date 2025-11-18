import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import dataEntryRoutes from "./routes/dataRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
const app = express();

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api", dataEntryRoutes);
app.use("/api", doctorRoutes);
app.use("/api", patientRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Medi3Buddy Backend Server running on port ${process.env.PORT || 5000}`
  );
});
