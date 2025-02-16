








import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";

dotenv.config();

// User Registration
// export const UserRegister = async (req, res, next) => {
//     try {
//         console.log("Signup request received:", req.body);  // Debugging
        
//         const { email, password, name, img } = req.body;

//         if (!email || !password || !name) {
//             return next(createError(400, "All fields are required."));
//         }

//         // Check if the email is already used
//         const existingUser = await User.findOne({ email }).exec();
//         if (existingUser) {
//             return next(createError(409, "Email is already in use."));
//         }

//         // Hash the password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create a new user
//         const user = new User({
//             name,
//             email,
//             password: hashedPassword,
//             img,
//         });

//         const createdUser = await user.save();
//         console.log("User created:", createdUser);

//         // Generate JWT token
//         const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
//             expiresIn: "7d",  // Set a reasonable expiry time
//         });

//         console.log("✅ Token Generated:", token);

//         return res.status(201).json({ token, user });
//     } catch (error) {
//         console.error("Error in UserRegister:", error);
//         return next(error);
//     }
// };

// // User Login
// export const UserLogin = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return next(createError(400, "Email and password are required."));
//         }

//         const user = await User.findOne({ email }).exec();
//         if (!user) {
//             return next(createError(404, "User not found."));
//         }

//         // Compare password
//         const isPasswordCorrect = await bcrypt.compare(password, user.password);
//         if (!isPasswordCorrect) {
//             return next(createError(403, "Incorrect password."));
//         }

//         // Generate JWT token
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//             expiresIn: "7d",
//         });

//         return res.status(200).json({ token, user });
//     } catch (error) {
//         console.error("Error in UserLogin:", error);
//         return next(error);
//     }
// };

// // Get User Dashboard
// export const getUserDashboard = async (req, res, next) => {
//     try {
//         const userId = req.user?.id;
//         const user = await User.findById(userId);
//         if (!user) {
//             return next(createError(404, "User not found."));
//         }

//         const startToday = new Date();
//         startToday.setHours(0, 0, 0, 0);
//         const endToday = new Date();
//         endToday.setHours(23, 59, 59, 999);

//         // Calculate total calories burnt
//         const totalCaloriesBurnt = await Workout.aggregate([
//             { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
//             { $group: { _id: null, totalCaloriesBurnt: { $sum: "$caloriesBurned" } } },
//         ]);

//         const totalWorkouts = await Workout.countDocuments({
//             user: userId,
//             date: { $gte: startToday, $lt: endToday },
//         });

//         return res.status(200).json({
//             totalCaloriesBurnt: totalCaloriesBurnt.length > 0 ? totalCaloriesBurnt[0].totalCaloriesBurnt : 0,
//             totalWorkouts,
//         });
//     } catch (err) {
//         console.error("Error in getUserDashboard:", err);
//         next(err);
//     }
// };

// // Get Workouts by Date
// export const getWorkoutsByDate = async (req, res, next) => {
//     try {
//         const userId = req.user?.id;
//         const user = await User.findById(userId);
//         if (!user) {
//             return next(createError(404, "User not found."));
//         }

//         const date = req.query.date ? new Date(req.query.date) : new Date();
//         const startOfDay = new Date(date.setHours(0, 0, 0, 0));
//         const endOfDay = new Date(date.setHours(23, 59, 59, 999));

//         const todaysWorkouts = await Workout.find({
//             user: userId,
//             date: { $gte: startOfDay, $lt: endOfDay },
//         });

//         const totalCaloriesBurnt = todaysWorkouts.reduce((total, workout) => total + workout.caloriesBurned, 0);

//         return res.status(200).json({ todaysWorkouts, totalCaloriesBurnt });
//     } catch (err) {
//         console.error("Error in getWorkoutsByDate:", err);
//         next(err);
//     }
// };

// // Add Workout
// export const addWorkout = async (req, res, next) => {
//     try {
//         const userId = req.user?.id;
//         const { workoutString } = req.body;

//         if (!workoutString) {
//             return next(createError(400, "Workout string is missing."));
//         }

//         // Split workouts
//         const workouts = workoutString.split(";").map((w) => w.trim());

//         const categories=workouts.filter((line)=>line.startsWith("#"));

//         if (categories.length === 0) {
//             return next(createError(400, "Invalid workout format."));
//         }

//         const parsedWorkouts = workouts.map((workout) => {
//             const [category, name, setsReps, weight, duration] = workout.split("\n").map((w) => w.trim());
//             return {
//                 category: category.replace("#", ""),
//                 workoutName: name.replace("-", ""),
//                 sets: parseInt(setsReps.split("sets")[0].trim()),
//                 reps: parseInt(setsReps.split("reps")[0].trim()),
//                 weight: parseFloat(weight.replace("kg", "").trim()),
//                 duration: parseFloat(duration.replace("min", "").trim()),
//                 caloriesBurned: parseFloat(duration.replace("min", "").trim()) * 5,
//             };
//         });

//         await Workout.insertMany(parsedWorkouts.map((w) => ({ ...w, user: userId })));

//         return res.status(201).json({ message: "Workouts added successfully", workouts: parsedWorkouts });
//     } catch (err) {
//         console.error("Error in addWorkout:", err);
//         next(err);
//     }
// };










export const UserRegister = async (req, res, next) => {
    try {
      const { email, password, name, img } = req.body;
  
      // Check if the email is in use
      const existingUser = await User.findOne({ email }).exec();
      if (existingUser) {
        return next(createError(409, "Email is already in use."));
      }
  
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      const user = new User({
        name,
        email,
        password: hashedPassword,
        img,
      });
      const createdUser = await user.save();
      const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).json({ token, user });
    } catch (error) {
      return next(error);
    }
  };
  
  export const UserLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email: email });
      // Check if user exists
      if (!user) {
        return next(createError(404, "User not found"));
      }
      console.log(user);
      // Check if password is correct
      const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
      if (!isPasswordCorrect) {
        return next(createError(403, "Incorrect password"));
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d", //9999 years
      });
  
      return res.status(200).json({ token, user });
    } catch (error) {
      return next(error);
    }
  };
  
  export const getUserDashboard = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const user = await User.findById(userId);
      if (!user) {
        return next(createError(404, "User not found"));
      }
  
      const currentDateFormatted = new Date();
      const startToday = new Date(
        currentDateFormatted.getFullYear(),
        currentDateFormatted.getMonth(),
        currentDateFormatted.getDate()
      );
      const endToday = new Date(
        currentDateFormatted.getFullYear(),
        currentDateFormatted.getMonth(),
        currentDateFormatted.getDate() + 1
      );
  
      //calculte total calories burnt
      const totalCaloriesBurnt = await Workout.aggregate([
        { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
        {
          $group: {
            _id: null,
            totalCaloriesBurnt: { $sum: "$caloriesBurned" },
          },
        },
      ]);
  
      //Calculate total no of workouts
      const totalWorkouts = await Workout.countDocuments({
        user: userId,
        date: { $gte: startToday, $lt: endToday },
      });
  
      //Calculate average calories burnt per workout
      const avgCaloriesBurntPerWorkout =
        totalCaloriesBurnt.length > 0
          ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkouts
          : 0;
  
      // Fetch category of workouts
      const categoryCalories = await Workout.aggregate([
        { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
        {
          $group: {
            _id: "$category",
            totalCaloriesBurnt: { $sum: "$caloriesBurned" },
          },
        },
      ]);
  
      //Format category data for pie chart
  
      const pieChartData = categoryCalories.map((category, index) => ({
        id: index,
        value: category.totalCaloriesBurnt,
        label: category._id,
      }));
  
      const weeks = [];
      const caloriesBurnt = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(
          currentDateFormatted.getTime() - i * 24 * 60 * 60 * 1000
        );
        weeks.push(`${date.getDate()}th`);
  
        const startOfDay = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
        const endOfDay = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 1
        );
  
        const weekData = await Workout.aggregate([
          {
            $match: {
              user: user._id,
              date: { $gte: startOfDay, $lt: endOfDay },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              totalCaloriesBurnt: { $sum: "$caloriesBurned" },
            },
          },
          {
            $sort: { _id: 1 }, // Sort by date in ascending order
          },
        ]);
  
        caloriesBurnt.push(
          weekData[0]?.totalCaloriesBurnt ? weekData[0]?.totalCaloriesBurnt : 0
        );
      }
  
      return res.status(200).json({
        totalCaloriesBurnt:
          totalCaloriesBurnt.length > 0
            ? totalCaloriesBurnt[0].totalCaloriesBurnt
            : 0,
        totalWorkouts: totalWorkouts,
        avgCaloriesBurntPerWorkout: avgCaloriesBurntPerWorkout,
        totalWeeksCaloriesBurnt: {
          weeks: weeks,
          caloriesBurned: caloriesBurnt,
        },
        pieChartData: pieChartData,
      });
    } catch (err) {
      next(err);
    }
  };
  
  export const getWorkoutsByDate = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const user = await User.findById(userId);
      let date = req.query.date ? new Date(req.query.date) : new Date();
      if (!user) {
        return next(createError(404, "User not found"));
      }
      const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      );
  
      const todaysWorkouts = await Workout.find({
        userId: userId,
        date: { $gte: startOfDay, $lt: endOfDay },
      });
      const totalCaloriesBurnt = todaysWorkouts.reduce(
        (total, workout) => total + workout.caloriesBurned,
        0
      );
  
      return res.status(200).json({ todaysWorkouts, totalCaloriesBurnt });
    } catch (err) {
      next(err);
    }
  };
  
  export const addWorkout = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const { workoutString } = req.body;
      if (!workoutString) {
        return next(createError(400, "Workout string is missing"));
      }
      // Split workoutString into lines remove ;
      const eachworkout = workoutString.split(";").map((line) => line.trim());
      // Check if any workouts start with "#" to indicate categories
      const categories = eachworkout.filter((line) => line.startsWith("#"));
      if (categories.length === 0) {
        return next(createError(400, "No categories found in workout string"));
      }
  
      const parsedWorkouts = [];
      let currentCategory = "";
      let count = 0;
  
      // Loop through each line to parse workout details
      await eachworkout.forEach((line) => {
        count++;
        if (line.startsWith("#")) {
            // remove ? mark and \n
          const parts = line?.split("/n").map((part) => part.trim());
          console.log(parts);
          if (parts.length < 5) {
            return next(
              createError(400, `Workout string is missing for ${count}th workout`)
            );
          }
  
          // Update current category
          currentCategory = parts[0].substring(1).trim();
          // Extract workout details
          const workoutDetails = parseWorkoutLine(parts);
          if (workoutDetails == null) {
            return next(createError(400, "Please enter in proper format "));
          }
  
          if (workoutDetails) {
            // Add category to workout details
            workoutDetails.category = currentCategory;
            parsedWorkouts.push(workoutDetails);
          }
        } else {
          return next(
            createError(400, `Workout string is missing for ${count}th workout`)
          );
        }
      });
  
      // Calculate calories burnt for each workout
      await parsedWorkouts.forEach(async (workout) => {
        workout.caloriesBurned = parseFloat(calculateCaloriesBurnt(workout));
        await Workout.create({ ...workout, user: userId });
      });
  
      return res.status(201).json({
        message: "Workouts added successfully",
        workouts: parsedWorkouts,
      });
    } catch (err) {
      next(err);
    }
  };
  
  // Function to parse workout details from a line
  const parseWorkoutLine = (parts) => {
    const details = {};
    console.log(parts);
    if (parts.length >= 5) {
      details.workoutName = parts[1].substring(1).trim();
      details.sets = parseInt(parts[2].split("sets")[0].substring(1).trim());
      details.reps = parseInt(
        parts[2].split("sets")[1].split("reps")[0].substring(1).trim()
      );
      details.weight = parseFloat(parts[3].split("kg")[0].substring(1).trim());
      details.duration = parseFloat(parts[4].split("min")[0].substring(1).trim());
      console.log(details);
      return details;
    }
    return null;
  };
  
  // Function to calculate calories burnt for a workout
  const calculateCaloriesBurnt = (workoutDetails) => {
    const durationInMinutes = parseInt(workoutDetails.duration);
    const weightInKg = parseInt(workoutDetails.weight);
    const caloriesBurntPerMinute = 5; // Sample value, actual calculation may vary
    return durationInMinutes * caloriesBurntPerMinute * weightInKg;
  };



