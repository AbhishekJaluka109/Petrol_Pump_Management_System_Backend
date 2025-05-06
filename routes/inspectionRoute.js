import express from "express";
import {inspectionFieldCntl,inspectionFieldInputCntl,inspectionPost,inspectionValueCntl,inspectionDelete} from "../controller/inspection.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/fields",authMiddleware(['Assistant_Manager']),inspectionFieldCntl);
router.get("/",authMiddleware(['Assistant_Manager']),inspectionValueCntl);
router.get("/input",authMiddleware(['Assistant_Manager']),inspectionFieldInputCntl);
router.post("/",authMiddleware(['Assistant_Manager']),inspectionPost);
router.post("/delete",authMiddleware(['Assistant_Manager']),inspectionDelete);

export default router;