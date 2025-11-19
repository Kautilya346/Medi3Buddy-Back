import Doctor from "../models/Doctor.Model.js";

export async function registerDoctor(doctorData) {
  if (!doctorData || !doctorData.name) {
    throw new Error("Doctor name is required");
  }

  const doctorName = String(doctorData.name).trim();
  const specialty = doctorData.specialty
    ? String(doctorData.specialty).trim()
    : undefined;
  
  const doctor = await Doctor.create({
    name: doctorName,
    specialty: specialty,
  });
  
  return doctor;
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

export default {
  registerDoctor,
  getDoctorPatients,
  getAllDoctors,
  getDoctorById,
};
