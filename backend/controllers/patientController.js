import Patient from "../models/Patient.js";
import User from "../models/User.js";

export async function getPatients(_req, res, next) {
  try {
    const patients = await Patient.find().populate("user", "email phone role isActive").sort({ createdAt: -1 });
    res.json({ success: true, data: patients });
  } catch (error) {
    next(error);
  }
}

export async function getPatientById(req, res, next) {
  try {
    const patient = await Patient.findById(req.params.id).populate("user", "email phone role isActive");

    if (!patient) {
      res.status(404);
      throw new Error("Patient not found.");
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
}

export async function updatePatient(req, res, next) {
  try {
    const { id } = req.params;
    const { name, phone, age, gender, bloodGroup, address, medicalHistory } = req.body;

    const patient = await Patient.findById(id);
    if (!patient) {
      res.status(404);
      throw new Error("Patient not found.");
    }

    // Check authorization: only the patient themselves or admin can update
    if (req.user.role !== "admin" && req.user._id.toString() !== patient.user.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this patient.");
    }

    if (name) patient.name = name;
    if (phone) patient.phone = phone;
    if (age) patient.age = age;
    if (gender) patient.gender = gender;
    if (bloodGroup) patient.bloodGroup = bloodGroup;
    if (address) patient.address = address;
    if (medicalHistory) patient.medicalHistory = medicalHistory;

    const updated = await patient.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deletePatient(req, res, next) {
  try {
    const { id } = req.params;

    const patient = await Patient.findById(id);
    if (!patient) {
      res.status(404);
      throw new Error("Patient not found.");
    }

    // Delete associated user
    await User.findByIdAndDelete(patient.user);
    await Patient.findByIdAndDelete(id);

    res.json({ success: true, message: "Patient deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export async function getMyProfile(req, res, next) {
  try {
    const patient = await Patient.findOne({ user: req.user._id }).populate("user", "email phone role");

    if (!patient) {
      res.status(404);
      throw new Error("Patient profile not found.");
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
}
