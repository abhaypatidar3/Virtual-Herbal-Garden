// routes/plantRoutes.js
import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { verifyToken, authorizeRoles } from "../middleware/AuthMiddleware.js";
import {
  addPlant,
  deletePlant,
  getPlants,
  updatePlant,
} from "../controllers/plantController.js";
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

// 🌿 Public
router.get("/", getPlants);

// 🪴 Super-admin only
router.post(
  "/",
  verifyToken,
  authorizeRoles("super-admin"),
  upload.single("image"),
  addPlant
);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("super-admin"),
  upload.single("image"),
  updatePlant
);
router.delete("/:id", verifyToken, authorizeRoles("super-admin"), deletePlant);

export default router;
