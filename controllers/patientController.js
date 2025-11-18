import Patient from "../models/Patient.Model.js";
import Doctor from "../models/Doctor.Model.js";

export async function registerPatient(patientData) {
  if (!patientData || !patientData.name) {
    throw new Error("Patient name is required");
  }

  const patientName = String(patientData.name).trim();
  const age =
    patientData.age !== undefined ? String(patientData.age).trim() : undefined;
  const gender = patientData.gender
    ? String(patientData.gender).trim()
    : undefined;
  const patient = await Patient.create({
    name: patientName,
    ...(age ? { age } : {}),
    ...(gender ? { gender } : {}),
  });

  // Return the created patient record
  return patient;
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
  const patient = await Patient.findById(patientId);
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

export async function getPatientData(patientId) {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }
  return patient;
}
