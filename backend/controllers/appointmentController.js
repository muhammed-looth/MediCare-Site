import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

export async function getAppointments(req, res, next) {
  try {
    let filter = {};

    // Patients can only see their own appointments
    if (req.user.role === "patient") {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient) {
        res.status(404);
        throw new Error("Patient profile not found.");
      }
      filter.patient = patient._id;
    }

    // Doctors can see appointments assigned to them
    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor) {
        res.status(404);
        throw new Error("Doctor profile not found.");
      }
      filter.doctor = doctor._id;
    }

    const appointments = await Appointment.find(filter)
      .populate("patient", "name phone email")
      .populate("doctor", "name specialization")
      .populate("department", "name")
      .sort({ date: -1, time: -1 });

    res.json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
}

export async function getAppointmentById(req, res, next) {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name phone email")
      .populate("doctor", "name specialization")
      .populate("department", "name");

    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found.");
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
}

export async function createAppointment(req, res, next) {
  try {
    const { patientId, doctorId, date, time, notes = "" } = req.body;

    if (!patientId || !doctorId || !date || !time) {
      res.status(400);
      throw new Error("patientId, doctorId, date, and time are required.");
    }

    const [patient, doctor] = await Promise.all([
      Patient.findOne({ $or: [{ _id: patientId }, { user: patientId }] }),
      Doctor.findById(doctorId).populate("department", "name"),
    ]);

    if (!patient) {
      res.status(404);
      throw new Error("Patient not found.");
    }

    if (!doctor) {
      res.status(404);
      throw new Error("Doctor not found.");
    }

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      department: doctor.department?._id,
      patientName: patient.name,
      doctorName: doctor.name,
      departmentName: doctor.department?.name || "",
      mobile: patient.phone || "",
      date,
      time,
      notes,
      fee: doctor.fee || 0,
      createdByRole: req.user?.role || "patient",
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
}

export async function updateAppointment(req, res, next) {
  try {
    const { id } = req.params;
    const { date, time, notes, status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found.");
    }

    // Authorization: only the involved parties or admin can update
    if (req.user.role === "patient") {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient || appointment.patient.toString() !== patient._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to update this appointment.");
      }
    } else if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to update this appointment.");
      }
    }
    // admin can update any appointment

    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (notes) appointment.notes = notes;
    if (status) appointment.status = status;

    const updated = await appointment.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteAppointment(req, res, next) {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found.");
    }

    await Appointment.findByIdAndDelete(id);
    res.json({ success: true, message: "Appointment deleted successfully." });
  } catch (error) {
    next(error);
  }
}

export async function updateAppointmentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400);
      throw new Error("Status is required.");
    }

    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true })
      .populate("patient", "name phone email")
      .populate("doctor", "name specialization")
      .populate("department", "name");

    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found.");
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
}
