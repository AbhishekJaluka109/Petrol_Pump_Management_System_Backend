import express from "express";
import { moduleCntl } from "../controller/module.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router=express.Router();

router.get("/",authMiddleware(['Manager', 'Pump_Operator', 'Technician', 'Cleaner', 'Accountant' , 'Assistant_Manager', 'Sales_person']),moduleCntl);

export default router;