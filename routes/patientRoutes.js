import {
  registerPatient,
  grantDoctorAccess,
  revokeDoctorAccess,
  getPatientData,
} from "../controllers/patientController.js";

import express from "express";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const patientData = req.body;
    const patient = await registerPatient(patientData);
    res.status(201).json(patient);
  } catch (error) {
    console.error("Error registering patient:", error);
    res.status(500).json({ error: "Error registering patient" });
  }
});

router.post("/grant-access", async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;
    const doctor = await grantDoctorAccess(patientId, doctorId);
    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error granting doctor access:", error);
    res.status(500).json({ error: "Error granting doctor access" });
  }
});

router.post("/revoke-access", async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;
    const doctor = await revokeDoctorAccess(patientId, doctorId);
    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error revoking doctor access:", error);
    res.status(500).json({ error: "Error revoking doctor access" });
  }
});

// Get doctors who have access to a patient (must come before /data/:patientId)
router.get("/doctors-with-access/:patientId", async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const Doctor = (await import("../models/Doctor.Model.js")).default;
    const doctors = await Doctor.find({ accessToPatients: patientId });
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors with access:", error);
    res.status(500).json({ error: "Error fetching doctors with access" });
  }
});

router.get("/data/:patientId", async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patient = await getPatientData(patientId);
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error fetching patient data:", error);
    res.status(500).json({ error: "Error fetching patient data" });
  }
});

export default router;
