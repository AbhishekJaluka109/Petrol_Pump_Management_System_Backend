import Product from "../model/products.model.js";

export const productFieldCntl = async (req, res) => {
    try {
        const fields = Object.keys(Product.schema.paths);
        const displayedFields = fields.filter(field => {
            const fieldOptions = Product.schema.path(field).options;
            return fieldOptions.display !== false && field!=="_id" && field!=="__v";
        });

        res.status(200).send({
            success: true,
            message: "Product Fields fetched",
            data: displayedFields,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Product Fields",
            error,
        });
    }
};


export const productValueCntl = async (req,res) =>{
    try{
        const product = await Product.find({});
        console.log(product);
        res.status(200).send({success: true, data:product });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Product Details",
            error,
        });
    }
};

export const productFieldInputCntl = async (req, res) => {
    try {
        const schemaDefinition = Product.schema.paths;

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
            message: "Product Fields fetched",
            data: filteredSchema,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Product Fields",
            error,
        });
    }
};

export const productPost = async(req,res)=>{
        const product =req.body;
        const newProduct= new Product(product)

        console.log(product);
        try{
            await newProduct.save();
            return res.status(200).json({success:true,data:newProduct});
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


    export const productDelete = async(req,res)=>{
        try{
            const {key} =req.body;
            const deletedItem=await Product.findByIdAndDelete(key);
            if(deletedItem)
                return res.status(200).json({success:true,message:"Item Deleted Successfully"});
            return res.status(404).json({success:false,message:"Item Not found"});
        }
        catch(e){
            return res.status(500).json({sucess:false,error:"Error Deleting item"});
            
        }
};
