import Finance from "../model/finance.model.js";
import Accounts from "../model/accounts.model.js";

export const financeFieldCntl = async (req, res) => {
    try {
        const fields = Object.keys(Finance.schema.paths);
        const displayedFields = fields.filter(field => {
            const fieldOptions = Finance.schema.path(field).options;
            return fieldOptions.display !== false && field!=="_id" && field!=="__v";
        });

        res.status(200).send({
            success: true,
            message: "Finance Fields fetched",
            data: displayedFields,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Finance Fields",
            error,
        });
    }
};


export const financeValueCntl = async (req,res) =>{
    try{
        const finance = await Finance.find({});
        res.status(200).send({success: true, data:finance });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Finance Details",
            error,
        });
    }
};

export const financeFieldInputCntl = async (req, res) => {
    try {
        const schemaDefinition = Finance.schema.paths;

        const filteredSchema = Object.keys(schemaDefinition)
        .filter(field => field !== '_id' && field !== '__v' && schemaDefinition[field].options.input==="True")  
        .map(field => {
            const fieldOptions = schemaDefinition[field].options;

            return {
            fieldName: field,
            inputType: fieldOptions.inputType || 'Text',  
            enum: fieldOptions.enum || [] ,
            required: fieldOptions.required || 'false',
            };
        });

        res.status(200).send({
            success: true,
            message: "Finance Fields fetched",
            data: filteredSchema,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Finance Fields",
            error,
        });
    }
};

export const financePost = async(req,res)=>{
        const ng =req.body;
        const { _id, __v, ...finance } = ng;
        const newGift= new Finance(finance);
        const account=await Accounts.findOne();
        if(newGift.transaction_type==='Cr'){
            if(newGift.payment_mode==='Cash'){
                account.cash=account.cash-account.amount;
            }
            else{
                account.cash=account.cash+account.amount
            }
        }
        else if(newGift.transaction_type==='Dr'){
            if(newGift.payment_mode==='Online'){
                account.online=account.online-account.amount;
            }
            else{
                account.online=account.online+account.amount
            }
        }
        else {
            if(newGift.payment_mode==='Online'){
                account.online=account.online-account.amount;
                account.cash=account.cash+account.amount;
            }
            else{
                account.online=account.online+account.amount;
                account.cash=account.cash-account.amount;
            }
        }
        newGift.cash=account.cash;
        newGift.online=account.online;
        try{
            await account.save();
            await newGift.save();
            console.log(newGift);
            return res.status(200).json({success:true,data:newGift});
        }
        catch(e){
            console.log(e);
            if (e.name === "ValidationError") {
                const messages = Object.values(e.errors).map(field => ({field}));
                return res.status(400).json({ success: false, error: messages });
            }
            return res.status(400).json({sucess:false,error:"Please provide all the fields"});
            
        }

    };


export const financeDelete = async(req,res)=>{
        try{
            const {key} =req.body;
            const deletedItem=await Finance.findByIdAndDelete(key);
            if(deletedItem)
                return res.status(200).json({success:true,message:"Item Deleted Successfully"});
            return res.status(404).json({success:false,message:"Item Not found"});
        }
        catch(e){
            return res.status(500).json({sucess:false,error:"Error Deleting item"});
            
        }
};


