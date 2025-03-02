import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
    console.log("Cookies Received:", req.cookies);

    const token = req.cookies.access_token; 
    if (!token) {
        return next(errorHandler(401, "Unauthorized: No token provided"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(errorHandler(403, "Forbidden: Invalid token"));
        }
        req.user = decoded; 
        console.log("Decoded Token:", req.user); 
        next();
    });
};
