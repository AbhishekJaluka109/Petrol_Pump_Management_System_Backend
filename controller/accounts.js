import Accounts from "../model/accounts.model.js";

export const accountsFieldCntl = async (req, res) => {
    try {
        const fields = Object.keys(Accounts.schema.paths);
        const displayedFields = fields.filter(field => {
            const fieldOptions = Accounts.schema.path(field).options;
            return fieldOptions.display !== false && field!=="_id" && field!=="__v";
        });

        res.status(200).send({
            success: true,
            message: "Accounts Fields fetched",
            data: displayedFields,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Accounts Fields",
            error,
        });
    }
};


export const accountsValueCntl = async (req,res) =>{
    try{
        const accounts = await Accounts.find({});
        res.status(200).send({success: true, data:accounts });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Accounts Details",
            error,
        });
    }
};

export const accountsFieldInputCntl = async (req, res) => {
    try {
        const schemaDefinition = Accounts.schema.paths;

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
            message: "Accounts Fields fetched",
            data: filteredSchema,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Accounts Fields",
            error,
        });
    }
};

export const accountsPost = async(req,res)=>{
        const ng =req.body;
        const { _id, __v, ...accounts } = ng;
        const newGift= new Accounts(accounts);
        console.log(newGift);
        try{
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


export const accountsDelete = async(req,res)=>{
        try{
            const {key} =req.body;
            const deletedItem=await Accounts.findByIdAndDelete(key);
            if(deletedItem)
                return res.status(200).json({success:true,message:"Item Deleted Successfully"});
            return res.status(404).json({success:false,message:"Item Not found"});
        }
        catch(e){
            console.log(e);
            return res.status(500).json({sucess:false,error:"Error Deleting item"});
            
        }
};


