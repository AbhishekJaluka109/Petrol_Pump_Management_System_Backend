import mongoose from "mongoose";
import Product from "./products.model.js";
import Customer from "./customer.model.js";
import Employee from "./employees.model.js";
import Company from "./companies.model.js";
import Roles from "./assigned_roles.model.js";
import Nozzle from "./nozzle.model.js";
import formatDate from "./format/date.js";
import formatTime from "./format/time.js";



const getProductName=async(n,p)=>{
    const nozzle = await Nozzle.findOne({ nozzle_no: n ,pump_no: p});
    return nozzle ? nozzle.product_name : null;
}

const salesSchema = new mongoose.Schema({
    date: {
        type: String,
        default: ()=>formatDate(new Date()),
        display: "True",
    },
    time:{
        type:String,
        required:true,
        default: ()=>formatTime(new Date()),
        display: "False",
    },
    payment_mode: {
        type: String,
        enum: ['Cash', 'Upi', 'Card', 'Credit'],
        required: true,
        input: "True",
        display: "True",
        inputType: "Select", 
    },
    pump_no:{
        type:Number,
        required:true,
        display:"True"
    },
    nozzle_no: {
        type: Number,
        required: true,
        input: "True",
        display: "True",
        inputType: "Number", 
    },
    product_name: {
        type: String,
        display: "True",
    },
    vehicle_no: {
        type: String,
        input: "True",
        display: "False",
        inputType: "Text", 
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        validate: {
            validator: async function (value) {
                return await Customer.exists({ _id: value });
            },
            message: 'Customer not found.',
        },
        input: "True",
        display: "True",
        inputType: "Number", 
    },
    company_name: {
        type: String,
        ref: "Company",
        input: "False",
        display: "True", 
    },
    amount: {
        type: Number,
        display: "True",
    },
    quantity: {
        type: Number,
        required:true,
        input: "True",
        display: "True",
        inputType: "Number", 
    },
    employee_id: {
        type: Number,
        ref: "Employee",
        required: true,
        validate: {
            validator: async function (value) {
                return await Employee.exists({ id: value });
            },
            message: 'Employee not found.',
        },
        display: "True", 
    },
    payment_received: {
        type: String,
        required: true,
        enum:["True","False"],
        input: "True",
        display: "True",
        inputType: "Select", 
    },
});

salesSchema.pre('save', async function (next) {
    console.log("hi");
    if (this.nozzle_no && this.pump_no) {
        console.log(1);
        this.product_name =await getProductName(this.nozzle_no,this.pump_no);
    }

    if (this.customer_id) {
        const customer = await Customer.findOne({ _id: this.customer_id });
        this.company_name =await customer ? customer.companyName : null;
    }

    if (this.product_name && this.quantity) {
        const product = await Product.findOne({ name: this.product_name });
        this.amount =await product ? product.sales_price * this.quantity : null;
    }

    if((Product.findOne({ name: this.product_name })).quantity<this.quantity){
        throw new error('Requested quantity not available') ;
    }

    if(this.amount&&this.company_name&&(Company.findOne({ name: this.company_name })).available_limit<this.amount){
        throw new error('Company not found or available limit is below billed amount.');
    }
    next();
});

const Sales = mongoose.model('Sales', salesSchema);


export default Sales;
