import mongoose from "mongoose";
import formatDate from "./format/date.js";
import formatTime from "./format/time.js";





const financeSchema = new mongoose.Schema({
    date: {
        type: String,
        default: ()=>formatDate(new Date()),
        display: "True",
    },
    time:{
        type:String,
        default: ()=>formatTime(new Date()),
        display: "False",
    },
    payment_mode: {
        type: String,
        enum: ['Cash', 'Online'],
        required: true,
        input: "True",
        display: "True",
        inputType: "Select", 
    },
    transaction_type:{
        type: String,
        enum: ['Cr','Dr'],
        input: "True",
        display: "True",
        inputType: "Select", 
        required: true
    },
    Reason:{
        type: String,
        input: "True",
        display: "True",
        inputType: "Text", 
        required:true
    },
    cash:{
        type:Number,
        display: "True",
        input: "False",
    },
    online:{
        type:Number,
        display: "True",
        input: "False",
    }
});

financeSchema.pre('save', async function (next) {
    
    next();
});

const Finance = mongoose.model('Finance', financeSchema);


export default Finance;
