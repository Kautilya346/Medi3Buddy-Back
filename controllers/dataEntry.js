import Patient from "../models/Patient.Model.js";

import { v4 as uuidv4 } from "uuid";
import Pinata from "../utils/pinata.js";

async function post(healthDataJson, patientId) {

  console.log(patientId)

  try {
    if (!healthDataJson || healthDataJson === "undefined") {
      throw new Error("Invalid or missing health data JSON");
    }
    if (!patientId) {
      throw new Error("Patient ID is required");
    }

    const healthData = JSON.parse(healthDataJson);
    const file = new File(
      [JSON.stringify(healthData)],
      `healthData_${uuidv4()}.json`,
      {
        type: "application/json",
      }
    );
    const upload = await Pinata.upload.public.file(file);
    console.log(upload);

    // Add CID to patient's medical history
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { $push: { medicalHistory: upload.cid } },
      { new: true }
    );

    if (!patient) {
      throw new Error("Patient not found");
    }

    return { upload, patient };
  } catch (error) {
    console.log(error);
    throw error; // Re-throw to be caught in the route
  }
}

export default post;
