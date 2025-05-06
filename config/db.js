import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const uri=process.env.MONGO_URI;
console.log(uri);
export const connectDB =async()=>{
    try{
        const conn=await mongoose.connect(uri);
        console.log('MongoDB Connected ');
    }
    catch(e){
        console.log(e);
    }
}