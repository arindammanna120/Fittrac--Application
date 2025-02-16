import express from "express";
import {  UserLogin,
    UserRegister,
    addWorkout,
    getUserDashboard,
    getWorkoutsByDate,

} from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router=express.Router();

// Debugging Log
console.log("📌 User routes loaded");

router.use((req, res, next) => {
    console.log(`📢 User Route Hit: ${req.method} ${req.url}`);
    next();
  });


router.get("/", (req, res) => {
    res.status(200).json({ message: "User route is working!" });
  });


router.post("/signup",UserRegister);
router.post("/signin",UserLogin);


router.get("/dashboard",verifyToken,getUserDashboard);
router.get("/workout", verifyToken, getWorkoutsByDate);
router.post("/workout", verifyToken, addWorkout);

export default router;