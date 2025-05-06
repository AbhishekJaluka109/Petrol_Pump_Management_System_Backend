import mongoose from "mongoose";

const productSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        input: "True",
        display: "True",
        inputType: "Text", 
    },
    category: {
        type: String,
        enum: ['Fuel', 'Lubricant', 'Accessory','Services'],
        required: true,
        input: "True",
        display: "True",
        inputType: "Select", 
    },
    density: {
        type: Number,
        input: "True",
        display: "True",
        inputType: "Number", 
    },
    sales_price: {
        type: Number,
        min: 0,
        required:true,
        input: "True",
        display: "True",
        inputType: "Number", 
    },
    quantity: {
        type: Number,
        default: 0,
        display: "True",
        inputType: "Number", 
    },
    unit: {
        type: String,
        enum: ['liters', 'pieces','others'], 
        input: "True",
        display: "True",
        inputType: "Select", 
    },
    description: {
        type: String,
        trim: true,
        input: "True",
        display: "True",
        inputType: "Text", 
    },
}, );

const Product = mongoose.model('Product',productSchema);

export default Product;