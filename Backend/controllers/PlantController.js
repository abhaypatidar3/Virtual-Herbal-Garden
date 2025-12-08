// controllers/PlantController.js
import Plant from "../models/Plant.js";
import { ErrorHandler } from "../middleware/Error.js";

// ========================================
// GET ALL PLANTS (Admin - with pagination)
// ========================================
export const getAllPlantsAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {};
    
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const total = await Plant.countDocuments(query);
    const plants = await Plant.find(query)
      .sort("-createdAt")
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(200).json({
      success: true,
      plants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error("Error in getAllPlantsAdmin:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// ========================================
// GET SINGLE PLANT BY ID
// ========================================
export const getPlantById = async (req, res, next) => {
  try {
    const { plantId } = req.params;

    const plant = await Plant.findById(plantId);

    if (!plant) {
      return next(new ErrorHandler("Plant not found", 404));
    }

    res.status(200).json({
      success: true,
      plant
    });
  } catch (error) {
    console.error("Error in getPlantById:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// ========================================
// CREATE NEW PLANT (Admin only)
// ========================================
export const createPlant = async (req, res, next) => {
  try {
    const { name, image } = req.body;

    if (!name || !name.trim()) {
      return next(new ErrorHandler("Plant name is required", 400));
    }

    // Check if plant already exists
    const existingPlant = await Plant.findOne({ name: name.trim() });
    if (existingPlant) {
      return next(new ErrorHandler("Plant with this name already exists", 400));
    }

    const plant = await Plant.create({
      name: name.trim(),
      image: image || ""
    });

    res.status(201).json({
      success: true,
      message: "Plant created successfully",
      plant
    });
  } catch (error) {
    console.error("Error in createPlant:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// ========================================
// UPDATE PLANT (Admin only)
// ========================================
export const updatePlant = async (req, res, next) => {
  try {
    const { plantId } = req.params;
    const { name, image } = req.body;

    const plant = await Plant.findById(plantId);

    if (!plant) {
      return next(new ErrorHandler("Plant not found", 404));
    }

    // Check for duplicate name if name is being changed
    if (name && name !== plant.name) {
      const existingPlant = await Plant.findOne({
        name: name.trim(),
        _id: { $ne: plantId }
      });
      if (existingPlant) {
        return next(new ErrorHandler("Plant with this name already exists", 400));
      }
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (image !== undefined) updateData.image = image;

    const updatedPlant = await Plant.findByIdAndUpdate(
      plantId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Plant updated successfully",
      plant: updatedPlant
    });
  } catch (error) {
    console.error("Error in updatePlant:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// ========================================
// DELETE PLANT (Admin only)
// ========================================
export const deletePlant = async (req, res, next) => {
  try {
    const { plantId } = req.params;

    const plant = await Plant.findByIdAndDelete(plantId);

    if (!plant) {
      return next(new ErrorHandler("Plant not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Plant deleted successfully"
    });
  } catch (error) {
    console.error("Error in deletePlant:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

// ========================================
// GET ALL PLANTS (Public - no pagination)
// ========================================
export const getAllPlants = async (req, res, next) => {
  try {
    const plants = await Plant.find().sort("-createdAt");

    res.status(200).json({
      success: true,
      plants
    });
  } catch (error) {
    console.error("Error in getAllPlants:", error);
    next(new ErrorHandler(error.message, 500));
  }
};
