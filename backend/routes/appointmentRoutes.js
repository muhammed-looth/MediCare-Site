import { Router } from "express";
import { createAppointment, getAppointments, getAppointmentById, updateAppointment, deleteAppointment, updateAppointmentStatus } from "../controllers/appointmentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Protected routes
router.get("/", protect, getAppointments);
router.get("/:id", protect, getAppointmentById);
router.post("/", protect, createAppointment);
router.put("/:id", protect, updateAppointment);
router.patch("/:id/status", protect, authorize("admin", "doctor", "staff"), updateAppointmentStatus);
router.delete("/:id", protect, authorize("admin", "staff", "patient"), deleteAppointment);

export default router;
