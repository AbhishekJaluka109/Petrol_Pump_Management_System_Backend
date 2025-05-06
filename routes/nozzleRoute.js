import express from "express";
import {nozzleDelete, NozzleFieldCntl,NozzleFieldInputCntl,NozzlePost,NozzleValueCntl} from "../controller/nozzle.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();
router.get("/fields",authMiddleware(['Assistant_Manager']),NozzleFieldCntl);
router.get("/",authMiddleware(['Assistant_Manager']),NozzleValueCntl);
router.get("/input",authMiddleware(['Assistant_Manager']),NozzleFieldInputCntl);
router.post("/",authMiddleware(['Assistant_Manager']),NozzlePost);
router.post("/delete",authMiddleware(['Assistant_Manager']),nozzleDelete);

export default router;