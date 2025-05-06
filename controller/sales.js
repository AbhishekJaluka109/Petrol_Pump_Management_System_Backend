import Sales from "../model/sales.model.js";
import Product from "../model/products.model.js";
import Company from "../model/companies.model.js";
import Roles from "../model/assigned_roles.model.js";
import Nozzle from "../model/nozzle.model.js";
import { getProductNames } from "./productName.js";
import Finance from "../model/finance.model.js";
import Accounts from "../model/accounts.model.js";



export const salesFieldCntl = async (req, res) => {
    try {
        const fields = Object.keys(Sales.schema.paths);
        const displayedFields = fields.filter(field => {
            const fieldOptions = Sales.schema.path(field).options;
            return fieldOptions.display !== false && field!=="_id" && field!=="__v";
        });

        res.status(200).send({
            success: true,
            message: "Sales Fields fetched",
            data: displayedFields,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Sales Fields",
            error,
        });
    }
};


export const salesValueCntl = async (req,res) =>{
    try{
        if(req.user.role==='Manager' || req.user.role==='Assistant_Manager'){
            const sales = await Sales.find({});
            res.status(200).send({success: true, data:sales });
            return ;
        }

        const sales = await Sales.find({employee_id:req.user.id});
        res.status(200).send({success: true, data:sales });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Sales Details",
            error,
        });
    }
};

export const salesFieldInputCntl = async (req, res) => {
    try {
        const schemaDefinition = Sales.schema.paths;
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
            message: "Sales Fields fetched",
            data: filteredSchema,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch Sales Fields",
            error,
        });
    }
};

export const salesPost = async(req,res)=>{
        const sales =req.body;
        let rollbackActions = [];
        console.log(1);
        try{
            const newSales= new Sales(sales);
            newSales.employee_id=req.user.id;
            const employee=await Roles.findOne({employee_id:newSales.employee_id,date:newSales.date});
            newSales.pump_no=employee.pump_no;
            console.log(newSales);
            await newSales.save();
            rollbackActions.push(() => Sales.findByIdAndDelete(newSales._id));
            

            const prod=await Product.findOne({name:newSales.product_name});
            prod.quantity=prod.quantity-newSales.quantity;
            await prod.save();
            rollbackActions.push(() => Product.updateOne({ name: newSales.product_name }, { $inc: { quantity: newSales.quantity } }));
            
            
            if(newSales.payment_mode=='Credit'){
                const comp=await Company.findOne(newSales.company_name);
                comp.available_limit=comp.available_limit-newSales.amount;
                await comp.save();
                rollbackActions.push(() => Company.updateOne({ name: newSales.company_name }, { $inc: { available_limit: newSales.amount } }));
            }   
            else{
                if(newSales.payment_mode=='Cash'){
                    employee.cashcollected=employee.cashcollected+newSales.amount;
                    await employee.save();
                    rollbackActions.push(() => Roles.updateOne({ employee_id: newSales.employee_id }, { $inc: { cashcollected: -newSales.amount } }));
                }
                const newtransaction = new Finance({
                            amount: newSales.amount,
                            type: 'Dr',
                            payment_mode: newSales.payment_mode === 'Cash' ? 'Cash' : 'Online',
                            description: `Sale by ${employee.employee_id}`
                        });
                        const account=await Accounts.findOne();
                        if(newSales.payment_mode==='Cash'){
                            account.cash+=newSales.amount;
                        }
                        else{
                            account.online+=newSales.amount;
                        }
                        newtransaction.online=account.online;
                        newtransaction.cash=account.cash;
                        await newtransaction.save();
            await account.save();
            }

            
            const nozzle=await Nozzle.findOne({nozzle_no:newSales.nozzle_no});
            nozzle.current_reading+=newSales.quantity;
            await nozzle.save();
            rollbackActions.push(() => Nozzle.updateOne({ nozzle_no: newSales.nozzle_no }, { $inc: { current_reading: -newSales.quantity } }));
            return res.status(200).json({success:true,data:newSales});
        }
        catch(e){
            console.log(e);
            for (const rollback of rollbackActions.reverse()) {
                await rollback();
            }
            if (e.name === "ValidationError") {
                const messages = Object.values(e.errors).map(field => ({field}));
                return res.status(400).json({ success: false, errorMessages: messages });
            }
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    };


export const salesDelete = async(req,res)=>{
        try{
            const {key} =req.body;
            const deletedItem=await Sales.findByIdAndDelete(key);
            if(deletedItem)
                return res.status(200).json({success:true,message:"Item Deleted Successfully"});
            return res.status(404).json({success:false,message:"Item Not found"});
        }
        catch(e){
            return res.status(500).json({sucess:false,error:"Error Deleting item"});
            
        }
};
