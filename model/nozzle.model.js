import mongoose from "mongoose";
import Product from "./products.model.js";

const nozzleSchema=new mongoose.Schema({
    pump_no:{
        type:Number,
        required:true,
        input: "True",
        display: "True",
        inputType: "Number", 
    },
    nozzle_no:{
        type: Number,
        required: true,
        input: "True",
        display: "True",
        inputType: "Number",
    },
    product_name:{
        type: String,
        ref: "Product",
        required: true,
        validate:{
            validator: async function (value){
                return await Product.exists({name:value});
            },
            message:'Product not found.',
        },
        input: "True",
        display: "True",
        inputType: "Select", 
    },
    status:{
        type: String,
        required:false,
        enum:['Active','Inactive'],
        input: "True",
        display: "True",
        inputType: "Select", 
        default:0
    },
    previous_reading:{
        type:Number,
        required:true,
        input:"True",
        display:"True",
        inputType:"Number"
    },
    current_reading:{
        type:Number,
        input:"false",
        display:"True",
    }
});

nozzleSchema.pre('save', async function (next) {
    const pro=await Product.findOne({name:this.product_name});
            if(pro.quantity<5){
                this.status='InActive';
            }
            else{
            this.status='Active';
            }
        next();
        });

const Nozzle = mongoose.model('Nozzle', nozzleSchema);

export default Nozzle;
