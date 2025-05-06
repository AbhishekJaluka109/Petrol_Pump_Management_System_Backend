import express from "express";
import {salesDelete, salesFieldCntl,salesFieldInputCntl,salesPost,salesValueCntl} from "../controller/sales.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/fields",authMiddleware(['Pump_Operator','Assistant_Manager','Accountant']),salesFieldCntl);
router.get("/",authMiddleware(['Pump_Operator','Assistant_Manager','Accountant']),salesValueCntl);
router.get("/input",authMiddleware(['Pump_Operator']),salesFieldInputCntl);
router.post("/",authMiddleware(['Pump_Operator']),salesPost);
router.post("/delete",authMiddleware(['Pump_Operator']),salesDelete);

export default router;