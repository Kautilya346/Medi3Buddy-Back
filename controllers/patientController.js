import mongoose from "mongoose";
import Patient from "../models/Patient.Model.js";
import Doctor from "../models/Doctor.Model.js";

export async function registerPatient(patientData) {
  if (!patientData || !patientData.name) {
    throw new Error("Missing patient data");
  }

  const patientName = String(patientData.name).trim();
  const age =
    patientData.age !== undefined && patientData.age !== null
      ? Number(patientData.age)
      : undefined;
  const gender = patientData.gender
    ? String(patientData.gender).trim()
    : undefined;

  const patient = await Patient.create({
    name: patientName,
    ...(age !== undefined && !Number.isNaN(age) ? { age } : {}),
    ...(gender ? { gender } : {}),
  });

  return patient;
}

export async function grantDoctorAccess(patientId, doctorId) {
  if (
    !mongoose.Types.ObjectId.isValid(patientId) ||
    !mongoose.Types.ObjectId.isValid(doctorId)
  ) {
    throw new Error("Invalid patientId or doctorId");
  }

  const patient = await Patient.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { $addToSet: { accessToPatients: patientId } },
    { new: true }
  );

  if (!doctor) throw new Error("Doctor not found");
  return doctor;
}

export async function revokeDoctorAccess(patientId, doctorId) {
  if (
    !mongoose.Types.ObjectId.isValid(patientId) ||
    !mongoose.Types.ObjectId.isValid(doctorId)
  ) {
    throw new Error("Invalid patientId or doctorId");
  }

  const patient = await Patient.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { $pull: { accessToPatients: patientId } },
    { new: true }
  );

  if (!doctor) throw new Error("Doctor not found");
  return doctor;
}

export async function getPatientData(patientId) {
  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    throw new Error("Invalid patientId");
  }
  const patient = await Patient.findById(patientId);
  if (!patient) throw new Error("Patient not found");
  return patient;
}
