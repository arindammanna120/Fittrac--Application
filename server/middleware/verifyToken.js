// import jwt from "jsonwebtoken";
// import { createError } from "../error.js";

// export const verifyToken = async (req, res, next) => {
//   try {
//     if (!req.headers.authorization) {
//       return next(createError(401, "You are not authenticated!"));
//     }

//     const token = req.headers.authorization.split(" ")[1];

//     if (!token) return next(createError(401, "You are not authenticated"));

//     const decode = jwt.verify(token, process.env.JWT);
//     req.user = decode;
//     return next();
//   } catch (err) {
//     next(err);
//   }
// };

// import jwt from "jsonwebtoken";
// import { createError } from "../error.js";

// export const verifyToken = async (req, res, next) => {
//   try {
//     if (!req.headers.authorization) {
//       return next(createError(401, "No token provided. You are not authenticated!"));
//     }

//     const token = req.headers.authorization.split(" ")[1];

//     if (!token) return next(createError(401, "Invalid token format. You are not authenticated!"));

//     jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
//       if (err) {
//         return next(createError(403, "Invalid or expired token!"));
//       }
//       req.user = decode; // Attach decoded user data
//       next();
//     });
//   } catch (err) {
//     next(err);
//   }
// };






import jwt from "jsonwebtoken";
import { createError } from "../error.js";

// export const verifyToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return next(createError(401, "No token provided or invalid format. Use 'Bearer <token>'"));
//     }

//     const token = authHeader.split(" ")[1];

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         return next(createError(403, "Invalid or expired token!"));
//       }
//       req.user = decoded; // Attach decoded user data
//       next();
//     });
//   } catch (err) {
//     next(err);
//   }
// };




export const verifyToken = async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        return next(createError(401, "You are not authenticated!"));
      }
  
      const token = req.headers.authorization.split(" ")[1];
      console.log("Received Token:", token); 
  
      if (!token) return next(createError(401, "You are not authenticated"));
  
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      return next();
    } catch (err) {
        console.error("JWT Verification Error:", err);
      next(err);
    }
  };