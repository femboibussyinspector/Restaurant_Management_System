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
        imageUrl:{
            type:String,
            trim: true,
            default:'https://plus.unsplash.com/premium_photo-1664527306003-0e6f35b728a6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=500'
        },
        isAvailable: {
            type: Boolean,
            default:true
        }
    },
    {
        timestamps:true
    }
);
const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;