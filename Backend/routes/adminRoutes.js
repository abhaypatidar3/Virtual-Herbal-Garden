// routes/adminRoutes.js
import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAnalytics,
  getSystemLogs,
} from "../controllers/AdminController.js";
import { verifyToken, authorizeRoles } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// ========================================
// MIDDLEWARE: All admin routes require super-admin role
// ========================================
router.use(verifyToken);
router.use(authorizeRoles("super-admin"));

// ========================================
// DASHBOARD
// ========================================
router.get("/dashboard/stats", getDashboardStats);

// ========================================
// USER MANAGEMENT
// ========================================
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.put("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);

// ========================================
// PLANT MANAGEMENT
// ========================================
import {
  getAllPlantsAdmin,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
} from "../controllers/PlantController.js";

router.get("/plants", getAllPlantsAdmin);
router.get("/plants/:plantId", getPlantById);
router.post("/plants", createPlant);
router.put("/plants/:plantId", updatePlant);
router.delete("/plants/:plantId", deletePlant);

// ========================================
// ANALYTICS & LOGS
// ========================================
router.get("/analytics", getAnalytics);
router.get("/logs", getSystemLogs);

export default router;