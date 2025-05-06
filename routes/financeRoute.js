import express from "express";
import {financeFieldCntl,financeFieldInputCntl,financePost,financeValueCntl,financeDelete} from "../controller/finance.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/fields",authMiddleware(['Accountant']),financeFieldCntl);
router.get("/",authMiddleware(['Accountant']),financeValueCntl);
router.get("/input",authMiddleware([]),financeFieldInputCntl);
router.post("/",authMiddleware([]),financePost);
router.post("/delete",authMiddleware([]),financeDelete);

export default router;