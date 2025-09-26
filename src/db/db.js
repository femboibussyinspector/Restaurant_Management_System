const mongoose = require('mongoose');


async function connectdb(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        
        console.log("connected to DataBase");
    }
    catch (err){
        console.error("Error connecting to DataBase",err);
        
    }
}

module.exports = connectdb;