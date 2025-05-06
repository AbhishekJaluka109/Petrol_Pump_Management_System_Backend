import express from "express";
import {employeeFieldCntl,employeeFieldInputCntl,employeePost,employeeValueCntl,employeeDelete} from "../controller/employee.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router=express.Router();

router.get("/fields",authMiddleware(['Assistant_Manager']),employeeFieldCntl);
router.get("/",authMiddleware(['Assistant_Manager']),employeeValueCntl);
router.get("/input",authMiddleware([]),employeeFieldInputCntl);
router.post("/",authMiddleware([]),employeePost);
router.post("/delete",authMiddleware([]),employeeDelete);

export default router;