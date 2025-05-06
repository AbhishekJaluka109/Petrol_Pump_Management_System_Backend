import InspectionReport from "../model/inspectionReport.model.js";
import { getProductNames } from "./productName.js";

export const inspectionFieldCntl = async (req, res) => {
    try {
        const fields = Object.keys(InspectionReport.schema.paths);
        const displayedFields = fields.filter(field => {
            const fieldOptions = InspectionReport.schema.path(field).options;
            return fieldOptions.display !== false && field!=="_id" && field!=="__v";
        });

        res.status(200).send({
            success: true,
            message: "InspectionReport Fields fetched",
            data: displayedFields,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch InspectionReport Fields",
            error,
        });
    }
};


export const inspectionValueCntl = async (req,res) =>{
    try{
        const inspection = await InspectionReport.find({});
        console.log(inspection);
        res.status(200).send({success: true, data:inspection });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch InspectionReport Details",
            error,
        });
    }
};

export const inspectionFieldInputCntl = async (req, res) => {
    try {
        const schemaDefinition = InspectionReport.schema.paths;
        schemaDefinition["product"].options.enum=await getProductNames();
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

        console.log(filteredSchema);
        res.status(200).send({
            success: true,
            message: "InspectionReport Fields fetched",
            data: filteredSchema,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch InspectionReport Fields",
            error,
        });
    }
};

export const inspectionPost = async(req,res)=>{
        const inspection =req.body;
        const newInspectionReport= new InspectionReport(inspection)

        console.log(inspection);
        try{
            await newInspectionReport.save();
            return res.status(200).json({success:true,data:newInspectionReport});
        }
        catch(e){
            if (e.name === "ValidationError") {
                console.log(e);
                const messages = Object.values(e.errors).map(field => ({field}));
                return res.status(400).json({ success: false, error: messages });
            }console.log(e);
            
            return res.status(400).json({sucess:false,error:"Please provide all the fields"});
            
        }
    };
export const inspectionDelete = async(req,res)=>{
        try{
            const {key} =req.body;
            const deletedItem=await InspectionReport.findByIdAndDelete(key);
            if(deletedItem)
                return res.status(200).json({success:true,message:"Item Deleted Successfully"});
            return res.status(404).json({success:false,message:"Item Not found"});
        }
        catch(e){
            return res.status(500).json({sucess:false,error:"Error Deleting item"});
            
        }
};

