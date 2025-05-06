import express from "express";
import {giftFieldCntl,giftFieldInputCntl,giftPost,giftValueCntl,giftDelete} from "../controller/gift.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/fields",authMiddleware(['Assistant_Manager']),giftFieldCntl);
router.get("/",authMiddleware(['Assistant_Manager']),giftValueCntl);
router.get("/input",authMiddleware(['Assistant_Manager']),giftFieldInputCntl);
router.post("/",authMiddleware(['Assistant_Manager']),giftPost);
router.post("/delete",authMiddleware(['Assistant_Manager']),giftDelete);

export default router;