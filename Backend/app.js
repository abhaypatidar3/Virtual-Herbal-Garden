// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// //import { ErrorHandler } from "./middleware/Error.js";
// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import multer from "multer";

// // const multer = require("multer");
// // const upload = multer({
// //   dest: "./upload",
// //   limits: {
// //     fileSize: 1000000,
// //   },
// // });

// // Config
// dotenv.config();
// const app = express();

// // Middlewares
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // app.use(
// //   fileUpload({
// //     useTempFiles: true,
// //     tempFileDir: "/tmp/",
// //   })
// // );

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);

// // Test route
// app.get("/", (req, res) => {
//   res.send("Server is live!");
// });

// // Error handling
// app.use(ErrorHandler);
// export default app;
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorMiddleware } from "./middleware/Error.js"; // ✅ correct import
import plantRoutes from "./routes/plantRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
dotenv.config();
const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("Server is live!");
});

// ✅ Centralized error middleware (must be last)
app.use(errorMiddleware);

export default app;
