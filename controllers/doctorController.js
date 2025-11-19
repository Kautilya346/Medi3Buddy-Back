import Doctor from "../models/Doctor.Model.js";

export async function registerDoctor(doctorData) {
  const doctorName = doctorData.name.trim();
  const specialization = doctorData.specialization.trim();
  const doctor = await Doctor.create({
    name: doctorName,
    specialization: specialization,
  });
  return (
    doctor._id,
    doctor.name,
    doctor.specialization,
    doctor.accessToPatients,
    doctor.createdAt
  );
}

export async function getDoctorPatients(doctorId) {
  const doctor = await Doctor.findById(doctorId).populate("accessToPatients");
  if (!doctor) {
    throw new Error("Doctor not found");
  }
  return doctor.accessToPatients;
}

export async function getAllDoctors() {
  const doctors = await Doctor.find();
  return doctors;
}

export async function getDoctorById(doctorId) {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new Error("Doctor not found");
  }
  return doctor;
}
