import express from "express";
import { registerPost, userExist } from "../controller/register.js";
const router=express.Router();

router.post("/userCheck",userExist);
router.post("/",registerPost);

export default router;