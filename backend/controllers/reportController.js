import Report from "../models/Report.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";

// Get all reports for a doctor's patients
export const getMyPatientReports = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const reports = await Report.find({ doctor: doctor._id })
      .populate("patient", "name email phone age gender")
      .populate("appointment", "date time")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all unique patients for a doctor (from appointments)
export const getMyPatients = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Get unique patients from appointments
    const Appointment = (await import("../models/Appointment.js")).default;
    const appointments = await Appointment.find({ doctor: doctor._id })
      .distinct("patient");

    const patients = await Patient.find({ _id: { $in: appointments } })
      .select("name email phone age gender bloodGroup medicalHistory healthStatus");

    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single patient details
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new report
export const createReport = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const { patientId, appointmentId, title, reportType, findings, recommendations, diagnosis, status, severity, notes, followUpDate } = req.body;

    // Validate patient exists and is connected to this doctor
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const report = new Report({
      doctor: doctor._id,
      patient: patientId,
      appointment: appointmentId || null,
      title,
      reportType,
      findings,
      recommendations,
      diagnosis,
      status,
      severity,
      notes,
      followUpDate: followUpDate || null,
    });

    await report.save();

    // Add report to patient's health records
    patient.healthReports.push({
      date: new Date(),
      reportType,
      findings,
      doctorName: doctor.name,
      status,
    });
    await patient.save();

    const populated = await report.populate("patient", "name email phone").populate("doctor", "name specialization");

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update report
export const updateReport = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const report = await Report.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    if (report.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this report" });
    }

    const { title, reportType, findings, recommendations, diagnosis, status, severity, notes, followUpDate } = req.body;

    if (title) report.title = title;
    if (reportType) report.reportType = reportType;
    if (findings) report.findings = findings;
    if (recommendations) report.recommendations = recommendations;
    if (diagnosis) report.diagnosis = diagnosis;
    if (status) report.status = status;
    if (severity) report.severity = severity;
    if (notes !== undefined) report.notes = notes;
    if (followUpDate) report.followUpDate = followUpDate;

    await report.save();

    const updated = await report.populate("patient", "name email phone").populate("doctor", "name specialization");

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete report
export const deleteReport = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const report = await Report.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    if (report.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this report" });
    }

    await Report.findByIdAndDelete(req.params.reportId);

    res.status(200).json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reports for a specific patient
export const getPatientReports = async (req, res) => {
  try {
    const { patientId } = req.params;
    const reports = await Report.find({ patient: patientId })
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching patient reports:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
