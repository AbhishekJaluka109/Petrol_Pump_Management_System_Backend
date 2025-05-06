import express from "express";
import {rolesDelete, rolesFieldCntl,rolesFieldInputCntl,rolesPost,rolesValueCntl} from "../controller/task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/fields",authMiddleware(['Manager', 'Pump_Operator', 'Technician', 'Cleaner', 'Accountant' , 'Assistant_Manager', 'Sales_person']),rolesFieldCntl);
router.get("/",authMiddleware(['Manager', 'Pump_Operator', 'Technician', 'Cleaner', 'Accountant' , 'Assistant_Manager', 'Sales_person']),rolesValueCntl);
router.get("/input",authMiddleware([ 'Assistant_Manager']),rolesFieldInputCntl);
router.post("/",authMiddleware(['Assistant_Manager']),rolesPost);
router.post("/delete",authMiddleware([ 'Assistant_Manager']),rolesDelete);

export default router;