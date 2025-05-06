import mongoose from "mongoose";

const companySchema=new mongoose.Schema({
    name: { 
        type: String,
        required: true
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
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zip: { type: String, trim: true },
    },
    available_limit: {
        type: Number,
        required: true,
        default: 0
    },
},{
    timestamps:true,
})

const Company = mongoose.model('Company', companySchema);

export default Company;
