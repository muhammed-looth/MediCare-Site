import { Router } from "express";
import { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor, getMyProfile, getDoctorsByDepartment } from "../controllers/doctorController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.get("/department/:departmentId", getDoctorsByDepartment);

// Protected routes
router.get("/profile/my", protect, authorize("doctor"), getMyProfile);
router.post("/", protect, authorize("admin"), createDoctor);
router.put("/:id", protect, authorize("admin", "doctor"), updateDoctor);
router.delete("/:id", protect, authorize("admin"), deleteDoctor);

export default router;
