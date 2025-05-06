import mongoose from "mongoose";
import Employee from "./employees.model.js";
import formatDate from "./format/date.js";

const rolesSchema=new mongoose.Schema({
    date: {
        type: String,
        default: ()=>formatDate(new Date()),
        display: "True",
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
    shift:{
        type:String,
        enum:['Day','Night'],
        required:true,
        input:"True",
        display:"True",
        inputType:"Select",
    },
    pump_no:{
        type:Number,
        required:true,
        input:"True",
        display:"True",
        inputType:"Number",
    },
    services_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        validate:{
            validator: async function (value){
                return await Service.exists({_id:value});
            },
            message:'No servicing details found.',
        },
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
