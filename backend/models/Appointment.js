import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    patientName: { type: String, required: true, trim: true },
    doctorName: { type: String, required: true, trim: true },
    departmentName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Canceled", "Rescheduled"],
      default: "Pending",
    },
    fee: { type: Number, default: 0 },
    createdByRole: {
      type: String,
      enum: ["admin", "doctor", "staff", "patient"],
      default: "patient",
    },
  },
  { timestamps: true },
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
