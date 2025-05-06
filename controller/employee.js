import Employee from "../model/employees.model.js";

export const employeeFieldCntl = async (req, res) => {
    try {
        const fields = Object.keys(Employee.schema.paths);
        const displayedFields = fields.filter(field => {
            const fieldOptions = Employee.schema.path(field).options;
            return fieldOptions.display === "True" && field!=="_id" && field!=="__v";
        });

        res.status(200).send({
            success: true,
            message: "Employee Fields fetched",
            data: displayedFields,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Employee Fields",
            error,
        });
    }
};


export const employeeValueCntl = async (req,res) =>{
    try{
        const employee = await Employee.find({});
        console.log(employee);
        res.status(200).send({success: true, data:employee });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Employee Details",
            error,
        });
    }
};

export const employeeFieldInputCntl = async (req, res) => {
    try {
        const schemaDefinition = Employee.schema.paths;

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
            message: "Employee Fields fetched",
            data: filteredSchema,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Employee Fields",
            error,
        });
    }
};

export const employeePost = async(req,res)=>{
        const employee =req.body;
        const newEmployee= new Employee(employee)
        newEmployee.supervisor=req.user.id;
        console.log(employee);
        try{
            await newEmployee.save();
            return res.status(200).json({success:true,data:newEmployee});
        }
        catch(e){
            if (e.name === "ValidationError") {
                console.log(e);
                const messages = Object.values(e.errors).map(field => ({field}));
                return res.status(400).json({ success: false, error: messages });
            }console.log(e);
            
            return res.status(400).json({success:false,error:"Please provide all the fields"});
            
        }
    };
export const employeeDelete = async(req,res)=>{
        try{
            const {key} =req.body;
            const deletedItem=await Employee.findByIdAndDelete(key);
            if(deletedItem)
                return res.status(200).json({success:true,message:"Item Deleted Successfully"});
            return res.status(404).json({success:false,message:"Item Not found"});
        }
        catch(e){
            return res.status(500).json({sucess:false,error:"Error Deleting item"});
            
        }
};

