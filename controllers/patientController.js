import Patient from "../models/Patient.Model.js";
import mongoose from "mongoose";
import Doctor from "../models/Doctor.Model.js";
import { v4 as uuidv4 } from "uuid";

export async function registerPatient(patientData) {
  const patientName = patientData.name.trim();
  const age = patientData.age.trim();
  const patient = await Patient.create({
    name: patientName,
    age: age,
  });
  return (
    patient._id,
    patient.name,
    patient.age,
    patient.medicalHistory,
    patient.createdAt
  );
}

export async function grantDoctorAccess(patientId, doctorId) {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { $addToSet: { accessToPatients: patientId } },
    { new: true }
  );

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  return doctor;
}

export async function revokeDoctorAccess(patientId, doctorId) {
  const patient = await Patient.find.findById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { $pull: { accessToPatients: patientId } },
    { new: true }
  );

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  return doctor;
}
