import express from "express";
import {purchaseDelete, purchaseFieldCntl,purchaseFieldInputCntl,purchasePost,purchaseValueCntl} from "../controller/purchase.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router=express.Router();

router.get("/fields",authMiddleware(['Assistant_Manager','Accountant']),purchaseFieldCntl);
router.get("/",authMiddleware(['Assistant_Manager','Accountant']),purchaseValueCntl);
router.get("/input",authMiddleware(['Assistant_Manager']),purchaseFieldInputCntl);
router.post("/",authMiddleware(['Assistant_Manager']),purchasePost);
router.post("/delete",authMiddleware(['Assistant_Manager']),purchaseDelete);

export default router;