import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", default: null },
    title: { type: String, required: true },
    reportType: { 
      type: String, 
      enum: ["Blood Test", "X-Ray", "Scan", "ECG", "Ultrasound", "General Checkup", "Follow-up", "Other"], 
      required: true 
    },
    findings: { type: String, required: true },
    recommendations: { type: String, default: "" },
    diagnosis: { type: String, default: "" },
    status: { type: String, enum: ["Normal", "Abnormal", "Pending"], default: "Pending" },
    severity: { type: String, enum: ["Mild", "Moderate", "Severe"], default: "Mild" },
    notes: { type: String, default: "" },
    reportUrl: { type: String, default: "" },
    followUpDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
