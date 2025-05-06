import Employee from "../model/employees.model.js";
import bcrypt from "bcrypt";
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
export const registerPost = async(req,res)=>{
    const {employeeId,password} =req.body;

    const saltround=10;
    console.log(employeeId,password);
    try{
        await bcrypt.hash(password,saltround,async (err,hash_password)=>{
            if(err){
                console.error('Error hashing password : ',err);
            }
            else{
                console.log(employeeId,password);
                const employee = await Employee.findOne({id:employeeId});
                if(employee){
                    if(employee.validationCode){
                        employee.password = hash_password ;
                        await employee.save();
                        return res.status(200).json({success:true});
                    }
                    return res.status(200).json({success:false,message:"Permission Denied"});
                }
                else{
                    return res.status(400).json({success:false,message:"Employee Not Found"});
                }
            }
        })
    }
    catch(e){
        console.log(e);
        return res.status(400).json({success:false,error:e});
    }
};
