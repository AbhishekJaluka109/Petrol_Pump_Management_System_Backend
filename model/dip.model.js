import mongoose from "mongoose";

const dipSchema=new mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    value:{
        type:Number,
        required:true
    }
})

const Dip = mongoose.model('Dip',dipSchema);

export default Dip;
