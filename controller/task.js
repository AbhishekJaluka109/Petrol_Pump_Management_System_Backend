import Roles from "../model/assigned_roles.model.js";
import formatDate from "../model/format/date.js";

export const rolesFieldCntl = async (req, res) => {
    try {
        const fields = Object.keys(Roles.schema.paths);
        const displayedFields = fields.filter(field => {
            const fieldOptions = Roles.schema.path(field).options;
            return fieldOptions.display === 'True' && field!=="_id" && field!=="__v" && field!=="Date";
        });

        res.status(200).send({
            success: true,
            message: "Roles Fields fetched",
            data: displayedFields,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Roles Fields",
            error,
        });
    }
};


export const rolesValueCntl = async (req,res) =>{
    try{
        if(req.user.role==='Manager' || req.user.role==='Assistant_Manager'){
        const roles = await Roles.find({});
        res.status(200).send({success: true, data:roles });
        return ;
        }
        const roles = await Roles.find({employee_id:req.user.id});
        res.status(200).send({success: true, data:roles });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Roles Details",
            error,
        });
    }
};

export const rolesFieldInputCntl = async (req, res) => {
    try {
        const schemaDefinition = Roles.schema.paths;

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
            message: "Roles Fields fetched",
            data: filteredSchema,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Roles Fields",
            error,
        });
    }
};

export const rolesPost = async(req,res)=>{
        const roles =req.body;
        roles.Date=formatDate(roles.Date);
        console.log(roles.Date);
        roles.start = new Date(`${roles.Date}T${roles.start}`);
        roles.end = new Date(`${roles.Date}T${roles.end}`);
        const newRoles= new Roles(roles)
        try{
            await newRoles.save();
            return res.status(200).json({success:true,data:newRoles});
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


    export const rolesDelete = async(req,res)=>{
        try{
            const {key} =req.body;
            const deletedItem=await Roles.findByIdAndDelete(key);
            if(deletedItem)
                return res.status(200).json({success:true,message:"Item Deleted Successfully"});
            return res.status(404).json({success:false,message:"Item Not found"});
        }
        catch(e){
            return res.status(500).json({sucess:false,error:"Error Deleting item"});
            
        }
};