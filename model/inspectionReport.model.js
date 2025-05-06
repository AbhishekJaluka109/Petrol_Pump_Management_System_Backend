import mongoose from "mongoose";
import Nozzle from "./nozzle.model.js";
import Product from "./products.model.js";
import formatDate from "./format/date.js";
import Dip from "./dip.model.js";



const getTotalAccumulatedSales = async (productName) => {
    try {
        const totalSales = await Nozzle.aggregate([
            {
                $match: { product_name: productName } 
            },
            {
                $group: {
                    _id: null,
                    totalCurrent: { $sum: "$current_reading" }, 
                    totalPrevious: { $sum: "$previous_reading" } 
                }
            },
            {
                $project: {
                    _id: 0,
                    totalSales: { $subtract: ["$totalCurrent", "$totalPrevious"] }
                }
            }
        ]);

        return totalSales.length > 0 ? totalSales[0].totalSales : 0; 
    } catch (err) {
        console.error("Error calculating total sales:", err);
        return 0;
    }
};

const  inspectionReportSchema=new mongoose.Schema({
    date:{
        type:String,
        default: formatDate(new Date()),
        display:"True"
    },
    product:{
        type: String,
        required: true,
        validate:{
            validator:async function(value) {
                return await Product.exists({name:value});
            },
            message:"Product doesn't exist",
        },
        display:"True",
        input:"True",
        inputType:"Select"
    },
    previous_stock:{
        type:Number,
        required:true,
        display:"True",
        input:"True",
        inputType:"Number"
    },
    received:{
        type:Number,
        required:true,
        input:"True",
        display:"True",
        inputType:"Number"
    },
    total_stock:{
        type:Number,
        display:"True",
    },
    present_stock:{
        type:Number,
    },
    actual_dip_sale:{
        type:Number,
    },
    total_sale:{
        type:Number,
    },
    variation:{
        type:Number,
    },
    cutting:{
        type:Number,
        default:0,
        input:"True",
        display:"True",
        inputType:"Number"
    },
    testing:{
        type:Number,
        default:0,
        input:"True",
        display:"True",
        inputType:"Number"
    },
    dip:{
        type:Number,
        required:true,
        input:"True",
        display:"True",
        inputType:"Number"
    },
});

inspectionReportSchema.pre('save',async function (next){
    if(this.dip){
        const d=await Dip.findOne({id:this.dip});
        this.present_stock=d.value;
    }
    if(this.previous_stock&&this.received&&this.present_stock){
        this.actual_dip_sale=this.previous_stock+this.received-this.present_stock;
    }
    if(this.previous_stock&&this.received){
        this.total_stock=this.previous_stock+this.received;
    }
    if(this.product&& this.testing){
        console.log(1);
        this.total_sale=(await getTotalAccumulatedSales(this.product))-this.testing;
    }
    if(this.total_sale&&this.actual_dip_sale){
        this.variation=this.total_sale-this.actual_dip_sale;
    }
});

const InspectionReport = mongoose.model('InspectionReport', inspectionReportSchema);


export default InspectionReport;