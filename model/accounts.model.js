import mongoose from "mongoose";

const accountsSchema=new mongoose.Schema({
    cash:{
        type:Number,
        required:true
    },
    online:{
        type:Number,
        required:true
    }
})

const Accounts = mongoose.model('Accounts', accountsSchema);

export default Accounts;
