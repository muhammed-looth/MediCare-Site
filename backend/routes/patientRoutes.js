import { Router } from "express";
import { getPatients, getPatientById, updatePatient, deletePatient, getMyProfile } from "../controllers/patientController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", protect, authorize("admin", "staff"), getPatients);
router.get("/:id", protect, authorize("admin", "staff", "doctor"), getPatientById);

// Protected routes
router.get("/profile/my", protect, authorize("patient"), getMyProfile);
router.put("/:id", protect, authorize("admin", "patient"), updatePatient);
router.delete("/:id", protect, authorize("admin"), deletePatient);

export default router;
