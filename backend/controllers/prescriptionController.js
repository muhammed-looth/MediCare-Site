import Prescription from "../models/Prescription.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";

export async function getPrescriptions(_req, res, next) {
  try {
    const prescriptions = await Prescription.find()
      .populate("patient", "name email mobile")
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: prescriptions });
  } catch (error) {
    next(error);
  }
}

export async function getPrescriptionById(req, res, next) {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findById(id)
      .populate("patient", "name email mobile")
      .populate("doctor", "name specialization")
      .populate("appointment");
    
    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }
    
    res.json({ success: true, data: prescription });
  } catch (error) {
    next(error);
  }
}

export async function getPrescriptionsByPatient(req, res, next) {
  try {
    const { patientId } = req.params;
    const prescriptions = await Prescription.find({ patient: patientId })
      .populate("doctor", "name specialization")
      .sort({ date: -1 });
    res.json({ success: true, data: prescriptions });
  } catch (error) {
    next(error);
  }
}

export async function getPrescriptionsByDoctor(req, res, next) {
  try {
    const { doctorId } = req.params;
    const prescriptions = await Prescription.find({ doctor: doctorId })
      .populate("patient", "name email mobile")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: prescriptions });
  } catch (error) {
    next(error);
  }
}

export async function createPrescription(req, res, next) {
  try {
    const {
      patient,
      patientName,
      doctor,
      doctorName,
      appointment,
      date,
      medications,
      diagnosis,
      notes,
      status,
    } = req.body;

    if (!patient || !patientName || !doctor || !doctorName || !date || !medications || !diagnosis) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: patient, patientName, doctor, doctorName, date, medications, diagnosis",
      });
    }

    const prescription = new Prescription({
      patient,
      patientName,
      doctor,
      doctorName,
      appointment: appointment || null,
      date,
      medications,
      diagnosis,
      notes: notes || "",
      status: status || "Active",
    });

    await prescription.save();
    await prescription.populate("patient", "name email mobile");
    await prescription.populate("doctor", "name specialization");

    res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePrescription(req, res, next) {
  try {
    const { id } = req.params;
    const {
      medications,
      diagnosis,
      notes,
      status,
    } = req.body;

    const prescription = await Prescription.findByIdAndUpdate(
      id,
      {
        ...(medications && { medications }),
        ...(diagnosis && { diagnosis }),
        ...(notes !== undefined && { notes }),
        ...(status && { status }),
      },
      { new: true, runValidators: true }
    )
      .populate("patient", "name email mobile")
      .populate("doctor", "name specialization");

    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    res.json({
      success: true,
      message: "Prescription updated successfully",
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePrescription(req, res, next) {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findByIdAndDelete(id);

    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    res.json({
      success: true,
      message: "Prescription deleted successfully",
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
}
