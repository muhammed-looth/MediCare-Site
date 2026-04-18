import mongoose from "mongoose";

const healthReportSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  reportType: { type: String, enum: ["Blood Test", "X-Ray", "Scan", "ECG", "Ultrasound", "Other"], required: true },
  reportUrl: { type: String, default: "" },
  findings: { type: String, default: "" },
  doctorName: { type: String, default: "" },
  status: { type: String, enum: ["Normal", "Abnormal", "Pending"], default: "Normal" },
});

const diseaseRecordSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  diseaseName: { type: String, required: true },
  severity: { type: String, enum: ["Mild", "Moderate", "Severe"], default: "Mild" },
  description: { type: String, default: "" },
  treatmentStatus: { type: String, enum: ["Active", "Recovered", "Chronic"], default: "Active" },
  doctorName: { type: String, default: "" },
});

const prescriptionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  medicineName: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  doctorName: { type: String, default: "" },
  notes: { type: String, default: "" },
});

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    age: { type: Number, default: null },
    gender: { type: String, default: "" },
    bloodGroup: { type: String, default: "" },
    address: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    medicalHistory: { type: String, default: "" },
    allergies: { type: String, default: "" },
    currentMedications: { type: String, default: "" },
    height: { type: String, default: "" },
    weight: { type: String, default: "" },
    bmi: { type: String, default: "" },
    healthStatus: { type: String, enum: ["Good", "Fair", "Critical"], default: "Good" },
    healthReports: [healthReportSchema],
    diseaseRecords: [diseaseRecordSchema],
    prescriptions: [prescriptionSchema],
  },
  { timestamps: true },
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
