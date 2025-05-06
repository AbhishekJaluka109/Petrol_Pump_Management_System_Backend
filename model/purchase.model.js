import mongoose from "mongoose";
import Product from "./products.model.js";
import formatDate from "./format/date.js";



const purchaseSchema= new mongoose.Schema({
    date: {
        type: String,
        default: ()=>formatDate(new Date()),
        display: "True",
    },
    product_name: {
        type: String,
        required:true,
        input: "True",
        display: "True",
        inputType: "Select"
    },
    quantity: {
        type: Number,
        required: true,
        input:"True",
        display:"True",
        inputType:"Number"
    },
    amount:{
        type:Number,
        required: true,
        input:"True",
        display:"True",
        inputType:"Number"
    },
    total_amount:{
        type:Number,
        display:"True",
    },

    payment_mode: {
        type: String,
        enum: ['Cash','Upi','Card','Credit'],
        required: true,
        input: "True",
        display: "True",
        inputType: "Select"
    },
    cutting:{
        type:Number,
        default:0,
        input:"True",
        inputType:"Number"
    },
    testing:{
        type:Number,
        default:0,
        input:"True",
        inputType:"Number"
    },
    dip:{
        type:Number,
        required:true,
        input:"True",
        inputType:"Number"
    },
});


purchaseSchema.pre('save', async function (next) {
    if(this.quantity && this.amount){
        this.total_amount=this.quantity*this.amount;
    }
    next();
})
const Purchase = mongoose.model('Purchase', purchaseSchema);

export default Purchase;
