import express from "express";
import {productDelete, productFieldCntl,productFieldInputCntl,productPost,productValueCntl} from "../controller/product.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/fields",authMiddleware(['Assistant_Manager',,'Accountant']),productFieldCntl);
router.get("/",authMiddleware(['Assistant_Manager','Accountant']),productValueCntl);
router.get("/input",authMiddleware([]),productFieldInputCntl);
router.post("/",authMiddleware([]),productPost);
router.post("/delete",authMiddleware([]),productDelete);

export default router;