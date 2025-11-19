import doctorController from "../controllers/doctorController.js";
import express from "express";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const doctorData = req.body;
    const doctor = await doctorController.registerDoctor(doctorData);
    res.status(201).json(doctor);
  } catch (error) {
    console.error("Error registering doctor:", error);
    res.status(500).json({ error: "Error registering doctor" });
  }
});

router.get("/doctor-patients/:doctorId", async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const patients = await doctorController.getDoctorPatients(doctorId);
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching doctor's patients:", error);
    res.status(500).json({ error: "Error fetching doctor's patients" });
  }
});

router.get("/doctors", async (req, res) => {
  try {
    const doctors = await doctorController.getAllDoctors();
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Error fetching doctors" });
  }
});

router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctor = await doctorController.getDoctorById(doctorId);
    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    res.status(500).json({ error: "Error fetching doctor by ID" });
  }
});

export default router;
