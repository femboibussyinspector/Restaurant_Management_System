const mongoose = require('mongoose');


const menuItemSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
            unique:true,
        },
        description:{
            type:String,
            required:[true,'please provide description'],
            trim:true,
        },
        price:{
            type:Number,
            required:[true,"Price is required"],
            min:[0,"Price cannot be  negative"]
        },
        category:{
            type:String,
            required: [true, "Category is required"],
            enum:[
                'Starters',
                'Main Course',
                'Dessert',
                'Drinks',
                'Sides',
                'Chefs Kiss'
            ],
            default:'Main Course'
        },
        isAvailable: {
            type: Boolean,
            default:true
        }, SpiceLevel: {
            type:String,
            default:'1'
        },
       
    },
    {
        timestamps:true
    }
);
const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;