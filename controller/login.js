import Employee from "../model/employees.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const userExist=async(req,res)=>{
    const {employeeId}=req.body;
    console.log(employeeId);
    try{
        const employee = await Employee.findOne({ id: employeeId });
        if (employee) {
        return res.json({ exists: true });
        } else {
        return res.json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking employee:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
}
export const loginPost = async(req,res)=>{
    const {employeeId,password} =req.body;
    const saltround=10;
    try{
        const employee = await Employee.findOne({id:employeeId});
        const isMatch=await bcrypt.compare(password, employee.password);
                if(isMatch){
                    const token=jwt.sign({id:employeeId,role:employee.designation},process.env.SECRET_TOKEN,{expiresIn: '1d'});
                    console.log(employee);
                    return res.status(200).json({success:true,token});       
                }
                else{
                    return res.status(200).json({success:false,message:"Invalid Employee_ID or Password"});
                }
            }

    catch(e){
        console.log(e);
        return res.status(400).json({success:false,error:e});
    }
};
