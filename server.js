import express from "express";
import dotenv from "dotenv";
import {connectDB} from './config/db.js';
import giftRouter from "./routes/giftRoutes.js";
import nozzleRouter from "./routes/nozzleRoute.js";
import salesRouter from "./routes/salesRoute.js";
import productRouter from "./routes/productRoute.js";
import employeeRouter from "./routes/employeeRoute.js";
import rolesRouter from "./routes/rolesRoute.js";
import registerRouter from "./routes/registerRoute.js";
import loginRouter from "./routes/loginRoute.js";
import cors from "cors";
import inspectionRouter from "./routes/inspectionRoute.js";
import purchaseRouter from "./routes/purchaseRoute.js";
import moduleRouter from "./routes/moduleRoute.js";
import financeRouter from "./routes/financeRoute.js";
import accountsRouter from "./routes/accountsRoute.js";
import jwt from "jsonwebtoken";

dotenv.config();
const app=express();
const port=process.env.PORT;
console.log(port);
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
//app.use("/",loginRouter);
app.use("/Gift",giftRouter);
app.use("/Nozzle",nozzleRouter);
app.use("/Sales",salesRouter);
app.use("/Product",productRouter);
app.use("/Employee",employeeRouter);
app.use("/Task",rolesRouter);
app.use("/Inspection",inspectionRouter);
app.use("/Purchase",purchaseRouter);
app.use("/register",registerRouter);
app.use("/login",loginRouter);
app.use("/modules",moduleRouter);
app.use("/Finance",financeRouter);
app.use("/Accounts",accountsRouter);
app.listen(port,()=>{
    connectDB();
    console.log("Server running on port : "+port);
})