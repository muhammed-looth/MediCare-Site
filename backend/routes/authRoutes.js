import { Router } from "express";
import { getCurrentUser, loginUser, registerPatient, registerAdmin, registerDoctor, registerStaff } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.post("/register", registerPatient);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getCurrentUser);

// Admin-only routes
router.post("/register-admin", protect, authorize("admin"), registerAdmin);
router.post("/register-doctor", protect, authorize("admin"), registerDoctor);
router.post("/register-staff", protect, authorize("admin"), registerStaff);

export default router;
