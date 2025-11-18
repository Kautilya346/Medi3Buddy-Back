import {
  registerDoctor,
  getAllDoctors,
  getDoctorById,
  getDoctorPatients,
} from "../controllers/doctorController.js";
import express from "express";

const router = express.Router();

router.post("/register-doctor", async (req, res) => {
  try {
    const doctorData = req.body;
    const doctor = await registerDoctor(doctorData);
    res.status(201).json(doctor);
  } catch (error) {
    console.error("Error registering doctor:", error);
    res.status(500).json({ error: "Error registering doctor" });
  }
});

router.get("/doctor-patients/:doctorId", async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const patients = await getDoctorPatients(doctorId);
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching doctor's patients:", error);
    res.status(500).json({ error: "Error fetching doctor's patients" });
  }
});

router.get("/doctors", async (req, res) => {
  try {
    const doctors = await getAllDoctors();
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Error fetching doctors" });
  }
});

router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctor = await getDoctorById(doctorId);
    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    res.status(500).json({ error: "Error fetching doctor by ID" });
  }
});

export default router;
