import Nozzle from "../model/nozzle.model.js";
import { getProductNames } from "./productName.js";

export const NozzleFieldCntl = async (req, res) => {
    try {
        const fields = Object.keys(Nozzle.schema.paths);
        const displayedFields = fields.filter(field => {
            const fieldOptions = Nozzle.schema.path(field).options;
            return fieldOptions.display !== false && field!=="_id" && field!=="__v";
        }); 
        res.status(200).send({
            success: true,
            message: "Nozzle Fields fetched",
            data: displayedFields,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Nozzle Fields",
            error,
        });
    }
};


export const NozzleValueCntl = async (req,res) =>{
    try{
        const nozzle = await Nozzle.find({});
        res.status(200).send({success: true, data:nozzle });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Nozzle Details",
            err:error,
        });
    }
};

export const NozzleFieldInputCntl = async (req, res) => {
    try {
        const schemaDefinition = Nozzle.schema.paths;
        schemaDefinition["product_name"].options.enum=await getProductNames();
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
            message: "Nozzle Fields fetched",
            data: filteredSchema,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Nozzle Fields",
            error,
        });
    }
};

export const NozzlePost = async(req,res)=>{
        const nozzle =req.body;
        const newNozzle= new Nozzle(nozzle);
        newNozzle.current_reading=newNozzle.previous_reading;
        try{
            await newNozzle.save();
            return res.status(200).json({success:true,data:newNozzle});
        }
        catch(e){
            if (e.name === "ValidationError") {
                const messages = Object.values(e.errors).map(field => ({field}));
                return res.status(400).json({ success: false, error: messages });
            }
            return res.status(400).json({sucess:false,error:"Please provide all the fields"});
            
        }
    };


    export const nozzleDelete = async(req,res)=>{
        try{
            const {key} =req.body;


            const deletedItem=await Nozzle.findByIdAndDelete(key);
            if(deletedItem)
                return res.status(200).json({success:true,message:"Item Deleted Successfully"});
            return res.status(404).json({success:false,message:"Item Not found"});
        }
        catch(e){
            return res.status(500).json({sucess:false,error:"Error Deleting item"});
            
        }
};
