import { Router } from "express";
import { getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment } from "../controllers/departmentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getDepartments);
router.get("/:id", getDepartmentById);

// Protected routes
router.post("/", protect, authorize("admin"), createDepartment);
router.put("/:id", protect, authorize("admin"), updateDepartment);
router.delete("/:id", protect, authorize("admin"), deleteDepartment);

export default router;
