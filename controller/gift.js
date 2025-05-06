import Gift from "../model/gift.model.js";

export const giftFieldCntl = async (req, res) => {
    try {
        const fields = Object.keys(Gift.schema.paths);
        const displayedFields = fields.filter(field => {
            const fieldOptions = Gift.schema.path(field).options;
            return fieldOptions.display !== false && field!=="_id" && field!=="__v";
        });

        res.status(200).send({
            success: true,
            message: "Gift Fields fetched",
            data: displayedFields,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Gift Fields",
            error,
        });
    }
};


export const giftValueCntl = async (req,res) =>{
    try{
        const gift = await Gift.find({});
        res.status(200).send({success: true, data:gift });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Gift Details",
            error,
        });
    }
};

export const giftFieldInputCntl = async (req, res) => {
    try {
        const schemaDefinition = Gift.schema.paths;

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
            message: "Gift Fields fetched",
            data: filteredSchema,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Gift Fields",
            error,
        });
    }
};

export const giftPost = async(req,res)=>{
        const ng =req.body;
        const { _id, __v, ...gift } = ng;
        const newGift= new Gift(gift);
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


export const giftDelete = async(req,res)=>{
        try{
            const {key} =req.body;
            const deletedItem=await Gift.findByIdAndDelete(key);
            if(deletedItem)
                return res.status(200).json({success:true,message:"Item Deleted Successfully"});
            return res.status(404).json({success:false,message:"Item Not found"});
        }
        catch(e){
            return res.status(500).json({sucess:false,error:"Error Deleting item"});
            
        }
};


