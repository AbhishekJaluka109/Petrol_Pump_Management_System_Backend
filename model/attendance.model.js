import mongoose from "mongoose";
import Employee from "./employees.model.js";

const attendanceSchema=new mongoose.Schema({
    date:{
        type:Date,
        default:Date.now
    },
    employee_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        validate:{
            validator: async function (value){
                return await Employee.exists({_id:value});
            },
            message:'employee not found.',
        },type: Number,
        required: true
    },
    checkin_time:{
        hours:{type: Number,required:true},
        minutes:{type: Number,required: true}
    },
    checkout_time:{
        hours:{type: Number,required:true},
        minutes:{type: Number,required: true}
    },
})
const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
