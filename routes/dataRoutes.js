import express from "express";
import dataEntry from "../Controllers/dataEntry.js";
import Pinata from "../utils/pinata.js";
import Doctor from "../Models/Doctor.Model.js";
import upload, { uploadBufferToPinata } from "../utils/upload.js";
import Patient from "../models/Patient.Model.js";
const router = express.Router();

// Simple GET to explain endpoint usage
router.get("/data-entry", (req, res) => {
  res.send(
    "This endpoint accepts POST requests for data entry. Use a tool like Postman or curl to send POST requests."
  );
});

router.post("/data-entry", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .send("Request body is required and must be valid JSON");
    }
    await dataEntry.postToPinata(JSON.stringify(req.body.healthDataJson), req.body.patientId);
    res.status(200).send("Data uploaded successfully");
  } catch (error) {
    console.error("Error in data-entry route:", error);
    res.status(500).send(`Error uploading data: ${error.message}`);
  }
});

// Route to fetch pinned data by CID
router.get("/get-data", async (req, res) => {
  const cid = req.query.cid;
  if (!cid) {
    return res.status(400).send("cid query parameter is required");
  }

  try {
    const response = await Pinata.gateways.public.get(cid);
    res.status(200).send(response);
  } catch (error) {
    console.error("Error fetching data from Pinata (route):", error);
    res.status(500).send(`Error fetching data: ${error.message}`);
  }
});

// Route to get all medical histories of patient
router.post("/get-medical-history", async (req, res) => {
  const patientId = req.body.patientId || req.query.patientId;
  if (!patientId) {
    return res.status(400).send("patientId query parameter is required");
  }

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).send("Patient not found");
    }

    // Fetch all medical history data from Pinata using CIDs
    const medicalHistoryData = await Promise.all(
      patient.medicalHistory.map(async (cid) => {
        try {
          const data = await Pinata.gateways.public.get(cid);
          return { cid, data };
        } catch (error) {
          console.error(`Error fetching CID ${cid}:`, error);
          return { cid, error: error.message };
        }
      })
    );

    res.status(200).json({
      patientId: patient._id,
      patientName: patient.name,
      medicalHistory: medicalHistoryData
    });
  } catch (error) {
    console.error("Error fetching medical history:", error);
    res.status(500).send(`Error fetching medical history: ${error.message}`);
  }
});

router.post("/get-all-patients", async (req, res) => {
  try {
    const doctor=req.body.doctorId;
    const doctorData=await Doctor.findById(doctor).populate('accessToPatients');
    if(!doctorData){
      return res.status(404).send("Doctor not found");
    }
    const patients=doctorData.accessToPatients;
    res.status(200).send(patients);
  } catch (error) {
    console.error("Error fetching all patients from Pinata (route):", error);
    res.status(500).send(`Error fetching patients: ${error.message}`);
  }
});

// Upload a file (image/pdf), pin to Pinata, and return the CID
router.post("/upload-media", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .send("File is required (multipart/form-data field 'file')");
    }

    const file = req.file;
    const upload = await uploadBufferToPinata(file);

    res.status(200).json({ upload });
  } catch (error) {
    console.error("Error in upload-media route:", error);
    res.status(500).send(`Error uploading file: ${error.message}`);
  }
});

export default router;
