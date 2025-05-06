import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (requiredRoles) => (req, res, next) => {
    const token = req.header("Authorization");
    console.log("Token");
    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN); 
        req.user = decoded; 
        console.log(requiredRoles);
        console.log(req.user.role);
        console.log(!requiredRoles.includes(req.user.role));
        if (!requiredRoles.includes(req.user.role) && req.user.role!=='Manager') {
            console.log("Access Denied");
            return res.status(403).json({ success: false, message: "Access denied" });
        }   
        next();
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid token" });
    }
};

export default authMiddleware;
