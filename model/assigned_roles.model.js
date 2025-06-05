import mongoose from "mongoose";
import Employee from "./employees.model.js";
import formatDate from "./format/date.js";

const rolesSchema=new mongoose.Schema({
    start: {
        type: Date,
        display: "True",
        inputType: "Time",
        input:"True"
    },
    end: {
        type: Date,
        display: "True",
        inputType: "Time",
        input:"True"
    },
    Date: {
        type: Date,
        default: ()=>formatDate(new Date()),
        display: "True",
        inputType: "Date",
        input:"True"
    },
    employee_id:{
        type: Number,
        validate:{
            validator: async function (value){
                return await Employee.exists({id:value});
            },
            message:'employee not found.',
        },
        input:"True",
        display:"True",
        inputType:"Number",
    },
    description:{
        type:String,
        required:true,
        input:"True",
        display:"True",
        inputType:"Text",
    },
    pump_no:{
        type:Number,
        input:"True",
        display:"True",
        inputType:"Number",
    },
    cashProvidedAtStart:{
        type:Number,
        required:true,
        input:"True",
        display:"True",
        inputType:"Number",
    },

    cashcollected:{
        type:Number,
        default:0,
        display:"True",
    }
})
const Roles = mongoose.model('Roles', rolesSchema);

export default Roles;
