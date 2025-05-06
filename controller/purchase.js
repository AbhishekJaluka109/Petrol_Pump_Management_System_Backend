import Purchase from "../model/purchase.model.js";
import Product from "../model/products.model.js";
import Company from "../model/companies.model.js";
import Roles from "../model/assigned_roles.model.js";
import Nozzle from "../model/nozzle.model.js";
import { getProductNames } from "./productName.js";
import InspectionReport from "../model/inspectionReport.model.js";
import Finance from "../model/finance.model.js";
import Accounts from "../model/accounts.model.js";



export const purchaseFieldCntl = async (req, res) => {
    try {
        const fields = Object.keys(Purchase.schema.paths);
        const displayedFields = fields.filter(field => {
            const fieldOptions = Purchase.schema.path(field).options;
            return fieldOptions.display === "True" && field!=="_id" && field!=="__v";
        });

        res.status(200).send({
            success: true,
            message: "Purchase Fields fetched",
            data: displayedFields,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Purchase Fields",
            error,
        });
    }
};


export const purchaseValueCntl = async (req,res) =>{
    try{
        const purchase = await Purchase.find({});
        res.status(200).send({success: true, data:purchase });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Purchase Details",
            error,
        });
    }
};

export const purchaseFieldInputCntl = async (req, res) => {
    try {
        const schemaDefinition = Purchase.schema.paths;
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
            message: "Purchase Fields fetched",
            data: filteredSchema,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Purchase Fields",
            error,
        });
    }
};

export const purchasePost = async(req,res)=>{
        const purchase =req.body;
        console.log(purchase);
        const previous = await InspectionReport.findOne().sort({ date: -1 }).select('present_stock');
        console.log(previous);
        const newPurchase= new Purchase(purchase);
        const newInspectionReport= new InspectionReport({
            product:purchase.product_name,
            previous_stock:previous.present_stock,
            received:purchase.quantity,
            cutting:purchase.cutting,
            dip:purchase.dip,
            testing:purchase.testing
        });
        const newtransaction = new Finance({
            amount: newPurchase.amount,
            type: 'Cr',
            payment_mode: newPurchase.payment_mode,
            description: `Purchase of ${newPurchase.quantity} units of ${newPurchase.product_name}`
        });
        const account=await Accounts.findOne();
        if(newPurchase.payment_mode==='Cash'){
            account.cash-=newPurchase.amount;
        }
        else{
            account.online-=newPurchase.amount;
        }
        newtransaction.online=account.online;
        newtransaction.cash=account.cash;
        try{
            await newtransaction.save();
            await account.save();
            await newPurchase.save();
            const prod=await Product.findOne({name:newPurchase.product_name});
            prod.quantity=prod.quantity+newPurchase.quantity;
            await prod.save();
            await newInspectionReport.save();
            await Nozzle.updateMany(
                { product_name: purchase.product_name },
                [
                    {
                        $set: {
                            previous_reading: "$current_reading"
                        }
                    }
                ]
            );
            return res.status(200).json({success:true,data:newPurchase});
        }
        catch(e){console.log(e);
            if (e.name === "ValidationError") {
                
                const messages = Object.values(e.errors).map(field => ({field}));
                return res.status(400).json({ success: false, errorMessages: messages });
            }
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    };


export const purchaseDelete = async(req,res)=>{
        try{
            const {key} =req.body;
            const deletedItem=await Purchase.findByIdAndDelete(key);
            if(deletedItem)
                return res.status(200).json({success:true,message:"Item Deleted Successfully"});
            return res.status(404).json({success:false,message:"Item Not found"});
        }
        catch(e){
            return res.status(500).json({sucess:false,error:"Error Deleting item"});
            
        }
};
