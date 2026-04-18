import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    specialization: { type: String, required: true, trim: true },
    qualifications: { type: String, default: "" },
    experience: { type: String, default: "" },
    location: { type: String, default: "" },
    about: { type: String, default: "" },
    fee: { type: Number, default: 0, min: 0 },
    availability: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
    imageUrl: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    patients: { type: String, default: "" },
    success: { type: String, default: "" },
    schedule: { type: Map, of: [String], default: {} },
  },
  { timestamps: true },
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
