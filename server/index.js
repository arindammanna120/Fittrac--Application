



import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";


dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true })); // for form data

console.log("⚡ Server is starting...");

// Debugging logs
app.use((req, res, next) => {
  console.log(`➡ Incoming Request: ${req.method} ${req.url}`);
  next();
});



//Mount routes
app.use("/api/user",UserRoutes);


// error handler
// app.use((err, req, res, next) => {
  
//   const status = err.status || 500;
//   const message = err.message || "Something went wrong";
//   return res.status(status).json({
//     success: false,
//     status,
//     message,
//   });
// });


app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Something went wrong" });
});


// Test route
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello developers from Arindam",
  });
});

const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to Mongo DB"))
    .catch((err) => {
      console.error("failed to connect with mongo");
      console.error(err);
    });
};

const startServer = async () => {
  try {
    connectDB();
    app.listen(8080, () => console.log("Server started on port 8080"));
  } catch (error) {
    console.log(error);
  }
};

startServer();
