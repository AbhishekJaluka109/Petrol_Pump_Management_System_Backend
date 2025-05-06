import mongoose from "mongoose";
import Company from "./companies.model.js";

const customerSchema=new mongoose.Schema({
    customer_name:{
        type:String,
        required:true
    },
    companyName: { 
        type: String,
        ref: "Company",
        required: true,
        validate:{
            validator: async function (value){
                return await Company.exists({name:value});
            },
            message:'Company not found.',
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    }
})

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
