import express from "express";
import {accountsFieldCntl,accountsFieldInputCntl,accountsPost,accountsValueCntl,accountsDelete} from "../controller/accounts.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/fields",authMiddleware(['Accountant']),accountsFieldCntl);
router.get("/",authMiddleware(['Accountant']),accountsValueCntl);
router.get("/input",authMiddleware([]),accountsFieldInputCntl);
router.post("/",authMiddleware([]),accountsPost);
router.post("/delete",authMiddleware([]),accountsDelete);

export default router;