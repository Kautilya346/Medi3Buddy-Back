import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Utils/db.js";

const app = express();

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


app.listen(process.env.PORT || 5000, () => {
  console.log(`Medi3Buddy Backend Server running on port ${process.env.PORT || 5000}`);
});