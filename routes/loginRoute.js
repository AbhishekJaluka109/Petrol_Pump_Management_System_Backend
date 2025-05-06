import express from "express";
import { loginPost, userExist } from "../controller/login.js";
const router=express.Router();

router.post("/userCheck",userExist);
router.post("/",loginPost);

export default router;