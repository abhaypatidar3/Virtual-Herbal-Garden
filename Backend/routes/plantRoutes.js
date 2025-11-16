// routes/plantRoutes.js
import express from "express";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { verifyToken, authorizeRoles } from "../middleware/AuthMiddleware.js";
import {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
} from "../controllers/PlantController.js";
import upload from "../config/cloudinary.js";

const router = express.Router();

// ✅ Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "virtual_herbal_garden",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

// ========================================
// PUBLIC ROUTES
// ========================================

// Get all plants (public - no pagination)
router.get("/", getAllPlants);

// Get single plant by ID (public)
router.get("/:plantId", getPlantById);

// ========================================
// ADMIN ROUTES (Super-admin only)
// ========================================

// Create new plant
router.post(
  "/",
  verifyToken,
  authorizeRoles("super-admin"),
  upload.single("image"),
  createPlant
);

// Update plant
router.put(
  "/:plantId",
  verifyToken,
  authorizeRoles("super-admin"),
  upload.single("image"),
  updatePlant
);

// Delete plant
router.delete(
  "/:plantId",
  verifyToken,
  authorizeRoles("super-admin"),
  deletePlant
);

export default router;