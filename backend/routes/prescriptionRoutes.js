import { Router } from "express";
import {
  getPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  createPrescription,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes (protected with auth)
router.use(protect);

router.get("/", getPrescriptions);
router.get("/:id", getPrescriptionById);
router.get("/patient/:patientId", getPrescriptionsByPatient);
router.get("/doctor/:doctorId", getPrescriptionsByDoctor);
router.post("/", createPrescription);
router.put("/:id", updatePrescription);
router.delete("/:id", deletePrescription);

export default router;
