// controllers/plantController.js
import Plant from "../models/Plant.js";
import { ErrorHandler } from "../middleware/Error.js";
import cloudinary from "../config/cloudinary.js";

// 🪴 Add new plant
export const addPlant = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) return next(new ErrorHandler("Plant name is required", 400));
    if (!req.file?.path)
      return next(new ErrorHandler("Image is required", 400));

    const existing = await Plant.findOne({ name });
    if (existing) return next(new ErrorHandler("Plant already exists", 400));

    // Cloudinary already uploaded file → req.file.path is the URL
    const imageUrl = req.file.path;

    const plant = await Plant.create({ name, image: imageUrl });

    res.status(201).json({
      success: true,
      message: "Plant added successfully",
      plant,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

// 🌿 Delete plant
export const deletePlant = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if plant exists
    const plant = await Plant.findById(id);
    if (!plant) {
      return next(new ErrorHandler("Plant not found", 404));
    }

    // 🌿 Delete image from Cloudinary if exists
    if (plant.image) {
      try {
        // Extract Cloudinary public_id safely
        const publicId = plant.image
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0]; // e.g. "virtual_herbal_garden/tulsi"
        await cloudinary.uploader.destroy(publicId);
        console.log("🧹 Cloudinary image deleted:", publicId);
      } catch (cloudErr) {
        console.error("⚠️ Cloudinary delete error:", cloudErr.message);
      }
    }

    // 🌱 Delete from MongoDB
    await plant.deleteOne();

    res.status(200).json({
      success: true,
      message: "Plant deleted successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

// 🌾 Get all plants
export const getPlants = async (req, res, next) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, plants });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};
export const updatePlant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const plant = await Plant.findById(id);
    if (!plant) return next(new ErrorHandler("Plant not found", 404));

    // Update name (if provided)
    if (name) {
      plant.name = name;
    }

    // Handle new image upload
    if (req.file?.path) {
      try {
        // Delete old image from Cloudinary
        if (plant.image) {
          const publicId = plant.image
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0]; // e.g. "virtual_herbal_garden/tulsi"
          await cloudinary.uploader.destroy(publicId);
        }

        // Replace with new Cloudinary image
        plant.image = req.file.path;
      } catch (cloudErr) {
        console.error("Cloudinary update error:", cloudErr.message);
      }
    }

    await plant.save();

    res.status(200).json({
      success: true,
      message: "Plant updated successfully",
      plant,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};
