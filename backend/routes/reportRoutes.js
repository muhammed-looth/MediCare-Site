import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyPatientReports,
  getMyPatients,
  getPatientById,
  createReport,
  updateReport,
  deleteReport,
  getPatientReports,
} from "../controllers/reportController.js";

const router = express.Router();

// Protected routes - doctor only
router.get("/my-reports", protect, getMyPatientReports);
router.get("/my-patients", protect, getMyPatients);
router.post("/", protect, createReport);
router.get("/patient/:patientId/reports", getPatientReports);
router.put("/:reportId", protect, updateReport);
router.delete("/:reportId", protect, deleteReport);

// Public route - get patient details
router.get("/patient/:patientId", getPatientById);

export default router;
